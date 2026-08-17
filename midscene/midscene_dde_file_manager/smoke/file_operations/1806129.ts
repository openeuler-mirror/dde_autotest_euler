/**
 * 用例 PMSID: 1806129
 * 用例标题: 剪切桌面文件后在"文档"目录下粘贴
 * 生成时间: 2026-02-12
 * 用例编写人: UT000211(陈依)
 */



describe('1806129-剪切桌面文件后在"文档"目录下粘贴', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/Desktop/test ~/Desktop/test1 `);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 在桌面新建文件test和文件夹test1
    console.log('3: 在桌面新建文件test和文件夹test1');
    await system.exec('touch ~/Desktop/test');
    await system.exec('mkdir ~/Desktop/test1');
    console.log('4. 测试文件和文件夹已创建在桌面');
  });

  test('1806129-剪切桌面文件后在"文档"目录下粘贴', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，点击侧边栏的文档
    console.log("=== 步骤1：打开文件管理器并进入文档目录 ===");
    await uos.openApp('文件管理器');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiAssert("当前目录为文档目录");
    console.log("✅ 已进入文档目录");

    // 步骤 2: 桌面选中test文件，打开test文件的右键菜单，点击剪切
    console.log("=== 步骤2：选中电脑桌面上test文件并剪切 ===");
    await agent.aiRightClick("电脑桌面上的test文件");
    await agent.aiAssert("test文件的右键菜单已打开");
    await agent.aiTap("右键菜单中的剪切选项");
    console.log("✅ test文件剪切成功");

    // 步骤 3: 空白处右键，打开粘贴
    console.log("=== 步骤3：在文档目录空白处粘贴 ===");
    await agent.aiRightClick("文件管理器中的文档目录的空白区域");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("右键菜单中的粘贴选项");
    await agent.aiAssert("文档目录存在test文件");
    console.log("✅ 粘贴操作完成");
   
    // 步骤 5: 桌面选中test文件夹，打开test文件夹的右键菜单，点击剪切
    console.log("=== 步骤5：选中桌面test1文件夹并剪切 ===");
    await agent.aiRightClick("电脑桌面上的test1文件夹");
    await agent.aiAssert("test1文件夹的右键菜单已打开");
    await agent.aiTap("右键菜单中的剪切选项");
    console.log("✅ test1文件夹剪切成功");

    // 步骤 6: 打开文件管理器，点击侧边栏的文档，空白处右键，打开粘贴
    console.log("=== 步骤6：在文档目录粘贴test1文件夹 ===");
    await agent.aiRightClick("文件管理器中的文档目录的空白区域");
    await agent.aiAssert("右键菜单已打开");
    await agent.aiTap("右键菜单中的粘贴选项");
    await agent.aiAssert("文档目录存在test1文件夹");
    console.log("✅ test1文件夹粘贴完成");

    // 步骤 7: 验证预期结果 - 桌面没有test1文件夹，文档有test1文件夹
    await agent.aiAssert("桌面不存在test1文件夹和test文件");
    console.log("===1806129-剪切桌面文件后在'文档'目录下粘贴，执行成功===");

  }, { timeout: 700000, tags: ["1806129", "level1", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('8. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec('rm -rf ~/Desktop/test ~/Desktop/test1 ~/Documents/test ~/Documents/test1');
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('9. afterAll: 清理测试套件');
    // 关闭文件管理器窗口
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
