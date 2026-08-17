/**
 * 用例 PMSID: 1807465
 * 用例标题:    重命名支持殊符号-不支持特殊符号
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/12
 */

describe('1807465-重命名支持殊符号-不支持特殊符号', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807465-重命名支持殊符号-不支持特殊符号', async ({ device, agent, uos, system }) => {
        console.log('验证文本文件右键-重命名，输入“\ / : * ? " < > | ”');
        const INVALID_CHARS = ['\\', '/', ':', '*', '?', '"', '<', '>', '|'];
        const EXPECTED_PROMPT = '不得含有：\\ / : * ? " < > |';
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiRightClick('空白处');
        await agent.aiTap("新建文档");
        await agent.aiTap("文本文档");
        for (let i = 0; i < INVALID_CHARS.length; i++) {
            const char = INVALID_CHARS[i];
            console.log(`\n---------- 第 ${i + 1}/${INVALID_CHARS.length} 个字符: "${char}" ----------`);
            await device.typeText(char);
            await new Promise(resolve => setTimeout(resolve, 1000));
            await agent.aiAssert(EXPECTED_PROMPT);
        }
        await device.pressKey('esc');

    }, { timeout: 1200000, tags: ["1807465", 'level3', 'file_rightclick', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
    });
});