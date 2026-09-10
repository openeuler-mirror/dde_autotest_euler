/**
 * 用例 PMSID: 1587271
 * 用例标题:   启用音频适配器
 * 用例编写人: UT005045（许琪）
 * 生成时间：2026/04/28
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1587271- 启用音频适配器', () => {
    beforeAll(async ({ device, uos, system, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1587271- 启用音频适配器', async ({ device, agent, uos, system }) => {
        const { openDeviceManager } = await import(`${caseDir}midscene_device_manager/common/common.ts`);
        await openDeviceManager(device, agent, uos);
        //预制环境
        await agent.aiWaitFor('展示了设备管理器界面');
        await agent.aiTap('左侧菜单列中的音频适配器分类');
        await agent.aiWaitFor('切换到了音频适配器界面');
        await agent.aiRightClick('制造商下方的任意记录信息', { deepThink: true });
        await agent.aiTap('禁用');
        await new Promise(resolve => setTimeout(resolve, 5000));

        //验证启用音频适配器
        await agent.aiWaitFor('设备管理器界面不显示正在加载');
        await agent.aiRightClick('第一条红色的文字');
        await agent.aiAssert('菜单命令中展示了启用');
        await agent.aiTap('启用');
        await new Promise(resolve => setTimeout(resolve, 5000));
        await agent.aiWaitFor('设备管理器界面不显示正在加载');
        await agent.aiRightClick('制造商下方的任意记录信息', { deepThink: true });
        await agent.aiAssert('弹出的菜单中展示了禁用');
        await device.pressKey('ESC');
        await uos.closeCurrentWindow();

    }, { timeout: 600000, tags: ["1587271", "level1", "smoke", "xuqi"] });

    // 后置：清理测试残留
    afterAll(async ({ system, uos, agent, device, env }) => {
        console.log('3. afterAll: 清理测试残留');
        await uos.closeCurrentWindow();
    });
}); 