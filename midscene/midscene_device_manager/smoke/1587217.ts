/**
 * 用例 PMSID: 1587217
 * 用例标题:   处理器不可禁用-多个处理器
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/05/26
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587217-处理器不可禁用-多个处理器', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587217-处理器不可禁用-多个处理器', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('展示了设备管理器窗口');
        await agent.aiTap('左侧菜单列中的处理器分类');
        await agent.aiWaitFor('切换到了处理器界面');
        await agent.aiRightClick('点击底部制造商下方的任意记录信息', { deepThink: true });
        await agent.aiAssert('菜单列表显示了刷新、导出命令');
        await device.pressKey('ESC');

        await agent.aiRightClick('点击底部制造商下方的逻辑处理器', { deepThink: true });
        await agent.aiAssert('菜单列表显示了复制、刷新、导出命令');
        await device.pressKey('ESC');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1587217", "level1", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 