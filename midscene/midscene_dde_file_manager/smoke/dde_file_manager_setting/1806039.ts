/**
 * 用例 PMSID: 1806039
 * 用例标题: 【文件管理器】计算机页面和侧边栏系统盘、数据盘右键
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */

describe('1806039-计算机页面和侧边栏系统盘、数据盘右键', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806039-计算机页面和侧边栏系统盘、数据盘右键', async ({ device, agent, uos }) => {
      await agent.aiDoubleClick("桌面上计算机图标");
      await agent.aiRightClick("文件管理器侧边栏的系统盘");
      await agent.aiTap("点击新窗口打开");
      await agent.aiAssert("打开了新窗口并定位在系统盘目录");     
      await uos.closeCurrentWindow();

      await agent.aiDoubleClick("桌面上计算机图标");
      await agent.aiRightClick("文件管理器侧边栏的系统盘");
      await agent.aiTap("点击新标签中打开");
      await agent.aiAssert("打开了新标签,且标签名称为系统盘");     
      await uos.closeCurrentWindow();

      await agent.aiDoubleClick("桌面上计算机图标");
      await agent.aiRightClick("文件管理器侧边栏的系统盘");
      await agent.aiTap("点击属性");
      await agent.aiAssert("打开了系统盘属性对话框,且对话框中展示了系统盘属性内容");
      await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1806039",'level2', 'smoke']  });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });