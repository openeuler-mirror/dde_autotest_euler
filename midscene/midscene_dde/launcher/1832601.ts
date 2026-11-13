/**
 * 用例 PMSID: 1832601
 * 用例标题: 【启动器】【全屏模式】【遮挡弹窗】唤出剪贴板，打开启动器全屏模式，剪贴板弹窗被遮挡
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832601-【启动器】【全屏模式】【遮挡弹窗】唤出剪贴板，打开启动器全屏模式，剪贴板弹窗被遮挡', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 通过配置文件设置启动器为全屏模式并重启 dde-shell
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已设置启动器为全屏模式');

    // 预置剪贴板内容，确保剪贴板有记录可唤出
    await system.exec(`systemctl --user restart dde-clipboard`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 通过 xdotool 复制一段文本到剪贴板
    await system.exec(`echo "1832601剪贴板测试" | xclip -selection clipboard`);
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832601-【启动器】【全屏模式】【遮挡弹窗】唤出剪贴板，打开启动器全屏模式，剪贴板弹窗被遮挡', async ({ device, agent, uos, system }) => {
    // 步骤1：点击快捷键 ctrl+alt+v 唤出剪贴板
    console.log('步骤1：快捷键 Ctrl+Alt+V 唤出剪贴板');
    // 注：系统默认剪贴板快捷键为 Super+V（Meta+V），用例文档记为 Ctrl+Alt+V
    // 优先通过 D-Bus Toggle 接口唤出剪贴板（最可靠），再使用快捷键兜底
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Toggle 2>/dev/null || true`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    let hasClipboard = await agent.aiBoolean('屏幕显示了剪贴板弹窗，包含剪贴板记录列表');
    if (!hasClipboard) {
      // 兜底：使用快捷键 Super+V
      console.log('D-Bus 未唤出剪贴板，使用快捷键 Super+V');
      await device.pressKey('Super', 'V');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await agent.aiWaitFor('剪贴板弹窗已显示，包含剪贴板记录列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查：剪贴板已唤出
    await agent.aiAssert('剪贴板弹窗已显示，包含剪贴板记录列表');

    // 步骤2：打开启动器全屏模式
    console.log('步骤2：打开启动器全屏模式');
    await device.pressKey('Super');
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：剪贴板弹窗被遮挡
    await agent.aiAssert('启动器全屏模式覆盖整个屏幕，界面显示了应用图标网格列表，启动器全屏模式遮挡了剪贴板弹窗（剪贴板弹窗被启动器覆盖，不在启动器之上显示）');
  }, { timeout: 600000, tags: ['1832601', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
    // 重启剪贴板服务恢复状态
    system.exec(`systemctl --user restart dde-clipboard`);
    // 还原启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
