/**
 * 用例 PMSID: 1816661
 * 用例标题: 标题栏-布局改版
 * 生成时间: 2026-2-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816661-标题栏-布局改版', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  
    test('1816661-标题栏-布局改版', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：进入用户主目录，查看标题栏布局显示--结果：标题单分为上下两行
      await uos.openApp('文件管理器', { maximizeWindow: true });
      await agent.aiTap('左侧边栏的图片');
      // await agent.aiAssert('标题栏分为上下两行');

      // 步骤2：检查标题栏上一行内容--结果：有新建标签页按钮
      await agent.aiAssert('标题栏的上一行：有新建标签页按钮');

      // 步骤3：左侧为地址栏，右侧为视图按钮、视图选项、排序方式选项、搜索框
      await agent.aiAssert('标题栏的下一行：左侧为前进、后退、和地址栏，右侧为视图按钮、视图选项、排序方式选项、搜索框');

    }, { timeout: 1200000, tags: ["1816661", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
