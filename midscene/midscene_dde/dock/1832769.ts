/**
 * 用例 PMSID: 1832769
 * 用例标题: 【任务栏】【右键菜单】【任务栏设置】右键菜单-任务栏设置项打开功能
 * 生成时间: 2026-03-05 17:00:00
 * 用例编写人：UT000224(何权)
 */

describe('1832769-【任务栏】【右键菜单】【任务栏设置】右键菜单-任务栏设置项打开功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 显示桌面，确保任务栏可见
    await uos.showDesktop();
    // 确保控制中心未打开
    await system.exec('killall dde-control-center');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832769-【任务栏】【右键菜单】【任务栏设置】右键菜单-任务栏设置项打开功能', async ({ device, agent, uos, system }) => {
    console.log('========== 步骤1: 未打开控制中心时，通过任务栏右键菜单打开任务栏设置 ==========');
    
    // 在任务栏任意空白区域右键点击
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 选择右键菜单中的"任务栏设置，机器原因等待10秒"
    await agent.aiTap('任务栏设置');
    await new Promise(resolve => setTimeout(resolve, 10000));
    
    // 验证已跳转到个性化-桌面和任务栏三级界面
    await agent.aiAssert('显示个性化-桌面和任务栏界面');
    
    console.log('========== 步骤2: 已打开控制中心时，通过任务栏右键菜单更新跳转到任务栏设置 ==========');
    
    // 再次在任务栏任意空白区域右键点击
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 再次选择右键菜单中的"任务栏设置"
    await agent.aiTap('任务栏设置');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 验证已更新跳转到个性化-桌面和任务栏三级界面
    await agent.aiAssert('显示个性化-桌面和任务栏界面，窗口是选中状态');
    
  }, { timeout: 120000, tags: ['1832769', 'level2', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭控制中心
    await system.exec('killall dde-control-center');
  });
});