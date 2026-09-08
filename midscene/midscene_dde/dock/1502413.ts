/**
 * 用例 PMSID: 1502413
 * 用例标题: 【任务栏】【固定区域】最左侧区域驻留插件全部移除后展示效果
 * 生成时间: 2026-02-11 11:00:00
 * 用例编写人：UT000224(何权)
 */

describe('1502413-【任务栏】【固定区域】最左侧区域驻留插件全部移除后展示效果', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1502413-【任务栏】【固定区域】最左侧区域驻留插件全部移除后展示效果', async ({ device, agent, uos, system }) => {
    // 设置任务栏为经典模式
    await new Promise(resolve => setTimeout(resolve, 2000));   
    await system.exec('dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"DisplayMode" variant:int32:1');
    await new Promise(resolve => setTimeout(resolve, 1000));   
    // 设置任务栏隐藏多任务视图
    await system.exec('dbus-send --session --dest=org.deepin.dde.Dock1 --type=method_call --print-reply /org/deepin/dde/Dock1  org.deepin.dde.Dock1.setItemOnDock string:"multitasking-view" string:"multitasking-view" boolean:false');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isThirdIconNotMultitasking = await agent.aiBoolean('第三个图标hover提示不是多任务视图');
    if (!isThirdIconNotMultitasking) {
        await agent.aiHover("任务栏从左侧计数第四个图标", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert('第四个图标hover提示不是多任务视图');
    }
    await system.exec('dbus-send --session --dest=org.deepin.dde.Dock1 --type=method_call --print-reply /org/deepin/dde/Dock1  org.deepin.dde.Dock1.setItemOnDock string:"multitasking-view" string:"multitasking-view" boolean:true');
    await agent.aiHover("任务栏从左侧计数第三个图标", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    const isThirdIconMultitasking = await agent.aiBoolean('第三个图标hover提示是多任务视图');

    if (!isThirdIconMultitasking) {
        await agent.aiHover("任务栏从左侧计数第四个图标", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert('第四个图标hover提示是多任务视图');
    }
  }, { timeout: 600000, tags: ['1502413', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复多任务视图显示
    await system.exec('dbus-send --session --dest=org.deepin.dde.Dock1 --type=method_call --print-reply /org/deepin/dde/Dock1  org.deepin.dde.Dock1.setItemOnDock string:"multitasking-view" string:"multitasking-view" boolean:true');
  });
});