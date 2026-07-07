/**
 * 用例 PMSID: 1804805
 * 用例标题: 勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-01-20
 * 用例编写人: UT000211(陈依)
 */


describe('1804805-勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 例如：清理状态、重置数据等
  });

  test('1804805-勾选【显示隐藏文件】-在桌面以“.”开头新建/重命名文件-不弹窗提示', async ({ uos, agent,system, device }) => {
    // 1.打开文件管理器，点击右上方设置菜单，进入设置页面
    console.log("=== 前置条件：打开文件管理器 ===");
    await uos.openApp('文件管理器');
    await device.pressKey('Super', 'Up');
    await agent.aiAssert("文件管理器窗口已打开");
    await agent.aiTap('文件管理器右上角的三条杠');
    await agent.aiTap('设置');
    await agent.aiAssert('进入设置页面');

    
    // 2.点击文件和目录
    await agent.aiTap('设置页面中的文件和目录选项');
    await agent.aiAssert('文件和目录高亮显示');
    
    // 3.点击设置页面显示隐藏文件前方方框
    await agent.aiTap('设置页面显示隐藏文件前方的方框');
    await agent.aiAssert('显示隐藏文件前方方框被勾选');
    
    // 4.关闭设置
    await agent.aiTap('设置页面的关闭按钮');
    await agent.aiAssert('设置页面被关闭');
    
    // 5.点击桌面目录
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    
    // 6.点击桌面空白处，打开右键菜单，在桌面目录新建.test文件
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.pressKey('Control+A'); // 全选操作
    await device.typeText('.test', false);
    await device.pressKey('Enter');
    await agent.aiAssert('test -f ~/Desktop/.test && echo "文件存在" || (echo "文件不存在" && false)');
    
    // 7.点击桌面空白处，打开右键菜单，在桌面目录新建.test1文件夹
    await agent.aiTap('桌面空白区域');
    await agent.aiRightClick('桌面空白区域');
    await agent.aiTap('新建文件夹');
    await device.pressKey('Control+A'); // 全选操作
    await device.typeText('.test1', false);
    await agent.aiWaitFor('等候.test1输入完成')
    await device.pressKey('Enter');
    //await agent.aiAssert('桌面存在.test1文件夹');
    await agent.aiRightClick('.test1文件夹');
    await agent.aiTap('右键菜单中的重命名');
    await device.pressKey('Control+A'); // 全选操作
    await device.typeText('.3-test', false);
    await device.pressKey('Enter');
    await system.exec('test -d ~/Desktop/.3-test && echo "文件存在" || (echo "文件不存在" && false')



    await agent.aiTap('.test');
    await agent.aiRightClick('.test文件');
    await agent.aiTap('右键菜单中的重命名');
    await device.pressKey('Control+A'); // 全选操作
    await device.typeText('.2-test', false);
    await device.pressKey('Enter');
    await system.exec('test -f ~/Desktop/.2-test && echo "文件存在" || (echo "文件不存在" && false)');
    }, { timeout: 600000, tags: ["1804805",'level2', 'smoke','DITT','chenyi'] });


  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
    // 例如：截图、验证状态等
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 例如：关闭应用、清理文件等
    await system.exec("rm ~/Desktop/.test")
    await system.exec("rm -rf ~/Desktop/.test1")
    await system.exec("rm ~/Desktop/.2-test")
    await system.exec("rm -rf ~/Desktop/.3-test")
    //await agent.aiTap('文件管理器右上角的设置菜单');
    //await agent.aiTap('设置');
    //await agent.aiTap('设置页面中的文件和目录选项');
    //await agent.aiTap('设置页面显示隐藏文件前方的方框');
    //await agent.aiAssert('显示隐藏文件前方方框没有被勾选');
    //await agent.aiTap('设置页面的关闭按钮');
    await device.pressKey('Super', 'Down');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await uos.showDesktop();
  });
});

