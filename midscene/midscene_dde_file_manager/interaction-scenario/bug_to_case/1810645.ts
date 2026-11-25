// @ts-nocheck

/**
 * 用例 PMSID: 1810645
 * 用例标题: 【Bug转用例场景】网络邻居页面顶部工具栏检查
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */

describe('1810645-网络邻居页面顶部工具栏检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810645-网络邻居页面顶部工具栏检查', async ({ device, agent, uos, system, env }) => {
    console.log('=== 开始测试：1810645 ===');

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);

    console.log('步骤1：点击左侧边栏的【网络邻居】');
    await agent.aiTap('左侧边栏的网络邻居');

    // 判断是否弹出"管理系统服务或单元文件需要认证"窗口
    console.log('判断是否存在认证窗口');
    try {
      await agent.aiWaitFor('管理系统服务或单元文件需要认证窗口', { timeoutMs: 5000 });
      // 认证窗口存在，输入密码并点击确定
      console.log('存在认证窗口，输入密码');
      const result = await system.exec("ps aux | grep -v grep | grep polkit-agent-helper | awk '{print $2}'");
      const TEST_PASSWORD = process.env.TEST_PASSWORD;
      if (result.success) {
        await agent.aiInput( `${TEST_PASSWORD}`,'密码输入框');
        await agent.aiTap('确定');
      }
      await agent.aiWaitFor('进入网络邻居目录');
      console.log('已通过认证并切换到网络邻居');
    } catch (e) {
      // 认证窗口不存在，直接断言已切换到网络邻居
      console.log('不存在认证窗口，直接断言已切换到网络邻居');
      await agent.aiWaitFor('切换到网络邻居', { timeoutMs: 5000 });
    }

    console.log('步骤2：检查顶部工具栏');
    await agent.aiAssert('工具栏正常展示图标按钮');
    await agent.aiAssert('工具栏正常展示列表按钮');
    await agent.aiAssert('工具栏正常展示视图选项按钮');
    console.log('工具栏正常展示图标、列表、视图选项按钮');

    await uos.closeCurrentWindow();

    console.log('✅ 1810645用例测试完成');
  }, { timeout: 600000, tags: ['1810645', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});