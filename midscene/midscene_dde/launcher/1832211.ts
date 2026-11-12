/**
 * 用例 PMSID: 1832211
 * 用例标题: 【启动器】【窗口模式】【快捷访问】左侧快捷访问菜单栏图标和tips检查
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 * 注：左侧快捷访问菜单栏图标：计算机→图片→文档→桌面→控制中心(齿轮)→关机(电源)
 *     图片定位参考 1832237：内网图片 URL 必须加 convertHttpImage2Base64 由框架转 base64 提交
 */

describe('1832211-【启动器】【窗口模式】【快捷访问】左侧快捷访问菜单栏图标和tips检查', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  beforeAll(async ({ device }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }
    await device.pressKey('ESC');
  });

  test('1832211-【启动器】【窗口模式】【快捷访问】左侧快捷访问菜单栏图标和tips检查', async ({ device, agent, uos, system }) => {
    console.log('========== 用例执行开始 ==========');

    // 左侧快捷访问菜单的定位锚点：启动器左上角"排序模式"按钮正下方的竖向侧边栏图标列。
    // 严禁把应用网格（如"我的常用"里的应用图标）当成侧边栏图标。
    const SIDE = '启动器窗口左上角"排序模式"按钮正下方的那一列竖向侧边栏快捷访问图标（就是启动器窗口最左侧紧贴左边缘排列的小图标列，正下方紧挨着"排序模式"按钮的图标；注意：绝不能是启动器应用网格"我的常用"里的应用图标，也不是底部系统任务栏）';
    // 工具函数：aiLocate 取图标中心坐标，xdotool 精确移动指针到正中央（不做二次 AI 定位，避免漂移），
    // 等 3s 让 Qt ToolTip（delay 500ms）稳定显示；tooltip 未出现则重新定位重试（最多 4 次）
    const locateCenter = async (locateDesc) => {
      for (let attempt = 1; attempt <= 4; attempt++) {
        let loc = null;
        try {
          loc = await agent.aiLocate(locateDesc, { deepThink: true });
        } catch (e) {
          console.log(`  - 第 ${attempt} 次 aiLocate 定位失败（${e.message}），重试`);
          continue;
        }
        if (loc && loc.rect && loc.rect.width > 0) {
          const cx = Math.round(loc.center ? loc.center[0] : loc.rect.left + loc.rect.width / 2);
          const cy = Math.round(loc.center ? loc.center[1] : loc.rect.top + loc.rect.height / 2);
          return { cx, cy };
        }
        console.log(`  - 第 ${attempt} 次 aiLocate 未返回有效矩形，重试`);
      }
      return null;
    };
    const checkTooltip = async (hoverDesc, tooltipText) => {
      let found = false;
      for (let attempt = 1; attempt <= 4 && !found; attempt++) {
        const pos = await locateCenter(hoverDesc);
        if (!pos) {
          continue;
        }
        console.log(`  - 第 ${attempt} 次定位 ${tooltipText} 图标中心 (${pos.cx}, ${pos.cy})`);
        await system.exec(`xdotool mousemove ${pos.cx} ${pos.cy}`, 3000);
        await new Promise(resolve => setTimeout(resolve, 3000));
        found = await agent.aiBoolean(`启动器窗口"排序模式"按钮正下方的左侧边栏图标上方弹出了悬浮提示（tooltip），提示文字为"${tooltipText}"`);
        if (!found) {
          console.log(`  - 第 ${attempt} 次未检测到"${tooltipText}"的 tooltip，重新定位重试`);
        }
      }
      await agent.aiAssert(`启动器窗口"排序模式"按钮正下方的左侧边栏图标上方弹出的悬浮提示（tooltip）显示"${tooltipText}"`);
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    // ── 第一步：打开启动器 ──
    console.log('[步骤 1/7] 打开启动器（窗口模式）');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已打开，左侧显示快捷访问菜单栏');

    // ── 第二步：依次 hover 左侧快捷访问菜单栏图标，检查 tips ──
    console.log('[步骤 2/7] hover 计算机图标，检查 tips 为"计算机"');
    await checkTooltip(`${SIDE} 中从上往下第 1 个图标（黑色显示器/电脑图形），这是计算机图标`, '计算机');
    console.log('  验证通过：计算机图标 tooltip 为 计算机');

    console.log('[步骤 3/7] hover 图片图标，检查 tips 为"图片"');
    await checkTooltip(`${SIDE} 中从上往下第 2 个图标（相框/图片图形），这是图片图标`, '图片');
    console.log('  验证通过：图片图标 tooltip 为 图片');

    console.log('[步骤 4/7] hover 文档图标，检查 tips 为"文档"');
    await checkTooltip(`${SIDE} 中从上往下第 3 个图标（纸张/文档图形），这是文档图标`, '文档');
    console.log('  验证通过：文档图标 tooltip 为 文档');

    console.log('[步骤 5/7] hover 桌面图标，检查 tips 为"桌面"');
    await checkTooltip(`${SIDE} 中从上往下第 4 个图标（桌面/显示器+箭头图形），这是桌面图标`, '桌面');
    console.log('  验证通过：桌面图标 tooltip 为 桌面');

    console.log('[步骤 6/7] hover 控制中心图标，检查 tips 为"控制中心"');
    await checkTooltip(`${SIDE} 中从上往下第 5 个图标（齿轮形状），这是控制中心图标`, '控制中心');
    console.log('  验证通过：控制中心图标 tooltip 为 控制中心');

    console.log('[步骤 7/7] hover 关机图标，检查 tips 为"关机"，点击进入关机界面');
    await checkTooltip('启动器窗口内部（非底部系统任务栏）底部工具栏中的电源（关机）图标', '关机');
    console.log('  验证通过：关机图标 tooltip 为 关机');

    // ── 点击关机图标（在底部工具栏），进入关机界面 ──
    const powerPos = await locateCenter('启动器窗口内部（非底部系统任务栏）底部工具栏中的电源（关机）图标');
    if (!powerPos) {
      throw new Error('无法定位关机图标（aiLocate 多次失败）');
    }
    console.log(`  - 点击关机图标中心 (${powerPos.cx}, ${powerPos.cy})`);
    await system.exec(`xdotool mousemove ${powerPos.cx} ${powerPos.cy} click 1`, 3000);
    await agent.aiWaitFor('关机界面已显示，包含关机、重启、待机、休眠、锁屏、注销六个选项', { timeoutMs: 15000 });
    await agent.aiAssert('关机界面已显示，包含关机、重启、待机、休眠、锁屏、注销六个选项');
    console.log('  - 已进入关机界面');

    // ── 收尾：ESC 退出关机界面，还原桌面 ──
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
    console.log('  - 已 ESC 退出关机界面并显示桌面');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832211', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
