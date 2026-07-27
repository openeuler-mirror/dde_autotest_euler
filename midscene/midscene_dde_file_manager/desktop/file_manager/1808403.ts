/**
 * 用例 PMSID: 1808403
 * 用例标题: 勾选自动排列-桌面文件过多堆叠在最后一个图标上
 * 生成时间: 2026-02-4 15:39:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808403-勾选自动排列-桌面文件过多堆叠在最后一个图标上', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据')
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //显示桌面
    await uos.showDesktop();
    //await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 3000));//等到3秒
    //勾选自动排列
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    //开关按钮是否是打开状态， 如果未打开，则执行下面动作，否则不执行
    const switchStatus = await agent.aiBoolean(`自动排列图标后面的开关按钮的状态`);
    if (switchStatus == false) {
      await agent.aiTap("自动排列图标后面的开关按钮");
    }
    await device.pressKey("ESC");
    //在桌面创建200份测试文件夹
    await system.exec('bash -c "mkdir -p ~/Desktop/YF文件夹{01..200}"');
    await new Promise(resolve => setTimeout(resolve, 5000));//等到5秒

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808403-勾选自动排列-桌面文件过多堆叠在最后一个图标上', async ({ device, agent, uos, system, env }) => {

    //步骤1：检查文件堆满屏，多余文件显示在最后一个图标
    //显示桌面
    await uos.showDesktop();
    //await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 3000));//等到3秒
    await agent.aiAssert("桌面文铺满件");

    //步骤2： 检查右键菜单呼出正常
    await agent.aiRightClick("桌面最后一个图标");
    await agent.aiWaitFor("右键菜单显示：打开、打开方式、压缩等内容");

  }, { timeout: 600000, tags: ["1808403", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/YF文件夹*');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //关闭自动排列--恢复默认
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    await agent.aiTap("自动排列图标后面的开关按钮");
    await device.pressKey("ESC");
  });
}); 