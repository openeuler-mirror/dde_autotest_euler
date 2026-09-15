/**
 * 用例 PMSID: 1873635
 * 用例标题: 【任务栏】【固定区域】任务栏全局搜索图标点击操作
 * 生成时间: 2026-02-11 15:00:00
 * 用例编写人：UT000224(何权)
 */

describe('1873635-【任务栏】【固定区域】任务栏全局搜索图标点击操作', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await agent.exec(`killall dde-file-manager dde-control-center`);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1873635-【任务栏】【固定区域】任务栏全局搜索图标点击操作', async ({ device, agent, uos, system }) => {
    // 步骤1: 鼠标点击任务栏的全局搜索图标，即时打开全局搜索框
    await agent.aiTap("任务栏全局搜索放大镜图标", { deepThink: true });
    await agent.aiAssert("搜索框界面展示正常，处于可输入状态");
    
    // 步骤2: 输入相关关键字，可正常搜索到相关结果项
    await device.typeText("终端");
    await agent.aiWaitFor("搜索结果已显示");
    await agent.aiAssert("搜索到相关结果项，展示正常");
    
    // 步骤3: 点击搜索结果记录，可正常打开相关应用
    await agent.aiTap("搜索结果中的终端应用图标");
    await agent.aiAssert("终端应用已打开");
    
    // 关闭终端应用
    await system.exec(`killall deepin-terminal`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 步骤4: 多次点击任务栏的全局搜索图标，验证状态保持
    await agent.aiTap("任务栏全局搜索放大镜图标", { deepThink: true });
    await agent.aiWaitFor("全局搜索框已显示");
    
    // 第二次点击
    await agent.aiTap("任务栏全局搜索放大镜图标", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("搜索框一直保持显示状态");
    
    // 关闭搜索框
    await system.exec(`xdotool key Escape`);
    await new Promise(resolve => setTimeout(resolve, 500));

  }, { timeout: 600000, tags: ['1873635', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保搜索框已关闭
    await system.exec(`xdotool key Escape`);
  });
});