
/**
 * 用例 PMSID: 1878133
 * 用例标题: 【控制中心】【系统更新】“功能更新”，“安全性更新”，“第三方更新”三种更新配置开关关闭，‘更新提醒’、‘自动下载’、‘闲时下载’置灰不可点击
 * 生成时间: 2026-02-04 08:31:01
 * 用例编写人: UT001924（李鹤）
 */

describe('1878133-【控制中心】【系统更新】“功能更新”，“安全性更新”，“第三方更新”三种更新配置开关关闭，‘更新提醒’、‘自动下载’、‘闲时下载’置灰不可点击', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878133-【控制中心】【系统更新】“功能更新”，“安全性更新”，“第三方更新”三种更新配置开关关闭，‘更新提醒’、‘自动下载’、‘闲时下载’置灰不可点击', async ({ device, agent, uos, system, env }) => {
    // 定义需要使用的变量
    const PASSWD = env.testPassword;
    const disableFeatureAndSecurityUpdateCmd = "busctl --system set-property \
      org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager UpdateMode t 0";
    const enableAutoDownloadUpdatesCmd = "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Updater SetAutoDownloadUpdates b 1";
    const enableIdleDownloadCmd = "busctl --system call org.deepin.dde.Lastore1 \
      /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s \
      '{\"IdleDownloadEnabled\":true,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'"
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 进入更新设置页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'重新检查更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true }); 
    // 通过命令打开自动下载开关和勾选闲时下载保障稳定性
    await system.exec(enableAutoDownloadUpdatesCmd);
    // 设置有一定延迟，需要等待生效后进行下一步设置
    await agent.aiWaitFor("'闲时下载'文字可见", {timeoutMs: 5000, checkIntervalMs: 1000});
    await system.exec(enableIdleDownloadCmd);
    // 设置有一定延迟，需要等待生效后进行下一步设置
    await agent.aiWaitFor("'闲时下载'左边的复选框是勾选状态", {timeoutMs: 5000, checkIntervalMs: 1000});
    // 通过命令关闭功能和安全更新开关保障稳定性
    await system.exec(`echo ${PASSWD} | sudo -S ${disableFeatureAndSecurityUpdateCmd}`);
    await agent.aiWaitFor("功能更新开关变为灰色");
    // 断言更新提醒、自动下载、闲时下载配置项置灰不可点击
    await agent.aiAssert({
      prompt: "‘更新提醒’、‘自动下载’、‘闲时下载’不可点击，闲时下载前面的勾选框还是勾选状态且呈现蓝色，会有颜色很浅的灰色蒙层，展示与参考图一致就是不可点击",
        images: [
        { name: '参考图', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/closeAllUpdateTypes.png' }
        ],
        convertHttpImage2Base64: true,
    });
  }, { timeout: 600000, tags: ['1878133', 'level3'] });

  afterEach(async ({ device, system, agent, env}) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 定义需要使用的变量
    const PASSWD = env.testPassword;
    const enableFeatureAndSecurityUpdateCmd = "busctl --system set-property \
      org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager UpdateMode t 5";
    const resetIdleDownloadCmd = "busctl --system call org.deepin.dde.Lastore1 \
      /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s \
      '{\"IdleDownloadEnabled\":false,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'"
    const resetAutoDownloadUpdatesCmd = "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Updater SetAutoDownloadUpdates b 0";
    // 打开功能和安全更新
    await system.exec(`echo ${PASSWD} | sudo -S ${enableFeatureAndSecurityUpdateCmd}`);
    // 恢复闲时下载默认状态
    await system.exec(resetIdleDownloadCmd);
    // 关闭自动下载开关恢复默认状态
    await system.exec(resetAutoDownloadUpdatesCmd);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});

