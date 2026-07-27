/**
 * 用例 PMSID: 1808647
 * 用例标题:  【工作区视图插件显示隐藏】文管设置，高级设置-对话框-使用文件管理器的文件选择对话框
 * 生成时间: 2026-02-06 13:28:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1808647-【工作区视图插件显示隐藏】文管设置，高级设置-对话框-使用文件管理器的文件选择对话框', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808647-【工作区视图插件显示隐藏】文管设置，高级设置-对话框-使用文件管理器的文件选择对话框', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2：打开设置窗口，进入高级设置-对话框选项，检查默认值
    console.log('步骤 2：打开设置窗口，进入高级设置-对话框选项，检查默认值');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiScroll('设置左侧边栏',{direction:'down',distance: 20} )
    await agent.aiTap("对话框");

    // 步骤 3：检查设置项："使用文件管理器的文件选择对话框"，默认勾选
    console.log('步骤 3：检查设置项："使用文件管理器的文件选择对话框"，默认勾选');
    await agent.aiAssert("使用文件管理器的文件选择对话框左侧复选框有蓝色√");

    //步骤 4：取消勾选"使用文件管理器的文件选择对话框"
    console.log('步骤 4：取消勾选"使用文件管理器的文件选择对话框');
    await agent.aiTap("使用文件管理器的文件选择对话框左侧方框的中心");
    await agent.aiAssert("使用文件管理器的文件选择对话框左侧不显示蓝色√");
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    //步骤 5：打开浏览器，按Ctrl+s，检查调起的对话框不是系统默认的文件选择对话框
    console.log('步骤 5：打开浏览器，按Ctrl+s，检查调起的对话框不是系统默认的文件选择对话框');
    await uos.openApp('浏览器');
    await agent.aiWaitFor('浏览器界面已显示');
    await device.pressKey('ctrl+s')
    await agent.aiWaitFor('保存文件对话框已显示');
    await agent.aiAssert("保存文件对话框上方显示的标签为保存文件");

    //环境清理：关闭浏览器
    await agent.aiTap('保存文件对话框的取消')
    await agent.aiTap('浏览器窗口右上角关闭按钮')

  }, { timeout: 600000, tags: ["1808647", "level3", "menu","DITT", "hushimin"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});