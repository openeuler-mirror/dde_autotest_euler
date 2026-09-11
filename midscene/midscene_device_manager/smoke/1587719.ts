/**
 * 用例 PMSID: 1587719
 * 用例标题:  查看处理器详细信息
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/23
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587719-查看处理器详细信息', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587719-查看处理器详细信息', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiTap('处理器');
        await agent.aiWaitFor('切换到了处理器界面');
        await agent.aiTap('更多');
        await agent.aiAssert('特性右侧展示了更多的详细内容');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1587719", "level2", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 