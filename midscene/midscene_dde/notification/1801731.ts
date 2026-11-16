/**
 * 用例 PMSID: 1801731
 * 用例标题: 【通知中心】设置最大倍率缩放，最小支持分辨率，最大号字体，通知横幅在桌面展示正常，在通知中心展示正常
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801731-【通知中心】设置最大倍率缩放，最小支持分辨率，最大号字体，通知横幅在桌面展示正常，在通知中心展示正常', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';
  let defaultFontSize;
  let primaryOutput;
  let defaultMode;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue, clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    // 记录当前配置，便于用例结束后还原
    defaultFontSize = await getDconfigValue('org.deepin.dde.appearance', 'org.deepin.dde.appearance', 'Font_Size', system);
    // 获取主显示器输出名称和当前模式
    const xrandr = await system.exec('xrandr');
    const lines = xrandr.stdout.split('\n');
    const connected = lines.find(l => / connected /.test(l));
    if (connected) {
      primaryOutput = connected.split(' ')[0];
      const modeMatch = lines.find(l => primaryOutput && l.includes(primaryOutput) && /\*/.test(l));
      const mode = connected.match(/\d+x\d+/);
      defaultMode = modeMatch ? modeMatch.trim().match(/\d+x\d+(?:\.\d+)?/)[0] : (mode ? mode[0] : null);
    }
    console.log(`主显示器: ${primaryOutput}, 默认模式: ${defaultMode}, 默认字体: ${defaultFontSize}`);
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801731-【通知中心】设置最大倍率缩放，最小支持分辨率，最大号字体，通知横幅在桌面展示正常，在通知中心展示正常', async ({ device, agent, uos, system }) => {
    const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
    // 设置最大号字体
    await setDconfigValue('org.deepin.dde.appearance', 'org.deepin.dde.appearance', 'Font_Size', '14', system);
    // 设置最小支持分辨率 1024x768
    if (primaryOutput) {
      await system.exec(`xrandr --output ${primaryOutput} --mode 1024x768`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 关闭可能残留的系统认证弹窗，避免遮挡通知横幅/通知中心
    const { closeSystemAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeSystemAuthDialog(agent);
    // dbus接口模拟发送有按钮通知
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "testappname" 0 "" "最大缩放多行测试" "fewfw fewaf fewa fewa \\n 测试支持链接跳转 \\n 2424 \\n fewfw \\n fewf 统信官网：https://www.uniontech.com 测试测试" '["a1", "按钮1", "a2", "按钮2"]' "{}" 60000`);
    // dbus接口模拟发送无按钮通知
    await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "testappname" 0 "" "最大缩放多行测试" "fewfw fewaf fewa fewa \\n 测试支持链接跳转 \\n 2424 \\n fewfw \\n fewf 统信官网：https://www.uniontech.com 测试测试" '[]' "{}" 60000`);
    await agent.aiWaitFor('桌面右下角出现通知横幅', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 查看通知横幅在桌面展示
    await agent.aiAssert('通知横幅在桌面展示正常，标题一行展示，正文内容正常展示，有按钮和无按钮通知均正常显示');

    // 步骤 2: 打开通知中心查看展示
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiAssert('通知中心展示正常，标题一行展示，正文内容正常展示，有按钮和无按钮通知均正常显示');
  }, { timeout: 600000, tags: ['1801731', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { setDconfigValue, clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    // 还原字体
    if (defaultFontSize) {
      await setDconfigValue('org.deepin.dde.appearance', 'org.deepin.dde.appearance', 'Font_Size', String(defaultFontSize), system);
    } else {
      await setDconfigValue('org.deepin.dde.appearance', 'org.deepin.dde.appearance', 'Font_Size', '10.5', system);
    }
    // 还原分辨率
    if (primaryOutput && defaultMode) {
      await system.exec(`xrandr --output ${primaryOutput} --mode ${defaultMode}`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
