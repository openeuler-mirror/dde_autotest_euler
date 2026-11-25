// @ts-nocheck

/**
 * 用例 PMSID: 1810633
 * 用例标题: 【Bug转用例场景】外设或网络存储，拷贝文件到保险箱
 * 生成时间: 2026-10-22
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

// 账号/家目录统一来自 .env，不做运行时探测（换机只需改 .env 的 TEST_USERNAME）
const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1810633-外设或网络存储拷贝文件到保险箱', () => {
    let USER = '';
    let VAULT_DIR = '';

    beforeAll(async ({ uos, device, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const { closeFileManager, clearEnvironment, rmVault, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await rmVault(system);
        await cleanSmbMounts(agent, system);
    });

    beforeEach(async ({ device, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { escShell } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        USER = `'${escShell(TEST_USER)}'`;
        VAULT_DIR = `${TEST_HOME}/.config/Vault/vault_unlocked`;
        await device.pressKey('Esc');
    });

    test('1810633-外设或网络存储拷贝文件到保险箱', async ({ device, agent, uos, env, system }) => {
        const { createPasswordVault, SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        console.log('===== 步骤0：创建保险箱（前置条件：已开启保险箱） =====');
        await createPasswordVault(uos, env, agent, device, system);

        console.log('===== 步骤1：挂载 SMB（前置条件：已挂载网络存储） =====');
        await uos.openApp('文件管理器', { maximizeWindow: true });
        // 2026-10-29 提速：应用就绪改 wmctrl 客观判定（原 aiWaitFor 最多白等 30s）；界面正确性由后续 SMB 目录断言保证
        for (let i = 0; i < 20; i++) {
            try {
                const w = await system.exec("wmctrl -lx | grep -ci 'dde-file-manager'", 10000);
                if (Number(String(w.stdout || '0').trim()) > 0) break;
            } catch (e) { }
            await sleep(500);
        }
        await SmbMount(agent, system, device);

        console.log('===== 步骤2：进入 SMB 内部，选中一个文件复制 =====');
        // SmbMount 已通过地址栏直达 smb://IP/SMB_DIR，无需再从计算机页逐级进入（失败实证：从计算机页双击SMB图标只会停在服务器共享列表，误选了空共享print$）
        // 先用 smbclient 确保共享内存在已知测试文件（失败实证：UI 显示共享目录为空导致 aiQuery 报错）
        const SMB_IP = process.env.SMB_IP || '';
        const SMB_DIR = process.env.SMB_DIR || '';
        const SMB_USER = process.env.SMB_USERNAME || '';
        const SMB_PWD = process.env.SMB_PASSWORD || '';
        const KNOWN_FILE = '1810633_smb_copy.txt';
        // v2(2026-10-27)：原实现丢弃 smbclient 输出，共享目录为空时无法判断是"上传失败"还是"UI 未刷新"，
        // 改为打印 put 结果便于定位（实测本次共享显示 0 项）
        const putOut = await system.exec(`printf 'smb-copy-test' > /tmp/${KNOWN_FILE} && (smbclient //${SMB_IP}/${SMB_DIR} -U '${SMB_USER}%${SMB_PWD}' -c 'put /tmp/${KNOWN_FILE} ${KNOWN_FILE}' 2>&1 || smbclient //${SMB_IP}/${SMB_DIR} -N -c 'put /tmp/${KNOWN_FILE} ${KNOWN_FILE}' 2>&1) | tail -3; rm -f /tmp/${KNOWN_FILE}`, 30000);
        console.log('smbclient put 输出:', JSON.stringify(putOut).slice(0, 400));
        // 上传文件后文管可能重新弹出 SMB 授权框（失败实证：上传后出现登录弹窗，文件列表等待 60s 超时），
        // 需显式填入凭据完成认证，否则后续一直停在登录框 --UT005045(许琪)
        const fillSmbAuth = async () => {
            if (!(await agent.aiBoolean('当前界面出现需要授权来访问的账号密码认证弹窗'))) {
                return false;
            }
            await agent.aiTap('用户名输入框');
            await device.pressKey('ctrl+a');
            await device.typeText(`${SMB_USER}`);
            await agent.aiTap('密码输入框');
            await device.pressKey('ctrl+a');
            await device.typeText(`${SMB_PWD}`);
            try {
                await agent.aiTap('记住密码');
            } catch (err) {
                console.log('弹窗中无记住密码选项，跳过勾选');
            }
            await agent.aiTap('连接');
            await sleep(3000);
            console.log('已填写SMB凭据并连接');
            return true;
        };
        await fillSmbAuth();
        await sleep(2000);
        // 2026-10-29 提速：原「aiWaitFor(SMB 文件列表已显示, 60s)」+「aiQuery 取第一个文件名」两步共 2~3 次模型调用，
        // 且共享刷新慢时会白等满 60s。改为 smbclient 客观确认文件已在共享上 + 已知文件名直接定位，
        // 定位失败按「检测授权框 → F5 → 重试」有界重试；选中态仍由 aiWaitFor 校验，断言强度不降
        const fileName = KNOWN_FILE;
        let smbReady = false;
        for (let attempt = 1; attempt <= 3 && !smbReady; attempt++) {
            const lsOut = await system.exec(`smbclient //${SMB_IP}/${SMB_DIR} -U '${SMB_USER}%${SMB_PWD}' -c 'ls' 2>&1 | grep -c '${KNOWN_FILE}'`, 30000);
            if (Number(String(lsOut.stdout || '0').trim()) > 0) {
                try {
                    await agent.aiTap(`SMB 共享目录中的文件: ${fileName}`);
                    smbReady = true;
                    break;
                } catch (err) {
                    console.log(`第${attempt}次定位SMB文件失败，刷新后重试`);
                }
            } else {
                console.log(`第${attempt}次 smbclient 未确认 ${KNOWN_FILE} 已在共享上`);
            }
            await fillSmbAuth();
            await device.pressKey('F5');
            await sleep(2500);
        }
        if (!smbReady) {
            throw new Error('前置条件失败：SMB 共享目录中未能定位到上传的测试文件');
        }
        await agent.aiWaitFor(`文件 ${fileName} 已被选中`);
        await device.pressKey('ctrl+c');
        await sleep(1000);

        console.log('===== 步骤3：粘贴到保险箱 =====');
        await agent.aiTap('文件管理器左侧栏的保险箱');
        await agent.aiWaitFor('成功打开保险箱', { timeoutMs: 30000 });
        await device.pressKey('ctrl+v');
        await agent.aiWaitFor('没有1个任务正在进行文字', { timeoutMs: 300000, checkIntervalMs: 2000 });
        await sleep(3000);

        console.log('===== 步骤4：断言文件拷贝成功且文管正常 =====');
        // 网络存储复制可能耗时，轮询等待文件出现在保险箱目录
        // 注意：保险箱为 FUSE 挂载，root 直读可能为空，需改用桌面用户身份读取，最后退化为界面校验
        let list = '';
        let found = false;
        for (let i = 1; i <= 6; i++) {
            const listRes = await system.exec(`ls -1 ${VAULT_DIR} 2>/dev/null`, 10000);
            list = (listRes.stdout || '').trim();
            if (list.indexOf(fileName) < 0) {
                // 远程 exec 偶发 500（失败实证），su 读取带一次重试
                let userRes;
                try {
                    userRes = await system.exec(`su -s /bin/sh ${USER} -c 'ls -1 ${VAULT_DIR}' 2>&1`, 10000);
                } catch (err) {
                    await sleep(2000);
                    userRes = await system.exec(`su -s /bin/sh ${USER} -c 'ls -1 ${VAULT_DIR}' 2>&1`, 10000);
                }
                list = (userRes.stdout || '').trim();
            }
            console.log(`第${i}次检查保险箱内文件列表:\n${list}`);
            if (list.indexOf(fileName) >= 0) {
                found = true;
                break;
            }
            await sleep(3000);
        }
        if (!found) {
            // shell 读不到 FUSE 挂载内容时退化为界面校验
            found = await agent.aiBoolean(`保险箱内容区域显示文件 ${fileName}`);
            console.log(`shell 未读到文件，界面校验结果: ${found}`);
        }
        if (!found) {
            throw new Error(`断言失败：文件 ${fileName} 未成功拷贝到保险箱`);
        }
        console.log('✅ 断言通过：SMB 文件已成功拷贝到保险箱');

        const pidRes = await system.exec('pidof dde-file-manager | wc -w', 10000);
        const pidCount = parseInt((pidRes.stdout || '0').trim(), 10);
        if (pidCount < 1) {
            throw new Error('断言失败：文管进程已退出');
        }
        await agent.aiAssert('文件管理器窗口正常显示，界面没有卡死或崩溃');

        console.log('===== 测试全部通过 =====');
    }, { timeout: 1800000, tags: ['1810633', 'level3', 'interaction-scenario', 'bug_to_case', 'vault', 'smb', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.pressKey('Esc');
    });

    afterAll(async ({ device, uos, agent, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { rmVault, closeFileManager, clearEnvironment, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await device.pressKey('Esc');
        await cleanSmbMounts(agent, system);
        await rmVault(system);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
    });
});
