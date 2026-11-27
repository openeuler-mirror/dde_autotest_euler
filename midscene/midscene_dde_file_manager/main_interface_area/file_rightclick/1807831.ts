/**
 * 用例 PMSID: 1807831
 * 用例标题: 【多选图片右键打印】选中多张文件和其他文件，右键菜单点击"打印"
 * 生成时间: 2026-07-07 10:00:00
 * 用例编写人： UT000649（黄甜）
 */

describe('1807831-多选图片右键打印', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        await system.exec('killall dde-file-manager', 500);
        await system.exec('mkdir -p ~/Desktop/1807831_test');
        await system.exec('touch ~/Desktop/1807831_test/test.jpg');
        await system.exec('touch ~/Desktop/1807831_test/test.png');
        await system.exec('touch ~/Desktop/1807831_test/test.txt');
    });

    test('1807831-多选图片右键打印', async ({ device, agent, uos, system }) => {
        console.log('=== 开始测试：1807831 ===');

        await agent.aiDoubleClick('1807831_test');

        console.log('步骤1：选中多张图片和其他类型文件，检查右键菜单');
        await device.pressKey('Ctrl+A');

        await agent.aiRightClick('test.txt');
        await agent.aiAssert('右键菜单中不显示【打印】选项');
        console.log('右键菜单中不显示【打印】选项');

        await agent.aiTap('文件管理器窗口空白处');

        console.log('✅ 1807831用例测试完成');
    }, { timeout: 1200000, tags: ["1807831", 'level3', 'file_rightclick', 'DITT', 'huangtian'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await system.exec('rm -rf ~/Desktop/1807831_test');
        await system.exec('killall dde-file-manager', 500);
        await uos.showDesktop();
    });
});