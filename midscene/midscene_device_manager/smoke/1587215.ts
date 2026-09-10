/**
 * 用例 PMSID: 1587215
 * 用例标题:  主板不可禁用
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/28
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587215-主板不可禁用', () => {
    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587215-主板不可禁用', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        await agent.aiWaitFor('打开了设备管理器窗口');
        await agent.aiTap('左侧菜单列中的主板分类');
        await agent.aiWaitFor('切换到了主板界面');
        await agent.aiRightClick('制造商');
        await agent.aiAssert('无禁用菜单命令');
        await device.pressKey('ESC');
        await uos.closeCurrentWindow();
    }, { timeout: 600000, tags: ["1587215", "level1", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 