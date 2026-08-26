/**
 * 用例 PMSID: 1808273
 * 用例标题: 【文件管理器】计算机图标右键菜单
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */


describe('1808273-计算机图标右键菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808273-计算机图标右键菜单', async ({ device, agent, uos }) => {
    await agent.aiRightClick("桌面上计算机图标");
    await agent.aiTap("点击属性");
    await agent.aiAssert("界面显示文本内容：计算机名，版本，版本号，类型，处理器，内存");
    await uos.closeCurrentWindow();
 
  }, { timeout: 1200000, tags: ["1808273",'level1', 'smoke'] });
    
    
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});