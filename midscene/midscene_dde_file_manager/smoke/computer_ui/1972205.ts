/**
 * 用例 PMSID: 1972205
 * 用例标题: 侧边栏显示项目设置取消勾选标签分组下所有设置项目
 * 生成时间: 2025-12-19 13:48:00
 * 用例编写人: UT000211（陈依）
 */


describe('1972205-侧边栏显示项目设置取消勾选标签分组下所有设置项目', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1972205-侧边栏显示项目设置取消勾选标签分组下所有设置项目', async ({ uos, agent, device }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
    // 1.打开文件管理器，点击主目录，空白处右键，点击新建文件夹并确认，选中新建的文件夹，打开右键菜单，点击标记信息橙色
    await agent.aiTap('侧边栏中的主目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到主目录');
    // 验证页面已跳转到主目录
    await agent.aiAssert('当前目录为主目录');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiTap('新建文件夹');
    await agent.aiWaitFor('新建文件夹输入框已出现');
    await device.typeText('新建文件夹', false);
    await agent.aiTap('右侧内容区域空白处');
   // 验证测试文件夹已创建成功
    await agent.aiAssert('界面存在新建文件夹');
    await agent.aiRightClick('新建的文件夹');
    await agent.aiWaitFor('右键菜单已出现');
    await agent.aiTap('右键菜单中的标记信息橙色');
    await agent.aiAssert('文管侧边栏显示标记');
    
    // 2.打开文件管理器，点击右上方设置菜单
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('进入设置页面');
    
    // 3.点击设置页面的侧边栏
    await agent.aiTap('设置页面中的侧边栏选项');
    await agent.aiAssert('侧边栏高亮显示');
    
    // 4.向下滑动进度条，找到设置页面的快捷模块，取消勾选已添加的标记
    await agent.aiScroll('设置页面', { direction: 'down', distance: 5 });
    await agent.aiTap('设置页面标记前方的方框');
    await agent.aiAssert('标记下的项目没有被勾选');
    
    // 5.查看文管侧边栏
    await agent.aiAssert('文管侧边栏快捷访问不显示标记');

    // 6.滑动设置页面到最底部，点击恢复默认
    await agent.aiScroll('设置页面', { direction: 'down', distance: 30 });
    await agent.aiTap('设置页面底部的恢复默认按钮');
    await agent.aiAssert('文管侧边栏显示标记');

    // 7.关闭设置菜单
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置菜单关闭');
    

    // 8.打开文件管理器侧边栏标记右键菜单，从标记中移除
    await agent.aiRightClick('侧边栏橙色字样');
    await agent.aiTap('移除');
    await agent.aiTap('删除');
    await agent.aiAssert('文管侧边栏不显示标记');
     }, { timeout: 700000, tags: ["1972205",'level2', 'smoke','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");

    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    await agent.aiTap("窗口右上角关闭按钮:X");
    // 清理临时文件（如需要）
    await system.exec('rm -rf /home/uos/新建文件夹');
    await uos.showDesktop();
  });
});

