/**
 * 用例 PMSID: 1814315
 * 用例标题: 【本地磁盘】盘符展示-挂载磁盘后检查计算机页面UI
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */

describe('1814315-盘符展示-挂载磁盘后检查计算机页面UI', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1814315-盘符展示-挂载磁盘后检查计算机页面UI', async ({ device, agent, uos }) => {
      await agent.aiDoubleClick("桌面上计算机图标");
      await uos.maximizeWindow();
      await agent.aiAssert("文件管理器中展示了我的目录文字");
      await agent.aiAssert("文件管理器中展示了磁盘文字");
      await agent.aiAssert("文件管理器中展示了保险箱文字");
      await uos.closeCurrentWindow();
    }, { 
        timeout: 120000,  // 超时时间
        tags: ["1814315",'level1', 'smoke'] 
    });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });