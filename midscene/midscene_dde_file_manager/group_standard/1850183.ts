/**
 * 用例 PMSID: 1850183
 * 用例标题: 支持应用程序快捷方式与文件共存
 * 生成时间: 2026-02-10 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850183-支持应用程序快捷方式与文件共存', () => {

  // 测试相关变量定义
  const test_file = 'dde-file-manager.desktop';
  const link_file = '文件管理器 快捷方式';
  const test_app = '文件管理器';

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 测试前清理桌面文件, 避免之前测试影响
    // 准备步骤: 删除测试文件${test_file}和链接文件${link_file}
    console.log(`准备步骤 : 清理测试文件${test_file}和链接文件${link_file}`);
    await system.exec(`test -L ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
    let result = await system.exec(`test -L ~/Desktop/"${link_file}" && rm -v ~/Desktop/"${link_file}"`); // 注意双引号, 不加双引号可能会因转义问题导致删除失败
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试文件${test_file}和链接文件${link_file}
    console.log(`清理步骤 : 清理测试文件${test_file}和链接文件${link_file}`);
    await system.exec(`test -L ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
    await system.exec(`test -L ~/Desktop/"${link_file}" && rm -v ~/Desktop/"${link_file}"`); // 注意双引号, 不加双引号可能会因转义问题导致删除失败\

    // 清理步骤: 关闭可能因失败未关闭的保存对话窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭可能因失败未关闭的保存对话窗口');
    await system.exec("ps aux | grep dde-file-dialog | grep -v grep | awk '{print $2}' | xargs kill -15");

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

  test('1850183-支持应用程序快捷方式与文件共存', async ({ device, system, agent, uos }) => {
    // 步骤 1: 打开启动器搜索${test_app}
    console.log(`步骤 1: 打开启动器搜索${test_app}`);
    await uos.openLauncher();
    await uos.searchInLauncher(test_app);

    // 步骤 2: 右击启动器中的${test_app}并发送到桌面
    console.log(`步骤 2: 右击启动器中的${test_app}并发送到桌面`);
    await agent.aiRightClick(`启动器右边所有应用下的${test_app}图标`);
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('发送到桌面');
    await device.pressKey('Super');

    // 预期 2: 桌面上有${test_app}文件
    console.log(`预期 2: 桌面上有${test_app}文件`);
    await agent.aiAssert(`桌面上有${test_app}文件`);

    // 步骤 3: 在桌面上右击${test_app}图标, 创建链接
    console.log(`步骤 3: 在桌面上右击${test_app}文件, 创建链接`);
    await agent.aiRightClick(`桌面上的${test_app}文件`);
    await agent.aiHover('发送到');
    await agent.aiWaitFor('发送到子菜单已展开');
    await agent.aiTap('创建链接');
    await agent.aiWaitFor('保存窗口已弹出', 
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 4: 单击保存窗口中左侧的桌面, 点击保存按钮
    console.log(`步骤 4: 单击保存窗口中左侧的桌面, 点击保存按钮`);
    await agent.aiTap('保存窗口中左侧的桌面', { deepThink : true });
    await agent.aiWaitFor('保存窗口跳转到桌面');
    await agent.aiTap('保存按钮');
    await agent.aiWaitFor('保存窗口已关闭');

    // 预期 4: 桌面上同时有${test_app}和${link_file}文件
    console.log(`预期 4: 桌面上同时有${test_app}和${link_file}文件`);
    await agent.aiAssert(`桌面上同时有${test_app}和${link_file}文件`);

  }, { timeout: 600000, tags: ['1850183', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'app', 'link', 'coexistence'] });
});
