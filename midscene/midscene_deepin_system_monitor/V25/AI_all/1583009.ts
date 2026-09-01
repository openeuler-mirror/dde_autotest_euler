/**
 * 用例 PMSID: 1583009
 * 用例标题: 【系统监视器】程序进程列表显示
 * 用例编写人: UT006165(李日华)
 * 生成时间: 2026-06-18
 */

describe('1583009-【系统监视器】程序进程列表显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1583009-【系统监视器】程序进程列表显示', async ({ device, agent, uos }) => {
    // ========== 步骤 1: 打开系统监视器 ==========
    await uos.openApp("系统监视器");
    await agent.aiWaitFor("系统监视器应用已打开");

    // 验证：系统监视器可以正常打开
    await agent.aiAssert("系统监视器应用窗口已显示");

    // ========== 步骤 2: 单击菜单栏窗口最大化按钮"□"，查看程序进程列表显示 ==========
    await agent.aiTap("窗口标题栏上的最大化按钮", { deepThink: true });

    // 等待窗口最大化完成
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证：程序进程列表默认按序显示如下列头：名称、处理器、内存、上传、下载、进程号
    await agent.aiAssert("程序进程列表默认显示列头：名称、处理器、内存、上传、下载、进程号，且按序排列");

    // ========== 步骤 3: 右键单击"名称"所在行空白处 ==========
    await agent.aiRightClick("进程列表中的名称列头所在行空白处", { deepThink: true });

    // 等待菜单展开
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证：菜单栏展开，进程列表的列头应包括：名称、处理器、用户、内存、共享内存、虚拟内存、上传、下载、磁盘读取、磁盘写入、进程号、Nice、优先级
    await agent.aiAssert("菜单栏已展开，进程列表列头包含：名称、处理器、用户、内存、共享内存、虚拟内存、上传、下载、磁盘读取、磁盘写入、进程号、Nice、优先级");

  }, { timeout: 600000, tags: ['1583009', 'level1'] });

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
