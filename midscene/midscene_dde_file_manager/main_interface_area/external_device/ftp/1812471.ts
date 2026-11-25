/**
 * 用例 PMSID: 1812471
 * 用例标题: 卸载ftp-多窗口操作ftp卸载
 * 生成时间：2026-07-28
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1812471-卸载ftp-多窗口操作ftp卸载', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
        const { cleanFtpMounts, FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        // 前置完全卸载ftp
        await cleanFtpMounts(agent, system, device);
        // 用户名挂载ftp
        await FtpMount(agent, system, device, 1);
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812471-卸载ftp-多窗口操作ftp卸载', async ({ device, agent, uos, system }) => {
        const ip = process.env.FTP_IP;
        const { cleanFtpMounts, FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log(`FTP服务器IP：${ip}`);

        // ===== 步骤1：窗口A和窗口B均打开进入同一ftp目录-窗口B卸载ftp =====
        console.log('===== 步骤1：窗口A和窗口B均打开进入同一ftp目录-窗口B卸载ftp =====');

        // 打开窗口A并进入ftp目录
        console.log('步骤1.1：打开窗口A并进入ftp目录');
        // 窗口A布局到左侧
        await agent.aiAssert("窗口已进入ftp目录");
        await device.pressKey('super+left');
        await agent.aiWaitFor('左侧文件管理器窗口已布局到屏幕左侧');
        console.log('窗口A已进入ftp目录');

        // 打开窗口B并进入同一ftp目录
        console.log('步骤1.2：打开窗口B并进入同一ftp目录');
        await agent.aiRightClick(`文件管理器左侧边栏${ip}`);
        await agent.aiTap('在新窗口打开');
        await agent.aiAssert(`窗口已进入${ip}/目录`);
        await new Promise(resolve => setTimeout(resolve, 300));

        // 窗口B布局到右侧
        await device.pressKey('super+right');
        await agent.aiWaitFor('右侧文件管理器窗口已布局到屏幕右侧');
        await new Promise(resolve => setTimeout(resolve, 300));
        await agent.aiTap(`文件管理器左侧边栏${ip}`);
        await agent.aiAssert(`窗口B已进入${ip}的ftp目录`);
        console.log('窗口B已进入ftp目录');

        // 窗口B卸载ftp：右键点击侧边栏ftp目录，选择卸载
        console.log('步骤1.3：窗口B卸载ftp');
        await cleanFtpMounts(agent, system, device);
        await new Promise(resolve => setTimeout(resolve, 300));

        // 预期1：窗口A和窗口B均卸载成功，自动切换到计算机目录
        console.log('步骤1.4：验证窗口A和窗口B均卸载成功，自动切换到计算机目录');
        await agent.aiAssert(`侧边栏不显示${ip}文本`);
        await agent.aiAssert("左侧和右侧的窗口展示为计算机目录");
        console.log('✅ 步骤1验证通过：窗口A和窗口B均卸载成功，自动切换到计算机目录');

        // ===== 步骤2：窗口A进入ftp目录文件夹下-窗口B打开回收站目录-点击侧边栏ftp目录右键卸载 =====
        console.log('===== 步骤2：窗口A进入ftp目录文件夹下-窗口B打开回收站目录-点击侧边栏ftp目录右键卸载 =====');

        // 重新挂载ftp
        console.log('步骤2.1：重新挂载ftp');
        await FtpMount(agent, system, device, 1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 通过命令在ftp目录下创建测试文件夹
        await system.exec(`mkdir -p /run/user/1000/gvfs/ftp:host=${ip}/1812471_test`);
        await device.pressKey("F5");
        await device.pressKey("F5");
        await agent.aiWaitFor("1812471_test文件夹已显示");

        // 窗口A进入ftp目录下的1812471_test文件夹
        console.log('步骤2.2：左侧窗口进入ftp目录文件夹下');
        await agent.aiTap(`文件管理器左侧边栏${ip}`);
        await agent.aiDoubleClick("'1812471_test'文本");
        await agent.aiAssert("左侧窗口已进入1812471_test文件夹");
        console.log('窗口A已进入ftp目录下的1812471_test文件夹');

        // 窗口B打开回收站目录
        console.log('步骤2.3：右侧窗口打开回收站目录ftp');
        await agent.aiTap('右侧窗口中文件管理器左侧栏的回收站');
        await agent.aiAssert("右侧窗口已进入回收站目录");
        console.log('窗口B已进入回收站目录ftp');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 点击侧边栏ftp目录右键卸载
        await cleanFtpMounts(agent, system, device);

        // 预期2：窗口A自动切换到默认目录，即计算机目录上，窗口B正常运行
        console.log('步骤2.5：验证窗口A自动切换到默认目录，窗口B正常运行');
        await agent.aiAssert(`侧边栏不显示${ip}文本`);
        await agent.aiAssert("左侧窗口展示为计算机目录");
        await agent.aiAssert("右侧窗口展示为回收站目录");
        console.log('✅ 步骤2验证通过：窗口A自动切换到默认目录，窗口B正常运行');

        await system.exec("kill -TERM $(pidof dde-file-manager)");
        console.log('✅ 1812471用例测试完成');
    }, { timeout: 1200000, tags: ['1812471', 'level3', 'ftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const ip = process.env.FTP_IP;
        // 清除ftp目录下的测试文件
        await system.exec(`rm -rf /run/user/1000/gvfs/ftp:host=${ip}/1812471_test`);
        // 卸载ftp
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, device);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
