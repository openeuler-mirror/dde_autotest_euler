/**
 * 用例 PMSID: 1878033
 * 用例标题: 【通知中心】日历应用触发的通知按钮功能正常响应
 * 生成时间: 2026-09-03 22:30:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1878033-【通知中心】日历应用触发的通知按钮功能正常响应', () => {
  const caseDir = process.env.TESTCASE_DIR;

  // 计算minutes分钟后的HH:MM时间字符串（ES5写法，兼容旧lib目标的tsc语法检查）
  const timeAfterMinutes = (minutes) => {
    const d = new Date(Date.now() + minutes * 60000);
    const pad2 = (n) => ('0' + n).slice(-2);
    return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
  };

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    // 前置条件: 确保 dde-calendar（日历）已安装
    const check = await system.exec('dpkg -l 2>/dev/null | grep dde-calendar');
    if (!check.stdout.includes('dde-calendar')) {
      console.log('安装 dde-calendar...');
      await system.exec(`echo '${passWord}' | sudo -S apt-get install -y dde-calendar 2>&1`, 300000);
    }
    // 清理残留通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878033-【通知中心】日历应用触发的通知按钮功能正常响应', async ({ device, agent, uos, system }) => {
    // 前置: 打开日历应用，创建3个日程（提醒为默认"15分钟前"，开始时间=创建时刻+20分钟，
    // 提醒通知约在创建后5分钟出现，三个日程的提醒先后间隔约1分钟）
    await uos.openApp('日历');
    await agent.aiWaitFor('日历应用窗口已打开', { timeoutMs: 30000 });

    const startTime = timeAfterMinutes(20);
    for (let i = 1; i <= 3; i++) {
      await agent.aiTap('日历应用中新建日程/事件的按钮（加号图标）', { deepThink: true });
      await agent.aiWaitFor('屏幕上出现新建日程的弹窗', { timeoutMs: 15000 });
      await agent.aiTap('新建日程弹窗中的标题输入框（占位文字"新建日程"）', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.typeText(`自动化日程测试${i}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 设置开始时间的时间部分（提醒保持默认"15分钟前"）
      await agent.aiTap('新建日程弹窗中开始时间右侧的时间输入框（显示时:分的输入框，非日期）', { deepThink: true });
      await device.pressKey('ctrl', 'a');
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.typeText(startTime);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('新建日程弹窗右下角的蓝色"保存"按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // 步骤 1: 等待日程1的提醒通知横幅出现，点击通知横幅的功能按钮
    await agent.aiWaitFor('桌面右下角出现包含"自动化日程测试1"的日程提醒通知横幅', { timeoutMs: 480000 });
    // 防止上一轮残留的下拉菜单干扰
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 日历提醒横幅的功能按钮为"关闭"和"稍后提醒"，点击"关闭"验证按钮响应
    await agent.aiTap('标题为"自动化日程测试1"的日程提醒横幅上的"关闭"按钮（不要点击"稍后提醒"）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 按钮功能正常响应，被点击的提醒横幅消失（其余日程提醒错峰出现，不断言其必须存在）
    await agent.aiAssert('屏幕上已经没有包含"自动化日程测试1"的提醒横幅（其余日程的提醒横幅可以继续显示）');

    // 步骤 2: 等待日程2的提醒通知进入通知中心（通知信息是展开状态），点击通知的功能按钮
    await agent.aiWaitFor('桌面右下角出现包含"自动化日程测试2"的日程提醒通知横幅', { timeoutMs: 480000 });
    await new Promise(resolve => setTimeout(resolve, 8000));
    const { openNotificationCenter } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await openNotificationCenter(device, agent);
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 10000 });
    // 展开状态下功能按钮直接展示在通知卡片上
    await agent.aiTap('通知中心中"自动化日程测试2"通知卡片上的"关闭"按钮（不要点击"稍后提醒"）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 点击忽略后通知中心面板可能随之关闭，确保面板打开后再断言
    const centerOpen2 = await agent.aiBoolean('通知中心面板当前是否处于打开状态', { deepThink: true });
    if (!centerOpen2) {
      await openNotificationCenter(device, agent);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 检查: 按钮功能正常响应（点击忽略后测试2从中心消失；测试3的提醒错峰出现，不在此处断言其可见性）
    await agent.aiAssert('通知中心的通知列表中已经没有"自动化日程测试2"的日程提醒通知');

    // 步骤 3: 等待日程3的提醒通知进入通知中心，通知信息是折叠状态时点击通知的功能按钮
    await agent.aiWaitFor('通知中心中出现"自动化日程测试3"的日程提醒通知', { timeoutMs: 480000 });
    // 折叠状态下需要先悬浮通知展示出按钮
    await agent.aiHover('通知中心中标题为"自动化日程测试3"的通知卡片', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('"自动化日程测试3"通知卡片上的"关闭"按钮（不要点击"稍后提醒"）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 同样确保面板打开后再断言
    const centerOpen3 = await agent.aiBoolean('通知中心面板当前是否处于打开状态', { deepThink: true });
    if (!centerOpen3) {
      await openNotificationCenter(device, agent);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // 检查: 按钮功能正常响应
    await agent.aiAssert('通知中心的通知列表中已经没有"自动化日程测试3"的日程提醒通知');
  }, { timeout: 900000, tags: ['1878033', 'level4'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭日历应用窗口（创建的测试日程数据保留在日历中，不影响系统配置）
    await system.exec('killall dde-calendar 2>/dev/null || true');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    await uos.showDesktop();
  });
});
