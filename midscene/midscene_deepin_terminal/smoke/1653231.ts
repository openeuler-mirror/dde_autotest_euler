/**
 
 * 用例 PMSID:1653231
 * 用例标题: [016]设置界面显示
 * 生成时间: 2026-05-18
 * 用例编写人: UT000211(陈依)
 */

describe('1653231-[016]设置界面显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec('pkill -f deepin-terminal|| true');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1653231-[016]设置界面显示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开终端，空白处右键，打开终端的右键菜单
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    await agent.aiRightClick("终端界面空白处", { deepThink: true });
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiTap("设置", { deepThink: true });
    await agent.aiWaitFor("设置界面已显示");
    // 预期：左边标题列表，右边显示具体参数设置，基础设置中无主题设置，终端设置界面去除关于
    await agent.aiAssert("设置界面左边是标题列表，右边显示具体参数设置");
    await agent.aiAssert("基础设置中无主题设置");
    await agent.aiAssert("背景模糊默认未勾选");
    await agent.aiAssert("终端设置界面去除关于");

    // 步骤 2: 点击左边标题列表的高级设置，点击光标
    await agent.aiTap("左边标题列表中的高级设置", { deepThink: true });
    await agent.aiTap("光标选项", { deepThink: true });
    // 预期：选中文字时复制到剪贴板默认勾选
    await agent.aiAssert("选中文字时复制到剪贴板默认勾选");

    // 步骤 3: 点击左边标题列表的滚动
    await agent.aiTap("左边标题列表中的滚动", { deepThink: true });
    // 预期：滚动设置中无滚行数
    await agent.aiAssert("滚动设置中无滚行数");

    // 步骤 4: 点击左边标题列表的窗口，点击启动时的倒三角
    await agent.aiTap("左边标题列表中的窗口", { deepThink: true });
    await agent.aiTap("启动时的倒三角", { deepThink: true });
    // 预期：下拉列表中存在分屏选项
    await agent.aiWaitFor("下拉列表已显示");
    await agent.aiAssert("下拉列表中存在分屏选项");
    await agent.aiTap("正常窗口")
    await agent.aiAssert("不展示启动时使用的其他选项");


    // 步骤 5: 右边具体参数展示丢失焦点后隐藏雷神窗口，默认未勾选
    await agent.aiAssert("丢失焦点后隐藏雷神窗口默认未勾选");

    // 步骤 6: 点击左边标题列表的快捷键
    await agent.aiTap("左边标题列表中的快捷键", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 预期：右边最上方展示快捷键相关设置
    await agent.aiAssert("右边最上方展示快捷键相关设置");

    // 步骤 7: 移动鼠标到右边窗口，上下滚动查看
    await agent.aiHover("右边设置窗口区域", { deepThink: true });
    await agent.aiScroll("右边设置窗口区域", { direction: "down", distance: 500 });
    await agent.aiScroll("右边设置窗口区域", { direction: "up", distance: 500 });
    // 预期：可以上下滚动查看
    await agent.aiAssert("设置内容可以上下滚动查看");

  }, { timeout: 1000000, tags: ['1653231', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('pkill -f deepin-terminal|| true');
  });
});
