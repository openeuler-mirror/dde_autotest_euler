/**
 * 用例 PMSID: 1804867
 * 用例标题:  设置--“新窗口和新标签”
 * 生成时间: 2026-01-13 10:18:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804867-设置--“新窗口和新标签”', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804867-设置--“新窗口和新标签', async ({ device, agent, uos, env }) => {
    console.log('=== 开始测试：设置--“新窗口和新标签” ===');

    // 步骤1: 打开文件管理器并验证初始状态
    console.log('步骤1: 打开文件管理器，验证初始状态');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器已打开');
    //  打开设置菜单
    console.log('步骤2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    console.log('✅ 设置窗口已打开');
    // 步骤2: 定位到新窗口设置
    console.log('步骤3: 定位到新窗口设置');
    await agent.aiTap("新窗口", { deepThink: true });
    await agent.aiAssert("当前窗口有新窗口下默认目录选项");
    console.log('✅ 已进入新窗口设置页面');
    // 步骤3: 展开新窗口下默认目录下拉框
    console.log('步骤4: 展开新窗口下默认目录下拉框');
    await agent.aiTap("新窗口下默认目录文字右侧的下拉箭头", { deepThink: true });
    await agent.aiAssert("下拉框展开，显示计算机、主目录、桌面、文档等选项");
    console.log('✅ 下拉框已展开');
    // 步骤4: 选择计算机作为默认目录
    console.log('步骤5: 选择计算机作为默认目录');
    await agent.aiTap("下拉框中的计算机选项", { deepThink: true });
    await agent.aiAssert("新窗口下默认目录显示为计算机");
    console.log('✅ 默认目录已设置为计算机');
    // 关闭设置窗口
    console.log('步骤6: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    // 重新打开一个文件管理器窗口验证默认路径
    console.log('步骤7: 重新打开文件管理器窗口验证默认路径');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的新建窗口", { deepThink: true });
    // 步骤5:验证新窗口的默认路径为计算机
    await agent.aiAssert("新窗口显示计算机页面");
    await agent.aiAssert("当前路径显示为计算机");
    console.log('✅ 新窗口默认路径验证通过：显示计算机页面');
    // 关闭新窗口
    console.log('步骤8: 关闭新窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 新窗口已关闭');
    console.log('✅ 新窗口默认目录设置测试完成');

    //验证新标签
    console.log('=== 开始测试：设置新标签页默认目录为主目录 ===');
    // 确保文件管理器已打开
    console.log('步骤1: 确保文件管理器已打开');
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('✅ 文件管理器窗口已就绪');
    // 重新打开设置菜单
    console.log('步骤2: 重新打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("设置窗口已打开");
    console.log('✅ 设置窗口已打开');
    // 定位到新标签页设置
    console.log('步骤3: 定位到新标签设置');
    await agent.aiTap("新标签", { deepThink: true });
    await agent.aiAssert("当前窗口有从新标签打开选项");
    console.log('✅ 已进入新标签设置页面');
    //  展开从新标签打开下拉框
    console.log('步骤4: 展开从新标签打开下拉框');
    await agent.aiTap("从新标签打开文字右侧的下拉框", { deepThink: true });
    await agent.aiAssert("下拉框展开，显示计算机、主目录、桌面、文档等选项");
    console.log('✅ 下拉框已展开');
    // 选择主目录作为默认目录
    console.log('步骤5: 选择主目录作为默认目录');
    await agent.aiTap("下拉框中的主目录选项", { deepThink: true });
    await agent.aiAssert("从新标签打开显示为主目录");
    console.log('✅ 默认目录已设置为主目录');
    // 关闭设置窗口
    console.log('步骤6: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');
    // 重新打开一个新的标签页验证默认路径
    console.log('步骤7: 重新打开新标签页验证默认路径');
    await agent.aiTap("左上角+号", { deepThink: true });
    // 验证新标签页的默认路径为主目录
    await agent.aiAssert("文件管理器窗口顶部显示两个标签页");
    await agent.aiAssert("新标签页显示主目录页面");
    await agent.aiAssert("当前路径显示为主目录");
    console.log('✅ 新标签页默认路径验证通过：显示主目录页面');
    // 关闭新标签页
    console.log('步骤8: 关闭新标签页');
    await agent.aiTap("当前标签页的关闭按钮:x");
    console.log('✅ 新标签页已关闭');

    console.log('✅ 1804867用例测试完成');

  }, { timeout: 600000, tags: ["1804867", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});