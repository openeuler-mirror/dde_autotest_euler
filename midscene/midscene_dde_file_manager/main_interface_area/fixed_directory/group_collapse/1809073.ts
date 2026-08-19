/**
 * 用例 PMSID: 1809073
 * 用例标题:分组折叠-折叠状态挂载smb、ftp、sftp
 * 生成时间: 2026-03-09 09:50:26
 * 用例编写人：UT000244(李庆玲)
 */

describe('1809073-分组折叠-折叠状态挂载smb、ftp、sftp', () => {
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
      // 折叠网络分区
      await agent.aiHover('左侧导航栏网络');
      await agent.aiTap('左侧导航栏网络右侧的向上箭头', 1000);
      await agent.aiAssert('网络邻居不可见');
    });

    test('1809073-【复制远程路径】地址栏上鼠标右键复制smb路径', async ({ device, agent, uos, system, env, clipboard }) => {
    // 步骤一：挂载SMB并访问SMB
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
      await device.typeText(process.env.SMB_USERNAME);
      await agent.aiTap('密码输入框');
      await device.typeText(process.env.SMB_PASSWORD);
      await agent.aiTap('连接按钮');

      //  检测是否会出现授权弹框，需要即授权认证
      try {
        await agent.aiWaitFor('挂载或卸载文件系统需要授权');
        await device.typeText(env.testPassword);
        await agent.aiTap('确定');
        await agent.aiWaitFor('测试数据');
      } catch (error) {
        // 没有检测到系统授权弹框，直接继续
        console.log('系统密码已认证');
        await agent.aiWaitFor('测试数据');
      }

    } catch (error) {
      // 没有检测到服务器授权弹框，直接继续
      console.log('服务器已认证');
      await agent.aiWaitFor('测试数据');
    }

    // 展开网络分区
    await agent.aiHover('左侧导航栏网络');
    await agent.aiTap('左侧导航栏网络右侧的向下箭头');
    await agent.aiAssert('网络邻居可见');
    await agent.aiAssert(`左侧导航栏显示${process.env.SMB_IP}`);
    await agent.aiTap('计算机', 500);

    // 步骤二：挂载FTP并访问FTP
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
    await agent.aiTap('ftp://');
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
    
    // 检查网络分区下的FTP
    await agent.aiHover('左侧导航栏网络');
    await agent.aiAssert('网络邻居可见');
    await agent.aiAssert(`左侧导航栏显示${process.env.FTP_IP}上的···`);
    await agent.aiTap('计算机', 500);

    // 步骤三：挂载SFTP并访问SFTP
    // 判断sftp服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SFTP_IP, 300);
      console.log('检测到SFTP_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击10.20.63.143
      await agent.aiRightClick(process.env.SFTP_IP);
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
      console.log('sftp服务器卸载成功');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('sftp服务器卸载成功');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SFTP_IP，无需卸载服务器');
    }

    // 挂载sftp服务器
    await agent.aiTap('文件管理器右上角的菜单按钮');
    await agent.aiWaitFor('展示菜单选项');
    await agent.aiTap('连接服务器');
    await agent.aiTap('左侧smb://下拉框');
    await agent.aiTap('sftp://');
    await agent.aiWaitFor('sftp://');
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('服务器地址输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText(process.env.SFTP_IP);
    await agent.aiTap('弹框内任意空白处');
    await agent.aiTap('连接按钮');

    // 处理连接后的登录流程
    let isFirstLogin = false;
    
    // 检查是否为首次登录（出现标识验证失败弹框）
    try {
        console.log('检查是否为首次登录...');
        await agent.aiWaitFor('标识验证失败弹框');
        isFirstLogin = true;
        console.log('检测到首次登录，点击仍然登录');
        await agent.aiTap('仍然登录', 3000);
    } catch (error) {
        console.log('非首次登录，直接进入用户认证流程');
    }
    
    // 用户认证流程
    console.log('进入用户认证流程...');
    await agent.aiWaitFor('用户名输入框');
    await agent.aiTap('用户名输入框');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Backspace');
    await device.typeText(process.env.SFTP_USERNAME);
    await agent.aiTap('密码输入框');
    await device.typeText(process.env.SFTP_PASSWORD);
    await agent.aiTap('连接按钮');
    
    // 等待进入sftp目录
    await agent.aiWaitFor('sftp目录', 2000);
    await agent.aiAssert('顶部标签栏显示upload');
    console.log(isFirstLogin ? '首次登录成功，已进入sftp目录' : '非首次登录成功，已进入sftp目录');

    // 检查网络分区下的SFTP
    await agent.aiHover('左侧导航栏网络');
    await agent.aiAssert('网络邻居可见');
    await agent.aiAssert(`左侧导航栏显示${process.env.SFTP_IP}`);
    }, { timeout: 1800000, tags: ["1809073", "level3", "group_collapse", "liqingling"] });
  
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

    // 卸载sftp服务器
    // 判断sftp服务器是否已经挂载，如挂载即取消挂载
    try {
      await agent.aiWaitFor(process.env.SFTP_IP, 300);
      console.log('检测到SFTP_IP已存在，执行取消记住密码并卸载操作');
      
      // 右键点击10.20.63.143
      await agent.aiRightClick(process.env.SFTP_IP);
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
      console.log('sftp服务器卸载成功');
      }catch (error1) {
        console.log('未找到“取消记住密码并卸载”，尝试查找是否点击“移除”');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('sftp服务器卸载成功');
      }catch (error2) {
        console.log('未找到“移除”，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到SFTP_IP，无需卸载服务器');
    }

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
        console.log('未找到"取消记住密码并卸载"，尝试查找是否点击"移除"');
      }

      try{
        // 检查是否存在移除，有则点击移除--即表示服务器未认证挂载
        await agent.aiAssert('移除');
        await agent.aiTap('移除', 500);
        console.log('ftp服务器卸载成功');
      }catch (error2) {
        console.log('未找到"移除"，即服务器未挂载，进入下一步');
      }

    } catch (error) {
      console.log('未检测到FTP_IP，无需卸载服务器');
    }
    });
  
    afterAll(async ({ uos, agent, device, system, env }) => {
      console.log('5. afterAll: 清理测试套件');
      // // 展开网络分区
      // await agent.aiHover('左侧导航栏网络');
      // await agent.aiTap('左侧导航栏网络右侧的向下箭头');
      // await agent.aiAssert('网络邻居可见');
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      await system.exec('killall dde-file-manager');

    });
    });
