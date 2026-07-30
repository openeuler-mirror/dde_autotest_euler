/**
 * 用例 PMSID: 1960145
 * 用例标题:【任务栏】【应用区域】单击应用区域图标打开应用
 * 生成时间: 2026-02-05
 * 用例编写人:UT005044(王亮)
 */

describe('1960145-【控制中心】【个性化】【桌面和任务栏】个性化任务栏界面“合并应用图标”开关项关闭和开启即时生效', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1960145-【控制中心】【个性化】【桌面和任务栏】个性化任务栏界面“合并应用图标”开关项关闭和开启即时生效', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击个性化
      await agent.aiTap("个性化", { deepThink: true });
      await agent.aiAssert("导航栏显示：个性化");

      // 步骤 3: 点击桌面和任务栏
      await agent.aiTap("桌面和任务栏", { deepThink: true });
      await agent.aiAssert("导航栏显示：个性化 / 桌面和任务栏；右侧区域中存在开关项标题：合并应用图标，对应右侧开关状态默认开启，高亮色效果");

      // 步骤 4: 点击合并应用图标
      await agent.aiTap("点击合并应用图标项同一水平线上对应右侧的开关", { deepThink: true });
      await agent.aiAssert("合并应用图标项同一水平线上对应右侧开关更新为关闭状态，灰色效果");

      // 检查 1: 控制中心应用图标标签
      await agent.aiAssert("任务栏上的设置图标紧靠右侧有标签文字：控制中心");

      // 步骤 6： 点击任务栏的文件管理器应用图标
      await agent.aiTap("点击任务栏左侧区域上黄色的文件管理器图标", { deepThink: true });

      // 检查 2: 文件管理器应用图标标签
      await agent.aiWaitFor("文件管理器应用打开");
      await agent.aiAssert("任务栏上的文件管理器图标有标签文字：文件管理器");

      // 步骤 7: 调起控制中心并开启开关
      await uos.openApp("控制中心", 2000, 20000, true);
      await agent.aiTap("点击合并应用图标项同一水平线上对应右侧的开关", { deepThink: true });
      await agent.aiAssert("合并应用图标项同一水平线上对应右侧开关更新为开启状态，活动色高亮效果");

      // 检查 3: 各应用图标标签展示      
      await agent.aiAssert("任务栏上的所有应用图标都没有标签文字，仅图标显示");
  
    }, { timeout: 600000, tags: ["1960145", "level2", "smoke"] });
  
    afterEach(async ({ device, uos }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await uos.closeCurrentWindow();
      await uos.closeCurrentWindow();
      await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      // 还原环境: 关闭三个应用窗口
    });
  });
