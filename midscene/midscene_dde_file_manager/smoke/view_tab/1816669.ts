/**
 * 用例 PMSID: 1816669
 * 用例标题: 地址栏-选中输入地址右键操作
 * 生成时间: 2026-01-16 12:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816669-地址栏-选中输入地址右键操作', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816669-地址栏-选中输入地址右键操作', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 输入桌面地址
    console.log('步骤 2: 输入桌面地址');
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

    // 步骤 3: 右击输入的地址
    console.log('步骤 3: 右击输入的地址');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏~/Desktop', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');

    // 确认右键菜单撤销、重做、剪切、复制、粘贴、删除、全选操作
    console.log('预期 3: 确认右键菜单包含撤销、重做、剪切、复制、粘贴、删除、全选操作');
    await agent.aiAssert('右键菜单包含撤销、重做、剪切、复制、粘贴、删除、全选操作', { deepThink: true });

    // 步骤 4: 检查右键菜单功能
    console.log('步骤 4: 检查右键菜单功能');
    // 步骤 4-1: 点击全选操作
    console.log('步骤 4-1: 点击全选操作');
    await agent.aiTap('右键菜单全选操作');

    // 确认地址栏中~/Desktop被全选
    console.log('预期 4-1: 确认地址栏中~/Desktop被全选');
    await agent.aiAssert('地址栏中~/Desktop被全选');

    // 步骤 4-2-1: 点击复制操作, 结果检查在步骤4-4
    console.log('步骤 4-2-1: 点击复制操作, 结果检查在步骤4-4');
    // await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏中的~/Desktop', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单复制操作');

    // 确认地址栏中~/Desktop无变化
    console.log('预期 4-2: 确认地址栏中~/Desktop无变化');
    await agent.aiAssert('地址栏中~/Desktop无变化');

    // 步骤 4-3: 全选后点击删除操作
    console.log('步骤 4-3: 全选后点击删除操作');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await device.pressKey("Ctrl", "A");
    await agent.aiRightClick('地址栏', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单删除操作');

    // 确认地址栏被清空
    console.log('预期 4-3: 确认地址栏被清空');
    await agent.aiAssert('地址栏被清空');

    // 步骤 4-4: 点击粘贴操作
    console.log('步骤 4-4: 点击粘贴操作');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单粘贴操作');

    // 确认地址栏显示~/Desktop
    console.log('预期 4-4: 确认地址栏显示~/Desktop');
    await agent.aiAssert('地址栏中显示~/Desktop');

    // 步骤 4-5: 全选后点击剪切操作
    console.log('步骤 4-5: 全选后点击剪切操作');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await device.pressKey("Ctrl", "A");
    await agent.aiRightClick('地址栏', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单剪切操作');
    await agent.aiAssert('地址栏被清空');
    await device.pressKey("Ctrl", "V");

    // 确认地址栏显示~/Desktop
    console.log('预期 4-5: 确认地址栏显示~/Desktop');
    await agent.aiAssert('地址栏中显示~/Desktop');

    // 步骤 4-6: 点击撤销操作
    console.log('步骤 4-6: 点击撤销操作');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏空白区域', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单粘贴操作');
    await agent.aiWaitFor('地址栏显示~/Desktop~/Desktop');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单撤销操作');

    // 确认地址栏显示~/Desktop
    console.log('预期 4-6: 地址栏显示~/Desktop');
    await agent.aiAssert('地址栏显示~/Desktop');

    // 步骤 4-3: 点击重做操作
    console.log('步骤 4-7: 点击重做操作');
    await agent.aiTap('地址栏空白区域', { deepThink: true }); // 点击下地址栏, 防止有下拉菜单
    await agent.aiRightClick('地址栏', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('右键菜单重做操作');

    // 确认地址栏显示~/Desktop~/Desktop
    console.log('预期 4-7: 地址栏显示~/Desktop~/Desktop');
    await agent.aiAssert('地址栏显示~/Desktop~/Desktop');

  }, { timeout: 900000, tags: ['1816669', 'level2', 'smoke', 'DITT', 'youwei', 'addressbar', 'file-manager', 'right-click menu'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 删除设置并关闭文件管理器
    console.log('清理步骤: 删除设置并关闭文件管理器');
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
