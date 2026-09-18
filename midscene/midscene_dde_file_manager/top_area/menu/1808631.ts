/**
 * 用例 PMSID: 1808631
 * 用例标题:  【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-在磁盘图标上显示文件系统标签
 * 生成时间: 2026-02-06 14:17:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1808631-【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-在磁盘图标上显示文件系统标签', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808631-【工作区视图插件显示隐藏】文管设置，工作区视图-计算机视图显示项目-在磁盘图标上显示文件系统标签', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2：打开设置窗口，进入工作区视图-计算机显示项目
    console.log('步骤 2：打开设置窗口，进入工作区视图-计算机显示项目');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap("计算机显示项目");

    // 步骤 3：检查设置项："在磁盘图标上显示文件系统标签"，默认未勾选
    console.log('步骤 3：检查设置项："在磁盘图标上显示文件系统标签"，默认未勾选');
    await agent.aiAssert("在磁盘图标上显示文件系统标签左侧复选框没有蓝色√");

    //步骤 4：勾选"在磁盘图标上显示文件系统标签"
    console.log('步骤 4：勾选"在磁盘图标上显示文件系统标签"');
    await agent.aiTap("在磁盘图标上显示文件系统标签左侧方框的中心");
    await agent.aiAssert("在磁盘图标上显示文件系统标签左侧复选框显示蓝色√");
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    //步骤 5：再次打开文管，检查计算机页面显示磁盘文件系统标签
    console.log('步骤 5：再次打开文管，检查计算机页面显示磁盘文件系统标签');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiAssert("系统盘和数据盘右边显示文件系统EXT4");

  }, { timeout: 600000, tags: ["1808631", "level3", "menu","DITT", "hushimin"] });

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