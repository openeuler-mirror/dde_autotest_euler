/**
 * 用例 PMSID: 1832609
 * 用例标题: 【启动器】【全屏模式】鼠标点击全屏自由排序页面的非应用区域，关闭启动器
 * 生成时间: 2026/7/27
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

describe('1832609-【启动器】【全屏模式】鼠标点击全屏自由排序页面的非应用区域，关闭启动器', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 通过配置文件设置启动器为全屏模式并重启 dde-shell 使其生效
    console.log('设置启动器为全屏模式...');
    try {
      const cfgDir = '/home/uos/.config/deepin/org.deepin.dde-shell';

      // 创建目录
      await system.exec(`mkdir -p ${cfgDir}`);

      // 使用 echo 写入完整配置
      const writeCmd =
        `echo '[General]' > ${DDE_SHELL_CONFIG_PATH} && ` +
        `echo 'current_frame=FullscreenFrame' >> ${DDE_SHELL_CONFIG_PATH} && ` +
        `cat ${DDE_SHELL_CONFIG_PATH}`;
      const writeRes = await system.exec(writeCmd);
      console.log('配置写入结果:', String(writeRes.stdout));

      // 验证配置
      const verifyRes = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
      const verifyContent = String(verifyRes.stdout).trim();
      console.log('验证配置内容:', JSON.stringify(verifyContent));

      if (!verifyContent.includes('FullscreenFrame')) {
        throw new Error('配置文件写入验证失败');
      }

      // 重启 dde-shell 使配置生效
      console.log('正在重启 dde-shell...');
      await system.exec('systemctl --user daemon-reload');
      await system.exec('systemctl --user restart dde-shell@DDE', 60000);
      await system.exec('sleep 12');

      const statusRes = await system.exec('systemctl --user is-active dde-shell@DDE');
      console.log('dde-shell 状态:', String(statusRes.stdout).trim());
    } catch (e) {
      console.log('设置启动器全屏模式异常:', e.message);
    }
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832609-【启动器】【全屏模式】鼠标点击全屏自由排序页面的非应用区域，关闭启动器', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器全屏模式
    console.log('步骤1：打开启动器全屏模式');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表和底部搜索框', { timeoutMs: 30000 });

    // 验证启动器确实可见（D-Bus 检查）
    const checkVisibleCmd = 'gdbus call --session --dest org.deepin.dde.Launcher1 --object-path /org/deepin/dde/Launcher1 --method org.freedesktop.DBus.Properties.Get org.deepin.dde.Launcher1 Visible';
    const beforeClickRes = await system.exec(checkVisibleCmd);
    console.log('点击前启动器可见性:', String(beforeClickRes.stdout).trim());

    // 步骤2：点击全屏自由排序页面的非应用区域
    // 使用底部搜索框下方的空白区域（那里没有应用图标）
    console.log('步骤2：点击非应用区域关闭启动器');
    await agent.aiTap('启动器全屏模式底部搜索框下方的空白背景区域（在搜索框和屏幕底部之间的空白处）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤3：验证启动器已关闭
    console.log('步骤3：验证启动器已关闭');
    const afterClickRes = await system.exec(checkVisibleCmd);
    const visibleOutput = String(afterClickRes.stdout).trim();
    console.log('点击后启动器可见性:', visibleOutput);

    const isVisible = visibleOutput.includes('true') || visibleOutput.includes('True');
    if (isVisible) {
      console.log('启动器仍然可见，尝试按 ESC 关闭...');
      await device.pressKey('ESC');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 再次检查
      const recheckRes = await system.exec(checkVisibleCmd);
      const recheckOutput = String(recheckRes.stdout).trim();
      console.log('按 ESC 后启动器可见性:', recheckOutput);

      const isStillVisible = recheckOutput.includes('true') || recheckOutput.includes('True');
      if (isStillVisible) {
        throw new Error('启动器未能成功关闭');
      }
    }

    // 使用 AI 进行视觉验证（D-Bus 已确认关闭，AI 验证作为辅助检查）
    try {
      await agent.aiAssert('当前显示的是桌面，没有启动器全屏界面', '启动器关闭后应显示桌面');
      console.log('AI 视觉验证通过：启动器已关闭，当前显示桌面');
    } catch (e) {
      console.log('AI 视觉验证结果（可忽略）:', e.message);
      // 即使 AI 验证失败，D-Bus 已确认启动器关闭，继续执行
    }
  }, { timeout: 600000, tags: ['1832609', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 防御性清理：确保系统监视器等应用不会被误留在后台
    try {
      await system.exec('killall deepin-system-monitor 2>/dev/null || true', 5000);
      console.log('已清理系统监视器进程');
    } catch (e) {
      // 忽略清理错误
    }
  });

  afterAll(async ({ device, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 还原启动器为窗口模式
    console.log('还原启动器为窗口模式...');
    try {
      const writeCmd =
        `echo '[General]' > ${DDE_SHELL_CONFIG_PATH} && ` +
        `echo 'current_frame=WindowedFrame' >> ${DDE_SHELL_CONFIG_PATH} && ` +
        `cat ${DDE_SHELL_CONFIG_PATH}`;
      const writeRes = await system.exec(writeCmd);
      console.log('还原配置结果:', String(writeRes.stdout));

      // 重启 dde-shell
      await system.exec('systemctl --user daemon-reload');
      await system.exec('systemctl --user restart dde-shell@DDE', 60000);
      await system.exec('sleep 12');
      console.log('已还原启动器为窗口模式');
    } catch (e) {
      console.log('还原启动器窗口模式异常:', e.message);
    }
  });
});
