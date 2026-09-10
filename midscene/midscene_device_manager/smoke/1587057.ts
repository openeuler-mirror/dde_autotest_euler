/**
 * 用例 PMSID: 1587057
 * 用例标题: 切换主题-深色
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/23
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587057-切换主题-深色', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587057-切换主题-深色', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiTap('点击设备管理器右上角主菜单按钮');
        await agent.aiTap('主题');
        await agent.aiTap('深色');
        await agent.aiAssert('设备管理器主题展示为深色');
        await uos.closeCurrentWindow();

    }, { timeout: 600000, tags: ["1587057", "level3", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiTap('点击设备管理器右上角主菜单按钮');
        await agent.aiTap('主题');
        await agent.aiTap('浅色');
        await uos.closeCurrentWindow();
    });
}); 