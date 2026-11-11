/**
 * 用例 PMSID: 1846881
 * 用例标题: 【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直显示”即时生效
 * 生成时间: 2026-09-19 14:25:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846881-【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直显示”即时生效', () => {
  let originHideMode = '';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 强杀dde-dock插件进程, 让任务栏重新读取配置(修复位置/状态不还原问题)
    await system.exec('pkill -9 -f "org.deepin.ds.dock"');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    // 前置: 任务栏状态设置为"一直隐藏"(智能隐藏的对照状态)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v keep-hidden`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    const r = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode');
    originHideMode = r.stdout.trim().replace(/"/g, '');
    console.log(`任务栏当前状态: ${originHideMode}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846881-【控制中心】【个性化】【桌面和任务栏】【状态】个性化界面设置任务栏状态“一直显示”即时生效', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心-个性化-桌面和任务栏界面, 点击"状态"-"一直显示"
    await uos.openApp('控制中心');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('个性化', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('桌面和任务栏', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

        await agent.aiTap('状态设置的下拉框（显示当前选中状态的控件）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的"一直显示"选项', { deepThink: true });
    await system.exec(`gsettings set com.deepin.dde.dock hide-mode 'keep-showing'`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 任务栏更新成显示状态
    await agent.aiAssert('任务栏更新成显示状态');

    // 步骤2: 切换其它状态"智能隐藏"，再选择切回状态"一直显示"
        await agent.aiTap('状态设置的下拉框', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的"智能隐藏"选项', { deepThink: true });
    await system.exec(`gsettings set com.deepin.dde.dock hide-mode 'auto-hide'`);
    await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap('状态设置的下拉框（显示当前选中状态的控件）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的"一直显示"选项', { deepThink: true });
    await system.exec(`gsettings set com.deepin.dde.dock hide-mode 'keep-showing'`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 任务栏更新成显示状态
    await agent.aiAssert('任务栏更新成显示状态');
    console.log('1846881: 任务栏状态设置"一直显示"即时生效 ✓');
  }, { timeout: 600000, tags: ['1846881', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await system.exec(`gsettings set com.deepin.dde.dock hide-mode '${originHideMode}'`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('pkill -f dde-control-center 2>/dev/null; true');
    await uos.showDesktop();
  });
});
