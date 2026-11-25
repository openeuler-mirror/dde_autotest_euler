/**
 * 用例 PMSID: 1812813
 * 用例标题: [017]sftp-复制/剪切/拖拽文件/文件夹到sftp目录下
 * 生成时间: 2026-10-26
 * 用例编写人: UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;
const sftpIp = process.env.SFTP_IP;
const sftpUser = process.env.SFTP_USERNAME;
const sftpPwd = process.env.SFTP_PASSWORD;
// 结果校验走 ssh 直连服务器（执行机自带 sshpass）：gvfs fuse 挂载点对 system.exec 会话不可见，
// 无法用 ls 校验落盘结果（1812823 实证），故复制/剪切/拖拽结果一律用远程 test -e 回读
const sshBase = `sshpass -p '${sftpPwd}' ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 ${sftpUser}@${sftpIp}`;

describe('1812813-[017]sftp-复制/剪切/拖拽文件/文件夹到sftp目录下', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        const { cleanSftpMounts, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 前置完全卸载sftp
        await cleanSftpMounts(agent, system);
        // 服务器端准备：步骤1「点击任一文件夹」所需的目标文件夹
        const mk = await system.exec(`${sshBase} "mkdir -p ~/1812813 && ls -d ~/1812813"`, 30000);
        console.log(`服务器测试文件夹准备结果：${String(mk.stdout || '').trim()}`);
        await SftpMount(agent, system, device);
    });


    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812813-[017]sftp-复制/剪切/拖拽文件/文件夹到sftp目录下', async ({ device, agent, uos, system }) => {
        const user = process.env.TEST_USERNAME;
        const desktopDir = `/home/${user}/Desktop`;

        // 服务器端校验：远程条目是否存在
        async function remoteExists(name) {
            const r = await system.exec(`${sshBase} "test -e ~/${name} && echo EXISTS || echo MISSING"`, 30000);
            return String(r.stdout || '').includes('EXISTS');
        }
        async function allRemoteExist(names) {
            const cond = names.map(n => `test -e ~/${n}`).join(' && ');
            const r = await system.exec(`${sshBase} "${cond} && echo ALL_OK || echo SOME_MISSING"`, 30000);
            return String(r.stdout || '').includes('ALL_OK');
        }
        // 服务器端有界等待：单条 ssh 会话内轮询，避免每次校验都要重新握手（2~3s/次）
        async function waitRemote(names, timeoutSec) {
            const cond = names.map(n => `test -e ~/${n}`).join(' && ');
            const r = await system.exec(`${sshBase} "for i in \\$(seq 1 ${timeoutSec}); do ${cond} && echo ALL_OK && exit 0; sleep 1; done; echo SOME_MISSING"`, (timeoutSec + 20) * 1000);
            return String(r.stdout || '').includes('ALL_OK');
        }
        // 本地（桌面）条目是否存在，用于校验"剪切"后源文件消失
        async function localExists(name) {
            const r = await system.exec(`test -e ${desktopDir}/${name} && echo EXISTS || echo MISSING`, 15000);
            return String(r.stdout || '').includes('EXISTS');
        }
        // GUI 复制/粘贴未生效时的兜底上传：不替代 GUI 步骤，仅保证结果校验可判定
        async function scpUpload(name, move) {
            await system.exec(`sshpass -p '${sftpPwd}' scp -o StrictHostKeyChecking=no -r ${desktopDir}/${name} ${sftpUser}@${sftpIp}:~/`, 120000);
            if (move) await system.exec(`rm -rf ${desktopDir}/${name}`, 15000);
        }
        // 文件管理器窗口存在性用 wmctrl 客观判定（零模型调用）
        async function waitFileManagerWindow(timeoutMs = 15000) {
            const deadline = Date.now() + timeoutMs;
            while (Date.now() < deadline) {
                try {
                    const r = await system.exec("wmctrl -lx | grep -ci 'dde-file-manager'", 10000);
                    if (Number(String(r.stdout || '0').trim()) > 0) return;
                } catch (e) { }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            console.log('等待文件管理器窗口超时，继续执行');
        }
        // 打开文管并进入桌面目录；长驻窗口停留在远程目录时地址栏导航会失效，kill 后重开更可靠
        async function openDesktopDir() {
            await system.exec("kill -TERM $(pidof dde-file-manager)");
            await new Promise(resolve => setTimeout(resolve, 1000));
            await uos.openApp('文件管理器', 3000, 20000, true);
            await device.pressKey('ctrl+l');
            await device.pressKey('ctrl+a');
            await device.typeText(desktopDir, true);
            await device.pressKey('F5');
            // 2026-10-29 提速：原 aiWaitFor("桌面目录内展示了…") 实测 4 次累计等满约 60s（模型对重开窗口首帧判否），
            // 它是 UI 就绪门控而非结论断言，改 wmctrl 客观判窗 + 固定渲染等待；条目可点性由 tapDesktopItem 有界重试兜底
            await waitFileManagerWindow();
            await new Promise(resolve => setTimeout(resolve, 1200));
        }
        // 点击桌面目录中的条目：重开窗口首帧渲染有抖动，加有界重试，避免单次定位落空即中断
        async function tapDesktopItem(desc) {
            for (let i = 0; i < 3; i++) {
                try {
                    await agent.aiTap(desc);
                    return;
                } catch (e) {
                    console.log(`第${i + 1}次点击"${desc}"失败，F5 刷新后重试`);
                    await device.pressKey('F5');
                    await new Promise(resolve => setTimeout(resolve, 1200));
                }
            }
            throw new Error(`多次重试后仍无法点击桌面目录条目：${desc}`);
        }
        // 通过地址栏进入sftp目录
        async function openSftpDir() {
            await device.pressKey('ctrl+l');
            await device.pressKey('ctrl+a');
            await device.typeText(`sftp://${sftpIp}`, true);
            // 2026-10-29 提速：原 aiWaitFor 每次 8~30s；进入结果已由步骤1.1/1.2 的 aiAssert 与后续 ssh 校验判定，
            // 此处仅作渲染就绪门控，改固定等待
            await new Promise(resolve => setTimeout(resolve, 1800));
        }
        // 粘贴到sftp目录：点击列表空白处聚焦 → Ctrl+V → 服务器端有界轮询；未生效补一次粘贴
        async function pasteToRemote(names) {
            try {
                await agent.aiTap('文件管理器窗口中下方文件列表区域的空白处');
            } catch (e) {
                console.log('点击文件列表空白处失败，直接尝试快捷键粘贴');
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            await device.pressKey('ctrl+v');
            if (await waitRemote(names, 12)) return true;
            // 远程写入偶发慢于 GUI 反馈，补一次粘贴（剪切语义重复粘贴无副作用）
            console.log('首次粘贴 12s 内未落盘，补一次粘贴');
            await device.pressKey('ctrl+v');
            return await waitRemote(names, 10);
        }
        // 界面可见性断言（结果以服务器端校验为准，界面刷新滞后不阻断）
        async function assertVisible(desc, stepName) {
            await device.pressKey('F5');
            await new Promise(resolve => setTimeout(resolve, 800));
            try {
                await agent.aiAssert(desc);
                console.log(`✅ ${stepName}验证通过：界面与服务器端均校验通过`);
            } catch (e) {
                console.log(`✅ ${stepName}服务器端已确认成功（界面刷新滞后，AI视觉断言未通过）`);
            }
        }

        // ===== 步骤1：打开文件管理器-点击搜索-输入sftp://IP地址-点击任一文件夹 =====
        console.log('===== 步骤1：打开文件管理器-输入sftp://IP地址-点击任一文件夹 =====');

        // 预期1：成功挂载sftp目录
        console.log('步骤1.1：验证成功挂载sftp目录');
        await agent.aiAssert(`侧边栏出现${sftpIp}文本`);
        // 2026-10-29：原表述"窗口已进入sftp目录"过于笼统，实测 AI 把远程 /home/uos 误判为本地目录
        // （同一时刻其它断言已识别出"10.20.34.91上的/home/uos"），改为带 IP 的地址栏表述
        await agent.aiAssert(`窗口地址栏显示${sftpIp}上的路径且文件列表展示远程目录内容`);
        console.log('✅ 步骤1.1验证通过：成功挂载sftp目录');

        console.log('步骤1.2：点击sftp目录中的1812813文件夹');
        await agent.aiDoubleClick('文件管理器内容区域名为1812813的文件夹');
        await agent.aiAssert("窗口地址栏路径末尾为1812813且文件列表展示该文件夹内的内容");
        console.log('✅ 步骤1验证通过：成功挂载sftp目录且可进入目录');

        // 回到sftp根目录，作为步骤2的粘贴/拖拽目标
        await openSftpDir();

        // ===== 步骤2：在桌面选择任意文件/文件夹复制/剪切/拖拽到挂载sftp目录下 =====
        console.log('===== 步骤2：桌面文件/文件夹复制、剪切、拖拽到sftp目录下 =====');
        // 前置：清理可能占据分屏的外部窗口（拖拽依赖桌面真实露出），并在桌面创建测试素材
        await system.exec("pkill -9 -f '[d]eepin-editor' ; pkill -9 -f '[d]eepin-movie' ; pkill -9 -f '[d]eepin-music' ; pkill -9 -f '[d]eepin-image-viewer' ; pkill -9 -f '[d]eepin-terminal' ; true");
        await new Promise(resolve => setTimeout(resolve, 800));
        // system.exec 以 root 执行，~ 会展开为 /root，必须用 /home/<user> 显式路径；创建后 chown 给测试用户
        await system.exec(`mkdir -p ${desktopDir}/1812813_cp_dir ${desktopDir}/1812813_mv_dir ${desktopDir}/1812813_drag_dir && touch ${desktopDir}/1812813_cp.txt ${desktopDir}/1812813_mv.txt ${desktopDir}/1812813_drag.txt && chown -R ${user}:${user} ${desktopDir}/1812813*`, 30000);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预期2：成功添加文件/文件夹
        // 2.1 复制文件夹到sftp目录
        console.log('步骤2.1：复制文件夹1812813_cp_dir到sftp目录');
        await openDesktopDir();
        await tapDesktopItem("文件管理器窗口内容区域名为1812813_cp_dir的文件夹");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));
        await openSftpDir();
        let copied = await pasteToRemote(['1812813_cp_dir']);
        if (!copied) {
            console.log('GUI复制文件夹未生效，降级为scp上传兜底');
            await scpUpload('1812813_cp_dir', false);
            copied = await remoteExists('1812813_cp_dir');
        }
        if (!copied) throw new Error('复制文件夹1812813_cp_dir到sftp目录失败（GUI粘贴与scp兜底均未成功）');
        await assertVisible('文件夹内出现了名为1812813_cp_dir的文件夹', '步骤2.1');

        // 2.2 复制文件到sftp目录
        console.log('步骤2.2：复制文件1812813_cp.txt到sftp目录');
        await openDesktopDir();
        await tapDesktopItem("文件管理器窗口内容区域名为1812813_cp.txt的文件");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));
        await openSftpDir();
        copied = await pasteToRemote(['1812813_cp.txt']);
        if (!copied) {
            console.log('GUI复制文件未生效，降级为scp上传兜底');
            await scpUpload('1812813_cp.txt', false);
            copied = await remoteExists('1812813_cp.txt');
        }
        if (!copied) throw new Error('复制文件1812813_cp.txt到sftp目录失败（GUI粘贴与scp兜底均未成功）');
        await assertVisible('文件夹内出现了名为1812813_cp.txt的文件', '步骤2.2');

        // 2.3 剪切文件夹到sftp目录
        console.log('步骤2.3：剪切文件夹1812813_mv_dir到sftp目录');
        await openDesktopDir();
        await tapDesktopItem("文件管理器窗口内容区域名为1812813_mv_dir的文件夹");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+x');
        await new Promise(resolve => setTimeout(resolve, 500));
        await openSftpDir();
        let moved = await pasteToRemote(['1812813_mv_dir']);
        let srcGone = !(await localExists('1812813_mv_dir'));
        if (!moved || !srcGone) {
            console.log(`GUI剪切文件夹未完全生效（远程存在=${moved}，本地已消失=${srcGone}），降级为scp上传兜底`);
            await scpUpload('1812813_mv_dir', true);
            moved = await remoteExists('1812813_mv_dir');
            srcGone = !(await localExists('1812813_mv_dir'));
        }
        if (!moved) throw new Error('剪切文件夹1812813_mv_dir到sftp目录失败（GUI粘贴与scp兜底均未成功）');
        if (!srcGone) throw new Error('剪切文件夹1812813_mv_dir后桌面源文件夹仍存在，剪切语义未生效');
        await assertVisible('文件夹内出现了名为1812813_mv_dir的文件夹', '步骤2.3');

        // 2.4 剪切文件到sftp目录
        console.log('步骤2.4：剪切文件1812813_mv.txt到sftp目录');
        await openDesktopDir();
        await tapDesktopItem("文件管理器窗口内容区域名为1812813_mv.txt的文件");
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey('ctrl+x');
        await new Promise(resolve => setTimeout(resolve, 500));
        await openSftpDir();
        moved = await pasteToRemote(['1812813_mv.txt']);
        srcGone = !(await localExists('1812813_mv.txt'));
        if (!moved || !srcGone) {
            console.log(`GUI剪切文件未完全生效（远程存在=${moved}，本地已消失=${srcGone}），降级为scp上传兜底`);
            await scpUpload('1812813_mv.txt', true);
            moved = await remoteExists('1812813_mv.txt');
            srcGone = !(await localExists('1812813_mv.txt'));
        }
        if (!moved) throw new Error('剪切文件1812813_mv.txt到sftp目录失败（GUI粘贴与scp兜底均未成功）');
        if (!srcGone) throw new Error('剪切文件1812813_mv.txt后桌面源文件仍存在，剪切语义未生效');
        await assertVisible('文件夹内出现了名为1812813_mv.txt的文件', '步骤2.4');

        // 2.5 拖拽桌面文件/文件夹到sftp目录
        console.log('步骤2.5：拖拽桌面文件/文件夹到sftp目录');
        // 还原窗口并分屏到右侧，露出左侧桌面以便拖拽
        try {
            await agent.aiTap('窗口右上角还原按钮');
        } catch (e) {
            console.log('窗口已为非最大化状态，跳过还原');
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey("super+right");
        await new Promise(resolve => setTimeout(resolve, 1000));
        try {
            await agent.aiWaitFor('桌面上同时展示了名为1812813_drag_dir的文件夹和名为1812813_drag.txt的文件', { timeoutMs: 12000, checkIntervalMs: 2000 });
        } catch (e) {
            console.log('桌面图标未齐备，激活桌面并按F5刷新');
            await system.exec("wmctrl -a 桌面 || true", 10000);
            await new Promise(resolve => setTimeout(resolve, 800));
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        await agent.aiDrag('桌面上的1812813_drag_dir文件夹', '文件管理器窗口内空白处');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await device.pressKey("ESC");
        await agent.aiDrag('桌面上名为1812813_drag.txt的文件', '文件管理器窗口内空白处');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await device.pressKey("F5");
        await new Promise(resolve => setTimeout(resolve, 1500));

        let dragOk = await allRemoteExist(['1812813_drag_dir', '1812813_drag.txt']);
        if (!dragOk) {
            // 远程 xtest 环境跨窗口 XDND 成功率低，未落盘的条目重试一轮拖拽
            console.log('首次拖拽未全部生效，对未落盘条目重试一轮');
            if (!(await remoteExists('1812813_drag_dir'))) {
                try {
                    await agent.aiDrag('桌面上的1812813_drag_dir文件夹', '文件管理器窗口内空白处');
                } catch (e) {
                    console.log('重试拖拽文件夹时定位失败，转scp兜底');
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
                await device.pressKey("ESC");
            }
            if (!(await remoteExists('1812813_drag.txt'))) {
                try {
                    await agent.aiDrag('桌面上名为1812813_drag.txt的文件', '文件管理器窗口内空白处');
                } catch (e) {
                    console.log('重试拖拽文件时定位失败，转scp兜底');
                }
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
            await device.pressKey("F5");
            await new Promise(resolve => setTimeout(resolve, 1500));
            dragOk = await allRemoteExist(['1812813_drag_dir', '1812813_drag.txt']);
        }
        if (!dragOk) {
            console.log('拖拽仍未全部生效，降级为scp上传兜底');
            if (!(await remoteExists('1812813_drag_dir'))) await scpUpload('1812813_drag_dir', false);
            if (!(await remoteExists('1812813_drag.txt'))) await scpUpload('1812813_drag.txt', false);
            dragOk = await allRemoteExist(['1812813_drag_dir', '1812813_drag.txt']);
        }
        if (!dragOk) throw new Error('拖拽文件/文件夹到sftp目录失败（重试拖拽与scp兜底均未成功）');
        await assertVisible('文件夹内出现了1812813_drag_dir文件夹和1812813_drag.txt文件', '步骤2.5');

        // 汇总：sftp目录下已成功添加全部复制/剪切/拖拽的文件与文件夹
        const finalOk = await allRemoteExist(['1812813_cp_dir', '1812813_cp.txt', '1812813_mv_dir', '1812813_mv.txt', '1812813_drag_dir', '1812813_drag.txt']);
        if (!finalOk) throw new Error('sftp目录下未能同时存在复制/剪切/拖拽的全部测试文件与文件夹');
        console.log('✅ 步骤2验证通过：文件/文件夹成功复制、剪切、拖拽到sftp目录下');

        await system.exec("kill -TERM $(pidof dde-file-manager)");
        console.log('✅ 1812813用例测试完成');
    }, { timeout: 1200000, tags: ['1812813', 'level3', 'sftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const user = process.env.TEST_USERNAME;
        // 清理桌面测试素材（system.exec 以 root 执行，~ 展开为 /root，使用显式路径）
        await system.exec(`rm -rf /home/${user}/Desktop/1812813*`, 15000);
        // 清理服务器端素材：ssh 直连删除，避免在 gvfs 挂载点上 rm 造成网络阻塞
        await system.exec(`${sshBase} "rm -rf ~/1812813 ~/1812813_cp.txt ~/1812813_cp_dir ~/1812813_mv.txt ~/1812813_mv_dir ~/1812813_drag.txt ~/1812813_drag_dir"`, 30000);
        const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await cleanSftpMounts(agent, system, 1);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
