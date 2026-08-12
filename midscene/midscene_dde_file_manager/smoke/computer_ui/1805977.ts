/**
 * 用例 PMSID: 1805977
 * 用例标题: [022 023][core]系统盘-选中侧边栏系统盘右键
 * 生成时间: 2026-02-27
 * 用例编写人: UT000211(陈依)
 */

describe('1805977-[022 023][core]系统盘-选中侧边栏系统盘右键', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805977-[022 023][core]系统盘-选中侧边栏系统盘右键', async ({ device, agent, uos, system }) => {
    // 前置条件: 打开文件管理器，预期进入计算机页面
    console.log("=== 前置条件：打开文件管理器 ===");
    await uos.openApp('文件管理器');
    await device.pressKey('Super', 'Up');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiAssert("当前页面为计算机页面");
    console.log("✅ 文件管理器已打开并进入计算机页面");

    // 步骤 1: 右键侧边栏系统盘，预期打开系统盘的右键菜单，点击在新窗口中打开
    console.log("=== 步骤1：右键系统盘，选择在新窗口中打开 ===");
    await agent.aiTap("侧边栏系统盘")
    await agent.aiRightClick("侧边栏系统盘侧边栏分区下系统盘");
    await agent.aiWaitFor("右键菜单出现")
    await agent.aiAssert("侧边栏分区下系统盘的右键菜单已打开");
    await agent.aiTap("右键菜单中的在新窗口中打开");
    await agent.aiAssert("打开新窗口");
    await agent.aiAssert("新窗口上方显示系统盘");
    await agent.aiAssert("打开的新窗口展示bin,boot目录");
    console.log("✅ 在新窗口中成功打开系统盘");
    
    // 关闭新打开的文件管理器的窗口
    await agent.aiTap("新打开的文件管理器窗口的关闭按钮");
    await agent.aiAssert("桌面只存在一个文件管理器窗口");
    console.log("✅ 新打开的文件管理器窗口已关闭");

    // 步骤 2: 右键侧边栏系统盘，预期打开系统盘的右键菜单，点击在新标签打开
    console.log("=== 步骤2：右键系统盘，选择在新标签中打开 ===");
    await agent.aiRightClick("侧边栏分区下系统盘");
    await agent.aiAssert("侧边栏分区下系统盘的右键菜单已打开");
    await agent.aiTap("右键菜单中的在新标签中打开");
    await agent.aiAssert("文件管理器上方存在计算机和系统盘的标签");
    console.log("✅ 在新标签中成功打开系统盘");

    // 步骤 3: 右键侧边栏系统盘，预期打开系统盘的右键菜单，点击属性
    console.log("=== 步骤3：右键系统盘，选择属性 ===");
    await agent.aiRightClick("侧边栏分区下系统盘");
    await agent.aiAssert("侧边栏分区下系统盘的右键菜单已打开");
    await agent.aiTap("右键菜单中的属性");
    await agent.aiAssert("打开属性弹窗");
    await agent.aiAssert("属性弹窗展示系统盘图片");
    await agent.aiAssert("属性弹窗展示系统盘名称");
    await agent.aiAssert("属性弹窗展示基本信息");
    await agent.aiAssert("基本信息包括设备类型");
    await agent.aiAssert("基本信息包括总容量");
    await agent.aiAssert("基本信息包括文件系统");
    await agent.aiAssert("基本信息包括文件个数");
    await agent.aiAssert("基本信息包括可用空间");
    await agent.aiTap("属性弹窗的关闭按钮");
    console.log("✅ 属性弹窗正确显示系统盘信息");

    console.log("===1805977-[022 023][core]系统盘-选中侧边栏系统盘右键，执行成功===");

  }, { timeout: 1000000, tags: ["1805977", "level2", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文件管理器窗口
    await device.pressKey('Super', 'Down');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
