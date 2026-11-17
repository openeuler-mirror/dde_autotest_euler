/**
 * 用例 PMSID: 1972819
 * 用例标题: 【通知中心】多账户在A账户触发系统级通知，切换到B账户，通知横幅和通知中心展示正常
 * 生成时间: 2026-09-03 20:55:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1972819-【通知中心】多账户在A账户触发系统级通知，切换到B账户，通知横幅和通知中心展示正常', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const testUser = 'uosB1972819';
  const testUserPassword = 'test1234';

  // 工具函数：注销/切换到指定用户并登录
  const switchToUser = async (agent, device, userName, passWord) => {
    await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
    await agent.aiWaitFor('电源管理界面已显示', { timeoutMs: 60000 });
    await agent.aiTap('切换用户按钮', { deepThink: true });
    await agent.aiWaitFor('登录界面已显示', { timeoutMs: 60000 });
    await agent.aiTap(`用户列表中名称为${userName}的用户头像`, { deepThink: true });
    // 用户切换时X会话重建，画面短暂黑屏，轮询等待密码输入框出现后再定位
    let pwdReady = false;
    for (let i = 0; i < 15; i++) {
      try {
        pwdReady = await agent.aiBoolean('登录界面是否已显示密码输入框（当前用户已选中）', { deepThink: true });
      } catch (e) { /* 黑屏期截图异常，继续等待 */ }
      if (pwdReady) break;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    await agent.aiTap('密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 首次登录可能弹出欢迎窗口，尝试关闭
    const hasWelcome = await agent.aiBoolean('屏幕显示首次登录的欢迎引导窗口', { deepThink: true });
    if (hasWelcome) {
      try { await agent.aiTap('欢迎窗口的关闭按钮', { deepThink: true }); } catch (e) { /* 忽略 */ }
    }
    // 新会话初始化期间可能黑屏，轮询等待桌面画面恢复
    for (let i = 0; i < 10; i++) {
      try {
        const desktopOk = await agent.aiBoolean('当前屏幕是否显示正常的桌面画面（有任务栏和壁纸，非黑屏、非锁屏、非登录界面）', { deepThink: true });
        if (desktopOk) break;
      } catch (e) { /* 忽略 */ }
      await new Promise(resolve => setTimeout(resolve, 4000));
    }
    await agent.aiWaitFor('显示桌面', { timeoutMs: 60000 });
  };

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key super+d');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    // 确保网络处于连接状态
    const pwd = env.testPassword || process.env.TEST_PASSWORD || '';
    await system.exec(`echo '${pwd}' | sudo -S nmcli networking on`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1972819-【通知中心】多账户在A账户触发系统级通知，切换到B账户，通知横幅和通知中心展示正常', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    // 前置: 创建B账户
    await system.exec(`echo '${passWord}' | sudo -S useradd -m ${testUser} -s /usr/bin/bash`);
    await system.exec(`echo '${passWord}' | sudo -S su -c 'echo "${testUser}:${testUserPassword}" | chpasswd'`);

    // 通知记录基线（clearNotifications后应为0）
    const recordCountCmd = 'gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount';
    const getRecordCount = async () => {
      const r = await system.exec(recordCountCmd);
      const m = r.stdout.match(/uint32 (\d+)/);
      if (!m) {
        throw new Error(`recordCount查询失败（用户会话可能未登录）: stdout=${r.stdout.trim()} stderr=${r.stderr.trim()}`);
      }
      return parseInt(m[1], 10);
    };
    const baselineCount = await getRecordCount();
    console.log(`通知记录基线: ${baselineCount}`);

    // 步骤 1&2: 模拟A账户的系统级通知
    // 单网卡机器真实断网(nmcli networking off)会切断控制机到远端的控制链路，
    // 改用 notify-send -a 'dde-control-center' 模拟系统通知（通知中心按应用名归组展示）
    await system.exec(`notify-send -a 'dde-control-center' "测试系统级通知" "系统级通知只在当前账户展示" -t 1000`);
    // 等待通知横幅消失进入通知中心
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 确定性证据: 模拟的系统通知已进入A账户通知中心（轮询等待recordCount增加，同应用通知可能合并计数）
    let networkNotifyCount = 0;
    for (let i = 0; i < 6; i++) {
      networkNotifyCount = await getRecordCount();
      if (networkNotifyCount >= baselineCount + 2) break;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    console.log(`A账户通知记录数: ${networkNotifyCount}（基线${baselineCount}）`);
    if (networkNotifyCount <= baselineCount) {
      throw new Error(`系统通知未进入通知中心: recordCount ${baselineCount} -> ${networkNotifyCount}`);
    }

    // 步骤 3: 切换到B账户桌面
    await switchToUser(agent, device, testUser, testUserPassword);

    // 检查: B账户没有A账户的断网和连网通知信息
    // 通过远端xdotool发送真正的Super+M组合键打开通知中心（runner键盘注入逐键按下会拆散组合键触发启动器）
    await system.exec('xdotool key super+m');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 系统级通知只在当前账户的通知中心展示：B账户不应看到A账户的系统级通知
    await agent.aiAssert('右下角面板（标题为"通知中心"）的通知区域中没有标题或内容包含"测试系统级通知"或"系统级通知只在当前账户展示"的系统级通知信息');
  }, { timeout: 900000, tags: ['1972819', 'level3', 'remote'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';

    // 优先恢复网络连接（切回原账户的AI操作依赖网络）
    await system.exec(`echo '${passWord}' | sudo -S nmcli networking on`);
    for (let i = 0; i < 15; i++) {
      const check = await system.exec('nmcli networking connectivity 2>/dev/null');
      if (check.stdout.includes('full')) break;
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // 通过loginctl确定性恢复环境（UI方式切换回原账户在B会话下不可靠）。
    // 顺序至关重要：必须先激活原账户会话（切回桌面），再终止B会话；
    // 若先终止活动中的B会话，seat会整体重置，lightdm重新接管把后台的uos会话一并带走，
    // 导致机器停在登录界面且残留选中uosB（输入uos密码会报密码错误）。
    const findSessionId = async (user) => {
      const r = await system.exec(`loginctl list-sessions --no-legend 2>/dev/null | grep " ${user} " | awk '{print $1}' | head -1`);
      return r.stdout.trim();
    };

    // 步骤1: 激活原账户会话（uos转为前台，B转入后台）
    const uosSid = await findSessionId('uos');
    if (uosSid) {
      await system.exec(`echo '${passWord}' | sudo -S loginctl activate ${uosSid}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`已激活原账户会话: ${uosSid}`);
      // 激活后原会话处于锁屏状态，输入密码解锁
      const locked = await agent.aiBoolean('当前屏幕是否为锁屏界面（有时间、用户头像和密码输入框）', { deepThink: true });
      if (locked) {
        await device.typeAscii(passWord);
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('已自动解锁原账户桌面');
      }
    } else {
      console.log('未找到原账户会话（需在远端手动登录原账户）');
    }

    // 步骤2: 终止后台的B会话（此时uos会话已在前台，seat不会重置到登录界面）
    const bSid = await findSessionId(testUser);
    if (bSid) {
      await system.exec(`echo '${passWord}' | sudo -S loginctl terminate-session ${bSid}`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      console.log(`已终止B账户会话: ${bSid}`);
    }
    await system.exec(`echo '${passWord}' | sudo -S sh -c 'pkill -9 -u ${testUser}; true'`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 删除测试用户（B会话结束后才能删除成功；进程退出需要时间，轮询重试）
    for (let i = 0; i < 5; i++) {
      await system.exec(`echo '${passWord}' | sudo -S sh -c 'pkill -9 -u ${testUser}; true'`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const check = await system.exec(`id ${testUser} 2>/dev/null || true`);
      if (!check.stdout.includes(testUser)) break;
      await system.exec(`echo '${passWord}' | sudo -S userdel -r ${testUser} 2>/dev/null; true`);
    }
    await system.exec(`echo '${passWord}' | sudo -S userdel -r ${testUser} 2>/dev/null; true`);

    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await system.exec('xdotool key super+d');
  });
});
