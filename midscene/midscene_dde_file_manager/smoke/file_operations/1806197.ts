/**
 * 用例 PMSID: 1806197
 * 用例标题: 主目录图标 - 右键操作-1
 * 生成时间: 2026-02-05
 * 用例编写人: UT000211(陈依)
 */

describe('1806197-主目录图标 - 右键操作-1', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/dde-home.7z ~/Desktop/dde-home.zip', 500);
  });

  test('1806197-主目录图标 - 右键操作-1', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中桌面主目录，打开主目录的右键菜单，点击打开，预期打开主目录，显示桌面，文档等文件夹
    console.log("=== 步骤1：右键打开主目录 ===");
    await agent.aiRightClick("桌面的主目录图标");
    await agent.aiTap("右键菜单中的打开");
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiAssert("当前目录为主目录");
    await agent.aiAssert("主目录中存在桌面文件夹");
    await agent.aiAssert("主目录中存在文档文件夹");
    
    // 步骤 2: 关闭打开的文管窗口
    console.log("=== 步骤2：关闭文件管理器窗口 ===");
    await agent.aiTap("窗口右上角关闭按钮");
    await agent.aiAssert("文件管理器窗口已关闭");

    // 步骤 3: 桌面选中文件主目录，打开主目录的右键菜单，点击打开方式，点击文本编辑器，文本编辑器打开
    console.log("=== 步骤3：右键打开方式-文本编辑器 ===");
    await agent.aiRightClick("桌面的主目录图标");
    await agent.aiTap("右键菜单中的打开方式");
    await agent.aiTap("打开方式菜单中的文本编辑器");
    await agent.aiAssert("文本编辑器窗口已打开");
    
    // 步骤 4: 关闭打开的文本编辑器窗口，预期：文本编辑器关闭
    console.log("=== 步骤4：关闭文本编辑器窗口 ===");
    await agent.aiTap("文本编辑器右上角关闭按钮");
    await agent.aiAssert("文本编辑器窗口已关闭");

    // 步骤 5: 桌面选中文件主目录，打开主目录的右键菜单，点击压缩，预期打开归档管理器
    console.log("=== 步骤5：右键压缩打开归档管理器 ===");
    await agent.aiRightClick("桌面的主目录图标");
    await agent.aiTap("右键菜单中的压缩");
    await agent.aiAssert("归档管理器窗口已打开");
    
    // 步骤 6: 关闭归档管理器，归档管理器关闭
    console.log("=== 步骤6：关闭归档管理器 ===");
    await agent.aiTap("归档管理器右上角关闭按钮");
    await agent.aiAssert("归档管理器窗口已关闭");

    // 步骤 7: 桌面选中文件主目录，打开主目录的右键菜单，添加到"dde-home.7z"，预期：桌面存在dde-home.7z
    console.log("=== 步骤7：右键添加到dde-home.7z ===");
    await agent.aiRightClick("桌面的主目录图标");
    await agent.aiTap("右键菜单中的添加到\"dde-home.7z\"");
    await agent.aiAssert("桌面存在dde-home.7z文件");

    // 步骤 8: 桌面选中文件主目录，打开主目录的右键菜单，添加到"dde-home.zip"，预期：桌面存在dde-home.zip
    console.log("=== 步骤8：右键添加到dde-home.zip ===");
    await agent.aiRightClick("桌面的主目录图标");
    await agent.aiTap("右键菜单中的添加到\"dde-home.zip\"");
    await agent.aiAssert("桌面存在dde-home.zip文件");

    console.log("===1806197-主目录图标 - 右键操作-1，执行成功===");

  }, { timeout: 1200000, tags: ["1806197", "level2", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除桌面测试文件
    await system.exec('rm -rf ~/Desktop/dde-home.7z ~/Desktop/dde-home.zip', 500);
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
