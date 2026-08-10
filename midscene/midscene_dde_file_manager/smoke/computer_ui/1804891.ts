/**
 * 用例 PMSID: 1804891
 * 用例标题: 侧边栏显示项目设置取消勾选快捷访问分组下所有设置项目
 * 生成时间: 2025-12-17 19:54:00
 * 用例编写人: UT000211(陈依)
 */


describe('1804891-侧边栏显示项目设置取消勾选快捷访问分组下所有设置项目', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec('rm -rf /home/uos/新建文件夹');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1804891-侧边栏显示项目设置取消勾选快捷访问分组下所有设置项目', async ({ uos, agent, device }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await device.pressKey('Super+Up');
    // 1.打开文件管理器，点击主目录，空白处右键，点击新建文件夹并确认，选中新建的文件夹，打开右键菜单，点击添加到快捷访问
    await agent.aiTap('侧边栏中的主目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到主目录');
    // 验证页面已跳转到视频目录
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
    await agent.aiTap('右键菜单中的添加到快捷访问');
    await agent.aiAssert('文管侧边栏快捷访问区域存在新建文件夹目录');
    
    // 2.打开文件管理器，点击右上方设置菜单
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiWaitFor('进入设置页面')
    await agent.aiAssert('进入设置页面');
    
    // 3.点击设置页面的侧边栏
    await agent.aiTap('侧边栏显示项目');
    await agent.aiAssert('侧边栏显示项目高亮显示');
    
    // 4.向下滑动进度条，找到设置页面的快捷模块，取消勾选快捷访问标签下的所有模块
    await agent.aiTap('设置页面最近使用的方框');
    await agent.aiTap('设置页面主目录前方的方框');
    await agent.aiTap('设置页面桌面前方的方框');
    await agent.aiTap('设置页面视频前方的方框');
    await agent.aiTap('设置页面音乐前方的方框');
    await agent.aiTap('设置页面图片前方的方框');
    await agent.aiTap('设置页面文档前方的方框');
    await agent.aiTap('设置页面下载前方的方框');
    await agent.aiTap('设置页面办公云盘前方的方框');
    await agent.aiTap('设置页面回收站前方的方框');
    await agent.aiAssert('快捷访问分区下的项目前方方框都没有被勾选');
    
    // 5.查看文管侧边栏
    await agent.aiAssert('文管侧边栏快捷访问不显示最近使用');
    await agent.aiAssert('文管侧边栏快捷访问不显示主目录');
    await agent.aiAssert('文管侧边栏快捷访问不显示桌面');
    await agent.aiAssert('文管侧边栏快捷访问不显示视频');
    await agent.aiAssert('文管侧边栏快捷访问不显示音乐');
    await agent.aiAssert('文管侧边栏快捷访问不显示图片');
    await agent.aiAssert('文管侧边栏快捷访问不显示文档');
    await agent.aiAssert('文管侧边栏快捷访问不显示下载');
    await agent.aiAssert('文管侧边栏快捷访问不显示办公云盘');
    //await agent.aiScroll('设置页面', { direction: 'down', distance: 10 })
    //await agent.aiWaitFor('显示回收站')
    await agent.aiAssert('文管侧边栏快捷访问不显示回收站');
    await agent.aiAssert('文管侧边栏快捷访问下显示新建文件夹');
     }, { timeout: 1500000, tags: ["1804891",'level2', 'smoke', 'chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");

    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    await agent.aiTap('右上角三条横线');
    await agent.aiTap('设置')
    await agent.aiAssert('进入到设置页面');
    await agent.aiScroll('设置页面', { direction: 'down', distance: 60 });
    await agent.aiTap('设置页面底部的恢复默认按钮');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert('文管侧边栏显示最近使用，主目录，桌面');
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置菜单被关闭');
    await device.pressKey('Super+Down');
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");

    // 清理临时文件（如需要）
    await system.exec('rm -rf /home/uos/新建文件夹');
    await uos.showDesktop();
  });
});

