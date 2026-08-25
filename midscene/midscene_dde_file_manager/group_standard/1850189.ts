/**
 * 用例 PMSID: 1850189
 * 用例标题: 桌面显示应用程序图标
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850189-桌面显示应用程序图标', () => {

  // 测试相关变量定义
  const test_file = 'dde-file-manager.desktop';
  const test_app = '文件管理器';
  const search_string = 'filemanager';

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 测试前清理桌面文件, 避免之前测试影响
    // 准备步骤: 删除测试文件${test_file}
    console.log(`准备步骤 : 清理测试文件${test_file}`);
    await system.exec(`test -L ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试文件${test_file}
    console.log(`清理步骤 : 清理测试文件${test_file}`);
    await system.exec(`test -L ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850189-桌面显示应用程序图标', async ({ device, system, agent, uos }) => {
    // 步骤 1: 打开启动器搜索${search_string}
    console.log(`步骤 1: 打开启动器搜索${search_string}`);
    await uos.openLauncher();
    await uos.searchInLauncher(search_string);

    // 步骤 2: 右击启动器中的${test_app}并发送到桌面
    console.log(`步骤 2: 右击启动器中的${test_app}并发送到桌面`);
    await agent.aiRightClick(`启动器中的${test_app}字符`);
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('发送到桌面');
    await device.pressKey('Super');

    // 预期 2: 桌面上有${test_app}图标
    console.log(`预期 2: 桌面上有${test_app}图标`);
    await agent.aiAssert(`桌面上有${test_app}图标`);

  }, { timeout: 600000, tags: ['1850189', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'app', 'icon'] });
});
