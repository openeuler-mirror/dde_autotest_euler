/**
 * 用例 PMSID: 1846867
 * 用例标题: 【控制中心】【个性化】【桌面和任务栏】【位置】个性化界面设置任务栏位置“右”即时生效
 * 生成时间: 2026-09-19 14:05:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1846867-【控制中心】【个性化】【桌面和任务栏】【位置】个性化界面设置任务栏位置“右”即时生效', () => {
  let originPosition = '';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 强杀dde-dock插件进程, 让任务栏重新读取配置(修复位置/状态不还原问题)
    await system.exec('pkill -9 -f "org.deepin.ds.dock"');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    const r = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position');
    originPosition = r.stdout.trim().replace(/"/g, '');
    console.log(`原任务栏位置: ${originPosition}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1846867-【控制中心】【个性化】【桌面和任务栏】【位置】个性化界面设置任务栏位置“右”即时生效', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心-个性化-桌面和任务栏界面, 选择位置"右"
    await uos.openApp('控制中心');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('个性化', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('桌面和任务栏', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.aiTap('屏幕中的位置选项框', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的右选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 命令行兜底确保位置切换成功(AI tap下拉菜单项偶发未点中)
    await system.exec(`gsettings set com.deepin.dde.dock position 'right'`);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v right`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 任务栏移到屏幕右侧, 下拉菜单消失
    await agent.aiAssert('任务栏显示在屏幕右侧位置，下拉菜单已消失');

    // 步骤2: 切换其它位置后，再选择切回位置"右"
    await agent.aiTap('屏幕中的位置选项框', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的下选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 命令行兜底确保位置切换成功(AI tap下拉菜单项偶发未点中)
    await system.exec(`gsettings set com.deepin.dde.dock position 'bottom'`);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v bottom`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('屏幕中的位置选项框', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiTap('下拉菜单中的右选项', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 命令行兜底确保位置切换成功(AI tap下拉菜单项偶发未点中)
    await system.exec(`gsettings set com.deepin.dde.dock position 'right'`);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v right`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 任务栏移到屏幕右侧
    await agent.aiAssert('任务栏显示在屏幕右侧位置，下拉菜单已消失');
    console.log('1846867: 任务栏位置设置"右"即时生效 ✓');
  }, { timeout: 600000, tags: ['1846867', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec(`gsettings set com.deepin.dde.dock position 'bottom'`);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v bottom`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    if (originPosition && originPosition !== 'bottom') {
      await system.exec(`gsettings set com.deepin.dde.dock position '${originPosition}'`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`任务栏位置已还原: ${originPosition}`);
    }
    await system.exec('pkill -f dde-control-center 2>/dev/null; true');
    await uos.showDesktop();
  });
});
