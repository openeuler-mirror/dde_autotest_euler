/**
 * 用例 PMSID: 1849671
 * 用例标题: 【通知中心】常驻通知信息重启后，不会进入通知中心
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1849671-【通知中心】常驻通知信息重启后，不会进入通知中心', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key super+d');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849671-【通知中心】常驻通知信息重启后，不会进入通知中心', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    await system.exec('xdotool key super+d');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 1: 通过 dbus 接口发送多条常驻通知（expire_timeout=0 表示常驻不消失）
    // 注意: app_icon 传"通知"占位（远端exec层会丢弃空字符串参数，传""会导致参数错位）
    for (let i = 1; i <= 2; i++) {
      await system.exec(`gdbus call --session --dest org.freedesktop.Notifications --object-path /org/freedesktop/Notifications --method org.freedesktop.Notifications.Notify "常驻重启测试应用${i}" 0 "通知" "常驻重启测试${i}" "重启后不应进入通知中心" '["action${i}", "按钮${i}"]' "{}" 0`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor('桌面右下角出现两条通知横幅，标题为"常驻重启测试1"和"常驻重启测试2"', { timeoutMs: 20000 });

    // 步骤 2: 通过 sudo 派发重启（2秒后触发；直接systemctl reboot会被polkit拦截，
    // nohup后台任务会被远端exec层清理，sudo -S方式已验证有效）
    await system.exec(`echo ${passWord} | sudo -S systemctl reboot`);

    // 轮询等待远端服务随重启恢复（约1~3分钟）
    let serviceBack = false;
    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      try {
        await system.exec('echo ok', 8000);
        serviceBack = true;
        console.log(`远端服务已恢复（等待${(i + 1) * 5}秒）`);
        break;
      } catch (e) {
        console.log(`重启中...（已等待${(i + 1) * 5}秒）`);
      }
    }
    if (!serviceBack) {
      throw new Error('重启后远端服务未在300秒内恢复');
    }
    // 服务刚恢复，等待桌面会话就绪
    await new Promise(resolve => setTimeout(resolve, 10000));

    // 步骤 3: 处理登录界面（若未自动登录）并进入桌面
    const isLogin = await agent.aiBoolean('当前屏幕是否为登录界面或锁屏界面（有用户头像和密码输入框）', { deepThink: true });
    if (isLogin) {
      // greeter可能显示用户列表且未聚焦密码框，先尝试点选uos用户头像
      try {
        await agent.aiTap('用户列表中名称为uos的用户头像', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { /* 可能已默认选中并聚焦密码框 */ }
      try {
        await agent.aiTap('登录界面的密码输入框', { deepThink: true });
      } catch (e) { /* 忽略 */ }
      await device.typeAscii(passWord);
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 6000));
      // 首次登录可能弹出欢迎窗口
      const hasWelcome = await agent.aiBoolean('屏幕显示首次登录的欢迎引导窗口', { deepThink: true });
      if (hasWelcome) {
        try { await agent.aiTap('欢迎窗口的关闭按钮', { deepThink: true }); } catch (e) { /* 忽略 */ }
      }
      await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
    }

    // 步骤 4: 打开通知中心，验证常驻通知未进入
    await new Promise(resolve => setTimeout(resolve, 3000));
    const recordCountCmd = 'gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount';
    const r = await system.exec(recordCountCmd);
    const afterCount = parseInt((r.stdout.match(/uint32 (\d+)/) || [])[1] || '0', 10);
    console.log(`重启后通知记录数: ${afterCount}`);

    // 通过远端xdotool发送真正的Super+M组合键打开通知中心（runner键盘注入逐键按下会拆散组合键触发启动器）
    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('屏幕右侧弹出通知中心面板（标题为"通知中心"，显示通知列表或"没有最近的通知"）', { timeoutMs: 10000 });

    // 检查: 常驻通知消失，不会进入通知中心
    if (afterCount > 0) {
      throw new Error(`重启后通知记录未清除: recordCount=${afterCount}，常驻通知进入了通知中心`);
    }
    await agent.aiAssert('通知中心暂驻区域和常驻区域中都没有标题为"常驻重启测试1"或"常驻重启测试2"的通知信息');
  }, { timeout: 900000, tags: ['1849671', 'level3', 'remote'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('xdotool key Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    // 自检恢复: 重启后新会话刚初始化，清理时的restart可能导致dde-shell未完全拉起，
    // 校验通知服务注册状态，未就绪则以当前登录用户身份重新start并等待注册
    const checkService = async () => {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      return r.stdout.includes('uint32');
    };
    for (let i = 0; i < 6; i++) {
      if (await checkService()) {
        console.log('通知服务已就绪');
        break;
      }
      console.log(`通知服务未就绪，第${i + 1}次尝试拉起 dde-shell`);
      await system.exec('systemctl --user start dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 6000));
    }
    await system.exec('xdotool key super+d');
  });
});
