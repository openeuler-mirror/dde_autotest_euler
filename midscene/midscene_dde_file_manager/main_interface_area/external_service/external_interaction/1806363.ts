/**
 * 用例 PMSID: 1806363
 * 用例标题:   日志适配规范-文件管理器日志配置文件查看
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/12
 */

describe('1806363-日志适配规范-文件管理器日志配置文件查看', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806363-日志适配规范-文件管理器日志配置文件查看', async ({ device, agent, uos, system }) => {
        console.log("验证dde-file-manager.json,配置文件的内容");
        const exeCmd = "cat /usr/share/deepin-log-viewer/deepin-log.conf.d/dde-file-manager.json"
        await device.pressKey('ctrl+alt+t');
        await device.pressKey('super+up');
        await device.typeText(exeCmd);
        await device.pressKey("enter");
        await agent.aiAssert("存在文件管理器日志配置文件，内容为json日志配置文件");
        await agent.aiAssert("包含name、exec、logType、logPath、visible、version字段");
        await agent.aiAssert("logType值为journal");
        await agent.aiAssert("visible值为true");
        await uos.closeCurrentWindow();

    }, { timeout: 1200000, tags: ["1806363", 'level4', 'external_interaction', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});