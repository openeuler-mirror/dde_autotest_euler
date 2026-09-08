
/**
 * 用例 PMSID: 1878141
 * 用例标题: 【控制中心】【系统更新】更新设置页面，开启自动下载开关，闲时下载时间修改后切换模块再次查看闲时下载时间，是上一次修改的时间
 * 生成时间: 2026-01-27 20:58:33
 * 用例编写人: UT001924（李鹤）
 */

describe('1878141-【控制中心】【系统更新】更新设置页面，开启自动下载开关，闲时下载时间修改后切换模块再次查看闲时下载时间，是上一次修改的时间', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878141-【控制中心】【系统更新】更新设置页面，开启自动下载开关，闲时下载时间修改后切换模块再次查看闲时下载时间，是上一次修改的时间', async ({ device, agent, uos, system }) => {
    // 定义一个进入系统更新设置页面并展开高级设置的函数方便后面重复调用
    const openAdvancedSettings = async () => {
      await agent.aiWaitFor("'系统更新'文字可见");
      await agent.aiTap("系统更新", { deepThink: true });
      await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
      await agent.aiTap("更新设置", { deepThink: true });
      // 确认进入更新设置页面后，点击高级设置展开控件
      await agent.aiWaitFor("'展开'文字可见");
      await agent.aiTap("'展开'文字", { deepThink: true });
      await agent.aiAssert("'收起'文字可见");   
    };
    // 打开控制中心并最大化
    await uos.openApp("控制中心", { maximizeWindow: true});
    // 调用进入更新设置页面并展开高级设置函数
    await openAdvancedSettings();
    // 打开自动下载开关展示闲时下载选项
    await agent.aiTap("'自动下载'区域开关", { deepThink: true});
    // 命令方式勾选闲时下载并设置时间为默认值
    system.exec("busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s '{\"IdleDownloadEnabled\":true,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'");
    // 确认闲时下载已经勾选
    await agent.aiWaitFor("'闲时下载'文字可见且文字前面的勾选框是勾选状态");
    // 修改闲时下载时间
    await agent.aiTap("'开始时间'输入框右边黑色圆形按钮向上箭头,位置是在黑色圆形上半部分区域", { deepThink: true});
    await agent.aiTap("'结束时间'输入框右边黑色圆形按钮向上箭头,位置是在黑色圆形上半部分区域", { deepThink: true});
    // 等待修改生效
    await agent.aiWaitFor("'开始时间'变为18:00, '结束时间'变为21:00");
    // 切换到其他模块后再次进入更新设置页面展开高级设置页面
    await agent.aiTap("电源管理", { deepThink: true });
    await agent.aiAssert("'通用'文字可见");
    // 调用进入更新设置页面并展开高级设置函数
    await openAdvancedSettings();
    // 断言闲时下载时间是上一次修改的时间
    await agent.aiAssert("'开始时间'是18:00,'结束时间'是21:00");
  }, { timeout: 600000, tags: ['1878141', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复闲时下载默认状态和时间
    system.exec("busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s '{\"IdleDownloadEnabled\":false,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'");
    // 等待修改生效
    await agent.aiWaitFor("'开始时间'变为17:00'");
    // 关闭自动下载开关恢复默认状态
    system.exec("busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetAutoDownloadUpdates b 0");
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
