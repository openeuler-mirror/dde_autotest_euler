/**
 * 用例 PMSID: 1587075
 * 用例标题:  调节系统字号为最小-应用界面显示
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/28
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587075-调节系统字号为最小-应用界面显示', () => {
    beforeAll(async ({ device, uos, system, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await system.exec(`dde-dconfig set org.deepin.dde.appearance -r org.deepin.dde.appearance Font_Size -v 8.5`);

    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587075-调节系统字号为最小-应用界面显示', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器界面');
        await agent.aiAssert('设备管理器界面内容展示完整');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1587075", "level1", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
        await system.exec(`dde-dconfig set org.deepin.dde.appearance -r org.deepin.dde.appearance Font_Size -v 10.5`);
    });
}); 