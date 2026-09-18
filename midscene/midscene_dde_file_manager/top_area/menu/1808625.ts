/**
 * 用例 PMSID: 1808625
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏内置磁盘
 * 生成时间: 2026-05-08
 * 用例编写人: UT000649（黄甜）
 */

describe('1808625-【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏内置磁盘', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808625-【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-计算机工作区隐藏内置磁盘', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808625-计算机工作区隐藏内置磁盘 ===');

    console.log('步骤1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    console.log('步骤2: 打开设置窗口，进入工作区视图-计算机视图显示项目');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('计算机视图显示项目');

    console.log('步骤3: 检查默认值');
    await agent.aiAssert("计算机工作区隐藏内置磁盘左侧复选框没有蓝色√");
    console.log('✅ 默认值未勾选');

    console.log('步骤4: 勾选计算机工作区隐藏内置磁盘');
    await agent.aiTap("计算机工作区隐藏内置磁盘左侧方框");
    await agent.aiAssert("计算机工作区隐藏内置磁盘左侧复选框显示蓝色√");
    await agent.aiTap('设置窗口关闭按钮');

    console.log('步骤5: 进入计算机页面检查磁盘是否隐藏');
    await agent.aiTap('计算机');
    await agent.aiAssert("计算机页面磁盘列表无系统盘和数据盘");
    console.log('✅ 计算机页面的所有内置磁盘整体隐藏');

    console.log('✅ 1808625用例测试完成');
  }, { timeout: 600000, tags: ["1808625", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('计算机视图显示项目');
    await agent.aiTap("计算机工作区隐藏内置磁盘左侧方框");
    await agent.aiTap('设置窗口关闭按钮');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});