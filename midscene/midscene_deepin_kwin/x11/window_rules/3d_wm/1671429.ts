/**

 * 用例 PMSID: 1671429
 * 用例标题: 窗口级菜单—总在最前与置顶
 * 生成时间: 2026-01-14 14:58:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671429-窗口级菜单—总在最前与置顶', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳视觉");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671429-窗口级菜单—总在最前与置顶', async ({ device, agent, uos }) => {
    // 步骤1：使用快捷键"Ctrl+Alt+T"打开终端应用
    await device.pressKey("Ctrl", "Alt", "T");
    await agent.aiAssert("终端窗口显示正常");

    
    // 使用快捷键"Super+E"打开文件管理器应用
    await device.pressKey("Super", "E");
    await agent.aiAssert("文件管理器窗口显示正常");

    // "alt+space"键调出文管菜单后，选择"总在最前"
    await device.pressKey("Alt", "Space");
    await agent.aiTap('窗口菜单中的"总在最前"选项', { deepThink: true });
    
    // 预期结果1：文件管理器窗口显示在最上层
    await agent.aiAssert('文件管理器窗口显示在最上层');

    // 步骤2：使用快捷键"super+s"调出多任务视图
    await device.pressKey("Super", "S");    
    // 鼠标hover在窗口选择区的文件管理器窗口缩略图上
    await agent.aiHover('屏幕左边的文件管理器窗口', { deepThink: true });
    
    // 预期结果2：文管窗口左上角置顶图标变成浅蓝色
    await agent.aiAssert('文件管理器窗口左上角置顶别针本身是白色的，背景是黄色圆形');

    // 步骤3：鼠标点击文管窗口左上角置顶图标
    await agent.aiTap('文件管理器窗口左上角的置顶图标', { deepThink: true });
    
    // 预期结果3：置顶图标置灰变成未置顶状态
    await agent.aiAssert('置顶图标颜色变深');

    // 步骤4：使用快捷键"super+s"退出多任务视图
    await device.pressKey("Super", "S");

    // 点击任务栏终端图标
    await agent.aiTap('任务栏终端图标', { deepThink: true });
    
    // 预期结果4：终端窗口显示在最上层
    await agent.aiAssert('终端窗口显示在最上层');

    // 步骤5：使用快捷键"super+s"调出多任务视图
    await device.pressKey("Super", "S");
    
    // 鼠标hover在窗口选择区的文件管理器窗口缩略图上
    await agent.aiHover('窗口选择区的文件管理器窗口', { deepThink: true });
    
    // 点击文管左上角置顶图标
    await agent.aiTap('文件管理器窗口左上角的置顶图标', { deepThink: true });
    
    // 预期结果5：置顶图标变成浅蓝色(AI识别不到这么小的图标)
    // await agent.aiAssert('文件管理器窗口左上角置顶图标变成浅蓝色');

    // 步骤6：使用快捷键"super+s"退出多任务视图
    await device.pressKey("Super", "S");
    // 预期结果6：文管窗口显示在最上层
    await agent.aiAssert('文件管理器窗口显示在最上层');
  }, { timeout: 600000, tags: ['1671429', 'level2','x11','window_rules','3d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保所有窗口关闭
    await device.pressKey("Esc");
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await agent.aiRightClick("任务栏文件管理器图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
    // 关闭终端窗口
    await agent.aiRightClick("任务栏终端图标");
    await agent.aiTap("右键菜单中的'关闭所有'选项");
  });
});