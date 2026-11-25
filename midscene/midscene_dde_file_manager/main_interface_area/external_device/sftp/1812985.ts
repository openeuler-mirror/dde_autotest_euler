/**
 * 用例 PMSID: 1812985
 * 用例标题: sftp-不勾选记住密码
 * 生成时间: 2026-07-29
 * 用例编写人: UT005045(许琪)
 */

describe('1812985-sftp-不勾选记住密码', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        const caseDir = process.env.TESTCASE_DIR;
        const { cleanSftpMounts, cleanFtpMounts, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 前置完全卸载sftp
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await cleanSftpMounts(agent, system);
        await cleanFtpMounts(agent, system, device);
        await cleanSmbMounts(agent, system, device);
        await cleanSmbMounts(agent, system);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1812985-sftp-不勾选记住密码', async ({ device, agent, uos, system }) => {
        const ip = process.env.SFTP_IP;
        const sftppwd = process.env.SFTP_PASSWORD;
        const sftpname = process.env.SFTP_USERNAME;
        console.log(`SFTP服务器IP：${ip}`);

        // ===== 步骤1：打开文件管理器-点击搜索-输入sftp://IP地址-点击任一文件夹 =====
        console.log('===== 步骤1：打开文件管理器-点击搜索-输入sftp://IP地址-点击任一文件夹 =====');
        // 打开文件管理器
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`sftp://${ip}`, true);

        // 预期1：主机密钥未信任时先弹"标识验证失败"安全提示框，点击"仍然登录"后出现需要认证对话框；
        // 主机密钥已信任时直接弹出需要认证对话框
        console.log('步骤1.1：等待弹窗出现');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const isPrompt = await agent.aiBoolean("页面出现首次访问的安全提示框，提示标识验证失败，包含'取消登录'和'仍然登录'按钮");
        if (isPrompt) {
            console.log('出现安全提示框，点击"仍然登录"');
            await agent.aiTap("安全提示框中的'仍然登录'按钮");
        } else {
            console.log('主机密钥已信任，未出现安全提示框');
        }
        console.log('步骤1.2：验证弹出需要认证对话框，可选择匿名访问或注册用户访问');
        await agent.aiAssert(`弹出需要认证的对话框`);
        await agent.aiAssert(`对话框提示匿名或注册用户方式访问`);
        console.log('✅ 步骤1验证通过：弹窗选择匿名访问或注册用户访问');

        // ===== 步骤2：输入用户名和正确密码-点击连接 =====
        console.log('===== 步骤2：输入用户名和正确密码-点击连接 =====');
        await device.typeText(`${sftpname}`);
        await agent.aiInput(`${sftppwd}`, '密码输入框');
        // 不勾选记住密码，直接点击连接
        await agent.aiTap("连接选项");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预期2：成功访问
        console.log('步骤2.1：验证成功访问sftp目录');
        await agent.aiAssert(`侧边栏出现${ip}文本`);
        await agent.aiAssert(`文件管理器已成功连接并进入sftp服务器：地址栏显示${ip}上的远程路径（如/home/uos/），窗口中显示该远程目录下的文件列表`);
        console.log('✅ 步骤2验证通过：成功访问sftp目录');

        // ===== 步骤3：侧边栏该sftp目录-右键点击卸载 =====
        console.log('===== 步骤3：侧边栏该sftp目录-右键点击卸载 =====');
        await agent.aiRightClick(`侧边栏中的${ip}文本`);
        await agent.aiTap("卸载");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预期3：成功卸载
        console.log('步骤3.1：验证成功卸载sftp');
        await agent.aiAssert(`侧边栏不显示${ip}文本`);
        console.log('✅ 步骤3验证通过：成功卸载sftp');

        // ===== 步骤4：再次输入sftp地址访问-检查是否弹出登录验证框 =====
        console.log('===== 步骤4：再次输入sftp地址访问-检查是否弹出登录验证框 =====');
        await device.pressKey('ctrl+l');
        await device.pressKey('ctrl+a');
        await device.typeText(`sftp://${ip}`, true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预期4：主机密钥未信任时先弹"标识验证失败"安全提示框，点击"仍然登录"后出现登录验证框；
        // 主机密钥已信任时直接弹出登录验证框
        console.log('步骤4.1：等待弹窗出现');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const isPrompt2 = await agent.aiBoolean("页面出现包含'取消登录'和'仍然登录'按钮的安全提示框");
        if (isPrompt2) {
            console.log('出现安全提示框，点击"仍然登录"');
            await agent.aiTap("安全提示框中的'仍然登录'按钮");
        } else {
            console.log('主机密钥已信任，未出现安全提示框');
        }
        console.log('步骤4.2：验证弹出登录验证框，可选择匿名访问或用户访问');
        await agent.aiAssert(`弹出需要认证的对话框`);
        await agent.aiAssert(`对话框提示匿名或注册用户方式访问`);
        console.log('✅ 步骤4验证通过：弹出登录验证框，可选择匿名访问或用户访问');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        console.log('✅ 1812985用例测试完成');
    }, { timeout: 1200000, tags: ['1812985', 'level3', 'sftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const caseDir = process.env.TESTCASE_DIR;
        const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 卸载sftp
        await cleanSftpMounts(agent, system);
        // 关闭文件管理器
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
