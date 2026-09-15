/**
 * 用例 PMSID: 1808669
 * 用例标题:【复制远程路径】地址栏上鼠标右键编辑ftp路径
 * 生成时间: 2026-03-02 09:50:26
 * 用例编写人：UT000244(李庆玲)
 */

describe('1808669-【复制远程路径】地址栏上鼠标右键编辑ftp路径', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      
      // 打开文本编辑器
      await uos.openApp('文本编辑器', { maximizeWindow: true });
      await agent.aiTap('右上角最小化按钮');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器并进入主目录保险箱
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1808669-【复制远程路径】地址栏上鼠标右键编辑ftp路径', async ({ device, agent, uos, system, env, clipboard }) => {
    // 挂载FTP并访问FTP
        // 判断ftp服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.FTP_IP, 300);
      console.log('检测到FTP_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击10.20.63.143
      await agent.aiRightClick(process.env.FTP_IP);
      await agent.aiWaitFor('右键菜单');

      // 查看服务器是否已认证挂载 
      try{
        // 点击"取消记住密码并卸载"
      await agent.aiAssert('取消记住密码并卸载');
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword);
      await agent.aiTap('确定', 500);
      console.log('ftp服务器卸载成功');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('ftp服务器卸载成功');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到FTP_IP，无需卸载服务器');
    }

    // 挂载ftp服务器
    await agent.aiTap('文件管理器右上角的菜单按钮');
    await agent.aiWaitFor('展示菜单选项');
    await agent.aiTap('连接服务器');
    await agent.aiTap('左侧smb://下拉框');
    await agent.aiTap('ftp://')
    await agent.aiWaitFor('ftp://');
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('服务器地址输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText(process.env.FTP_IP);
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('连接按钮');
    await agent.aiWaitFor('弹出需要认证的弹框');

    // 弹出认证框
    await agent.aiTap('用户名输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText(process.env.FTP_USERNAME);
    await agent.aiTap('密码输入框');
    await device.typeText(process.env.FTP_PASSWORD);
    await agent.aiTap('连接按钮');
    await agent.aiWaitFor('进入ftp目录');

    // 在ftp中新建1808669文件夹
    await agent.aiTap('空白区域');
    await agent.aiRightClick('空白区域', 500);
    await agent.aiTap('新建文件夹');
    await device.typeText('1808669', 500);
    await agent.aiTap('空白区域');
    await agent.aiDoubleClick('1808669文件夹');
    await agent.aiWaitFor('打开1808669文件夹');

    // 步骤1：在文管地址栏选中FTP路径，鼠标右键复制地址
    await agent.aiTap('顶部标签下的地址栏上的1808669文件夹');
    await agent.aiRightClick('顶部标签下的地址栏上的1808669文件夹');
    await agent.aiHover('编辑地址');
    await agent.aiTap('编辑地址');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Ctrl+C');
    await device.pressKey('Ctrl+V');

    //断言：复制路径成功
    await device.pressKey('Win+V');
    await agent.aiWaitFor('剪切板');
    await agent.aiAssert(`桌面右侧剪切板中第一行显示ftp://${process.env.FTP_IP}/1808669`);
      
    // 打开文本编辑器，粘贴FTP路径
    await agent.aiTap('任务栏上文本编辑器');
    await agent.aiTap('文本输入框第一行');
    await device.pressKey('Ctrl+V');
    await agent.aiAssert(`显示ftp://${process.env.FTP_IP}/1808669`);

    // 关闭文本编辑器
    await agent.aiTap('文本编辑器标签页的关闭按钮');
    await agent.aiTap('不保存');

    // 删除在ftp上创建的1808669文件夹
    await agent.aiTap('顶部标签下的地址栏上的后退按钮');
    await agent.aiTap('ftp目录的中间空白区域');
    await agent.aiTap('1808669文件夹');
    await agent.aiRightClick('1808669文件夹');
    await agent.aiTap('删除', 500);
    await agent.aiTap('删除');
    await agent.aiAssert('ftp目录下不存在1808669文件夹');
    }, { timeout: 1800000, tags: ["1808669", "level2", "history_navigation", "liqingling"] });
  
    afterEach(async ({ device, agent,system, env }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 卸载ftp服务器
       // 判断ftp服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.FTP_IP, 300);
      console.log('检测到FTP_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击10.20.63.143
      await agent.aiRightClick(`左侧导航栏${process.env.FTP_IP}`);
      await agent.aiWaitFor('右键菜单');

      // 查看服务器是否已认证挂载 
      try{
        // 点击"取消记住密码并卸载"
      await agent.aiAssert('取消记住密码并卸载');
      await agent.aiTap('取消记住密码并卸载');
      // 等待弹出挂载或卸载文件系统需要授权的弹框
      await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
      // 密码弹框输入配置文件密码
      await device.typeText(env.testPassword);
      await agent.aiTap('确定', 500);
      console.log('ftp服务器卸载成功');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('ftp服务器卸载成功');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到FTP_IP，无需卸载服务器');
    }
    });
  
    afterAll(async ({ uos, agent, device, system, env }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      await system.exec('killall dde-file-manager');
      await system.exec('rm -rf ~/.config/deepin/deepin-editor*');
      await system.exec('killall deepin-editor');
    });
    });
