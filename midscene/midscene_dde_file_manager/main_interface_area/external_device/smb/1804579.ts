/**
 * 用例 PMSID: 1804579
 * 用例标题: UBXC005943 文件打开关闭
 * 生成时间：2026-07-21
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1804579-UBXC005943 文件打开关闭', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 清理可能残留的文本编辑器（防止上次异常遗留的编辑器遮挡桌面）
        await system.exec("killall deepin-editor || true");
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const ip = process.env.SMB_IP;
        // 前置完全卸载smb
        await cleanSmbMounts(agent, system);
        // 用户名挂载smb
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await SmbMount(agent, system, device, 1);
        try {
            await agent.aiWaitFor(`侧边栏出现${ip}文本`, { timeout: 15000 });
        } catch (e) {
            console.log("首次未检测到侧边栏挂载项，清理后重新挂载一次");
            await cleanSmbMounts(agent, system);
            await SmbMount(agent, system, device, 1);
            await agent.aiAssert(`侧边栏出现${ip}文本`);
        }
    });

    test('1804579-UBXC005943 文件打开关闭', async ({ device, agent, uos, system }) => {
        const userName = process.env.TEST_USERNAME;
        // 步骤1：挂载Samba共享
        console.log("步骤1：挂载Samba共享");
        // 预期1：挂载成功
        await agent.aiAssert("smb挂载成功，侧边栏显示共享目录");

        // 步骤2：在smb共享路径频繁打开关闭文件(次数20)
        console.log("步骤2：在smb共享路径频繁打开关闭文件(次数20)");
        // 在smb路径下创建测试文件
        await system.exec(`touch /media/${userName}/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/1804579.txt`, 500);
        await device.pressKey("F5");
        await device.pressKey("F5");
        await agent.aiWaitFor("1804579.txt文件已显示");

        // 循环20次打开关闭文件
        for (let i = 0; i < 20; i++) {
            console.log(`第${i + 1}次打开关闭文件`);
            let fileOpened = false;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    await agent.aiDoubleClick("'1804579.txt'文件图标", { deepThink: true });
                    await agent.aiWaitFor("文件已打开");
                    fileOpened = true;
                    break;
                } catch (e) {
                    console.log(`第${attempt + 1}次打开文件失败，准备重试`);
                    if (attempt < 2) {
                        await device.pressKey("Esc");
                    }
                }
            }
            if (!fileOpened) {
                throw new Error("文件打开失败，重试多次仍无法打开");
            }
            await agent.aiAssert("1804579.txt文件已打开，无卡顿");
            await agent.aiTap("文本编辑器右上角关闭按钮:X");
            // 若弹出"您是否要保存此文件？"确认对话框，点击"不保存"后再等待窗口关闭
            try {
                await agent.aiWaitFor("屏幕上弹出'您是否要保存此文件？'的确认对话框", { timeout: 5000 });
                await agent.aiTap("对话框中的'不保存'按钮", { deepThink: true });
                console.log("检测到保存确认对话框，已点击'不保存'");
            } catch (e) {
                // 未弹出保存对话框，走正常关闭流程
            }
            await agent.aiWaitFor("文本编辑器窗口已关闭");
            await agent.aiAssert("未在文本编辑器中打开1804579.txt文件");
        }

    }, { timeout: 1200000, tags: ['1804579', 'level3', 'smb', 'DITT', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system, 1);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.cleanupFileManager();
        await device.pressKey("Esc");
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        // 清理残留文本编辑器，避免污染后续用例
        await system.exec("killall deepin-editor || true");
    });
});
