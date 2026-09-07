/**
 * 用例 PMSID: 1804825
 * 用例标题: 扩展名隐藏-取消勾选“显示文件扩展名”后，检查本地磁盘生效范围是否生效
 * 生成时间: 2026-03-11 14:00:00
 * 用例编写人:  UT001774(李炎)
 */


describe('1804825-扩展名隐藏-取消勾选“显示文件扩展名”后，检查本地磁盘生效范围是否生效', () => {
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
    await system.exec('rm -rf ~/Desktop/1804825*', 500);
    await system.exec('rm -rf ~/1804825*', 500);
  });

  test('1804825-扩展名隐藏-取消勾选“显示文件扩展名”后，检查本地磁盘生效范围是否生效', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1804825-扩展名隐藏-取消勾选“显示文件扩展名”后，检查本地磁盘生效范围是否生效 ===');

    // 前置条件,创建测试文件,打开文件管理器
    await system.exec('touch ~/Desktop/1804825.txt ~/Desktop/1804825.xlsx', 500);
    await system.exec('touch ~/1804825.doc', 500);
    console.log('操作1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    console.log('操作2: 打开设置菜单');
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("文件和目录", { deepThink: true });
    // 文件和目录，设置项："显示文件扩展名"，默认值:已勾选
    console.log('检查设置项："显示文件扩展名"，默认值:已勾选');
    await agent.aiAssert("显示文件扩展名左侧有蓝色√");
    console.log('✅ 设置项："显示文件扩展名"默认已勾选');
    // 取消勾选“显示文件扩展名”
    await agent.aiTap("取消勾选显示文件扩展名", { deepThink: true });
    await agent.aiAssert("显示文件扩展名左侧没有蓝色√");
    // 关闭设置窗口
    console.log('步骤4: 关闭设置窗口');
    await agent.aiTap("当前窗口关闭按钮:x");
    console.log('✅ 设置窗口已关闭');

    //步骤1：打开文管-检查文管最近使用目录文件
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiDoubleClick("1804825.txt");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧的最近使用");
    //预期：文件无扩展名
    await agent.aiAssert("该目录显示文件1804825,不显示1804825.txt");

    //步骤2: 进入主目录
    await agent.aiTap("文件管理器左侧的主目录");
    //预期：文件无扩展名
    await agent.aiAssert("该目录显示文件1804825,不显示1804825.doc");

    //步骤3: 进入回收站目录
    await agent.aiTap("文件管理器左侧的桌面");
    await agent.aiTap("1804825.xlsx");
    await device.pressKey("Delete");
    await agent.aiTap("文件管理器左侧的回收站");
    //预期：文件无扩展名
    await agent.aiAssert("该目录显示文件1804825,不显示1804825.xlsx");

    //步骤4: 进入系统盘目录
    await agent.aiTap("文件管理器左侧的系统盘");
    await agent.aiDoubleClick("var");
    await agent.aiDoubleClick("log");
    //预期：文件无扩展名
    await agent.aiAssert("该目录显示文件boot");

    console.log('✅ 1804825用例测试完成');

  }, { timeout: 600000, tags: ["1804825", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件
    await system.exec('rm -rf ~/Desktop/1804825*', 500);
    await system.exec('rm -rf ~/1804825*', 500);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
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