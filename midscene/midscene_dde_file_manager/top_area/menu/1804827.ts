/**
 * 用例 PMSID: 1804827
 * 用例标题:  [177][core]扩展名隐藏-取消勾选“显示文件扩展名”选项
 * 生成时间: 2026-03-11 10:00:00
 * 用例编写人:  UT001774(李炎)
 */

describe('1804827-[177][core]扩展名隐藏-取消勾选“显示文件扩展名”选项', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    //处理可能存在的弹框和右键菜单
    await device.pressKey('Esc');
    // 关闭所有文件管理器窗口
    await system.exec('kill -SIGTERM $(pidof dde-file-manager)', 500);
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/1804827*', 500);
  });

  test('1804827-[177][core]扩展名隐藏-取消勾选“显示文件扩展名”选项', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1804827-[177][core]扩展名隐藏-取消勾选“显示文件扩展名”选项 ===');

    // 前置条件，创建测试文件，打开文件管理器
    await system.exec('touch ~/Desktop/1804827.txt', 500);
    console.log('操作1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiAssert("文件管理器窗口已打开");
    console.log('操作2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("文件和目录", { deepThink: true });
    // 文件和目录，设置项："显示文件扩展名"，默认值:已勾选
    console.log('检查设置项："显示文件扩展名"，默认值:已勾选');
    await agent.aiAssert("显示文件扩展名左侧有蓝色√");
    console.log('✅ 设置项："显示文件扩展名"默认已勾选');

    //步骤1:鼠标点击“显示文件扩展名”勾选框
    await agent.aiTap("取消勾选显示文件扩展名", { deepThink: true });
    //预期：取消勾选
    await agent.aiAssert("显示文件扩展名左侧没有蓝色√");
    // 关闭设置窗口
    console.log('步骤4: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    //步骤2：检查文管音乐目录文件名显示
    await agent.aiTap("文件管理器左侧的音乐");
    //预期：文件无扩展名，设置即时生效
    await agent.aiAssert("该目录显示文件bensound-sunny,不显示bensound-sunny.mp3");
    console.log('✅ 文件的扩展名未显示');

    // 步骤3:	检查桌面文件名显示
    await agent.aiTap("文件管理器左侧的桌面");
    //预期：文件无扩展名，设置即时生效
    await agent.aiAssert("桌面存在1804827文件");
    console.log('✅ 文件的扩展名未显示');



    // console.log('步骤2: 打开设置菜单');
    // await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    // await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    // await agent.aiTap("文件和目录", { deepThink: true });
    // // 文件和目录，设置项："显示文件扩展名"，默认值:已勾选
    // console.log('检查设置项："显示文件扩展名"，默认值:已勾选');
    // await agent.aiTap("勾选显示文件扩展名左侧方框的中心", { deepThink: true });
    // await agent.aiAssert("显示文件扩展名左侧有蓝色√");
    // console.log('✅ 设置项："显示文件扩展名"默认已勾选');
    // //检查文件的扩展名
    // await agent.aiTap("文件管理器左侧的桌面");
    // await agent.aiAssert("桌面存在test_file.txt文件");

    console.log('✅ 1804827用例测试完成');

  }, { timeout: 600000, tags: ["1804827", "level2", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/1804827*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('kill -SIGTERM $(pidof dde-file-manager)', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});