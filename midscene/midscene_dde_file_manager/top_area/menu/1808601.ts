/**
 * 用例 PMSID: 1808601
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-文件和文件夹混合排序
 * 生成时间: 2026-05-14
 * 用例编写人: UT000649（黄甜）
 */

describe('1808601-【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-文件和文件夹混合排序', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec('rm -rf ~/Documents/test*');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808601-【工作区视图插件显示隐藏】文管设置，基础设置-文件和文件夹-文件和文件夹混合排序', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808601-文件和文件夹混合排序 ===');

    console.log('步骤1: 打开文件管理器并创建测试文件');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('侧边栏的文档目录');

    await system.exec(" touch ~/Documents/test1.txt");    
    await system.exec(" touch ~/Documents/test3.txt");
    await system.exec(" mkdir ~/Documents/test2");
    await system.exec(" mkdir ~/Documents/test4");
    console.log('✅ 已创建测试文件和文件夹');

    console.log('步骤2: 打开设置窗口，检查默认值');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('基础设置');
    await agent.aiTap('文件和目录');
    await agent.aiAssert("文件和文件夹混合排序左侧复选框没有蓝色√");
    console.log('✅ 默认值：未勾选');

    console.log('步骤3: 勾选"文件和文件夹混合排序"');
    await agent.aiTap("文件和文件夹混合排序左侧方框");
    await agent.aiAssert("文件和文件夹混合排序左侧复选框显示蓝色√");
    await agent.aiTap('设置窗口关闭按钮');
  
    await agent.aiRightClick('窗口空白处');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');
    await agent.aiAssert("一个文件、一个文件夹交叉排序");
    console.log('✅ 文件和文件夹混合排序');

    console.log('步骤4: 取消勾选"文件和文件夹混合排序"');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('基础设置');
    await agent.aiTap('文件和目录');
    await agent.aiTap("文件和文件夹混合排序左侧方框");
    await agent.aiAssert("文件和文件夹混合排序左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');
        await agent.aiRightClick('窗口空白处');
    await agent.aiTap('排序方式');
    await agent.aiTap('创建时间');
    await agent.aiAssert("所有文件进行排序，文件夹排在前，文件排在后");
    console.log('✅ 所有文件夹排序，然后所有文件进行排序，文件夹在前');

    console.log('✅ 1808601用例测试完成');
  }, { timeout: 600000, tags: ["1808601", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认");
    await system.exec('rm -rf ~/Documents/test*');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});