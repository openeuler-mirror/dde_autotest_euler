/**
 * 用例 PMSID: 1935227
 * 用例标题: 【在新标签页中打开新文件夹】在桌面打开新文件夹后再打开其子文件夹
 * 生成时间: 2026-01-29 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1935227-【在新标签页中打开新文件夹】在桌面打开新文件夹后再打开其子文件夹', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir -p /home/$USER/Desktop/A/A1')
    await system.exec('mkdir -p /home/$USER/Desktop/B/B1')
    });

  test('1935227-【在新标签页中打开新文件夹】在桌面打开新文件夹后再打开其子文件夹', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器窗口
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-设置，勾选在新标签打开新文件夹
    console.log('步骤 2: 进入主菜单-设置，勾选在新标签打开新文件夹');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('勾选在新标签打开新文件夹')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //最小化文管窗口
    await agent.aiTap('文件管理器最小化按钮')

    // 步骤 3: 双击桌面文件夹A，以新标签页打开文件夹A
    console.log('步骤 3: 双击桌面文件夹A，以新标签页打开文件夹A');
    await agent.aiDoubleClick('文件夹A');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiAssert('显示2个标签页，分别为计算机、A');

    // 步骤 4: 双击文件夹A1，在当前标签页打开文件夹A1
    console.log('步骤 4: 双击文件夹A1，在当前标签页打开文件夹A1');
    await agent.aiDoubleClick('文件夹A1');
    await agent.aiAssert('显示2个标签页，分别为计算机、A1');
    //最小化文管窗口
    await agent.aiTap('文件管理器最小化按钮')

    // 步骤 5: 双击桌面文件夹B，以新标签页打开文件夹B
    console.log('步骤 5: 双击桌面文件夹B，以新标签页打开文件夹B');
    await agent.aiDoubleClick('文件夹B');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiAssert('显示3个标签页，分别为计算机、A1、B');

  }, { timeout: 600000, tags: ['1935227', 'level2', 'smoke', 'DITT', 'hushimin', '2500u1'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    //清理测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/Desktop/A*')
    await system.exec('rm -rf /home/$USER/Desktop/B*')
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
