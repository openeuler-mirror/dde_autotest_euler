
/**
 * 用例 PMSID: 1878397
 * 用例标题: 【控制中心】【系统更新】修改更新设置界面配置项的开关状态，切换模块后查看配置项是否保留上一次修改的状态
 * 生成时间: 2026-03-21 11:15:49
 * 用例编写人: UT001924（李鹤）
 */

describe('1878397-【控制中心】【系统更新】修改更新设置界面配置项的开关状态，切换模块后查看配置项是否保留上一次修改的状态', () => {
  const testConfig = {
    passWord: process.env.TEST_PASSWORD,
    resetCommandList: [
      "busctl --system set-property org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Manager UpdateMode t 5",
      "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater \
      SetDownloadSpeedLimit s '{\"DownloadSpeedLimitEnabled\":false,\"LimitSpeed\":\"1024\"}'",
      "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater \
      SetAutoDownloadUpdates b 0",
      "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater \
      SetUpdateNotify b 1",
      "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Manager SetAutoClean b 1"
    ],
    buttonSwitchList: [
      "下载限速",
      "自动下载",
      "更新提醒",
      "清除软件包缓存",
      "功能更新",
      "安全更新"
    ]
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878397-【控制中心】【系统更新】修改更新设置界面配置项的开关状态，切换模块后查看配置项是否保留上一次修改的状态', async ({ device, agent, uos }) => {
    const openAdvancedSettings = async () => {
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'或'开启更新内容开关'文字可见", {timeoutMs: 40000});
    await agent.aiTap("更新设置", { deepThink: true });
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiAssert("'收起'文字可见");   
    };
    // 打开控制中心并最大化
    await uos.openApp("控制中心");
    // 调用进入更新设置页面并展开高级设置函数
    await openAdvancedSettings();
    // 切换开关状态
    for (const buttonName of testConfig.buttonSwitchList) {
      await agent.aiTap(`${buttonName}右边的开关(开关可能是灰色也可能是蓝色)`, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
    };
    // 切换模块后，再次进入更新设置页面展开高级设置，断言开关状态
    await agent.aiTap("电源管理", { deepThink: true });
    await agent.aiAssert("'通用'文字可见");
    await openAdvancedSettings();
    await agent.aiAssert("功能更新、安全更新、更新提醒、清除软件包缓存四个按钮右边的开关是灰色关闭状态，\
      下载限速开关右边的开关是蓝色开启状态，闲时下载文字可见");
  }, { timeout: 600000, tags: ['1878397', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    for (const cmd of testConfig.resetCommandList) {
      await system.exec(`echo "${testConfig.passWord}" | sudo -S ${cmd}`);
      await new Promise(resolve => setTimeout(resolve, 200));
    };
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
