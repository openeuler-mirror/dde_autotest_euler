/**
 * 用例 PMSID: 1870625
 * 用例标题:【控制中心】【个性化】【壁纸】我的图片-自定义添加后默认更新为当前壁纸
 * 生成时间: 2026-04-23
 * 用例编写人:UT005044(王亮)
 */

describe('1870625-【控制中心】【个性化】【壁纸】我的图片-自定义添加后默认更新为当前壁纸', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870625-【控制中心】【个性化】【壁纸】我的图片-自定义添加后默认更新为当前壁纸', async ({ device, agent, uos }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");
        await agent.aiAssert("右侧区域的列表菜单项中存在：壁纸");

        // 步骤 3: 点击壁纸
        await agent.aiTap("壁纸", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化 / 壁纸");

        // 步骤 4: 点击我的图片添加壁纸
        await agent.aiTap("添加图片框", { deepThink: true });
        await agent.aiWaitFor("文管路径选择框");
        await agent.aiTap("左侧区域的主目录菜单项", { deepThink: true });
        await agent.aiDoubleClick("右侧区域的图片文件夹", { deepThink: true });
        await agent.aiDoubleClick("右侧区域的Wallpapers文件夹", { deepThink: true });
        await agent.aiAssert("导航栏显示：图片 / Wallpapers");

        // 步骤 5: 点击任意一张本地图片
        await agent.aiDoubleClick("右侧区域名字Autumn开头的图片", { deepThink: true });
        await device.pressKey("Super", "D");

        // 检查 1: 桌面更新为对应森林壁纸       
        await agent.aiAssert("桌面壁纸更新为对应的森林图片");
        await device.pressKey("Super", "D");

        // 步骤 6: 再次点击我的图片添加壁纸
        await agent.aiTap("添加图片框", { deepThink: true });
        await agent.aiWaitFor("文管路径选择框");
        await agent.aiTap("左侧区域的主目录菜单项", { deepThink: true });
        await agent.aiDoubleClick("右侧区域的图片文件夹", { deepThink: true });
        await agent.aiDoubleClick("右侧区域的Wallpapers文件夹", { deepThink: true });
        await agent.aiAssert("导航栏显示：图片 / Wallpapers");

        // 步骤 7: 再次点击任意一张本地图片
        await agent.aiDoubleClick("右侧区域名字为desktop的图片", { deepThink: true });
        await device.pressKey("Super", "D");
    
        // 检查 2: 桌面更新为对应彩虹色壁纸     
        await agent.aiAssert("桌面壁纸更新为对应极光绿的图片");
        await device.pressKey("Super", "D");

    }, { timeout: 700000, tags: ["1870625", "level2", "smoke"] });
  
    afterEach(async ({ system, device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原系统原始配置
        //步骤1：先激活控制中心窗口，删除新添加的图片壁纸
        await system.exec(`killall dde-file-dialog`);
        await uos.openApp("控制中心");
        await agent.aiTap("鼠标点击系统壁纸区域中的第一个位置壁纸框");
        await agent.aiHover("鼠标移动到我的图片壁纸区的第二张壁纸框", { deepThink: true });
        await agent.aiAssert("当前鼠标所在的壁纸框中，右上角出现了关闭按钮X");
        await agent.aiTap("鼠标点击当前壁纸框右上角的关闭按钮X");
        await agent.aiHover("鼠标移动到我的图片壁纸区的第一张壁纸框", { deepThink: true });
        await agent.aiAssert("当前鼠标所在的壁纸框中，右上角出现了关闭按钮X");
        await agent.aiTap("鼠标点击当前壁纸框右上角的关闭按钮X");

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
  