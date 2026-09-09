/**
 * 用例 PMSID: 1503177
 * 用例标题: 【任务栏】【固定区域】【日历】时间插件右键菜单-打开日历
 * 生成时间: 2026-02-09 14:28:00
 * 用例编写人：UT000224(何权)
 */

describe('1503177-【任务栏】【固定区域】【日历】时间插件右键菜单-打开日历', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1503177-【任务栏】【固定区域】【日历】时间插件右键菜单-打开日历', async ({ device, agent, uos, system }) => {
    // 辅助函数：右键点击时间插件并选择打开日历
    async function openCalendarFromTimePlugin() {
      await agent.aiRightClick("任务栏右下角时间", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiTap("打开日历", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 测试1: 右键点击任务栏右下角"时间"插件图标，选择 打开日历
    console.log('测试1: 右键点击时间插件打开日历');
    await openCalendarFromTimePlugin();
    
    // 验证日历窗口显示当年月日的信息，显示正常
    await agent.aiAssert("日历窗口显示正常，界面完整");
    
    // 测试2: 直接再次右键点击"时间"插件图标，选择 打开日历，日历窗口保持不变
    console.log('测试2: 再次右键点击时间插件打开日历，验证窗口保持不变');
    await openCalendarFromTimePlugin();
    
    // 验证日历窗口保持不变（没有新的窗口打开，窗口状态未改变）
    await agent.aiAssert("日历窗口保持不变，日历窗口仍然显示当年月日的信息");
    
    // 测试3: 继续打开其它应用窗口（置顶），再右键点击"时间"插件图标，选择 打开日历，置顶日历窗口
    console.log('测试3: 打开置顶应用窗口后，右键点击时间插件打开日历，验证日历窗口置顶');
    
    // 打开文本编辑器并置顶
    await uos.openApp("文本编辑器", { waitAfterOpen: 3000, maximizeWindow: true });

    // 右键点击时间插件打开日历
    await openCalendarFromTimePlugin();
    
    // 验证日历窗口置顶显示
    await agent.aiAssert("日历窗口置顶显示，日历窗口在文本编辑器窗口之上");
    
    // 关闭文本编辑器
    await system.exec("killall deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 测试4: 最小化日历窗口，再右键点击"时间"插件图标，选择 打开日历，调起日历窗口到桌面
    console.log('测试4: 最小化日历窗口后，右键点击时间插件打开日历，验证日历窗口被调起');
    
    // 最小化日历窗口
    await uos.minimizeWindow();
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面无打开的日历窗口");
    
    // 右键点击时间插件打开日历
    await openCalendarFromTimePlugin();

    // 验证日历窗口被调起到桌面
    await agent.aiAssert("日历窗口被调起到桌，日历窗口显示正常");

  }, { timeout: 600000, tags: ['1503177', 'level2'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭日历窗口
    await system.exec("killall dde-calendar");
    // 确保所有应用窗口已关闭
    await system.exec("killall deepin-editor");
  });
});