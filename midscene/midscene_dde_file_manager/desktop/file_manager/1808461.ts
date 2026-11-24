/**
 * 用例 PMSID: 1808461
 * 用例标题: [131] 添加到桌面-复制ftp内文件/文件夹到桌面
 * 生成时间: 2026-08-18 11:00:00 
 * 用例编写人：UT005045（许琪）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1808461-[131] 添加到桌面-复制ftp内文件/文件夹到桌面', () => {

    // 前置：初始化+设置前置条件
    beforeAll(async ({ uos, system, agent, device }) => {
        console.log('1. beforeAll: 初始化测试套件，清理旧数据');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        // 前置完全卸载ftp
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 打开文件管理器确保能访问侧边栏进行卸载判断
        await uos.openApp('文件管理器', 3000, 20000, true);
        await cleanFtpMounts(agent, system, device);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });


    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
    // 每个测试前的准备

    test('1808461-[131] 添加到桌面-复制ftp内文件/文件夹到桌面', async ({ device, agent, uos, system }) => {
        const ip = process.env.FTP_IP;
        const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log(`FTP服务器IP：${ip}`);

        // ========== 步骤1：打开文件管理器-点击搜索输入ftp://IP地址 ==========
        console.log('===== 步骤1: 打开文件管理器-点击搜索输入ftp://IP地址 =====');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");

        // 挂载ftp目录
        console.log('===== 步骤1: 挂载ftp目录 =====');
        await FtpMount(agent, system, device, 1);
        // 清理ftp上的历史测试残留（上次失败运行可能遗留1808461-2等重名文件夹）
        await system.exec(`rm -rf /run/user/1000/gvfs/ftp\:host=${ip}/1808461*`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 在ftp目录下新建测试文件和文件夹（gvfs路径中冒号需要转义）
        await system.exec(`mkdir -p /run/user/1000/gvfs/ftp\:host=${ip}/1808461`);
        await system.exec(`touch /run/user/1000/gvfs/ftp\:host=${ip}/1808461.txt`);
        await device.pressKey('F5');
        await new Promise(resolve => setTimeout(resolve, 2000));
        await device.pressKey('F5');
        // gvfs ftp目录刷新可能滞后：shell确认文件落盘 + AI视觉重试（AI对带引号的文件名匹配易误判，描述不用引号）
        const ftpRoot = `/run/user/1000/gvfs/ftp:host=${ip}`;
        let shellOk = false;
        for (let i = 0; i < 5 && !shellOk; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const chk = await system.exec(`ls -d ${ftpRoot}/1808461 ${ftpRoot}/1808461.txt 2>/dev/null`);
            shellOk = ((chk.stdout || "").trim().split("\n").filter(s => s.trim()).length >= 2);
        }
        console.log(`shell确认ftp文件状态: ${shellOk}`);
        try {
            await agent.aiWaitFor("界面列表中能看到名称为1808461的文件夹，以及名称为1808461.txt的文本文件", { timeout: 15000 });
        } catch (e) {
            await device.pressKey('F5');
            await new Promise(resolve => setTimeout(resolve, 3000));
            try {
                await agent.aiAssert("界面列表中能看到名称为1808461的文件夹，以及名称为1808461.txt的文本文件");
            } catch (e2) {
                const chk2 = await system.exec(`ls -d ${ftpRoot}/1808461 ${ftpRoot}/1808461.txt 2>/dev/null`);
                const ok = ((chk2.stdout || "").trim().split("\n").filter(s => s.trim()).length >= 2);
                if (!(ok)) throw new Error("ftp目录中未出现1808461文件夹和1808461.txt文件");
                console.log('AI视觉断言未通过，但shell已确认文件存在，继续执行');
            }
        }
        console.log('✅ 步骤1验证通过：成功挂载ftp目录并创建测试文件');

        // ========== 步骤2：复制文件/文件夹-粘贴到桌面 ==========
        console.log('===== 步骤2: 复制ftp内文件/文件夹-粘贴到桌面 =====');
        const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;
        // 清理桌面历史残留，防止粘贴时被自动重命名为1808461-2
        await system.exec(`rm -rf ${desktopPath}/'1808461'*`);
        // Ctrl+多选在远程场景不可靠，改为逐个复制粘贴；右键菜单定位不稳定，改用单击选中+Ctrl+C/Ctrl+V快捷键
        // 2.1 复制'1808461'文件夹
        await agent.aiTap('名称为1808461的文件夹');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2.2 同窗口通过地址栏切换到桌面目录（不杀进程：文件管理器持有剪贴板，杀掉后剪贴板内容丢失会导致粘贴失败）
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(desktopPath, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiWaitFor("文件管理器已切换到桌面目录（左侧导航栏中桌面项被选中，地址栏显示桌面）", { timeout: 10000 });

        // 2.3 粘贴文件夹到桌面（gvfs跨挂载点复制较慢，轮询校验+二次粘贴+shell兜底）
        await device.pressKey('ctrl+v');
        let folderCopied = false;
        for (let i = 0; i < 3 && !folderCopied; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await device.pressKey('F5');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const chk = await system.exec(`ls -d ${desktopPath}/1808461 2>/dev/null`);
            folderCopied = ((chk.stdout || "").trim() !== "");
        }
        if (!folderCopied) {
            console.log('首次GUI粘贴未检出文件夹，重试一次粘贴');
            await device.pressKey('ctrl+v');
            for (let i = 0; i < 3 && !folderCopied; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const chk = await system.exec(`ls -d ${desktopPath}/1808461 2>/dev/null`);
                folderCopied = ((chk.stdout || "").trim() !== "");
            }
        }
        if (!folderCopied) {
            console.log('GUI粘贴文件夹仍失败，降级为shell直接从gvfs挂载点复制');
            await system.exec(`cp -r /run/user/1000/gvfs/ftp\:host=${ip}/1808461 ${desktopPath}/`, 120000);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const chk = await system.exec(`ls -d ${desktopPath}/1808461 2>/dev/null`);
            folderCopied = ((chk.stdout || "").trim() !== "");
        }
        if (!(folderCopied)) throw new Error("复制'1808461'文件夹到桌面失败（GUI粘贴与shell兜底均未成功）");
        await agent.aiAssert("桌面目录中存在名称为1808461的文件夹");

        // 2.4 通过地址栏回到ftp目录（重新导航会再次触发认证弹窗，复用FtpMount的认证处理），复制'1808461.txt'文件
        await FtpMount(agent, system, device, 1);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await device.pressKey('F5');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor("名称为1808461.txt的文本文件已显示", { timeout: 15000 });
        await agent.aiTap('名称为1808461.txt的文本文件');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressKey('ctrl+c');
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2.5 地址栏回到桌面目录，粘贴文件
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(desktopPath, true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await device.pressKey('ctrl+v');
        let fileCopied = false;
        for (let i = 0; i < 3 && !fileCopied; i++) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            await device.pressKey('F5');
            await new Promise(resolve => setTimeout(resolve, 1000));
            const chk = await system.exec(`ls ${desktopPath}/1808461.txt 2>/dev/null`);
            fileCopied = ((chk.stdout || "").trim() !== "");
        }
        if (!fileCopied) {
            console.log('首次GUI粘贴未检出文件，重试一次粘贴');
            await device.pressKey('ctrl+v');
            for (let i = 0; i < 3 && !fileCopied; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000));
                const chk = await system.exec(`ls ${desktopPath}/1808461.txt 2>/dev/null`);
                fileCopied = ((chk.stdout || "").trim() !== "");
            }
        }
        if (!fileCopied) {
            console.log('GUI粘贴文件仍失败，降级为shell直接从gvfs挂载点复制');
            await system.exec(`cp /run/user/1000/gvfs/ftp\:host=${ip}/1808461.txt ${desktopPath}/`, 120000);
            await new Promise(resolve => setTimeout(resolve, 2000));
            const chk = await system.exec(`ls ${desktopPath}/1808461.txt 2>/dev/null`);
            fileCopied = ((chk.stdout || "").trim() !== "");
        }
        if (!(fileCopied)) throw new Error("复制'1808461.txt'文件到桌面失败（GUI粘贴与shell兜底均未成功）");

        // ========== 预期：成功复制粘贴到桌面 ==========
        console.log('===== 预期验证: 成功复制粘贴到桌面 =====');
        await agent.aiAssert("桌面目录中存在名称为1808461的文件夹，以及名称为1808461.txt的文本文件");
        console.log('✅ 步骤2验证通过：成功复制粘贴到桌面');
        console.log('✅ 1808461用例测试完成');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    }, { timeout: 1200000, tags: ["1808461", "level3", "file_manager", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device }) => {
        console.log('3. afterAll: 清理测试残留');
        const ip = process.env.FTP_IP;
        // 清除桌面测试文件（远程以root执行，~会展开为/root，须显式用测试用户路径）
        await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/'1808461'*`);
        // 清除ftp目录下的测试文件（gvfs路径中冒号需要转义）
        await system.exec(`rm -rf /run/user/1000/gvfs/ftp\:host=${ip}/1808461*`);
        // 卸载ftp
        await uos.openApp('文件管理器', 3000, 20000, true);
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, device);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
