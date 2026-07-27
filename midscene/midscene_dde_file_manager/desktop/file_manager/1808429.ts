/**
 * 用例 PMSID: 1808429
 * 用例标题: 快捷键-敲击键盘快速定位选中文件/文件夹
 * 生成时间: 2026-02-5 13:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808429-快捷键-敲击键盘快速定位选中文件/文件夹', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec("touch ~/Desktop/testyf1.txt");
    await system.exec("mkdir -p ~/Desktop/testyf2");
    await system.exec("mkdir -p ~/Desktop/testyf3");
    await system.exec("mkdir -p ~/Desktop/atestyf");
    //修改系统主题，避免选中颜色无法识别
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await uos.openApp("控制中心");
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("主题");
    await agent.aiTap("bloom");
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await uos.showDesktop();
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808429-快捷键-敲击键盘快速定位选中文件/文件夹', async ({ device, agent, uos, system, env }) => {

    //步骤1：测试文件夹
    await device.pressKey("t");
    await agent.aiAssert("testyf1.txt 被选中");
    //步骤2：连续敲击字母
    await device.pressKey("t");
    await agent.aiAssert("testy2被选中");
    await device.pressKey("t");
    await agent.aiAssert("testy3被选中:testy3文件名背景颜色比testy2文件名颜色深");
    //步骤3：连续敲击键盘，间隔大于1s
    await device.pressKey("t");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("a");
    await agent.aiAssert("atestyf被选中：atestyf文件名背景颜色比testy2文件名颜色深");
    //步骤4:无匹配内容
    await agent.aiTap("桌面空白处");
    await device.pressKey("0");
    await agent.aiAssert("桌面文件无任何变化，没有文件被选中");


  }, { timeout: 600000, tags: ["1808429", "level4", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop//testyf*');
    await system.exec('rm -rf ~/Desktop/atestyf');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //恢复系统主题
    await uos.openApp("控制中心");
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("主题");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
  });
}); 