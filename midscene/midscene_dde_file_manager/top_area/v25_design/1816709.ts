/**
 * 用例 PMSID: 1816709
 * 用例标题: 视图选项-排序方式-下拉框开启与关闭
 * 生成时间: 2026-2-4 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816709-排序方式-下拉框开启与关闭', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

      // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 桌面新增多个文件
      await system.exec('touch /1816709.txt', 500);
      await system.exec('touch /1816709.xlsx', 500);
      await system.exec('touch /1816709.doc', 500);
    });
  
    test('1816709-排序方式-下拉框开启与关闭', async ({ device, agent, uos, system, env }) => {
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 进入主目录
      await agent.aiTap('文件管理器左侧的主目录');

      //步骤1：单击顶部工具栏“排序方式”按钮-结果：展开排序下拉框
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      // 检测视图选项显示正确性
      await agent.aiWaitFor('包含名称的下拉框');
      await agent.aiAssert('下拉框中包含大小');

      // 步骤2：收起排序下拉框
      await agent.aiTap('文件管理器窗口右下角空白处');
      await agent.aiAssert('下拉框收起');

      // 步骤2：再次点击击顶部工具栏“排序方式”按钮-结果：再开拉起排序下拉框
      await agent.aiTap('文件管理器窗口右上角第二排的↓↑图标右边的V', {deepThink:true});
      await agent.aiAssert('包含名称下拉框展开');

    }, { timeout: 1200000, tags: ["1816709", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 清楚新增的多个文件
      await system.exec('rm /1816709.txt', 500);
      await system.exec('rm /1816709.xlsx', 500);
      await system.exec('rm /1816709.doc', 500);

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
