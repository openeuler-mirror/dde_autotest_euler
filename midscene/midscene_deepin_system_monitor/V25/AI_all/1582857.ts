/**
 * 用例 PMSID: 1582857
 * 用例标题: 【系统监视器】【菜单栏】关于
 * 用例编写人: UT006165(李日华)
 * 生成时间: 2026-06-18
 */

describe('1582857-【系统监视器】【菜单栏】关于', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1582857-【系统监视器】【菜单栏】关于', async ({ device, agent, uos }) => {
    // ========== 步骤 1: 打开系统监视器 ==========
    await uos.openApp("系统监视器");
    await agent.aiWaitFor("系统监视器应用已打开");

    // 验证：系统监视器可以正常打开
    await agent.aiAssert("系统监视器应用窗口已显示");

    // ========== 步骤 2: 点击标题栏右上角的三条横线，点击关于 ==========
    await agent.aiTap("标题栏右上角的三条横线菜单按钮", { deepThink: true });

    // 验证：菜单栏展开
    await agent.aiAssert("系统监视器的菜单栏已展开，显示菜单选项");

    // 点击关于按钮
    await agent.aiTap("菜单栏中的关于按钮", { deepThink: true });

    // 验证：软件会自动弹出对话框，显示关于信息(图标、应用名称、版本号、网站、描述和致谢)
    await agent.aiAssert("系统监视器弹出关于对话框，显示图标、应用名称、版本号、网站、描述和致谢信息");

    // ========== 步骤 3: 软件弹出属性对话框后，点击右上角的X按钮 ==========
    await agent.aiTap("关于对话框右上角的关闭按钮:X", { deepThink: true });

    // 等待对话框关闭
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证：对话框会自动关闭
    await agent.aiAssert("关于对话框已自动关闭，系统监视器主窗口正常显示");

    // ========== 步骤 4: 再次打开菜单栏，点击关于 ==========
    await agent.aiTap("标题栏右上角的三条横线菜单按钮", { deepThink: true });

    // 验证：菜单栏展开
    await agent.aiAssert("系统监视器的菜单栏已再次展开，显示菜单选项");

    // 点击关于按钮
    await agent.aiTap("菜单栏中的关于按钮", { deepThink: true });

    // 验证：软件会自动弹出对话框
    await agent.aiAssert("系统监视器再次弹出关于对话框");

    // ========== 步骤 5: 软件弹出属性对话框后，按ESC键 ==========
    await agent.aiKeyboardPress("Escape");

    // 等待对话框关闭
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证：对话框会自动关闭
    await agent.aiAssert("关于对话框已通过ESC键关闭，系统监视器主窗口正常显示");

  }, { timeout: 600000, tags: ['1582857', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 先按ESC，再点击关闭按钮，关闭系统监视器应用，退出到桌面界面
    await agent.aiKeyboardPress("Escape");
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiTap("窗口右上角关闭按钮:X");
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 验证：已退出到桌面界面
    await agent.aiAssert("系统监视器应用已退出，当前处于桌面界面");
  });
});
