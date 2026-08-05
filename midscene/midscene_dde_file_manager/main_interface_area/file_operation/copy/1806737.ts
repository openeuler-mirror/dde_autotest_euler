/**
 * 用例 PMSID: 1806737
 * 用例标题:  剪切拷贝-从剪切板拖拽文件到桌面/文管窗口
 * 生成时间: 2025-12-22
 * 用例编写人: UT001774(李炎)
 */

describe('1806737-剪切拷贝-从剪切板拖拽文件到桌面/文管窗口', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理已存在的测试文件
    await system.exec('rm -f ~/Desktop/clipboard*', 500);
    await system.exec('rm -rf ~/Desktop/folder*', 500);
  });

  test('1806737-剪切拷贝-从剪切板拖拽文件到桌面/文管窗口', async ({ device, agent, uos, system }) => {



    // 前置条件: 在桌面创建测试文件并复制到剪切板
    await system.exec('touch ~/Desktop/clipboard.txt', 500);
    await agent.aiAssert("桌面存在clipboard.txt文件");
    // 复制文件到剪切板
    await agent.aiRightClick("clipboard.txt");
    await agent.aiTap("复制");
    console.log("文件已复制到剪切板");

    // 步骤 1: 从剪切板(Super+v)拖拽文件到桌面
    await device.pressKey("Super+V"); // Super+V 打开剪切板
    // 从剪切板拖拽文件到桌面
    await agent.aiAction("从剪切板拖拽clipboard.txt文件到桌面空白区域");
    // 验证文件被复制到桌面
    await agent.aiAssert("桌面存在clipboard.txt");
    console.log("文件已成功从剪切板拖拽复制到桌面");

    // 步骤 2: 创建目标文件夹并从剪切板拖拽文件到文件夹
    await agent.aiRightClick("桌面空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('folder');
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("桌面存在folder文件夹");
    // 再次打开剪切板并拖拽到文件夹
    await device.pressKey("Super+V"); // Super+V 打开剪切板
    // 从剪切板拖拽文件到文件夹
    await agent.aiAction("从剪切板拖拽clipboard.txt文件到folder文件夹");
    // 验证文件被复制到文件夹内
    await agent.aiDoubleClick("folder");
    await agent.aiAssert("folder文件夹内存在clipboard.txt");
    console.log("文件已成功从剪切板拖拽复制到文件夹");

    console.log("===1806737-剪切拷贝-从剪切板拖拽文件到桌面/文管窗口_,执行成功===");

  }, { timeout: 600000, tags: ["1806737", "level3", "copy", "liyan"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // // 清理已存在的测试文件
    await system.exec('rm -f ~/Desktop/clipboard*', 500);
    await system.exec('rm -rf ~/Desktop/folder*', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});