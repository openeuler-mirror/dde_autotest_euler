/**
 * 用例 PMSID: 1850151
 * 用例标题: 绝对路径的搜索
 * 生成时间: 2026-01-26 15:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1850151-绝对路径的搜索', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850151-绝对路径的搜索', async ({ device, env, system, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器桌面目录');
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器桌面目录');
    // await uos.openApp('文件管理器', { maximizeWindow: true });
    // await agent.aiWaitFor('文件管理器界面已显示');
    await system.exec('dde-file-manager ~/Desktop');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器界面已显示, 已打开桌面目录');

    // // 步骤 1-2: 在侧边栏选择桌面
    // console.log('步骤 1: 在侧边栏选择桌面');
    // await agent.aiTap('侧边栏中的桌面', { deepThink: true });
    // await agent.aiWaitFor('文件管理器跳转到桌面');

    // 步骤 2: 定位到地址栏
    console.log('步骤 2: 定位到地址栏');
    await device.pressKey('Ctrl', 'L');
    await agent.aiWaitFor('文件管理器路径栏被选中');

    // 预期 2: 显示完整路径
    console.log('预期 2: 显示完整路径');
    await agent.aiAssert(`地址栏显示完整路径/home/${env.testUsername}/Desktop`);

    // 步骤 3: 输入绝对路径trash:///
    console.log('步骤 3: 输入绝对路径trash:///');
    // 步骤 3-1: 全选地址栏内容并删除
    await device.pressKey("Ctrl", "A");
    await agent.aiWaitFor('地址栏内容被全选');
    await device.pressKey("Backspace");
    await agent.aiWaitFor('地址栏内容被清空');

    // 步骤 3-2: 输入绝对路径trash:///
    await device.typeText('trash:///', true);
    await agent.aiWaitFor('文件管理器跳转到回收站');

    // 预期 3: 验证页面已跳转到回收站
    console.log('预期 3: 验证页面已跳转到回收站');
    await agent.aiAssert('当前目录为回收站');

    // 步骤 4: 输入绝对路径/home/
    console.log('步骤 4: 输入绝对路径/home/');
    // 步骤 4-1: 定位到地址栏
    await device.pressKey('Ctrl', 'L');
    await agent.aiWaitFor('文件管理器路径栏被选中');

    // 步骤 4-2: 全选地址栏内容并删除
    await device.pressKey("Ctrl", "A");
    await agent.aiWaitFor('地址栏内容被全选');
    await device.pressKey("Backspace");
    await agent.aiWaitFor('地址栏内容被清空');

    // 步骤 4-3: 输入绝对路径/home
    await device.typeText('/home', true);
    await agent.aiWaitFor('文件管理器右侧内容窗口中有主目录文件夹');

    // 预期 4: 验证页面已跳转到/home
    console.log('预期 4: 验证页面已跳转到/home目录');
    await agent.aiAssert('文件管理器右侧内容窗口中有主目录文件夹');

  }, { timeout: 600000, tags: ['1850151', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'address', 'absolute path'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
