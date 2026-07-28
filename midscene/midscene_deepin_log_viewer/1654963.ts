/**
 * 用例 PMSID: 1654963
 * 用例标题: 日志收集工具，应用日志“子模块”筛选条件数量与json配置文件中submodules数量一致
 * 生成时间: 2026-04-22
 * 用例编写人: UT006165（李日华）
 */

describe('1654963-日志收集工具，应用日志“子模块”筛选条件数量与json配置文件中submodules数量一致', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1654963-日志收集工具，应用日志“子模块”筛选条件数量与json配置文件中submodules数量一致', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具启动成功串口打开
    await uos.openApp("日志收集工具");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 查看左侧菜单栏有系统日志、内核日志、应用日志，点击应用日志
    await agent.aiAssert("左侧菜单栏有系统日志、内核日志、应用日志");
    await agent.aiTap("应用日志");
    // 步骤 3: 如果弹出查看此日志需要授权的窗口在请输入密码框输入uos12345.,然后点击确定按钮
    var isAuthVisible =await agent.aiBoolean("显示查看此日志需要授权的窗口")
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }
    // 步骤 4: 进入到应用日志管理页面，点击应用筛选项后的下拉框，选择并点击应用商店
    await agent.aiAssert("进入到应用日志管理页面");
    await agent.aiTap("应用筛选项后的下拉框");
    await agent.aiTap("应用商店");

    // 步骤 5: 应用筛选框后显示子模块选项框，点击子模块后的筛选框项后的下拉框，显示全部、deepin-home-appstore-client、deepin-home-appstore-daemon
    await agent.aiAssert("应用筛选框后显示子模块选项框");
    await agent.aiTap("子模块后的筛选框项后的下拉框");
    await agent.aiAssert("显示全部、deepin-home-appstore-client、deepin-home-appstore-daemon");

    // 步骤 6: 查看应用商店日志配置文件：/usr/share/deepin-log-viewer/deepin-log.conf.d/deepin-app-store.json，显示内容
    const checkFileCmd = "cat /usr/share/deepin-log-viewer/deepin-log.conf.d/deepin-app-store.json";
    const fileResult = await system.exec(checkFileCmd);
    console.log('fileResult', fileResult.stdout);
    const fileContent = JSON.parse(fileResult.stdout);
    const expectedContent = {
        "name": "deepin-app-store",
        "submodules": [
            {
                "name": "deepin-home-appstore-client",
                "filter": "com.deepin.app-store.client",
                "exec": "/usr/bin/deepin-home-appstore-client",
                "logType": "file",
                "logPath": "~/.cache/deepin/deepin-app-store/deepin-app-store.log"
            },
            {
                "name": "deepin-home-appstore-daemon",
                "filter": "com.deepin.app-store.system-daemon",
                "exec": "/usr/bin/deepin-home-appstore-daemon",
                "logType": "file",
                "logPath": "/var/log/deepin/deepin-home-appstore-daemon/deepin-home-appstore-daemon.log"
            }
        ],
        "visible": 1,
        "version": "V1.0"
    };
    assertTrue(JSON.stringify(fileContent) === JSON.stringify(expectedContent));

  }, { timeout: 500000, tags: ['1654963', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
