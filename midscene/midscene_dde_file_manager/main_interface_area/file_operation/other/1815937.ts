/**
 * 用例 PMSID: 1815937
 * 用例标题: 长文件名功能(关闭) - 文件夹，以新窗口打开
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/23
 */



describe('1815937-长文件名功能(关闭) - 文件夹，以新窗口打开', () => {
    beforeAll(async ({ device, uos, agent}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815937-长文件名功能(关闭) - 文件夹，以新窗口打开', async ({ device,agent,uos,system}) => {
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的主目录");
        await agent.aiRightClick("图片");
        await agent.aiTap("新窗口打开");
        await agent.aiAssert("新窗口打开了图片文件夹")
        await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1815937",'level3', 'other','DITT','xuqi'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device}) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });