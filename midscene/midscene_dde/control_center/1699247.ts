/**
 * 用例 PMSID: 1699247
 * 用例标题: 【控制中心】【个性化】【颜色和图标】光标主题设置项四级界面展示
 * 生成时间: 2026-05-07 17:00:00
 * 用例编写人:UT001707(陈慧)
 */

describe('1699247-【控制中心】【个性化】【颜色和图标】光标主题设置项四级界面展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699247-【控制中心】【个性化】【颜色和图标】光标主题设置项四级界面展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心-个性化-颜色和图标-光标主题界面
      await uos.openApp("控制中心",{maximizeWindow: true});
      await agent.aiTap("个性化");
      await agent.aiTap("颜色和图标");
      await agent.aiTap("光标主题");

      // 检查: 打开到光标主题设置项四级界面展示正常
      await agent.aiAssert("光标主题设置项四级界面展示正常");

      // 检查: 光标主题设置项四级界面展示
      await agent.aiAssert("左侧列表焦点在一级菜单个性化项");
      await agent.aiAssert("页面左上角层级路径显示：< 个性化 / 颜色和图标 / 光标主题");
      await agent.aiAssert("右上角展示按钮：汉堡菜单，最小化，最大化/还原，关闭");
      await agent.aiAssert("直接展示多个主题项");
      await agent.aiAssert("默认选中主题bloom，显示勾选状态");
      //  步骤2: 还原控制中心窗口
      await agent.aiTap("最大化/还原")
      //  检查: : 光标主题显示顺序
      await agent.aiAssert("光标主题默认呈两列形式展示");
      await agent.aiAssert("依次显示：adwaita, bloom, bloom-dark, hazy-color, organic-glass, square, Vintage");

      //  检查: : 每项光标主题界面展示
      await agent.aiAssert("主题名称左对齐，右侧展示勾选状态");
      await agent.aiAssert("每个不同的主题第二行展示对应主题下不同状态的光标效果图");
      await agent.aiAssert("光标效果图显示清楚且正常");
  
    }, { timeout: 300000,
         tags: ['1699247','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });