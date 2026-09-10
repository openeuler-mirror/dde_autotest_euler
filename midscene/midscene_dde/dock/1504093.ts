/**
 * 用例 PMSID: 1504093
 * 用例标题: 【任务栏】【固定区域】最左侧区域-默认插件展示
 * 生成时间: 2026-02-10 17:00:00
 * 用例编写人：UT000224(何权)
 */

describe('1504093-【任务栏】【固定区域】最左侧区域-默认插件展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await device.pressKey('Super', 'D');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1504093-【任务栏】【固定区域】最左侧区域-默认插件展示', async ({ device, agent, uos, system }) => {
    // 测试1: 设置任务栏为经典模式
    console.log('测试1: 设置任务栏为经典模式');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试2: 任务栏最左侧区域，默认图标展示，从左到右依次hover提示
    console.log('测试2: 验证最左侧区域默认图标展示和hover提示');
    
    // 定义图标列表，使用循环方式验证每个图标的hover提示
    const icons = [
      { name: '启动器', description: '任务栏上最左侧启动器图标' },
      { name: 'UOS AI Bar', description: '任务栏上从左侧计数第二个UOS AI Bar图标' },
      { name: '全局搜索', description: '任务栏上从左侧计数第三个全局搜索图标' },
      { name: '多任务视图', description: '任务栏上从左侧计数第四个多任务视图图标' }
    ];
    
    // 循环遍历每个图标，hover并验证提示信息
    for (const icon of icons) {
      await agent.aiHover(icon.description, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`提示文字为${icon.name}`, { cacheable: true });
      await agent.aiDrag(icon.name,'桌面', { deepThink: true });
      await agent.aiAssert(`除任务栏外，桌面没有${icon.name}的图标`);
    }

    // 测试3: 切换到居中模式，验证图标展示
    console.log('测试3: 设置任务栏为居中模式');
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:0');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert(`任务栏位于屏幕底部，最左侧只保留两个图标，其他图标居中。`);
    await agent.aiAssert(`任务栏上最左侧区域，第一个图标为UOS AI Bar图标，第二个图标为全局搜索图标，居中图标区域第一个图标为启动器图标，第二个图标为多任务视图图标。`); 
  }, { timeout: 1200000, tags: ['1504093', 'level2'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复任务栏为经典模式（默认模式）
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1');
  });
});