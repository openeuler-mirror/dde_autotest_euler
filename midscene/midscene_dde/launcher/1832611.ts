/**
 * 用例 PMSID: 1832611
 * 用例标题: 【启动器】【全屏模式】鼠标点击全屏自由排序页面的应用组文件夹非应用区域，无响应
 * 生成时间: 2026/7/27
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';

describe('1832611-【启动器】【全屏模式】鼠标点击全屏自由排序页面的应用组文件夹非应用区域，无响应', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 通过配置文件设置启动器为全屏模式并重启 dde-shell 使其生效
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${DDE_SHELL_CONFIG_PATH}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832611-【启动器】【全屏模式】鼠标点击全屏自由排序页面的应用组文件夹非应用区域，无响应', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器全屏模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表和底部搜索框', { timeoutMs: 30000 });

    // 步骤2：通过 xdotool 拖拽两个相邻应用图标创建应用组文件夹
    // 使用 aiLocate 获取两个相邻应用图标的中心坐标
    const app1Loc = await agent.aiLocate('启动器中的"音乐"应用图标');
    console.log('音乐应用图标位置:', JSON.stringify(app1Loc));
    const app2Loc = await agent.aiLocate('启动器中的"影院"应用图标');
    console.log('影院应用图标位置:', JSON.stringify(app2Loc));

    const srcX = app1Loc.center[0];
    const srcY = app1Loc.center[1];
    const tgtX = app2Loc.center[0];
    const tgtY = app2Loc.center[1];
    console.log(`拖拽: 从 (${srcX}, ${srcY}) 到 (${tgtX}, ${tgtY})`);

    // 使用 xdotool 执行慢速拖拽（按下 → 停顿 → 慢速移动 → 停顿 → 释放）
    await system.exec(`xdotool mousemove ${srcX} ${srcY}`, 5000);
    await new Promise(resolve => setTimeout(resolve, 300));
    await system.exec(`xdotool mousedown 1`, 5000);
    await new Promise(resolve => setTimeout(resolve, 500));

    // 分步移动到目标位置（慢速拖拽，每步停顿）
    const steps = 10;
    for (let i = 1; i <= steps; i++) {
      const midX = Math.round(srcX + (tgtX - srcX) * i / steps);
      const midY = Math.round(srcY + (tgtY - srcY) * i / steps);
      await system.exec(`xdotool mousemove ${midX} ${midY}`, 5000);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    // 在目标位置停留，触发放置操作
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec(`xdotool mouseup 1`, 5000);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证文件夹是否创建成功
    let folderCreated = await agent.aiBoolean('启动器中出现了一个应用组文件夹图标（文件夹图标通常显示为包含多个应用图标的合集图标）');
    if (!folderCreated) {
      // 重试一次：尝试拖拽"影院"到"音乐"
      console.log('第一次拖拽未创建文件夹，尝试反向拖拽');
      const loc1 = await agent.aiLocate('启动器中的"影院"应用图标');
      const loc2 = await agent.aiLocate('启动器中的"音乐"应用图标');
      const sX = loc1.center[0], sY = loc1.center[1];
      const tX = loc2.center[0], tY = loc2.center[1];

      await system.exec(`xdotool mousemove ${sX} ${sY}`, 5000);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`xdotool mousedown 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 1; i <= steps; i++) {
        const midX = Math.round(sX + (tX - sX) * i / steps);
        const midY = Math.round(sY + (tY - sY) * i / steps);
        await system.exec(`xdotool mousemove ${midX} ${midY}`, 5000);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec(`xdotool mouseup 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 2000));

      folderCreated = await agent.aiBoolean('启动器中出现了一个应用组文件夹图标');
    }

    if (!folderCreated) {
      // 尝试拖拽"计算器"到"日志收集工具"（同行相邻）
      console.log('尝试拖拽"计算器"到"日志收集工具"');
      const loc1 = await agent.aiLocate('启动器中的"计算器"应用图标');
      const loc2 = await agent.aiLocate('启动器中的"日志收集工具"应用图标');
      const sX = loc1.center[0], sY = loc1.center[1];
      const tX = loc2.center[0], tY = loc2.center[1];

      await system.exec(`xdotool mousemove ${sX} ${sY}`, 5000);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`xdotool mousedown 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 1; i <= steps; i++) {
        const midX = Math.round(sX + (tX - sX) * i / steps);
        const midY = Math.round(sY + (tY - sY) * i / steps);
        await system.exec(`xdotool mousemove ${midX} ${midY}`, 5000);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec(`xdotool mouseup 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 2000));

      folderCreated = await agent.aiBoolean('启动器中出现了一个应用组文件夹图标');
    }

    if (!folderCreated) {
      throw new Error('无法通过拖拽创建应用组文件夹，请检查启动器是否支持此功能');
    }
    console.log('已成功创建应用组文件夹');

    // 步骤3：点击文件夹图标展开应用组文件夹
    await agent.aiTap('应用组文件夹图标');
    await agent.aiWaitFor('应用组文件夹已展开，显示其中包含的应用图标', { timeoutMs: 15000 });

    await agent.logScreenshot('点击前-应用组文件夹展开状态', {
      content: '应用组文件夹已展开，显示其中包含的应用图标',
    });

    // 步骤4：按位置动态定位文件夹弹窗中同一行相邻的两个应用图标（不依赖具体应用名），计算它们之间的中点坐标
    const icon1Loc = await agent.aiLocate('应用组文件夹弹窗中第一行最左侧的应用图标');
    console.log('弹窗中第一个应用图标位置:', JSON.stringify(icon1Loc));
    const icon2Loc = await agent.aiLocate('应用组文件夹弹窗中第一行从左数第二个应用图标');
    console.log('弹窗中第二个应用图标位置:', JSON.stringify(icon2Loc));

    // 计算两个图标之间的中点（即弹窗内部的非应用区域）
    const midX = Math.floor((icon1Loc.center[0] + icon2Loc.center[0]) / 2);
    const midY = Math.floor((icon1Loc.center[1] + icon2Loc.center[1]) / 2);
    console.log(`两个图标之间的中点坐标: (${midX}, ${midY})`);

    // 步骤5：记录点击前的窗口列表，用于后续判断是否有新应用启动
    const beforeWindows = await system.exec('wmctrl -l 2>/dev/null || echo "wmctrl not available"');
    const beforeWindowList = (beforeWindows.stdout || '').trim().split('\n').filter(Boolean);
    console.log(`点击前窗口数量: ${beforeWindowList.length}`);

    // 步骤6：使用 xdotool 在两图标中点点击（弹窗内部非应用区域）
    await system.exec(`xdotool mousemove ${midX} ${midY} click 1`, 5000);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：点击非应用区域后，无新应用启动（"无响应"即非应用区域不会启动应用程序）
    const afterWindows = await system.exec('wmctrl -l 2>/dev/null || echo "wmctrl not available"');
    const afterWindowList = (afterWindows.stdout || '').trim().split('\n').filter(Boolean);
    console.log(`点击后窗口数量: ${afterWindowList.length}`);

    // 比较窗口列表，判断是否有新窗口（新应用启动）
    const beforeSet = new Set(beforeWindowList.map(w => w.split(/\s+/).slice(4).join(' ')));
    const newWindows = afterWindowList.filter(w => {
      const title = w.split(/\s+/).slice(4).join(' ');
      return !beforeSet.has(title);
    });

    if (newWindows.length > 0) {
      throw new Error(`点击应用组文件夹非应用区域后启动了新应用: ${newWindows.map(w => w.split(/\s+/).slice(4).join(' ')).join(', ')}`);
    }
    console.log('点击非应用区域后无新应用启动，符合"无响应"预期（非应用区域不会启动应用程序）');

    // 步骤7：清理 - 解散创建的应用组文件夹，恢复启动器原状
    await device.pressKey('ESC'); // 关闭文件夹弹窗
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 通过拖拽文件夹中的应用图标到文件夹外来解散文件夹
    try {
      // 打开文件夹
      await agent.aiTap('应用组文件夹图标');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 获取文件夹中应用图标的位置和文件夹外的空白位置
      const folderIconLoc = await agent.aiLocate('应用组文件夹弹窗中第一行最左侧的应用图标');
      const fix = folderIconLoc.center;

      // 拖拽第一个应用图标到文件夹外的空白区域
      const outsideX = fix[0];
      const outsideY = fix[1] - 200; // 文件夹弹窗上方
      await system.exec(`xdotool mousemove ${fix[0]} ${fix[1]} mousedown 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 1; i <= 10; i++) {
        const mx = Math.round(fix[0] + (outsideX - fix[0]) * i / 10);
        const my = Math.round(fix[1] + (outsideY - fix[1]) * i / 10);
        await system.exec(`xdotool mousemove ${mx} ${my}`, 5000);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`xdotool mouseup 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 拖拽第二个应用图标到文件夹外
      const folderIconLoc2 = await agent.aiLocate('应用组文件夹弹窗中的应用图标');
      const fix2 = folderIconLoc2.center;
      const outsideX2 = fix2[0] + 200;
      const outsideY2 = fix2[1] - 200;
      await system.exec(`xdotool mousemove ${fix2[0]} ${fix2[1]} mousedown 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 1; i <= 10; i++) {
        const mx = Math.round(fix2[0] + (outsideX2 - fix2[0]) * i / 10);
        const my = Math.round(fix2[1] + (outsideY2 - fix2[1]) * i / 10);
        await system.exec(`xdotool mousemove ${mx} ${my}`, 5000);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`xdotool mouseup 1`, 5000);
      await new Promise(resolve => setTimeout(resolve, 1000));

      await device.pressKey('ESC');
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('已尝试解散应用组文件夹');
    } catch (e) {
      console.log('清理文件夹时出现异常:', e.message);
      await device.pressKey('ESC');
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1832611', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ device, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 还原启动器为窗口模式
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
