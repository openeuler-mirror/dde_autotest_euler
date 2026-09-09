/**
 * 用例 PMSID: 1587053
 * 用例标题: 切换主题-浅色
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/05/29
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587053-切换主题-浅色', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587053-切换主题-浅色', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);

        await uos.openApp('控制中心', 2000, 20000, true);
        await agent.aiTap('个性化');
        await agent.aiTap('浅色');
        await agent.aiTap('深色');
        await uos.closeCurrentWindow();
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiAssert('设备管理器主题展示为深色');

        await uos.openApp('控制中心', 2000, 20000, true);
        await agent.aiTap('个性化');
        await agent.aiTap('深色');
        await agent.aiTap('浅色');
        await uos.closeCurrentWindow();
        await agent.aiAssert('设备管理器主题展示为白色');
        await uos.closeCurrentWindow();

    }, { timeout: 600000, tags: ["1587053", "level3", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 