/**
 * 用例 PMSID: 1936033
 * 用例标题: 【支持固定标签页】新窗口默认目录设置为指定目录
 * 生成时间: 2026-01-29 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1936033-【支持固定标签页】新窗口默认目录设置为指定目录', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/$USER/Videos/A1')

  });

  test('1936033-【支持固定标签页】新窗口默认目录设置为指定目录', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-设置-新窗口目录
    console.log('步骤 2: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 3: 默认目录选择指定目录，点击取消
    console.log('步骤 3: 默认目录选择指定目录，点击取消');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('指定目录')
    await agent.aiWaitFor('文件管理器界面显示');
    await agent.aiTap('取消')

    // 步骤 4：选择视频-A1目录
    console.log('步骤 4：选择视频-A1目录');
    await agent.aiTap('默认菜单右侧的下拉选项')
    await agent.aiTap('指定目录')
    await agent.aiWaitFor('文件管理器界面显示');
    await agent.aiDoubleClick('视频')
    await agent.aiDoubleClick('A1')
    await agent.aiTap('打开')
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    // 步骤 5: 点击任务栏文件管理器图标，打开默认目录
    console.log('步骤 5: 点击任务栏文件管理器图标，打开默认目录');
    await agent.aiTap('点击任务栏的文件管理器图标')
    await agent.aiAssert('打开的目录为/视频/A1');

  }, { timeout: 1200000, tags: ['1936033', 'level1', 'smoke', 'DITT', 'hushimin', '2500u1'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //清理测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/Videos/A1')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
});
