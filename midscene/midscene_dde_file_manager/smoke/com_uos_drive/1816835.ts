/**
 * 用例 PMSID: 1816835
 * 用例标题:云盘插件-首页登录引导页面显示
 * 生成时间: 2026-4-14 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1816835-云盘插件-首页登录引导页面显示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');      
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理文件管理器相关缓存
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    // 关闭文件管理器相关进程
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1816835-云盘插件-首页登录引导页面显示', async ({ device, agent, uos, env, system }) => {
    await uos.showDesktop();
    await agent.aiWaitFor("桌面已显示");

    // 步骤1：打开文件管理器，点击文件管理器侧边栏的办公云盘
    await uos.openApp("文件管理器", 3000, 20000, true);

    await agent.aiTap("文件管理器侧边栏的办公云盘", { deepThink: true });
    // 步骤1预期结果：可以看到打开办公云盘按钮
    await agent.aiAssert("可以看到打开办公云盘按钮");

    // 步骤2：点击打开办公云盘按钮
    await agent.aiTap("打开办公云盘按钮", { deepThink: true });
    // 步骤2预期结果：弹出办公云盘登录界面，包含指定元素
    await agent.aiWaitFor("弹出办公云盘登录界面", { timeoutMs: 30000, checkIntervalMs: 2000 });
    
    // 新增判断：检测是否显示已登录UOS ID，若是则点击换个账号
    const hasLoggedInUosId = await agent.aiBoolean("看到快速登录文字", { timeoutMs: 5000 });
    if (hasLoggedInUosId) {
      console.log("检测到已登录UOS ID，点击「换个账号」");
      await agent.aiTap("换个账号文字", { deepThink: true });
      // 等待登录选择界面切换完成
      await agent.aiWaitFor("看到个人用户登录文字", { timeoutMs: 10000, checkIntervalMs: 1000 });
    }
    
    // 执行原有的断言逻辑
    await agent.aiAssert("办公云盘登录界面有办公云盘图标");
    await agent.aiAssert("办公云盘登录界面有手机验证登录方式");
    await agent.aiAssert("办公云盘登录界面有微信登录方式");
    await agent.aiAssert("办公云盘登录界面有账号登录方式");
    await agent.aiAssert("办公云盘登录界面有立即登录按钮");
    await agent.aiAssert("办公云盘登录界面有自动登录复选框");
    await agent.aiAssert("办公云盘登录界面有自动登录复选框有一个蓝色的√");
    await agent.aiAssert("办公云盘登录界面有我已阅读并同意复选框");
    if (hasLoggedInUosId) {
      await agent.aiAssert("办公云盘登录界面有UOS ID文字");
    }
    
    // 步骤3：按Alt+F4按钮关闭办公云盘登录界面，点击文件管理器左侧栏的计算机
    await device.pressKey("Alt+F4");
    await agent.aiWaitFor("办公云盘登录界面已关闭", { timeoutMs: 10000, checkIntervalMs: 1000 });

    await agent.aiTap("文件管理器左侧栏的计算机", { deepThink: true });
    // 步骤3预期结果：看到磁盘列表文字
    await agent.aiAssert("看到磁盘列表文字");

    // 步骤4：双击屏幕中间数据盘右侧的办公云盘图标
    await agent.aiDoubleClick("磁盘列表里的办公云盘图标，不是点击文件管理器左侧栏的办公云盘");
    // 步骤4预期结果：可以看到打开办公云盘按钮
    await agent.aiAssert("可以看到打开办公云盘按钮");

    // 步骤5：点击打开办公云盘按钮
    await agent.aiTap("打开办公云盘按钮", { deepThink: true });
    // 步骤5预期结果：弹出办公云盘登录界面，包含指定元素
    await agent.aiWaitFor("弹出办公云盘登录界面", { timeoutMs: 30000, checkIntervalMs: 2000 });
    
    // 新增判断：检测是否显示已登录UOS ID，若是则点击换个账号
    const hasLoggedInUosIdStep5 = await agent.aiBoolean("看到快速登录文字", { timeoutMs: 5000 });
    if (hasLoggedInUosIdStep5) {
      console.log("步骤5检测到已登录UOS ID，点击「换个账号」");
      await agent.aiTap("换个账号文字", { deepThink: true });
      // 等待登录选择界面切换完成
      await agent.aiWaitFor("切换到账号选择/登录界面", { timeoutMs: 10000, checkIntervalMs: 1000 });
    }
    
    // 执行原有的断言逻辑
    await agent.aiAssert("办公云盘登录界面有办公云盘图标");
    await agent.aiAssert("办公云盘登录界面有手机验证登录方式");
    await agent.aiAssert("办公云盘登录界面有微信登录方式");
    await agent.aiAssert("办公云盘登录界面有账号登录方式");
    await agent.aiAssert("办公云盘登录界面有立即登录按钮");
    await agent.aiAssert("办公云盘登录界面有自动登录复选框");
    await agent.aiAssert("办公云盘登录界面有自动登录复选框有一个蓝色的√");
    await agent.aiAssert("办公云盘登录界面有我已阅读并同意复选框");
    if (hasLoggedInUosIdStep5) {
      await agent.aiAssert("办公云盘登录界面有UOS ID文字");
    }    

    // 关闭文件管理器窗口
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });
  }, { timeout: 1200000, tags: ['1816835','level3','smoke','com_uos_drive','DITT','lanyanling'] });
  
  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文件管理器进程
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15"); 
  });
});