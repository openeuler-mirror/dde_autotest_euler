/**
 * 用例 PMSID: 1808613
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-网络
 * 生成时间: 2026-05-13
 * 用例编写人: UT000649（黄甜）
 */

describe('1808613-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-网络', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager', 500);
  });

  test('1808613-【工作区视图插件显示隐藏】文管设置，侧边栏显示项目-网络', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808613-侧边栏显示项目-网络 ===');

    console.log('前置条件: 挂载共享文件夹');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    const caseDir = process.env.TESTCASE_DIR;
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    console.log('✅ 已挂载共享文件夹');

    console.log('步骤1: 打开设置窗口，进入侧边栏显示项目-网络');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认"); 

    await agent.aiTap("侧边栏显示项目"); 
    await agent.aiScroll('快捷访问', { direction: 'down', distance: 10 });

    console.log('步骤2: 检查"网络邻居"默认值');
    await agent.aiAssert("网络邻居左侧复选框显示蓝色√");
    console.log('✅ 默认值：已勾选');

    console.log('步骤3: 取消勾选"网络邻居"');
    await agent.aiTap("网络邻居左侧方框");
    await agent.aiAssert("网络邻居左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiScroll('侧边栏计算机', { direction: 'down', distance: 10 });
    await agent.aiAssert("侧边栏无网络邻居");
    console.log('✅ 侧边栏"网络邻居"已隐藏');

    console.log('步骤4: 重新打开设置，检查"我的共享"默认值');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('侧边栏显示项目');
    await agent.aiScroll('快捷访问', { direction: 'down', distance: 10 });
    await agent.aiAssert("我的共享左侧复选框显示蓝色√");
    console.log('✅ 默认值：已勾选');

    console.log('步骤5: 取消勾选"我的共享"');
    await agent.aiTap("我的共享左侧方框");
    await agent.aiAssert("我的共享左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiScroll('侧边栏计算机', { direction: 'down', distance: 10 });
    await agent.aiAssert("侧边栏无我的共享");
    console.log('✅ 侧边栏"我的共享"已隐藏');

    console.log('步骤6: 重新打开设置，检查"已挂载的共享文件夹"默认值');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('侧边栏显示项目');
    await agent.aiScroll('快捷访问', { direction: 'down', distance: 10 });
    await agent.aiAssert("已挂载的共享文件夹左侧复选框显示蓝色√");
    console.log('✅ 默认值：已勾选');

    const ip = process.env.SMB_IP;
    console.log('步骤7: 取消勾选"已挂载的共享文件夹"');
    await agent.aiTap("已挂载的共享文件夹左侧方框");
    await agent.aiAssert("已挂载的共享文件夹左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');
    await agent.aiScroll('侧边栏计算机', { direction: 'down', distance: 10 });
    await agent.aiAssert(`文件管理器左侧导航栏无${ip}`);
    console.log('✅ 侧边栏"已挂载的共享文件夹"已隐藏');
 
    console.log('✅ 1808613用例测试完成');
  }, { timeout: 600000, tags: ["1808613", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认");
    await agent.aiTap('文件管理器右上角关闭按钮');
  });
});