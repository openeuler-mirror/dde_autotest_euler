/**
 * 用例 PMSID: 1695965
 * 用例标题: 【控制中心】【系统】【默认程序】三级菜单界面检查
 * 生成时间: 2026-05-08 10:00:00
 * 用例编写人:UT001707(陈慧)
 */

describe('1695965-【控制中心】【系统】【默认程序】三级菜单界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1695965-【控制中心】【系统】【默认程序】三级菜单界面检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心-系统-默认程序界面
      await uos.openApp("控制中心",{maximizeWindow: true});
      await agent.aiTap("系统");
      await agent.aiTap("默认程序");

      // 检查: 默认程序三级菜单界面展示正常
      await agent.aiAssert("默认程序三级菜单界面展示正常");

      // 步骤 1: 点击网页右侧的>进入网页三级菜单
      await agent.aiTap("网页", { deepThink: true });

      // 检查: 网页三级菜单界面
      await agent.aiAssert("顶部导航菜单显示：< 系统 / 默认程序 / 网页");
      await agent.aiAssert("页面文案显示：选择打开网页的默认程序");
      await agent.aiAssert("页面展示添加按钮");

      // 返回默认程序主界面
      await agent.aiTap("默认程序", { deepThink: true });

      // 步骤 2: 依次检查邮件、文本、音乐、视频、图片、终端模块的三级菜单界面
      const modules = ["邮件", "文本", "音乐", "视频", "图片", "终端"];

      for (const module of modules) {
          // 点击进入模块三级菜单
          await agent.aiTap(`${module}`, { deepThink: true });
          
          // 检查模块三级菜单界面
          await agent.aiAssert(`顶部导航菜单显示：< 系统 / 默认程序 / ${module}`);
          await agent.aiAssert(`页面文案显示：选择打开${module}的默认程序`);
          await agent.aiAssert("页面展示添加按钮");
          
          // 返回默认程序主界面
          await agent.aiTap("左侧的<返回箭头", { deepThink: true });
}

  
    }, { timeout: 600000,
         tags: ['1695965','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
