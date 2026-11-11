/**
 * 用例 PMSID: 1525283
 * 用例标题: 五笔-基础词库，五笔词库导出词库文件
 * 生成时间: 2026-05-13 10:03:10
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525283-五笔-基础词库，五笔词库导出词库文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec('killall deepin-editor');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
    await agent.aiTap("搜狗输入法工具栏第5个图标");
    await agent.aiTap("五笔(v3)");
  });

  test('1525283-五笔-基础词库，五笔词库导出词库文件', async ({ device, agent, uos }) => {
    // 生成用户词库
    console.log("生成用户词库")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("a");
    await device.pressKey("c");
    await device.pressKey("b");
    await device.pressKey("t");
    await agent.aiAssert("上屏：茅");
    await agent.aiKeyboardPress("Backspace");
    await device.pressKey("a");
    await device.pressKey("c");
    await device.pressKey("b");
    await device.pressKey("m");
    await agent.aiAssert("上屏：蓣");
    await agent.aiKeyboardPress("Backspace");
    await device.pressKey("a");
    await device.pressKey("c");
    await device.pressKey("a");
    await device.pressKey("c");
    await agent.aiAssert("上屏：茅蓣");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

    // 步骤 1: 打开属性设置菜单，进入五笔
    console.log("步骤 1: 打开属性设置菜单，进入五笔")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("五笔");
    await agent.aiAssert("打开五笔设置界面");

    // 步骤 2: 点击五笔词库【导出】
    console.log("步骤 2: 点击五笔词库【导出】")
    await agent.aiScroll("右侧区域",{direction:'down',distance: 10});
    await agent.aiTap("五笔词库右侧导出按钮");

    // 步骤 3: 进入保存路径，点击【确定】
    console.log("步骤 3: 进入保存路径，点击【确定】")
    await device.pressKey("ctrl","a");
    await device.pressKey("delete");
    await device.typeText("test.bin");
    await agent.aiTap("文件管理器窗口左侧栏的桌面");
    await agent.aiTap("保存");
    await agent.aiTap("确定");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");

    // 步骤 4: 打开五笔词库，查看词库内容
    console.log("步骤 4: 打开五笔词库，查看词库内容")
    await uos.showDesktop();
    await agent.aiRightClick("test.bin");
    await agent.aiTap("打开方式")
    await agent.aiTap("文本编辑器")
    await agent.aiAssert("显示内容acac 茅蓣");
    await agent.aiTap("窗口右上角关闭按钮:X");

    //还原环境：清空五笔词库
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("五笔");
    await agent.aiAssert("打开五笔设置界面");
    await agent.aiScroll("右侧区域",{direction:'down',distance: 10});
    await agent.aiTap("五笔词库右侧清空按钮");
    await agent.aiTap("确定");
    await agent.aiTap("确定");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");

  }, { timeout: 1200000, tags: ["1525283","smoke","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //环境清理：清除文管中最近访问记录
    await uos.openApp("文件管理器");
    await agent.aiRightClick("最近使用");
    await agent.aiTap("清除最近访问");
    await agent.aiTap("窗口右上角关闭按钮:X");
    //恢复环境：切换至默认输入法
    await device.pressKey("ctrl", "Shift", "w");
    await agent.aiAssert("切换到中文输入法，状态栏第5个图标显示拼");
    await device.pressKey('ctrl','space')
    //删除测试文件
    await system.exec("rm -rf /home/$USER/Desktop/test.bin");

  });
});