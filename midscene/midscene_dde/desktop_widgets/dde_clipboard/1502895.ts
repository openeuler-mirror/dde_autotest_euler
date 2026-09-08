/**
 * 用例 PMSID: 1502895
 * 用例标题: 【任务栏】【插件区域】【剪贴板】剪贴板插件图标hover显示tips
 * 生成时间: 2025-12-22 17:16:37
 * 用例编写人：UT000224(何权)
 */

describe('1502895-【任务栏】【插件区域】【剪贴板】剪贴板插件图标hover显示tips', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1502895-【任务栏】【插件区域】【剪贴板】剪贴板插件图标hover显示tips', async ({ device, agent, uos, system }) => {
    //设置剪贴板插件到任务栏
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    await system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:true`
    );
    // 步骤1: 鼠标hover到任务栏上的剪贴板图标
    await new Promise(resolve => setTimeout(resolve, 2000)); 
    await agent.aiHover("桌面右下任务栏插件区域线上箭头旁的剪贴板图标", { deepThink: true });
    
    // 验证即时展示tips：剪贴板，显示正常
    await agent.aiWaitFor("剪贴板tips显示");
    // 存在未翻译的BUG，需要强调为中文提示
    await agent.aiAssert("tips显示内容为中文，内容为剪贴板");
    
    // 步骤2: 鼠标移出剪贴板图标区域外
    await agent.aiTap("桌面正中心");
    
    // 验证剪贴板tips即时消失
    await agent.aiAssert("剪贴板tips已完全消失");
    
    // 再次hover验证可重复性
    await agent.aiHover("桌面右下任务栏插件区域线上箭头旁的剪贴板图标", { deepThink: true });
    await agent.aiWaitFor("剪贴板tips显示");
    await agent.aiAssert("tips显示剪贴板");
    
  }, { timeout: 600000, tags: ['1502895', 'level3'] });

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