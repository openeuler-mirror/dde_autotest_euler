/**
 * 用例 PMSID: 1801565
 * 用例标题:【控制中心】【系统】【开发者模式】开发者模式三级菜单界面展示检查
 * 生成时间: 2025-12-23 10:10:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1801565-【控制中心】【系统】【开发者模式】开发者模式三级菜单界面展示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1801565-【控制中心】【系统】【开发者模式】开发者模式三级菜单界面展示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击开发者选项
      await agent.aiTap("开发者选项", { deepThink: true });

      //检查: 开发者选项界面展示
      await agent.aiAssert("显示开发者模式和开发者调试选项个模块");
      await agent.aiAssert("开发者模式下展示: 进入开发者模式(已进入状态),可获得root使用权限,但同时也可能导致系统完整性遭到破坏,请谨慎使用。如需安装非应用商店来源的应用,前往安全中心进行设置。其中“安全中心” 字体蓝色,可点击状态");     
      await agent.aiAssert("开发调试选项下展示: 系统记录级别(默认关闭状态),更改此选项可以获得更详细的日志记录,这些日志可能会降低系统性能和/或占用更多存储空间。更改选项处理可能需要一分钟,收到设置成功提示后,请重启设备方可生效。");

    }, { timeout: 1200000, tags: ["1801565", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });