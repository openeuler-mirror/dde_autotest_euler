/**
 * 用例 PMSID: 1772887
 * 用例标题:【控制中心】【首页】【列表模式】首页列表模式一级菜单项切换响应正常
 * 生成时间: 2026-01-28
 * 用例编写人:UT005044(王亮)
 */

describe('1772887-【控制中心】【首页】【列表模式】首页列表模式一级菜单项切换响应正常', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1772887-【控制中心】【个性化】【壁纸】壁纸三级界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 检查 1: 点击个性化后界面更新展示
        await agent.aiTap("左侧列表菜单项：个性化", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：个性化");
        await agent.aiAssert("右侧区域中存在菜单标题项：主题、外观、桌面和任务栏、窗口效果、壁纸、屏幕保护、颜色和图标");

        // 检查 2: 点击账户后界面更新展示
        await agent.aiTap("左侧列表菜单项：账户", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：账户");
        await agent.aiAssert("右侧区域中存在菜单标题项：账户信息、账户名、登录设置、自动登录、登录方式、密码");

        // 检查 3: 点击隐私和安全后界面更新展示
        await agent.aiTap("左侧列表菜单项：隐私和安全", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：隐私和安全");
        await agent.aiAssert("右侧区域中存在菜单标题项：摄像头、文件和文件夹");

        // 检查 4: 点击电源管理后界面更新展示
        await agent.aiTap("左侧列表菜单项：电源管理", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：电源管理");
        await agent.aiAssert("右侧区域中存在菜单标题项：通用、使用电源");

        // 检查 5: 点击网络后界面更新展示
        await agent.aiTap("左侧列表菜单项：网络", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：网络");
        await agent.aiAssert("右侧区域中存在菜单标题项：VPN、DSL、系统代理、网络详情");

        // 检查 6: 点击设备后界面更新展示
        await agent.aiTap("左侧列表菜单项：蓝牙和其他设备", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备");
        await agent.aiAssert("右侧区域中存在菜单标题项：鼠标与触控板、键盘");

        // 检查 7: 点击系统更新后界面更新展示
        await agent.aiTap("左侧列表菜单项：系统更新", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：系统更新");
        await agent.aiAssert("右侧区域中存在菜单标题项：更新设置");

        // 检查 8: 点击系统后界面更新展示
        await agent.aiTap("左侧列表菜单项：系统", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：系统");
        await agent.aiAssert("右侧区域中存在菜单标题项：显示、声音、通知、时间和日期、启动菜单");

        // 检查 9: 点击UOS ID后界面更新展示
        await agent.aiTap("左侧列表菜单项：UOS ID", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：UOS ID");
        await agent.aiAssert("右侧区域中存在标题文案项：云同步、登录UOS ID");

    }, { timeout: 600000, tags: ["1772887", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        // 还原环境，恢复窗口大小并退出
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  });
  