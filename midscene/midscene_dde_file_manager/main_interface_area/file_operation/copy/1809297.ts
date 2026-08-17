/**
 * 用例 PMSID: 1809297
 * 用例标题: 目标目录存在同名文件/文件夹，可以再次复制
 * 生成时间: 2025-12-16 15:45:32
 * 用例编写人: UT001774(李炎)
 */

describe('1809297-目标目录存在同名文件/文件夹，可以再次复制', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 检查并删除已存在的test_file.txt、target_folder_1文件夹、target_folder_2文件夹
    await system.exec('test ~/Desktop/test_file.txt && rm -rf ~/Desktop/test_file*', 500);
    await system.exec('test -d ~/Desktop/target_folder_1 && rm -rf ~/Desktop/targetfolder*', 500);
  });

  test('1809297-目标目录存在同名文件/文件夹，可以再次复制', async ({ device, agent, uos, system }) => {


    // 前置条件：创建test.txt
    await system.exec('touch ~/Desktop/test_file.txt', 500);
    // 在桌面创建目标文件夹1
    await system.exec('mkdir ~/Desktop/targetfolder1', 500);
    await agent.aiAssert("桌面存在targetfolder1文件夹");
    // 在桌面创建目标文件夹2
    await system.exec('mkdir ~/Desktop/targetfolder2', 500);
    await agent.aiAssert("桌面存在targetfolder2文件夹");

    // 步骤 1: 第一次复制 - 复制文件到目标文件夹1
    await agent.aiRightClick("test_file.txt");
    await agent.aiTap("复制");
    await agent.aiDoubleClick("targetfolder1");
    await agent.aiRightClick("文件夹空白处");
    await agent.aiTap("粘贴");
    await agent.aiAssert("targetfolder1文件夹内存在test_file.txt");
    await agent.aiTap("点击文件管理器右上角的关闭按钮");

    // 步骤 2: 第二次复制 - 复制文件到目标文件夹2
    await agent.aiRightClick("test_file.txt");
    await agent.aiTap("复制");
    await agent.aiDoubleClick("targetfolder2");
    await agent.aiRightClick("文件夹空白处");
    await agent.aiTap("粘贴");
    await agent.aiAssert("targetfolder2文件夹内存在test_file.txt");
    await agent.aiTap("点击文件管理器右上角的关闭按钮");

    // 步骤 3: 验证原文件仍然存在
    await agent.aiAssert("桌面存在test_file.txt");
    console.log("===1809297-目标目录存在同名文件/文件夹，可以再次复制，执行成功===");

  }, { timeout: 600000, tags: ["1809297", "level2", "copy", "liyan"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 检查并删除已存在的test_file.txt、target_folder_1文件夹、target_folder_2文件夹
    await system.exec('rm -rf ~/Desktop/test_file*', 500);
    await system.exec('rm -rf ~/Desktop/targetfolder*', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});