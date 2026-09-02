/**
 * 用例 PMSID: 1807225
 * 用例标题: [002][core]右侧预览-文件夹，信息栏
 * 生成时间: 2026-01-26
 * 用例编写人: UT000211（陈依）
 */


describe('1807225-[002][core]右侧预览-文件夹，信息栏', () => {
  beforeAll(async ({ device, uos,system, agent }) => {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await system.exec('rm -rf ~/Desktop/test ~/Desktop/test1.txt'); 
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await device.pressKey('Super', 'Up');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1807225-[002][core]右侧预览-文件夹，信息栏', async ({ uos, agent, device }) => {
    // 1.打开文件管理器，进入到桌面目录，在桌面空白处打开右键菜单，点击新建文件夹，输入文本test,按enter进行确认操作，test文件夹新建成功
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText('test', false);
    await device.pressKey('Enter');
    await agent.aiAssert('test文件夹新建成功');
    
    // 2.点击test文件夹，打开右键菜单，点击标记信息，输入文本test，test前方显示橙色圆圈
    await agent.aiRightClick('test文件夹');
    await agent.aiTap('右键菜单中的标记信息');
    await device.typeText('test', false);
    await device.pressKey('Enter');
    await device.pressKey('Enter');
    // 滑动文管侧边栏到最底部，test文件夹显示在标记下方
    await agent.aiAssert('左侧边栏的标记下方的标记名称是test');

    // 3.打开文件管理器，进入到桌面目录，在桌面空白处打开右键菜单，点击新建文本，点击文本文档，输入文本test1,按enter进行确认操作，test1文件新建成功
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText('test1', false);
    await device.pressKey('Enter');
    await agent.aiAssert('test1.txt文件新建成功');
    
    // 3.点击右上方详情视图，打开test文件夹详情页面，上方展示文件夹图标，中间展示文件夹名称，类型，访问时间，修改时间，下方显示标记，标记下方框显示test
    await agent.aiTap('列表视图往右数的第二个图标上下箭头左边的图标,{ deepThink: true })');
    await agent.aiTap('点击显示预览前方方框');
    await agent.aiWaitFor('显示预览前方方框被勾选')
    await agent.aiAssert('预览前方方框被勾选');
    await agent.aiTap('点击桌面空白处');
    // 优化：合并多个断言为单个更全面的断言，减少AI调用次数
    await agent.aiAssert('右侧面板展示文件图标、名称、类型、访问时间、修改时间、标记，且标记下方框显示为空');
    await agent.aiTap('点击桌面test文件夹');
    await agent.aiWaitFor('test文件夹被选中')
    // 优化：合并文件夹详情面板的所有断言为单个更全面的断言
    await agent.aiAssert('打开test文件夹右侧面板，展示文件夹图标、名称、类型、访问时间、修改时间、标记，且标记下方框显示test');

 
    
    }, { timeout: 800000, tags: ["1807225",'level2', 'smoke','DITT','chenyi'] });
    


  afterEach(async ({agent, device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('列表视图往右数的第二个图标上下箭头左边的图标,{ deepThink: true })');
    await agent.aiTap('点击显示预览前方方框');
    await agent.aiWaitFor('显示预览前方方框没有勾选')
    await agent.aiAssert('预览前方方框没有被勾选');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 使用命令删除文件test test1
    await system.exec("rm -rf ~/Desktop/test ~/Desktop/test1.txt");
    await agent.aiAssert('桌面不存在test文件夹和test1.txt文件');
    await agent.aiRightClick("侧边栏test");
    await agent.aiTap("移除");
    await agent.aiTap("删除");

    
    // 例如：关闭应用、清理文件等
    await device.pressKey('Super', 'Down')
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await uos.showDesktop();
  });
});
