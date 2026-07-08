/**
 * 用例 PMSID: 1808353
 * 用例标题: 添加到桌面-同一文件重复多次右键发送到桌面
 * 生成时间: 2026-01-21 11:27:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808353-添加到桌面-同一文件重复多次右键发送到桌面', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await system.exec('mkdir -p ~/Documents/TestA && mkdir -p ~/Documents/TestB'); //创建测试文件
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808353-添加到桌面-同一文件重复多次右键发送到桌面', async ({ device, agent, uos, system, env }) => {

    //步骤1&2：在文档目录连续发送文件A到桌面
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的文档");
    await agent.aiRightClick("TestA");
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await agent.aiRightClick("TestA");
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    //断言步骤1，2
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await agent.aiAssert("桌面存在：TestA快捷方式、TestA快捷方式1， 注意忽视文件名换行和空格");

    //步骤3：剪切测试文件A 到文件B 发送A到桌面
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的文档");
    await device.pressKey("Ctrl+X");
    await agent.aiDoubleClick("TestB");
    await device.pressKey("Ctrl+V");
    await agent.aiRightClick("TestA");
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");

    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    //断言步骤3
    await agent.aiAssert("桌面存在：TestA快捷方式2， 注意忽视文件名换行和空格");

    //步骤4：删除文件夹A ，再创建文件夹A，发送到桌面
    //删除文件夹A
    await system.exec("rm -rf ~/Documents/TestB/TestA && mkdir -p ~/Documents/TestB/TestA");
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的文档");
    await agent.aiTap("空白处");
    await agent.aiDoubleClick("TestB");
    await agent.aiRightClick("TestA");
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");

    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("桌面存在：TestA 快捷方式3， 注意忽视文件名的空格和换行");

    //检查历史快捷键1 无法打开
    await agent.aiDoubleClick("TestA快捷方式1，忽视文件名的换行和空格");
    await agent.aiAssert("弹出提示：TestA快捷方式1’已被更改或移动 是否删除此快捷方式 等内容");
    await agent.aiTap("取消");
    await agent.aiAssert("提示框关闭，桌面上存在TestA快捷方式1");
    await agent.aiDoubleClick("TestA快捷方式1，忽视文件名的换行和空格");
    await agent.aiWaitFor("弹出提示：TestA快捷方式1’已被更改或移动 是否删除此快捷方式 等内容");
    await agent.aiTap("确定");
    await agent.aiAssert("桌面上没有TestA快捷方式1");

  }, { timeout: 600000, tags: ["1808353", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await system.exec('rm -rf ~/Documents/TestA && rm -rf ~/Documents/TestB');
    await system.exec('rm -rf ~/Desktop/TestA*');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 