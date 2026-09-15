/**
 * 用例 PMSID: 1847203
 * 用例标题:【桌面】【关机界面】关机界面显示
 * 生成时间: 2025-12-18
 * 用例编写人:UT005044(王亮)
 */

describe('1847203-【桌面】【关机界面】关机界面显示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });

    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1847203-【桌面】【关机界面】关机界面显示', async ({ device, agent, uos }) => {
        // 步骤 1: 点击关机图标打开关机界面
        //await agent.aiTap("点击任务栏上最右侧托盘区域的关机图标", { deepThink: true });
        //await agent.aiTap("点击任务栏上最右侧托盘区域中最右侧开始的第5个图标", { deepThink: true });
        await device.pressKey("Ctrl", "Alt", "Delete");

        //检查：关机界面展示
        await agent.aiAssert("即时展示关机界面，界面中央位置展示6个图标按钮和标题，从左到右依次为：关机、重启、待机、休眠、锁屏、注销，默认焦点在锁屏图标按钮，相对居中对齐");
        await agent.aiAssert("关机界面中，底部展示按钮：启动系统监视器");
        await agent.aiAssert("关机界面中，背景壁纸有蒙层效果，看不清具体的图案");

    }, { timeout: 60000, tags: ["1847203", "level2", "smoke"] });

    afterEach(async ({ device, agent, env }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境到桌面
        await agent.aiTap("鼠标点击关机界面的空白处");
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });