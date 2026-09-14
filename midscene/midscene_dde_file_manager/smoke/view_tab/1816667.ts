/**
 * 用例 PMSID: 1816667
 * 用例标题: 地址栏-激活状态显示
 * 生成时间: 2026-01-16 10:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816667-地址栏-激活状态显示', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816667-地址栏-激活状态显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 输入桌面地址, 点击其它位置, 回到默认界面
    console.log('步骤 2: 输入桌面地址, 点击其它位置, 回到默认界面');
    // 步骤 2-1: 按ctrl+l编辑地址栏
    console.log('步骤 2-1: 按ctrl+l编辑地址栏');
    await device.pressKey("Ctrl", "L");
    await agent.aiWaitFor('地址栏进入编辑状态, 编辑框显示');

    // 步骤 2-2: 全选地址栏内容并删除
    console.log('步骤 2-2: 全选地址栏内容并删除');
    await device.pressKey("Ctrl", "A");
    await agent.aiWaitFor('地址栏内容被全选');
    await device.pressKey("Backspace");
    await agent.aiWaitFor('地址栏内容被清空');


    // 步骤 2-3: 输入桌面目录路径
    console.log('步骤 2-3: 输入桌面目录路径');
    await device.typeText('~/Desktop', false);
    await agent.aiWaitFor('地址栏回显~/Desktop');

    // 步骤 2-4: 点击其它位置
    console.log('步骤 2-4: 点击其它位置');
    await agent.aiTap('文件管理器右侧窗口中的空白处', { deepThink: true });
    await agent.aiWaitFor('文件管理器窗口不再跳转');

    // 确认当前窗口是默认界面 -- 侧边栏选中 计算机
    console.log('预期 2: 确认当前窗口是默认界面 -- 侧边栏选中 计算机');
    await agent.aiAssert('侧边栏选中计算机', { deepThink: true });

    // 步骤 3: 输入桌面地址, 点击回车, 跳转到桌面
    console.log('步骤 3: 输入桌面地址, 点击回车, 跳转到桌面');
    // 步骤 3-1: 按ctrl+l编辑地址栏
    console.log('步骤 3-1: 按ctrl+l编辑地址栏');
    await device.pressKey("Ctrl", "L");
    await agent.aiWaitFor('地址栏进入编辑状态, 编辑框显示');

    // 步骤 3-2: 全选地址栏内容并删除
    console.log('步骤 3-2: 全选地址栏内容并删除');
    await device.pressKey("Ctrl", "A");
    await agent.aiWaitFor('地址栏内容被全选');
    await device.pressKey("Backspace");
    await agent.aiWaitFor('地址栏内容被清空');


    // 步骤 3-3: 输入桌面目录路径, 并点击回车
    console.log('步骤 3-3: 输入桌面目录路径, 并点击回车');
    await device.typeText('~/Desktop', true);
    await agent.aiWaitFor('文件管理器窗口不再跳转');

    // 确认当前窗口跳转到桌面
    console.log('预期 3: 确认当前窗口跳转到桌面');
    await agent.aiAssert('跳转到桌面目录, 侧边栏选中桌面目录', { deepThink: true });

  }, { timeout: 600000, tags: ['1816667', 'level2', 'smoke', 'DITT', 'youwei', 'addressbar', 'file-manager', 'active'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
