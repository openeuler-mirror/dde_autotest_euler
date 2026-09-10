/**
 * 用例 PMSID: 1587195
 * 用例标题: 根目录右键菜单显示
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/23
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587195-根目录右键菜单显示', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587195-根目录右键菜单显示', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiRightClick('概况');
        await agent.aiAssert('弹出了右键菜单，展示了导出和刷新命令');
        await device.pressKey('ESC');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1587195", "level3", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 