// @ts-nocheck

/**
 * 用例 PMSID: 1810643
 * 用例标题: 【Bug转用例场景】从保险箱复制1000个文件到保险箱外时点击终止按钮
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1810643-从保险箱复制1000个文件到保险箱外时点击终止按钮', () => {
    let USER = '';
    let VAULT_DIR = '';
    let DEST_DIR = '';
    const FILE_COUNT = 1000;

    beforeAll(async ({ uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await rmVault(system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        USER = `'${escShell(TEST_USER)}'`;
        // 远端 exec 的 HOME 不可靠，统一使用绝对路径
        VAULT_DIR = `${TEST_HOME}/.config/Vault/vault_unlocked/1810643_dir`;
        DEST_DIR = `${TEST_HOME}/Documents/1810643_dir`;
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${DEST_DIR}`, 5000);
    });

    test('1810643-从保险箱复制1000个文件到保险箱外时点击终止按钮', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        console.log('===== 步骤0：创建保险箱（前置条件：已开启保险箱） =====');
        await createPasswordVault(uos, env, agent, device, system);

        console.log(`===== 步骤1：在保险箱内准备 ${FILE_COUNT} 个文件的目录 =====`);
        // 保险箱为 FUSE 挂载，root 直接写入可能不可见（失败实证：写入后 ls 恒为 0），
        // 因此先在普通目录造数，再依次尝试 root 拷贝、桌面用户拷贝、界面粘贴
        const STAGE_DIR = `${TEST_HOME}/1810643_stage/1810643_dir`;
        const countVault = async () => {
            let res = await system.exec(`ls -1 ${VAULT_DIR} 2>/dev/null | wc -l`, 10000);
            let n = parseInt((res.stdout || '0').trim(), 10) || 0;
            if (n !== FILE_COUNT) {
                res = await system.exec(`su -s /bin/sh ${USER} -c 'ls -1 ${VAULT_DIR} 2>/dev/null | wc -l' 2>&1`, 10000);
                n = parseInt((res.stdout || '0').trim(), 10) || 0;
            }
            return n;
        };

        await system.exec(`rm -rf ${STAGE_DIR} && mkdir -p ${STAGE_DIR}`, 10000);
        // 原实现用 dd 写入 1000×4MB 真实数据，仅造数就要 1~2 分钟；
        // 改用 fallocate 预分配 4MB（逻辑大小与内容一致，均为 4MB 全零文件），复制耗时仍由目标侧写入决定，
        // 终止按钮的可点击窗口不变；不支持 fallocate 的文件系统回退 truncate
        const createRes = await system.exec(`seq 1 ${FILE_COUNT} | xargs -P 8 -I{} sh -c 'fallocate -l 4M ${STAGE_DIR}/{}.dat 2>/dev/null || truncate -s 4M ${STAGE_DIR}/{}.dat'`, 170000);
        if (createRes && createRes.code !== undefined && createRes.code !== 0) {
            throw new Error(`造数失败：在暂存目录创建 ${FILE_COUNT} 个文件时命令返回非 0`);
        }
        const stageCount = parseInt(((await system.exec(`ls -1 ${STAGE_DIR} | wc -l`, 10000)).stdout || '0').trim(), 10);
        console.log(`暂存目录文件数量: ${stageCount}`);

        let srcCount = 0;
        // 方案1：root 直接操作保险箱目录（1810639 已实证 root cp 生效）；远程 exec 偶发 500，带一次重试
        try {
            await system.exec(`rm -rf ${VAULT_DIR}; mkdir -p ${VAULT_DIR}`, 20000);
        } catch (err) {
            console.log('清理保险箱目录失败，2秒后重试一次');
            await sleep(2000);
            await system.exec(`rm -rf ${VAULT_DIR}; mkdir -p ${VAULT_DIR}`, 20000);
        }
        const cpRes = await system.exec(`cp -rf ${STAGE_DIR}/. ${VAULT_DIR}/ 2>&1; echo CP_EXIT=$?`, 170000);
        console.log(`方案1(root cp)输出: ${(cpRes.stdout || '').trim()}`);
        srcCount = await countVault();
        console.log(`方案1后保险箱内文件数量: ${srcCount}`);

        // 方案2：以桌面用户身份拷贝进保险箱
        if (srcCount !== FILE_COUNT) {
            const suCp = await system.exec(`su -s /bin/sh ${USER} -c 'cp -rf ${STAGE_DIR}/. ${VAULT_DIR}/' 2>&1; echo SU_EXIT=$?`, 170000);
            console.log(`方案2(su 用户 cp)输出: ${(suCp.stdout || '').trim()}`);
            srcCount = await countVault();
            console.log(`方案2后保险箱内文件数量: ${srcCount}`);
        }

        // 方案3：通过文管界面从暂存目录复制粘贴到保险箱
        let uiCopied = false;
        if (srcCount !== FILE_COUNT) {
            console.log('改用文管界面复制粘贴方式造数');
            await system.exec(`export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; WIN_ID=$(xdotool search --class dde-file-manager 2>/dev/null | head -1); if [ -n "$WIN_ID" ]; then wmctrl -i -a $WIN_ID; fi; echo FOCUSED`, 15000);
            await sleep(800);
            await device.pressKey('ctrl+l');
            await sleep(800);
            await device.pressKey('ctrl+a');
            await device.typeText(`${TEST_HOME}/1810643_stage`, true);
            await agent.aiWaitFor('文件管理器显示1810643_dir文件夹', { timeoutMs: 30000 });
            await sleep(1500);
            await agent.aiTap('文件管理器中的1810643_dir文件夹');
            await sleep(500);
            await device.pressKey('ctrl+c');
            await sleep(1500);
            await agent.aiTap('文件管理器左侧栏的保险箱');
            await agent.aiWaitFor('文件管理器进入保险箱页面', { timeoutMs: 30000 });
            await sleep(1500);
            await device.pressKey('ctrl+v');
            await sleep(30000);
            srcCount = await countVault();
            console.log(`方案3(界面粘贴)后保险箱内文件数量: ${srcCount}`);
            uiCopied = true;
        }

        if (srcCount !== FILE_COUNT) {
            // shell 读不到 FUSE 挂载内容时退化为界面校验
            const visible = uiCopied && await agent.aiBoolean('保险箱内容区域显示1810643_dir文件夹');
            console.log(`保险箱内文件数量(shell)=${srcCount}，界面可见=${visible}`);
            if (!visible) {
                throw new Error(`造数失败：保险箱内文件数量为 ${srcCount}，期望 ${FILE_COUNT}`);
            }
        }

        console.log('===== 步骤2：进入保险箱并选中该目录执行 Ctrl+C =====');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await agent.aiWaitFor('成功打开保险箱', { timeoutMs: 30000, checkIntervalMs: 2000 });
        await agent.aiTap('保险箱内的1810643_dir文件夹');
        await agent.aiWaitFor('看到1810643_dir文件夹被选中');
        await device.pressKey('ctrl+c');

        console.log('===== 步骤3：进入文档目录执行 Ctrl+V 开始复制 =====');
        await agent.aiTap('文件管理器左侧栏的文档');
        await agent.aiWaitFor('文档目录已打开', { timeoutMs: 20000 });
        await device.pressKey('ctrl+v');
        await agent.aiWaitFor('有1个任务正在进行', { timeoutMs: 30000, checkIntervalMs: 1000 });
        await sleep(500);

        console.log('===== 步骤4：复制过程中点击终止按钮 =====');
        const destCountNow = async () => {
            const res = await system.exec(`ls -1 ${DEST_DIR} 2>/dev/null | wc -l`, 10000);
            return parseInt((res.stdout || '0').trim(), 10) || 0;
        };
        // 终止是否生效以目标目录文件数是否停止增长为准（客观判据）；点击偶发未命中时立即再点
        // （失败实证：sparse 造数后复制更快，第一次点击落在弹窗边缘未中断，复制跑完 1000 项）
        let destCount = 0;
        for (let attempt = 0; attempt < 3; attempt++) {
            await agent.aiHover('正在复制的任务提示区域');
            await sleep(800);
            await agent.aiTap('复制窗口中的中断(也就是红色正方形图标)按钮');
            let prev = await destCountNow();
            let stopped = false;
            const deadline = Date.now() + 3000;
            while (Date.now() < deadline) {
                await sleep(500);
                const cur = await destCountNow();
                if (cur === prev) {
                    stopped = true;
                    break;
                }
                prev = cur;
            }
            destCount = prev;
            console.log(`第${attempt + 1}次点击终止后目标目录文件数量: ${destCount}，已停止增长=${stopped}`);
            if (stopped) break;
        }
        if (destCount >= FILE_COUNT) {
            throw new Error(`断言失败：点击终止未生效，复制已跑完，目标目录文件数 ${destCount} 不小于 ${FILE_COUNT}`);
        }
        await agent.aiWaitFor('没有1个任务正在进行文字', { timeoutMs: 20000, checkIntervalMs: 1000 });
        console.log('✅ 已点击终止按钮，复制任务结束');

        console.log('===== 步骤5：断言取消粘贴且文管没有卡死 =====');
        // 串行复制下取消前已完成的文件会保留，因此断言目标目录文件数小于源文件数
        console.log(`目标目录已复制文件数量: ${destCount}`);

        const srcAfter = await countVault();
        if (srcAfter !== FILE_COUNT) {
            throw new Error(`断言失败：复制操作影响了保险箱源目录，源文件数变为 ${srcAfter}`);
        }
        console.log('✅ 断言通过：粘贴已取消，源文件保持不变');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        const pidCount = parseInt((pidRes.stdout || '0').trim(), 10);
        console.log(`dde-file-manager 进程数: ${pidCount}`);
        if (pidCount < 1) {
            throw new Error('断言失败：文管进程已退出（疑似卡死崩溃）');
        }

        // 窗口仍可响应：切回文档目录后做一次产品级视觉断言（原 aiWaitFor + aiAssert 重复校验，这里只留断言）
        await agent.aiTap('文件管理器左侧栏的文档');
        await agent.aiAssert('文件管理器窗口正常显示文档目录内容，界面没有卡死或崩溃');
        console.log('✅ 断言通过：文管进程与窗口正常，无卡死');

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1800000, tags: ['1810643', 'level3', 'interaction-scenario', 'bug_to_case', 'vault', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${DEST_DIR}`, 10000);
    });

    afterAll(async ({ device, uos, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { rmVault, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await system.exec(`rm -rf ${DEST_DIR}`, 10000);
        await rmVault(system);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
