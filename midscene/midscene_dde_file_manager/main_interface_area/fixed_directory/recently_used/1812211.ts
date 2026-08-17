/**
 * 用例 PMSID: 1812211
 * 用例标题: 长文件名功能-最近使用,文件拖拽
 * 生成时间: 2025-12-25
 * 用例编写人: UT001774(李炎)
 */

describe('1812211-长文件名功能-最近使用,文件拖拽', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理可能存在的测试文件
        await system.exec('rm -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words*', 500);
        // 已开启长文件名功能
        const caseDir = process.env.TESTCASE_DIR;
        const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await enableLongFileName(device, agent, system);
    });

    test('1812211-长文件名功能-最近使用,文件拖拽', async ({ device, agent, uos, system }) => {

        // 前置条件: 创建长文件名测试文件
        console.log("=== 创建长文件名测试文件 ===");
        await system.exec('touch ~/Desktop/this_is_a_very_long_file_name_with_multiple_words.txt', 500);
        await agent.aiAssert("桌面存在this_is_a_…ords.txt文件或this_is_a_very_long_file_name_with_multiple_words.txt文件");
        console.log("✅ 第一个长文件名文件已创建");
        //  访问长文件名文件，生成最近使用记录
        console.log("=== 访问文件生成最近使用记录 ===");
        // 访问长文件名文件
        try {
            await agent.aiDoubleClick("this_is_a_very_long_file_name_with_multiple_words.txt");
        } catch {
            await agent.aiDoubleClick("this_is_a_…ords.txt");
        }
        console.log("✅ 长文件名文件已访问");
        try {
            await agent.aiTap("窗口右上角关闭按钮:X");
        } catch {
            console.log("无需操作");
        }

        // 步骤1: 打开文件管理器，进入最近使用目录，选择长文件名的文件，拖拽到桌面
        console.log("=== 进入最近使用目录 ===");
        await uos.openApp('文件管理器', { maximizeWindow: false });
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("已切换到最近使用栏目");
        console.log("✅ 已进入最近使用目录");
        //  选择长文件名的文件
        console.log("=== 选择长文件名的文件 ===");
        await agent.aiTap("this_is_a_very_long_file_name_with_multiple_words.txt文件");
        await agent.aiAssert("this_is_a_very_long_file_name_with_multiple_words.txt文件被选中");
        console.log("✅ 长文件名文件已选中");
        //保障文管窗口最大化
        device.pressKey("Super", "Down");
        // 拖拽到桌面
        console.log("=== 拖拽长文件名文件到桌面 ===");
        // 开始拖拽操作
        await agent.aiDrag("选中this_is_a_very_long_file_name_with_multiple_words.txt文件", "桌面右侧空白处", { deepThink: true });
        console.log("✅ 拖拽操作已完成");
        // 验证文件被复制到桌面
        await agent.aiTap("文件管理器左侧的桌面");
        await agent.aiAssert("桌面存在this_is_a_very_long_file_name_with_multiple_words（副本）.txt或this_is_a …（副本）.txt文件");
        console.log("✅ 文件已成功复制到桌面");
        // 验证副本文件内容正确
        console.log("=== 验证副本文件内容正确 ===");
        // 打开副本文件验证内容
        await agent.aiDoubleClick("this_is_a_very_long_file_name_with_multiple_words（副本）.txt");
        await agent.aiAssert("文件编辑器窗口已打开");
        await agent.aiTap("窗口右上角关闭按钮:X");
        console.log("✅ 副本文件内容正确，可正常打开");
        // 验证最近使用中原始文件记录仍然存在
        console.log("=== 验证最近使用中原始文件记录仍然存在 ===");
        // 回到最近使用目录
        await agent.aiTap("文件管理器左侧的最近使用");
        await agent.aiAssert("最近使用中存在this_is_a_very_long_file_name_with_multiple_words.txt文件");
        console.log("✅ 最近使用中原始文件记录仍然存在");

        console.log("===1812211-长文件名功能-最近使用,文件拖拽,执行成功===");

    }, { timeout: 600000, tags: ["1812211", "level3", "remote", "recently_used", "liyan"] });

    afterEach(async ({ agent, device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理创建的测试文件
        await system.exec('rm -f ~/Desktop/this_is_a_very_long_file_name_with_multiple_words*', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();
    });
});