/**
 * 用例 PMSID: 1808451
 * 用例标题: 快捷键-切换选中文件/文件夹顺序
 * 生成时间: 2026-02-5 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808451-快捷键-切换选中文件/文件夹顺序', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
    //移动桌面图标避免干扰
    await system.exec("mkdir -p ~/Downloads/testBak && mv ~/Desktop/* ~/Downloads/testBak");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //创建多个文件
    await system.exec('bash -c "mkdir -p ~/Desktop/YF文件夹{01..54}"');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //显示桌面
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //设置控制中心壁纸
    await system.exec("killall dde-control-center");
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("bloom");
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808451-快捷键-切换选中文件/文件夹顺序', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面选择文件，Right
    await agent.aiTap("YF文件夹23");
    await device.pressKey("Right");
    await agent.aiAssert("选中YF文件夹23右侧的文件夹");

    //步骤2：Left
    await device.pressKey("Left");
    await agent.aiAssert("选中YF文件夹23");

    //步骤3：Down
    await device.pressKey("Down");
    await agent.aiAssert("选中YF文件夹23图标下面的文件夹");

    //步骤4：Up
    await device.pressKey("Up");
    await agent.aiAssert("选中YF文件夹23");

    //步骤5：Shift+Home
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹49");
    await device.pressKey("Shift+Home");
    await agent.aiAssert("YF文件夹49左侧以及上面文件全部被选中");

    //步骤6：shift+end
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹05");
    await device.pressKey("Shift+End");
    await agent.aiAssert("YF文件夹05右侧和下面的文件都被选中");

    //步骤7：shift+left
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹23");
    await device.pressKey("Shift+Left");
    await agent.aiAssert("选中YF文件夹23和它左边的一个文件夹");

    //步骤8：Shift+Right
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹23");
    await device.pressKey("Shift+Right");
    await agent.aiAssert("选中YF文件夹23和它右边的一个文件夹");

    //步骤9：shift+up
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹50");
    await device.pressKey("Shift+Up");
    await agent.aiAssert("选中YF文件夹50、YF文件夹49、YF文件夹41、YF文件夹32、YF文件夹23、YF文件夹14、YF文件夹05 等7个文件夹");

    //步骤10：shift+down
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹02");
    await device.pressKey("Shift+Down");
    await agent.aiAssert("选中YF文件夹02、YF文件夹11、YF文件夹20、YF文件夹29、YF文件夹38、YF文件夹47、YF文件夹03等7个文件夹；");

    //步骤11：按shift+鼠标选中
    await agent.aiTap("桌面空白处");
    await agent.aiTap("YF文件夹01");
    await device.keyDown("Shift");
    await agent.aiTap("YF文件夹46");
    await device.keyUp("Shift");//释放
    await agent.aiAssert("选中YF文件夹01、YF文件夹10、YF文件夹19、YF文件夹28、YF文件夹37、YF文件夹46等6个文件夹");

    //步骤12：按ctrl+鼠标选中
    await agent.aiTap("桌面空白处");
    await device.keyDown("Ctrl");
    await agent.aiTap("YF文件夹23");
    await agent.aiTap("YF文件夹25");
    await device.keyUp("Ctrl");//释放
    await agent.aiAssert("YF文件夹23、YF文件夹25 被选中");

    //步骤13：键盘tab键
    await agent.aiTap("桌面空白处");
    await device.pressKey("Tab");
    await agent.aiAssert("选中桌面第一个图标");

  }, { timeout: 600000, tags: ["1808451", "level4", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await system.exec('rm -rf ~/Desktop/YF文件夹*');
    await device.releaseAllKeys();
    //恢复桌面图标
    await system.exec("mv ~/Downloads/testBak/* ~/Desktop");
    await system.exec("rm -rf ~/Downloads/testBak");
    // 初始化文管配置和进程
    await system.cleanupFileManager();

    //恢复控制中心壁纸
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("bloom");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
  });
}); 