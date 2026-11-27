/**
 * 用例 PMSID: 1814369
 * 用例标题: 【本地磁盘】盘符信息-勾选/不勾选"在磁盘图标上显示文件系统标签
 * 生成时间: 2026-07-08 10:00:00
 * 用例编写人： UT000649（黄甜）
 */

describe('1814369-本地磁盘-盘符信息-勾选不勾选在磁盘图标上显示文件系统标签', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager', 500);
    console.log('=== 恢复文件管理器默认设置 ===');
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await uos.maximizeWindow();
    await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 100 });
    await agent.aiTap('文件粉碎');
    await agent.aiTap('恢复默认'); 
    await agent.aiTap("文件管理器设置窗口右上角的关闭按钮:X"); 
  });

  test('1814369-本地磁盘-盘符信息-勾选不勾选在磁盘图标上显示文件系统标签', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1814369 ===');

    console.log('步骤1：打开文件管理器，点击右上角三横杠菜单按钮，点击工作区-缩略图预览，检查"在磁盘图标上显示文件系统标签"默认状态');
    await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiTap('计算机显示项目');
    await agent.aiAssert('"在磁盘图标上显示文件系统标签"选项左侧方框内无勾选标识');
    console.log('"在磁盘图标上显示文件系统标签"选项默认不勾选');

    console.log('步骤2：勾选"在磁盘图标上显示文件系统标签"选项');
    await agent.aiTap('在磁盘图标上显示文件系统标签');
    await agent.aiAssert('在磁盘图标上显示文件系统标签存在勾选标识');
    console.log('勾选成功');

    console.log('步骤3：鼠标挪动到计算机页面，检查分区盘符文件系统类型标签');
    await agent.aiTap('设置窗口右上角的关闭按钮:x');
    await agent.aiTap('文件管理器侧边栏的计算机');
    await agent.aiWaitFor('计算机页面已显示');
    await agent.aiAssert('盘符上显示文件系统类型标签');
    console.log('盘符上文件系统类型标签');

    console.log('步骤4：取消"在磁盘图标上显示文件系统标签"勾选');
    await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiTap('计算机显示项目');
    await agent.aiTap('在磁盘图标上显示文件系统标签');
    await agent.aiAssert('在磁盘图标上显示文件系统标签不存在勾选标识');
    console.log('取消勾选成功');

    console.log('步骤5：鼠标挪动到计算机页面，检查分区盘符文件系统类型标签');
    await agent.aiTap('设置窗口右上角的关闭按钮:x');
    await agent.aiTap('文件管理器侧边栏的计算机');
    await agent.aiWaitFor('计算机页面已显示');
    await agent.aiAssert('盘符上没有文件系统类型标签');
    console.log('盘符上没有文件系统类型标签');

    await uos.closeCurrentWindow();

    console.log('✅ 1814369用例测试完成');
  }, { timeout: 1200000, tags: ['1814369', 'level3', 'LocalDisk', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log('=== 恢复文件管理器默认设置 ===');
    await agent.aiTap('右上角有3条横线的图标',{deepThink:true});
    await agent.aiTap('下拉菜单中的设置');
    await agent.aiScroll('基础设置', { direction: 'down', distance: 100 });
    await agent.aiTap('文件粉碎');
    await agent.aiTap('恢复默认'); 
    await agent.aiTap("文件管理器设置窗口右上角的关闭按钮:X"); 
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});