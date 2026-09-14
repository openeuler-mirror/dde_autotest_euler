// @ts-nocheck

/**
 * 用例 PMSID: 1810331
 * 用例标题: 【菜单】【工作区视图插件显示隐藏】组策略，计算机工作区隐藏“我的目录”
 * 生成时间：2026-01-23 15:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810331-计算机工作区隐藏“我的目录”', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810331-计算机工作区隐藏“我的目录”', async ({ device, agent, uos, system }) => {
    // 前置条件
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.computer -k hideMyDirectories -v true', 500);

    // 步骤1：启动器-文件管理器窗口最大化，断言文件管理器页面无“我的目录”
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已最大化");
    await agent.aiAssert("文件管理器页面无我的目录");

    // 步骤2：文件管理器界面，点击主菜单，点击设置，点击计算机显示项目，断言计算机工作区隐藏我的目录前面的勾选框处于勾选的状态
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiWaitFor("主菜单已展开");
    await agent.aiTap("设置");
    await agent.aiWaitFor("文件管理器设置页面已打开");
    await agent.aiTap("计算机显示项目");
    await agent.aiWaitFor("计算机显示项目设置页面已显示");
    await agent.aiAssert("计算机工作区隐藏我的目录前面的勾选框处于勾选状态");

  }, { timeout: 600000, tags: ['1810331', 'level3', 'top_area', 'menu', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保设置恢复到默认状态
    await system.exec('killall dde-file-manager', 500);
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.computer -k hideMyDirectories -v false', 500);
  });
});