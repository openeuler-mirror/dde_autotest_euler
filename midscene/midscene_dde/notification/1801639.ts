/**
 * 用例 PMSID: 1801639
 * 用例标题: 【通知中心】通知中心通知信息右上角显示时间与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801639-【通知中心】通知中心通知信息右上角显示时间与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 清理残留通知：删除通知数据库并重启 dde-shell，确保通知中心无残留、面板状态干净
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801639-通知中心通知信息右上角显示时间与需求一致', async ({ device, agent, uos, system }) => {
    const dbPath = `${process.env.HOME}/.local/share/deepin/org.deepin.dde-shell/data.db`;

    // 应用元数据：Icon / AppName / AppId（由实际 notify-send 探测得到，确保渲染与真实通知一致）
    const apps = {
      controlCenter: { icon: 'preferences-system', appName: '控制中心', appId: 'org.deepin.dde.control-center' },
      browser: { icon: 'org.deepin.browser', appName: '浏览器', appId: 'org.deepin.browser' },
      terminal: { icon: 'deepin-terminal', appName: '终端', appId: 'deepin-terminal' },
      fileManager: { icon: 'dde-file-manager', appName: '文件管理器', appId: 'dde-file-manager' },
      trash: { icon: 'user-trash', appName: '回收站', appId: 'dde-trash' },
      music: { icon: 'deepin-music', appName: '音乐', appId: 'deepin-music' },
    };

    // 计算各目标时间（epoch 毫秒，字符串）。先算过去的时间，再取当前时间，尽量缩短"刚刚"通知的年龄。
    const weekAgoMs = (await system.exec(`date -d '8 days ago 14:00:00' '+%s'`)).stdout.trim() + '000';
    const threeDaysAgoMs = (await system.exec(`date -d '3 days ago 14:00:00' '+%s'`)).stdout.trim() + '000';
    const yesterdayMs = (await system.exec(`date -d 'yesterday 14:00:00' '+%s'`)).stdout.trim() + '000';
    const twoHoursAgoMs = (await system.exec(`date -d '2 hours ago' '+%s'`)).stdout.trim() + '000';
    const nowMs = (await system.exec(`date '+%s'`)).stdout.trim() + '000';
    const minutesAgoMs = String(Number(nowMs) - 100000); // ~100 秒前 → 分钟前格式
    const justNowMs = nowMs; // 当前时间 → 刚刚格式

    // 待插入通知：app 元数据 + Summary + Body + CTime
    // 通知1: 超过一周，重启 dde-shell 后会被自动清除，故不应在通知中心展示
    const notifications = [
      { ...apps.controlCenter, summary: '通知1', body: '一周前通知内容', ctime: weekAgoMs },
      { ...apps.browser, summary: '通知2', body: '三天前通知内容', ctime: threeDaysAgoMs },
      { ...apps.terminal, summary: '通知3', body: '昨天通知内容', ctime: yesterdayMs },
      { ...apps.fileManager, summary: '通知4', body: '两小时前通知内容', ctime: twoHoursAgoMs },
      { ...apps.trash, summary: '通知5', body: '分钟前格式测试通知', ctime: minutesAgoMs },
      { ...apps.music, summary: '通知6', body: '刚刚格式测试通知', ctime: justNowMs },
    ];

    // 直接写入通知数据库构造历史通知。实测 dde-shell 对系统时间（wall clock）回拨不敏感：
    // 即使 date -s 回拨到过去再 notify-send，通知仍按真实时间记录，导致时间格式校验失败。
    // 因此改为直接以指定 CTime 写库，并重启 dde-shell 加载，时间显示更稳定可靠。
    let insertSql = `DELETE FROM notifications2;`;
    for (const n of notifications) {
      insertSql += `INSERT INTO notifications2 (Icon, Summary, Body, AppName, AppId, CTime, Action, Hint, ReplacesId, NotifyId, Timeout, ProcessedType) VALUES ('${n.icon}', '${n.summary}', '${n.body}', '${n.appName}', '${n.appId}', '${n.ctime}', NULL, 'sender-pid!!!0|urgency!!!u0001|', '0', '0', NULL, 2);`;
    }
    await system.exec(`sqlite3 "${dbPath}" "${insertSql}"`);

    // 重启 dde-shell 重新加载数据库；超过一周的通知（通知1）会被自动清除。
    await system.exec(`systemctl --user restart dde-shell@DDE`);
    await new Promise(r => setTimeout(r, 3000));
    await system.exec(`systemctl --user daemon-reload`);
    await new Promise(r => setTimeout(r, 2000));

    // 确保桌面稳定后打开通知中心
    await uos.showDesktop();
    await new Promise(r => setTimeout(r, 1500));
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 30000 });

    // 按时间敏感度从高到低依次验证：先验证"刚刚"（超过1分钟会变化），再验证"分钟前"，以此类推
    // 检查6: 通知6显示【刚刚】（最优先，超过1分钟会变为"分钟前"）
    await agent.aiAssert("内容为'刚刚格式测试通知'的通知右上角显示'刚刚'字样", { deepThink: true });

    // 检查5: 通知5显示【XX分钟前】
    await agent.aiAssert("内容为'分钟前格式测试通知'的通知右上角显示'分钟前'格式的时间", { deepThink: true });

    // 检查4: 通知4显示【XX小时前】
    await agent.aiAssert("内容为'两小时前通知内容'的通知右上角显示'小时前'格式的时间", { deepThink: true });

    // 检查3: 通知3显示'昨天 XX:XX'或'X天前'格式的时间
    await agent.aiAssert("内容为'昨天通知内容'的通知右上角显示包含'昨天'的时间（如'昨天 XX:XX'）或'X天前'格式", { deepThink: true });

    // 检查2: 通知2显示星期加时间格式（如"周X XX:XX"）或日期格式
    await agent.aiAssert("内容为'三天前通知内容'的通知右上角显示星期加时间格式或日期格式的时间（如'周X'或'X月X日'）", { deepThink: true });

    // 检查1: 超过一周的通知不在通知中心展示（通知1不显示，已被 dde-shell 自动清除）
    const hasNotify1 = await agent.aiBoolean("通知中心存在内容为'一周前通知内容'的通知", { deepThink: true });
    if (hasNotify1) {
      throw new Error("超过一周的通知不应在通知中心显示");
    }

    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  }, { timeout: 600000, tags: ['1801639', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
    await device.releaseAllKeys();
    try {
      await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    } catch (e) { /* 忽略清理阶段的点击失败 */ }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 清理通知：删除通知数据库并重启 dde-shell，彻底清除通知残留
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
