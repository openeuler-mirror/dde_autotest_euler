/**
 * 用例 PMSID: 1806251
 * 用例标题: 【最近使用】最近使用侧边栏右键-清除最近访问
 * 生成时间: 2026-02-04
 * 用例编写人: UT000211(陈依)
 */


describe('1806251-【最近使用】最近使用侧边栏右键-清除最近访问', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec(`rm -rf ~/Desktop/test.png`);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
  });

  test('1806251-【最近使用】最近使用侧边栏右键-清除最近访问', async ({ device, agent, uos, system }) => {
    // 步骤 1: 复制图片文件到桌面
    console.log("=== 步骤1：复制图片文件到桌面 ===");
    await system.exec('cp /usr/share/browser/product_logo_64.png ~/Desktop/test.png', 500);

    // 步骤 2: 打开文件管理器，进入桌面目录，双击打开test.png
    console.log("=== 步骤2：打开文件管理器并打开test.png ===");
    await uos.openApp('文件管理器');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiAssert("当前目录为桌面目录");
    await agent.aiDoubleClick("桌面目录下的test.png文件");
    await agent.aiAssert("打开新窗口");
    await agent.aiTap("看图右上角关闭按钮");
    await agent.aiAssert("看图已关闭");

    // 步骤 3: 点击文件管理器侧边栏最近使用，验证最近使用里面存在test.png
    console.log("=== 步骤3：验证最近使用中存在test.png ===");
    await agent.aiTap("文件管理器侧边栏的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    await device.pressKey('Super', 'Left');
    await agent.aiAssert("文件管理器最左侧显示");
    await agent.aiAssert("最近使用中存在test.png文件");

    // 步骤 4: 点击设置菜单，点击新建窗口，新建窗口成功，拖动新建的窗口
    console.log("=== 步骤4：新建窗口并拖动 ===");
    await agent.aiTap("文件管理器顶部菜单栏的设置菜单");
    await agent.aiTap("设置菜单中的新建窗口");
    await agent.aiAssert("新建窗口已打开");
    await device.pressKey('Super', 'Right');
    await agent.aiAssert("文件管理器最右侧显示");
    

    // 步骤 5: 点击新建窗口的最近使用，验证最近使用里面存在test.png
    console.log("=== 步骤5：验证新建窗口的最近使用中存在test.png ===");
    await agent.aiTap("新建窗口侧边栏的最近使用");
    await agent.aiAssert("已切换到最近使用栏目");
    await agent.aiAssert("最近使用中存在test.png文件");

    // 步骤 6: 打开侧边栏最近使用的右键菜单，点击清除最近访问，验证两个窗口的最近使用都为空
    console.log("=== 步骤6：清除最近访问并验证两个窗口都为空 ===");
    await agent.aiRightClick("文件管理器侧边栏的最近使用");
    await agent.aiTap("右键菜单中的清除最近访问");
    await agent.aiAssert("左右窗口的最近使用为空");
   

    // 步骤 7: 关闭新建的窗口
    console.log("=== 步骤7：关闭新建的窗口 ===");
    await agent.aiTap("右边文件管理器窗口右上角关闭按钮");
    await agent.aiAssert("桌面只存在一个文件管理器窗口");;

    // 步骤 8: 再次执行步骤2和3，点击顶部最近使用旁边的+按钮，验证顶部存在两个最近使用的标签
    console.log("=== 步骤8：重新打开test.png并验证标签页 ===");
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiDoubleClick("桌面目录下的test.png文件");
    await agent.aiTap("看图右上角关闭按钮");
    await agent.aiTap("文件管理器左侧的最近使用");
    await agent.aiTap("最近使用旁边的+按钮");
    await agent.aiAssert("顶部存在两个最近使用的标签");

    // 步骤 9: 打开侧边栏最近使用的右键菜单，点击清除最近访问，验证当前标签页的最近使用为空
    console.log("=== 步骤9：清除当前标签页的最近访问 ===");
    await agent.aiRightClick("文件管理器左侧的最近使用");
    await agent.aiTap("右键菜单中的清除最近访问");
    await agent.aiAssert("当前标签页的最近使用为空");

    // 步骤 10: 点击第一个最近使用的标签页，验证第一个最近使用的标签页也为空
    console.log("=== 步骤10：验证第一个标签页也为空 ===");
    await agent.aiTap("第一个最近使用的标签页");
    await agent.aiAssert("第一个最近使用的标签页也为空");

    console.log("===1806251-【最近使用】最近使用侧边栏右键-清除最近访问，执行成功===");

  }, { timeout: 800000, tags: ["1806251", "level2", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除桌面测试文件
    await system.exec('rm -rf ~/Desktop/test.png', 500);
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 文件管理器向下还原再关闭
    await device.pressKey('Super', 'Up')
    await device.pressKey('Super', 'Down')
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
   // 关闭所有文件管理器窗口
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});

