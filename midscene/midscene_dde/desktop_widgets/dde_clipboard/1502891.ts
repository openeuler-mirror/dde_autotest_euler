/**
 * 用例 PMSID: 1502891
 * 用例标题: 【任务栏】【插件区域】【剪贴板】剪贴板插件图标右键菜单展示和操作
 * 生成时间: 2025-12-23 14:33:00
 * 用例编写人：UT000224(何权)
 */

describe('1502891-【任务栏】【插件区域】【剪贴板】剪贴板插件图标右键菜单展示和操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1502891-【任务栏】【插件区域】【剪贴板】剪贴板插件图标右键菜单展示和操作', async ({ device, agent, uos, system }) => {
    // 设置剪贴板插件到任务栏
    await new Promise(resolve => setTimeout(resolve, 2000));      
    await system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:true`
    );
    await new Promise(resolve => setTimeout(resolve, 500));   
    // 步骤1: 右键点击任务栏插件区上的剪贴板图标
    await agent.aiHover("桌面右下任务栏插件区域第一个剪贴板图标", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));   
    system.exec(`xdotool click 3`);
    
    // 验证正常在鼠标位置处展示右键菜单：打开，可选择操作
    await agent.aiWaitFor("右键菜单显示");
 
    // 步骤2: 鼠标点击右键菜单项"打开"
    await agent.aiTap("点击右键菜单中的“打开”选项");
    
    // 验证即时从屏幕右侧调出剪贴板窗口，右键菜单消失
    await agent.aiWaitFor("剪贴板窗口从屏幕右侧调出");
    await agent.aiAssert("桌面右侧剪贴板窗口显示");
    await agent.aiAssert("桌面右下任务栏插件区域右键菜单已消失");
    
    // 等待剪贴板窗口完全显示
    await system.exec(`xdotool click 3`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证剪贴板窗口即时消失，正常打开右键菜单
    await agent.aiAssert("剪贴板窗口已消失,右键菜单中包含“打开”选项");
    
    // 点击桌面其他区域关闭右键菜单
    await agent.aiTap("屏幕中心", { deepThink: true });
    
  }, { timeout: 600000, tags: ['1502891', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("桌面正中心");
    system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:false`
    );    
  });
});