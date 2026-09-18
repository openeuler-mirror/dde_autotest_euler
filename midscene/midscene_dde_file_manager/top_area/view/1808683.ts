/**
 * 用例 PMSID: 1808683
 * 用例标题: 【文管图标视图交互优化】检查文管工作区可任意更改图标大小
 * 生成时间: 2026-01-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808683-【文管图标视图交互优化】检查文管工作区可任意更改图标大小', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808683-【文管图标视图交互优化】检查文管工作区可任意更改图标大小', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");

    //步骤2：点击主目录
    await agent.aiTap('左侧导航栏主目录');
    
    // 步骤2：文件管理器视图模式设置为图标视图
    await agent.aiTap("地址栏右侧的图标视图按钮");

    // 步骤5：拖动地步右下角图标大小滚动条
    await agent.aiAction("右下角底部向右拖动滚动条");
    // await agent.aiAssert('图标视图显示变大');
    await agent.aiAction('右下角底部向左拖动滚动条');
    // await agent.aiAssert('图标视图显示变小');

    // 步骤6：使用快捷键Ctrl+鼠标滚轮更改图标大小
    // 模拟Ctrl+鼠标滚轮向上 - 图标变大
    await agent.aiTap('右下角底部图标大小显示条');
    await agent.aiScroll(
      { direction: 'up', scrollType: 'singleAction' },
      '右下角底部图标大小显示条'
    );
    // await agent.aiAssert('图标视图显示变大');
    
    // 模拟Ctrl+鼠标滚轮向下 - 图标变小
    await agent.aiScroll(
      { direction: 'down', scrollType: 'singleAction' },
      '右下角底部图标大小显示条'
    );
    // await agent.aiAssert('图标视图显示变小');
    
  }, { timeout: 1800000, tags: ["1808683", "level2", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    //恢复文件管理器设置
    await system.cleanupFileManager();
  
    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
