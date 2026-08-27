/**
 * 用例 PMSID: 1885833
 * 用例标题:【桌面】【锁屏】登录后-快捷键Super+L实现锁屏
 * 生成时间: 2025-12-16
 * 用例编写人:UT005044(王亮)
 */

describe('1885833-【桌面】【锁屏】登录后-快捷键Super+L实现锁屏', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1885833-【桌面】【锁屏】登录后-快捷键Super+L实现锁屏', async ({ device, agent, uos }) => {
        // 步骤 1: 快捷键Super+L
        await device.pressKey("Super", "L");
  
        //检查：锁屏界面的展示
        await agent.aiAssert("密码框中默认有焦点选中态，边框高亮");
        await agent.aiAssert("密码框中有底色提示文案：请输入密码");
        await agent.aiAssert("左下角有版本标识：25 专业版");
        await agent.aiAssert("界面顶部居中位置存在当天的时间和日期");

    }, { timeout: 60000, tags: ["1885833", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境，登录到桌面
        await device.typeText(env.testPassword);
        await device.pressKey("Enter");
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  