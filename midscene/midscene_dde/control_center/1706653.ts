/**
 * 用例 PMSID: 1706653
 * 用例标题:【控制中心】【首页】【列表模式】控制中心首页列表模式菜单项界面展示
 * 生成时间: 2026-04-29
 * 用例编写人:UT005044(王亮)
 */

describe('1706653-【控制中心】【首页】【列表模式】控制中心首页列表模式菜单项界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1706653-【控制中心】【首页】【列表模式】控制中心首页列表模式菜单项界面展示', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 检查 1: 控制中心界面默认展示-左侧区域
        await agent.aiAssert("左侧区域中，左上角为控制中心设置图标，紧靠下方为搜索框；左侧下方区显示一级菜单，按固定顺序展示：系统、网络、个性化、蓝牙和其他设备、电源管理、账户、UOS ID、隐私和安全、系统更新。默认焦点在系统上，有底色效果");

        // 检查 2: 控制中心界面默认展示-右侧区域
        await agent.aiAssert("顶部导航栏显示：系统");
        await agent.aiAssert("右侧区域中，上方存在类标题：常用设置，紧靠下方区显示菜单项，按固定顺序展示：显示、声音、通知、日期和时间、默认程序、语言和区域、启动菜单、开发者选项、域管理、备份还原。");
        await agent.aiAssert("右侧区域中，下方存在类标题：辅助信息，紧靠下方区显示菜单项，按固定顺序展示：关于本机、开源软件声明、用户体验计划、用户许可协议、隐私政策。");

    }, { timeout: 300000, tags: ["1706653", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境，恢复窗口大小并退出
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  