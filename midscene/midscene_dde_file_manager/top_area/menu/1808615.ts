/**
 * 用例 PMSID: 1808615
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-标记
 * 生成时间: 2026-05-08
 * 用例编写人: UT000649（黄甜）
 */

describe('1808615-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-标记', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808615-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-标记', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808615-侧边栏显示项目-标记 ===');

    console.log('步骤1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    console.log('步骤2: 前置条件-添加标记');
    await agent.aiTap('侧边栏的文档');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText('test_tag');
    await device.pressKey('Enter');
    await agent.aiRightClick('test_tag');
    await agent.aiTap('标记信息下方红色圆点');
    await agent.aiScroll('文档', { direction: 'down', distance: 10 });
    await agent.aiAssert("侧边栏存在标记菜单");
    console.log('✅ 已添加标记');

    console.log('步骤3: 打开设置窗口，进入侧边栏显示项目-网络');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('侧边栏显示项目');
    await agent.aiScroll('快捷访问', { direction: 'down', distance: 10 });

    console.log('步骤4: 检查默认值');
    await agent.aiAssert("已添加的标记左侧复选框显示蓝色√");
    console.log('✅ 默认值已勾选');

    console.log('步骤5: 取消勾选已添加的标记');
    await agent.aiTap("已添加的标记左侧方框");
    await agent.aiAssert("已添加的标记左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');

    console.log('步骤6: 检查侧边栏标记是否隐藏');
    await agent.aiScroll('侧边栏的文档', { direction: 'down', distance: 10 });
    await agent.aiAssert("侧边栏的网络下方无红色");
    console.log('✅ 侧边栏标记已隐藏');

    console.log('✅ 1808615用例测试完成');
  }, { timeout: 600000, tags: ["1808615", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('侧边栏显示项目');
    await agent.aiScroll('快捷访问', { direction: 'down', distance: 10 });
    await agent.aiTap("已添加的标记左侧方框");
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiScroll('侧边栏的文档', { direction: 'down', distance: 10 });
    await agent.aiRightClick('侧边栏标记下方的红色');
    await agent.aiTap('移除');
    await agent.aiTap('删除');
    await system.exec('rm -rf ~/Documents/test_tag');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});