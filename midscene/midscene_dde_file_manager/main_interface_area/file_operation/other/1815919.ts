/**
 * 用例 PMSID: 1815919
 * 用例标题: 长文件名功能(关闭) - 剪切，粘贴字符数超出规则
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/8
 */

describe('1815919-长文件名功能(关闭) - 剪切，粘贴字符数超出规则', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815919-长文件名功能(关闭) - 剪切，粘贴字符数超出规则', async ({ device, agent, uos, system }) => {
        console.log("验证库目录，拷贝当前路径下的原长文件名称的文件粘贴到当前路径");
        const folder = "测试拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文";
        await system.exec(`mkdir "/home/$USER/Documents/${folder}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiRightClick(folder);
        await agent.aiTap('复制(C)');
        await agent.aiRightClick('空白处');
        await agent.aiTap('粘贴(P)');
        await agent.aiAssert("提示并弹出文件名过长的对话框");
        await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1815919", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const folder = "测试拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文件名称的文件粘贴到当前路径拷贝当前路径下的原长文";
        await system.exec(`rm -rf "/home/$USER/Documents/${folder}"`);
        await uos.closeCurrentWindow();
    });
});