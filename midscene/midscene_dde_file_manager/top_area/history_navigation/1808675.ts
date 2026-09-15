/**
 * 用例 PMSID: 1808675
 * 用例标题:【复制远程路径】使用复制的smb路径，直接粘贴到文管中，检查smb挂载效果
 * 生成时间: 2026-02-06 09:50:26
 * 用例编写人：UT000244(李庆玲)
 */

describe('1808675-【复制远程路径】使用复制的smb路径，直接粘贴到文管中，检查smb挂载效果', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });

    test('1808675-【复制远程路径】使用复制的smb路径，直接粘贴到文管中，检查smb挂载效果', async ({ device, agent, uos, system, env }) => {
    // 挂载SMB并访问SMB
    // 判断smb服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      console.log('检测到SMB_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击process.env.SMB_IP
      await agent.aiRightClick(process.env.SMB_IP, 300);
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
      await agent.aiTap('确定');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SMB_IP，无需卸载服务器');
    }

    // 挂载smb服务器
    await agent.aiTap('文件管理器右上角的菜单按钮');
    await agent.aiWaitFor('连接服务器');
    await agent.aiTap('连接服务器');
    await agent.aiWaitFor('smb');
    await agent.aiTap('服务器地址输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText(process.env.SMB_IP);
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('连接按钮');
    await agent.aiWaitFor('SmbTest');

    // 进入服务器目录，验证是否需要认证
    await agent.aiDoubleClick('SmbTest');
    // 检测是否需要授权弹框
    try {
      await agent.aiWaitFor('用户名');
      // 检测到需要授权，输入用户名和密码
      await agent.aiTap('用户名输入框');
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      // await device.typeText('admin');
      await device.typeText(process.env.SMB_USERNAME);
      await agent.aiTap('密码输入框');
      // await device.typeText('uniontech123');
      await device.typeText(process.env.SMB_PASSWORD);
      await agent.aiTap('连接按钮');
      //  检测是否会出现授权弹框，需要即授权认证
      try {
        await agent.aiWaitFor('挂载或卸载文件系统需要授权');
        //  await agent.aiTap('第二个输入框', 100);
        await device.typeText(env.testPassword);
        await agent.aiTap('确定');
        await agent.aiWaitFor('测试数据');
      } catch (error) {
        // 没有检测到系统授权弹框，直接继续
        console.log('系统密码已认证');
        
        // await agent.aiWaitFor('测试数据');
      }

    } catch (error) {
      // 没有检测到服务器授权弹框，直接继续
      console.log('服务器已认证');
      // await agent.aiWaitFor('测试数据');
    }

      //步骤1：在smb中新建文件夹
      await agent.aiRightClick('任意空白处');
      await agent.aiTap('在终端中打开');
      await device.typeText('mkdir -p 1808675 && touch 1808675/1808675.txt');
      await device.pressKey('enter');
      await system.exec('killall deepin-terminal');
      // 等待文件管理器刷新显示新创建的文件夹
      await agent.aiWaitFor('1808675', 2000);
      await agent.aiAssert('smbtest中存在1808675文件夹');
      await agent.aiDoubleClick('1808675文件夹'); 
      await agent.aiAssert('1808675.txt可见');     

      // 步骤1：在文管地址栏选中SMB路径，鼠标右键复制地址
      await agent.aiTap('地址栏上的1808675');
      await agent.aiRightClick('地址栏上的1808675');
      await agent.aiHover('复制路径');
      await agent.aiTap('复制路径');

      //断言：复制路径成功
      await device.pressKey('Win+V');
      await agent.aiWaitFor('剪切板');
      await agent.aiAssert(`桌面右侧剪切板中第一行显示smb://${process.env.SMB_IP}/smbtest/1808675`);

      // 步骤3：将SMB路径粘贴到文件管理器新窗口
      await agent.aiRightClick('任务栏上文件管理器');
      await agent.aiTap('新建窗口');
      await agent.aiWaitFor('文件管理器新窗口');
      await agent.aiTap('文件管理器新窗口中左侧导航栏桌面目录', 2000);      
      // 更可靠地定位地址栏 - 使用更通用的选择器
      await agent.aiTap('地址栏上的桌面后面的空白区域');
      await device.pressKey('Ctrl+A');
      await device.pressKey('Del');
      await device.pressKey('Ctrl+V');
      await device.pressKey('enter');
      await agent.aiAssert(`地址栏上显示${process.env.SMB_IP}上的smbtest/1808675`);
      await agent.aiAssert('1808675.txt文件');
      await agent.aiTap('文件管理器新窗口右上角的关闭按钮');

    }, { timeout: 1800000, tags: ["1808675", "level3", "history_navigation", "liqingling"] });
  
    afterEach(async ({ device, agent,system, env }) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 卸载smb服务器
       // 判断smb服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SMB_IP, 300);
      console.log('检测到SMB_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击10.20.63.143
      await agent.aiRightClick(process.env.SMB_IP);
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
      console.log('smb服务器卸载成功');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('smb服务器卸载成功');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SMB_IP，无需卸载服务器');
    }
    });
  
    afterAll(async ({ uos, agent, device, system, env }) => {
      console.log('5. afterAll: 清理测试套件');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      await system.exec('killall dde-file-manager');
      // 删除在SMB上创建的文件夹
      await system.exec(`rm -rf "/media/${process.env.TEST_USERNAME}/smbmounts/smb-share:server=${process.env.SMB_IP},share=smbtest/1808675"`);
    });
    });
