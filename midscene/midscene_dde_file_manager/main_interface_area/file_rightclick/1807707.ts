/**
 * 用例 PMSID: 1807707
 * 用例标题:    检查U盘目录-列表模式-留白处右键菜单
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/3/4
 */

describe('1807707-检查U盘目录-列表模式-留白处右键菜单', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807707-检查U盘目录-列表模式-留白处右键菜单', async ({ device, agent, uos, system }) => {
        console.log('验证检查U盘目录-列表模式-留白处右键菜单');
        const usb_flash = process.env.USB_FLASH;
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiDoubleClick(usb_flash);
        await agent.aiRightClick('空白处');
        await agent.aiAssert("弹出了右键菜单");
        await device.pressKey("esc");
        await uos.closeCurrentWindow();
        
    }, { timeout: 600000, tags: ["1807707", 'level3', 'file_rightclick', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});