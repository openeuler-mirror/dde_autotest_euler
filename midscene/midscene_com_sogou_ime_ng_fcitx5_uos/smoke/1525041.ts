/**
 * 用例 PMSID: 1525041
 * 用例标题: 常用-自定义短语设置，添加多个新定义
 * 生成时间: 2026-05-13 11:00:08
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525041-常用-自定义短语设置，添加多个新定义', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")

  });

  test('1525041-常用-自定义短语设置，添加多个新定义', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入常用
    console.log("步骤 1: 打开属性设置菜单，进入常用")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");

    // 步骤 2: 进入【自定义短语设置】，点击【添加新定义】
    console.log("步骤 2: 进入【自定义短语设置】，点击【添加新定义】")
    await agent.aiScroll("右侧区域",{direction:'down',distance: 10});
    await agent.aiTap("自定义短语设置按钮");
    await agent.aiWaitFor("自定义短语设置窗口");
    await agent.aiTap("添加新定义按钮");
    await agent.aiAssert("弹出【添加自定义短语】弹框");

    // 步骤 3: 缩写输入框填写【test】，短语位置设置为3，内容输入【测试内容123】，点击【确认并继续添加】
    console.log("步骤 3: 缩写输入框填写【test】，短语位置设置为3，内容输入【测试内容123】，点击【确认并继续添加】")
    await agent.aiTap("缩写(英文字符，大小写，最长21个字符)下方的输入框");
    await device.pressKey("t");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("t");
    await agent.aiTap("该条短语在候选中的位置下方的下拉框");
    await agent.aiTap("3");
    await agent.aiTap("支持多行，空格，最长1000个汉字或英文字符，其中回车为两个字符下方的输入框");
    await device.pressKey("t");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("t");
    await device.pressKey("space");
    await agent.aiTap("确认并继续添加");
    await agent.aiAssert("添加成功后，添加自定义短语弹框不会自动关闭，相关内容被自动清空");

    // 步骤 4: 再次补全内容，点击确定
    await agent.aiTap("缩写(英文字符，大小写，最长21个字符)下方的输入框");
    await device.pressKey("c");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("h");
    await device.pressKey("i");
    await agent.aiTap("该条短语在候选中的位置下方的下拉框");
    await agent.aiTap("2");
    await agent.aiTap("支持多行，空格，最长1000个汉字或英文字符，其中回车为两个字符下方的输入框");
    await device.pressKey("c");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("h");
    await device.pressKey("i");
    await device.pressKey("space");
    await agent.aiTap("确定");
    await agent.aiAssert("添加后，存在新添加的两个自定义短语，并处于勾选状态");

  }, { timeout: 1200000, tags: ["1525041","smoke","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //数据清理：删除新增自定义短语
    await agent.aiWaitFor("自定义短语设置窗口");
    await agent.aiTap("删除高亮");
    await agent.aiTap("确定");
    await agent.aiTap("删除高亮");
    await agent.aiTap("确定");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await agent.aiAssert("自定义短语设置窗口关闭");
    await agent.aiTap("窗口右上角关闭按钮:X");
    //恢复环境：切换至默认输入法
    await device.pressKey('ctrl','space')
  });
});