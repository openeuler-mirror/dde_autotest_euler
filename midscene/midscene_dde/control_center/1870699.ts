/**
 * 用例 PMSID: 1870699
 * 用例标题:【控制中心】【个性化】【壁纸】纯色壁纸-自定义添加后默认更新为当前壁纸
 * 生成时间: 2025-12-17
 * 用例编写人:UT005044(王亮)
 */

describe('1870699-【控制中心】【个性化】【壁纸】纯色壁纸-自定义添加后默认更新为当前壁纸', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870699-【控制中心】【个性化】【壁纸】纯色壁纸-自定义添加后默认更新为当前壁纸', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 2: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");
        await agent.aiAssert("右侧区域的设置项中存在标题：纯色壁纸，第二项开始默认有10张纯色壁纸框");

        // 步骤 3: 点击自定义纯色壁纸框
        await agent.aiAction("点击纯色壁纸项中的第一个位置的自定义壁纸框");
        await agent.aiAssert("弹出颜色设置框，顶部显示不同颜色的区域，底部展示2个按钮：保存、取消");

        // 步骤 4: 点击颜色设置框中的颜色区域
        await agent.aiAction("点击颜色设置框中顶部的颜色区域中任意一个颜色点");
        await agent.aiAction("点击底部的按钮：保存");

        //检查：新添加的纯色壁纸成功后展示
        await agent.aiAssert("纯色壁纸项中的第二个位置更新展示当前选中的颜色值框，有选中态高亮边框");
        await device.pressKey("Super", "D");
        await agent.aiAssert("桌面上的应用窗口全部隐藏，桌面的壁纸已更新为新添加的纯色壁纸");

    }, { timeout: 600000, tags: ["1870699", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原系统原始配置
        //步骤1：先激活控制中心窗口，删除新添加的纯色壁纸
        await uos.openApp("控制中心");
        await agent.aiTap("鼠标点击系统壁纸区域中的第一个位置壁纸框");
        await agent.aiHover("鼠标移动到纯色壁纸区域中第二个位置的红色壁纸框", { deepThink: true });
        await agent.aiAssert("当前鼠标所在的纯色壁纸框中，右上角出现了关闭按钮X");
        await agent.aiTap("鼠标点击当前纯色壁纸框右上角的关闭按钮X");

        //步骤2：还原设置为默认主题
        await agent.aiTap("点击导航栏上的标题：个性化", { deepThink: true });
        await agent.aiTap("在主题设置区域中，点击名称项：nirvana");
        await agent.aiTap("在主题设置区域中，点击名称项：origin");

        //步骤3：关闭控制中心窗口
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  