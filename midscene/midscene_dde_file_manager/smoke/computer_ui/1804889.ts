/**
 * 用例 PMSID: 1804889
 * 用例标题: 侧边栏显示项目设置取消勾选标签分组下所有设置项目
 * 生成时间: 2025-12-17 09:53:00
 * 用例编写人: UT000211
 */


describe('1804889-侧边栏显示项目设置取消勾选标签分组下所有设置项目', () => {
  beforeAll(async ({ device, uos, agent }) => {
    await uos.openApp('文件管理器',2000,100000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1804889-侧边栏显示项目设置取消勾选标签分组下所有设置项目', async ({ uos, agent, device }) => {
    // 1.打开文件管理器，点击右上方设置菜单，勾选显示隐藏文件
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('进入设置页面');

    
    // 2.点击设置页面的侧边栏
    await agent.aiTap('设置页面中的侧边栏选项');
    await agent.aiAssert('侧边栏高亮显示');
    await agent.aiTap('设置页面中的侧边栏显示项目');
    await agent.aiAssert('侧边栏显示项目');
    
    // 3.向下滑动进度条，找到设置页面的分区模块，取消勾选分区标签下的所有项目
    await agent.aiScroll('设置页面侧边栏显示项目详情区域', { direction: 'down', distance: 4 });
    await agent.aiTap('设置页面计算机前方的方框');
    await agent.aiTap('保险箱前方的方框');
    await agent.aiTap('内置磁盘前方的方框');
    await agent.aiTap('挂载分区和光盘前方的方框');
    await agent.aiAssert('分区下的项目前方方框都没有被勾选');
    
      
    // 4.查看文管侧边栏
    await agent.aiAssert('文管侧边栏不显示计算机目录');
    await agent.aiAssert('文管侧边栏不显示保险箱');
    await agent.aiAssert('文管侧边栏不显示系统盘');
    await agent.aiAssert('文管侧边栏不显示数据盘');
 

  // 5.滑动设置页面到最底部，点击恢复默认
    await agent.aiScroll('设置页面', { direction: 'down', distance: 30 });
    await agent.aiTap('设置页面底部的恢复默认按钮');
    await agent.aiAssert('文管侧边栏显示分区');
    
  // 6.关闭设置菜单
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置菜单被关闭');
     }, { timeout: 300000, tags: ["1804889",'level2', 'smoke', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    await agent.aiTap("窗口右上角关闭按钮:X");
    await uos.showDesktop();
  });
});


