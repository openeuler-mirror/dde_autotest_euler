/**
 * 用例 PMSID: 1808443
 * 用例标题: [086]快捷键-剪切置灰状态按esc重新呈选中状态
 * 生成时间: 2026-02-5 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808443-[086]快捷键-剪切置灰状态按esc重新呈选中状态', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("mkdir -p ~/Desktop/testYF123");
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    //设置主题，避免蓝色壁纸与选中文件背景冲突
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec("dde-control-center -s");
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiTap("bloom");
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await uos.showDesktop();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808443-[086]快捷键-剪切置灰状态按esc重新呈选中状态', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面选择文件，剪切
    await agent.aiTap("testYF123");
    await device.pressKey("Ctrl+X");
    await agent.aiAssert("文件图标颜色置灰：图标颜色变灰色");
    //步骤2：取消剪切
    await device.pressKey("ESC");
    await agent.aiAssert("选中状态：图标颜色为蓝色，文件名为蓝色选中状态");
    //清除文件
    await system.exec('rm -rf ~/Desktop/testYF123');
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    // 测试文本文件-- 剪切
    await system.exec("touch ~/Desktop/1808443.txt");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiTap("1808443.txt");
    await device.pressKey("Ctrl+X");
    await agent.aiAssert("文件图标颜色置灰：图标颜色变浅灰色，比其他文件图标颜色浅");
    // 取消剪切
    await device.pressKey("ESC");
    await agent.aiAssert("选中状态：文件图标为白色，文件名背景为蓝色");


  }, { timeout: 600000, tags: ["1808443", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await system.exec('rm -rf ~/Desktop/testYF123');
    await system.exec('rm -rf ~/Desktop/1808443.txt');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //设置主题，避免蓝色壁纸与选中文件背景冲突
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
  });
}); 