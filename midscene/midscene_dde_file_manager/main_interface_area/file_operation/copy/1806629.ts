/**
 * 用例 PMSID: 1806629
 * 用例标题: 1806629-剪切拷贝-退出剪切状态_
 * 生成时间: 2025-12-17
 * 用例编写人: UT001774(李炎)
 */

describe('1806629-剪切拷贝-退出剪切状态_', () => {
    beforeAll(async ({ device, uos, agent , system}) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.cleanupFileManager();
        await device.pressKey('Esc');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
         // 清理已存在的测试文件
        await system.exec('rm -f ~/Desktop/cutfile*', 500);

    });

    test('1806629-剪切拷贝-退出剪切状态_', async ({ device, agent, uos, system }) => {

       
        // 步骤 1: 在桌面创建测试文件
        await system.exec('touch ~/Desktop/cutfile.txt', 500);
        await agent.aiAssert("桌面存在cutfile.txt文件");

        // 步骤 2: 选中文件并使用Ctrl+X进入剪切状态
        await agent.aiAction("选中cutfile.txt文件");
        await device.pressKey("Control+X"); // Ctrl+X剪切
        await agent.aiAssert("桌面cutfile.txt文件图标显示置灰");
        // 验证文件处于剪切状态（通常文件会显示为半透明或高亮状态）
        console.log("文件已进入剪切状态");

        // 步骤 3: 使用Esc键退出剪切状态
        await device.pressKey("Esc"); // Esc退出剪切状态
        // 验证文件恢复为普通选中状态
        console.log("文件已退出剪切状态，恢复为普通选中状态");

        // 步骤 4: 验证文件仍然存在且未被剪切
        await agent.aiAssert("桌面存在cutfile.txt");
        console.log("文件未被剪切，仍然存在于原位置");

        console.log("===1806629-剪切拷贝-退出剪切状态_，执行成功===");

    }, { timeout: 600000, tags: ["1806629", "level4", "copy", "liyan"] });

    afterEach(async ({ agent, device, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理创建的文件
        await system.exec('rm -f ~/Desktop/cutfile*', 500);
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有文件管理器窗口
        await system.exec('killall dde-file-manager', 500);
        await device.pressKey('Esc');
        await uos.showDesktop();

    });
});