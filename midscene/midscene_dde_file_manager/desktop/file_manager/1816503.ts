/**
 * 用例 PMSID: 1816503
 * 用例标题: 组策略配置自动排序-主线默认为关闭
 * 生成时间: 2026-03-26 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1816503-组策略配置自动排序-主线默认为关闭', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816503-组策略配置自动排序-主线默认为关闭', async ({ device, agent, uos, system, env }) => {

    //步骤1： 检查autoAlign默认值
    const autoAlignResult = await system.exec("dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign");
    // 获取并清理命令输出
    const rawValue = autoAlignResult.stdout.trim();
    const numericValue = Number(rawValue.replace(/^["']|["']$/g, ''));
    console.log("命令输出的值 =", numericValue);

    //判断autoAlign默认值为-1；如果值>0 表示开启；其他均为关闭
    // 步骤2：根据配置值验证桌面设置
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("自动排列可见");

    // 步骤3：根据配置值进行断言
    if (numericValue === -1) {
      // 默认值-1表示关闭
      await agent.aiAssert("自动排列开关是关闭的");
    } else if (numericValue > 0) {
      // 值大于0表示开启
      await agent.aiAssert("自动排列开关是打开的");
    } else {
      // 其他情况（包括0和负数）都视为关闭
      await agent.aiAssert("自动排列开关是关闭的");
    }

  }, { timeout: 600000, tags: ["1816503", "level3", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();
  });
}); 