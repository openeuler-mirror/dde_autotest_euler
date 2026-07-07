/**
 * 用例 PMSID: 1886875
 * 用例标题:【控制中心】【个性化】【主题】系统默认主题和壁纸展示
 * 生成时间: 2026-02-05
 * 用例编写人:UT005044(王亮)
 */

describe('1886875-【控制中心】【个性化】【主题】系统默认主题和壁纸展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1886875-【控制中心】【个性化】【主题】系统默认主题和壁纸展示', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击个性化
        await agent.aiTap("个性化", { deepThink: true });
        await agent.aiAssert("导航栏显示：个性化");

        // 检查1 ：默认主题项展示
        await agent.aiAssert("右侧区域的主题项默认为：origin, 对应有活动色高亮边框");

        // 检查2：桌面壁纸展示
        await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
        await agent.aiAssert("桌面壁纸是一张‌蓝色带有波浪条纹,且有UOS字样的图片");

        //检查3：锁屏壁纸展示
        await device.pressKey("Super", "L");
        await agent.aiWaitFor("屏幕被锁定，出现账户名和密码输入框");
        await agent.aiAssert("锁屏壁纸背景是一张蓝色图片，带虚化效果");

    }, { timeout: 300000, tags: ["1886875", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境1：登录到系统桌面
        await device.typeText(env.testPassword);
        await device.pressKey("Enter");

         // 还原环境2: 调起控制中心，还原窗口大小，并关闭
        await uos.openApp("控制中心", 2000, 20000, true);       
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  