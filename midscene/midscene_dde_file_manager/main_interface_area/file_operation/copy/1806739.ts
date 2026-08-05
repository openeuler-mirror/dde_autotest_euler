/**
 * 用例 PMSID: 1806739
 * 用例标题:  Bug181153转：目标目录存在同名文件/文件夹，可以再次复制
 * 生成时间: 2025-12-22
 * 用例编写人: UT001774(李炎)
 */

describe('1806739-Bug181153转：目标目录存在同名文件/文件夹，可以再次复制', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理已存在的测试文件
    await system.exec('rm -f ~/Desktop/testfile*', 500);
    await system.exec('rm -rf ~/Desktop/targetfolder*', 500);
  });

  test('1806739-Bug181153转：目标目录存在同名文件/文件夹，可以再次复制', async ({ device, agent, uos, system }) => {



    // 前置条件: 在桌面创建测试文件
    await system.exec('touch ~/Desktop/testfile.txt', 500);
    await agent.aiAssert("桌面存在testfile.txt文件");
    // 创建目标文件夹
    await system.exec('mkdir ~/Desktop/targetfolder', 500);
    await agent.aiAssert("桌面存在targetfolder文件夹");

    // 步骤 1: 第一次复制 - 从桌面复制文件到文件夹
    console.log("=== 第一次复制操作 ===");
    await agent.aiRightClick("testfile.txt");
    await agent.aiTap("复制");
    await agent.aiDoubleClick("targetfolder");
    await agent.aiRightClick("文件夹空白处");
    await agent.aiTap("粘贴");
    await agent.aiAssert("targetfolder文件夹内存在testfile.txt");
    await agent.aiTap("点击文件管理器右上角的关闭按钮");

    // 步骤 2: 第二次复制 - 再次复制同一文件到同一文件夹
    console.log("=== 第二次复制操作 ===");
    await agent.aiRightClick("testfile.txt");
    await agent.aiTap("复制");
    await agent.aiDoubleClick("targetfolder");
    await agent.aiRightClick("文件夹空白处");
    await agent.aiTap("粘贴");
    await agent.aiTap("窗口右下角共存按钮");
    await agent.aiAssert("targetfolder文件夹内存在带副本的文件");
    console.log("第二次复制成功，系统创建了副本文件");

    console.log("===1806739-Bug181153转：目标目录存在同名文件/文件夹，可以再次复制，执行成功===");

  }, { timeout: 600000, tags: ["1806739", "level2", "copy", "liyan"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理已存在的测试文件
    await system.exec('rm -f ~/Desktop/testfile*', 500);
    await system.exec('rm -rf ~/Desktop/targetfolder*', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});