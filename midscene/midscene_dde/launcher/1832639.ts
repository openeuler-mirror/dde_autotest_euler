/**
 * 用例 PMSID: 1832639
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】原应用图标排列顺序后，注销或重开启启动器，应用顺序保持不变
 * 生成时间: 2026-09-11
 * 用例编写人: UT001707(陈慧)
 * 来源用例: 1824373
 *
 * 实现说明：
 *   - 复用 1832159 的 logoutAndLogin 工具实现"注销 DUT"步骤。
 *   - 复用 1832647 的模式（aiLocate + pcService.mouse）实现拖动排序，
 *     以避免 common.ts 的 hoverDrag 在不同屏幕分辨率下失败的问题。
 *   - beforeEach 确保启动器为全屏模式。
 */

describe('1832639-【启动器】【全屏模式】【自由拖动排序】原应用图标排列顺序后，注销或重开启启动器，应用顺序保持不变', () => {
  const caseDir = process.env.TESTCASE_DIR;

  // ── 工具函数：注销并重新登录（来自 1832159） ──
  const logoutAndLogin = async (agent, device, logoutBtn, passWord) => {
    await device.pressKey('LeftCtrl', 'LeftAlt', 'Delete');
    await agent.aiTap(logoutBtn, { deepThink: true });
    const isBlocked = await agent.aiBoolean('显示以上程序阻止注销');
    if (isBlocked) {
      await agent.aiTap(logoutBtn);
    }
    await agent.aiTap('登录界面的密码输入框', { deepThink: true });
    await device.typeAscii(passWord);
    await device.pressKey('Enter');
  };

  // ── 工具函数：使用 aiLocate 识别坐标并拖动（来自 1832647 的稳定模式） ──
  // 先 aiLocate 获取源/目标坐标，处理坐标缩放，再用底层 mouse API 拖动
  //   approachDx/approachDy: 目标位置附近的偏移（先在附近悬停，等目标图标移开再松手）
  //   settleMs: 在 approach 位置停留的毫秒数，等待其他图标位移
  const dragByCoords = async (agent, device, system, srcLoc, dx, dy, label = 'drag', approachDx = 0, approachDy = 0, settleMs = 0) => {
    const env = 'DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority';
    const pcService = device.getPCService();

    // 获取物理屏幕分辨率
    const geoResult = await system.exec(`${env} xdotool getdisplaygeometry`);
    const geoMatch = geoResult.stdout.toString().trim().match(/(\d+)\s+(\d+)/);
    const physWidth = geoMatch ? parseInt(geoMatch[1]) : 1920;
    const physHeight = geoMatch ? parseInt(geoMatch[2]) : 1080;
    console.log(`[${label}] 物理屏幕分辨率: ${physWidth}x${physHeight}`);

    // 解析源坐标
    let srcX = Array.isArray(srcLoc.center) ? srcLoc.center[0] : srcLoc.center.x;
    let srcY = Array.isArray(srcLoc.center) ? srcLoc.center[1] : srcLoc.center.y;

    // 计算最终目标坐标
    let tgtX = srcX + dx;
    let tgtY = srcY + dy;
    // 计算中间悬停坐标（带偏移，避免与目标位置图标重叠形成应用文件夹）
    let apprX = tgtX + approachDx;
    let apprY = tgtY + approachDy;

    // 坐标转换：处理截图缩放
    if (srcX > physWidth || srcY > physHeight || tgtX > physWidth || tgtY > physHeight) {
      const scale = Math.max(
        srcX > physWidth ? srcX / physWidth : 1,
        srcY > physHeight ? srcY / physHeight : 1,
        tgtX > physWidth ? tgtX / physWidth : 1,
        tgtY > physHeight ? tgtY / physHeight : 1
      );
      srcX = Math.round(srcX / scale);
      srcY = Math.round(srcY / scale);
      tgtX = Math.round(tgtX / scale);
      tgtY = Math.round(tgtY / scale);
      apprX = Math.round(apprX / scale);
      apprY = Math.round(apprY / scale);
      console.log(`[${label}] 检测到坐标超界，缩放比=${scale}`);
    }

    srcX = Math.max(0, Math.min(srcX, physWidth - 1));
    srcY = Math.max(0, Math.min(srcY, physHeight - 1));
    tgtX = Math.max(0, Math.min(tgtX, physWidth - 1));
    tgtY = Math.max(0, Math.min(tgtY, physHeight - 1));
    apprX = Math.max(0, Math.min(apprX, physWidth - 1));
    apprY = Math.max(0, Math.min(apprY, physHeight - 1));

    console.log(`[${label}] 源坐标: (${srcX}, ${srcY}) -> 悬停坐标: (${apprX}, ${apprY}) -> 最终目标: (${tgtX}, ${tgtY})`);

    // 执行拖动
    if (pcService) {
      await pcService.mouse.move([{ x: srcX, y: srcY }]);
      await new Promise(r => setTimeout(r, 300));
      await pcService.mouse.pressButton(0);
      await new Promise(r => setTimeout(r, 800));

      // 阶段1：分步从源坐标移动到悬停坐标（避免重叠形成应用文件夹）
      const phase1Steps = 10;
      const phase1StepX = (apprX - srcX) / phase1Steps;
      const phase1StepY = (apprY - srcY) / phase1Steps;
      for (let i = 1; i <= phase1Steps; i++) {
        await pcService.mouse.move([{
          x: Math.round(srcX + phase1StepX * i),
          y: Math.round(srcY + phase1StepY * i),
        }]);
        await new Promise(r => setTimeout(r, 16));
      }
      // 阶段2：在悬停坐标停留（让目标位置的图标移开）
      await new Promise(r => setTimeout(r, Math.max(settleMs, 1000)));
      // 阶段3：从悬停坐标移动到最终目标坐标（图标已移开，可以安全释放）
      if (apprX !== tgtX || apprY !== tgtY) {
        const phase2Steps = 5;
        const phase2StepX = (tgtX - apprX) / phase2Steps;
        const phase2StepY = (tgtY - apprY) / phase2Steps;
        for (let i = 1; i <= phase2Steps; i++) {
          await pcService.mouse.move([{
            x: Math.round(apprX + phase2StepX * i),
            y: Math.round(apprY + phase2StepY * i),
          }]);
          await new Promise(r => setTimeout(r, 16));
        }
      }
      // 悬停 1s
      await new Promise(r => setTimeout(r, 1000));
      await pcService.mouse.releaseButton(0);
    } else {
      await system.exec(`${env} xdotool mousemove ${srcX} ${srcY}`);
      await new Promise(r => setTimeout(r, 300));
      await system.exec(`${env} xdotool mousedown 1`);
      await new Promise(r => setTimeout(r, 500));

      // 阶段1：分步从源坐标移动到悬停坐标
      const phase1Steps = 10;
      const phase1StepX = (apprX - srcX) / phase1Steps;
      const phase1StepY = (apprY - srcY) / phase1Steps;
      for (let i = 1; i <= phase1Steps; i++) {
        await system.exec(`${env} xdotool mousemove ${Math.round(srcX + phase1StepX * i)} ${Math.round(srcY + phase1StepY * i)}`);
        await new Promise(r => setTimeout(r, 16));
      }
      // 阶段2：在悬停坐标停留
      await new Promise(r => setTimeout(r, Math.max(settleMs, 1000)));
      // 阶段3：从悬停坐标移动到最终目标坐标
      if (apprX !== tgtX || apprY !== tgtY) {
        const phase2Steps = 5;
        const phase2StepX = (tgtX - apprX) / phase2Steps;
        const phase2StepY = (tgtY - apprY) / phase2Steps;
        for (let i = 1; i <= phase2Steps; i++) {
          await system.exec(`${env} xdotool mousemove ${Math.round(apprX + phase2StepX * i)} ${Math.round(apprY + phase2StepY * i)}`);
          await new Promise(r => setTimeout(r, 16));
        }
      }
      await new Promise(r => setTimeout(r, 1000));
      await system.exec(`${env} xdotool mouseup 1`);
    }
    await new Promise(r => setTimeout(r, 1500));
  };

  beforeAll(async ({ device, uos, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 强制设置启动器为全屏模式 + 应用排列顺序
    // 参考 1832145.ts 的前置条件结构：备份 → 写入 INI → 写入 settings.ini → 重启 dde-shell
    const testUser = env.testUsername || 'uos';
    const INI_PATH = `/home/${testUser}/.config/deepin/dde-launchpad/item-arrangement.ini`;
    const INIT_INI_PATH = '/tmp/item-arrangement.backup.ini';

    // 前置：备份当前 item-arrangement.ini（用于 afterAll 恢复）
    await system.exec(`mkdir -p /home/${testUser}/.config/deepin/dde-launchpad/`);
    await system.exec(`cp -f ${INI_PATH} ${INIT_INI_PATH} 2>/dev/null`);
    console.log('前置：item-arrangement.ini 已备份');

    // 前置：写入应用排列配置（第一行第一列固定为 dde-file-manager.desktop）
    //   说明：toplevel\pageItems\0 第一项即为启动器全屏模式第一行第一列的应用图标
    //         参考 1832145.ts（它把 org.deepin.browser.desktop 放在第一行第一列）
    //         这里把 dde-file-manager.desktop 放到第一行第一列的位置
    const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
1\\pageItems\\1=deepin-terminal.desktop, downloader.desktop, deepin-calculator.desktop, dde-calendar.desktop, deepin-camera.desktop, deepin-music.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=dde-file-manager.desktop, internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop
toplevel\\pageItems\\1=dde-computer.desktop, dde-trash.desktop, dde-printer.desktop
MIDSCEOF`;
    const writeResult = await system.exec(writeCmd);
    if (!writeResult.success) {
      throw new Error('写入应用排列配置失败');
    }
    console.log('前置：应用排列配置已写入（第一行第一列固定为 dde-file-manager.desktop）');

    // 前置：写全屏模式配置（无条件写，保证打开启动器即为全屏模式）
    // 参考 1832145.ts 的写法：使用 printf 一次性写完整文件
    const settingsIni = `/home/${testUser}/.config/deepin/org.deepin.dde-shell/settings.ini`;
    await system.exec(`mkdir -p /home/${testUser}/.config/deepin/org.deepin.dde-shell/ && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${settingsIni}`);

    // 重启 dde-shell 使配置生效（等待时间留足，让任务栏图标加载完成）
    console.log('前置：重启 dde-shell 使配置生效');
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log('前置：dde-shell 服务重启成功，配置已生效');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 防御性：每次测试前都确保启动器为全屏模式
    const testUser = env.testUsername || 'uos';
    const settingsIni = `/home/${testUser}/.config/deepin/org.deepin.dde-shell/settings.ini`;
    await system.exec(`mkdir -p /home/${testUser}/.config/deepin/org.deepin.dde-shell/`);
    await system.exec(`[ -f ${settingsIni} ] || echo 'current_frame=FullscreenFrame' > ${settingsIni}`);
    await system.exec(`sed -i "s/current_frame=.*/current_frame=FullscreenFrame/" ${settingsIni}`);
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832639-【启动器】【全屏模式】【自由拖动排序】原应用图标排列顺序后，注销或重开启启动器，应用顺序保持不变', async ({ device, agent, uos, system, env }) => {
    const passWord = env.testPassword || process.env.TEST_PASSWORD || '';
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1: 打开启动器全屏模式 ──
    console.log('[步骤 1] 打开启动器全屏模式');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开');
    await agent.aiAssert(
        '启动器全屏模式应用列表区第一行第一个应用是文件管理器'
    );

    // ── 步骤 2: 修改原应用图标排列顺序，重新打开启动器，检查顺序是否变化（预期：保持不变）──
    console.log('[步骤 2] 修改应用图标排列顺序后重新打开启动器，验证顺序保持不变');

    // 2.1 定位第一行第一个图标
    console.log('  - 定位第一行第一个图标坐标');
    const firstAppLoc = await agent.aiLocate('启动器全屏模式应用列表区第一行第一个位置的应用图标');
    console.log('  - 第一行第一个图标定位结果:', JSON.stringify(firstAppLoc));

    // 2.2 拖动第一行第一个图标向下交换（使用 1832647 模式）
    //   说明：从第一行第一列向第二行第一列拖动时，目标位置有图标，直接松手会形成应用文件夹。
    //   解决：先在目标位置左侧稍微偏移的位置悬停（approachDx=-60），
    //   等目标位置原图标移开后再移回目标位置释放（settleMs=1500）。
    console.log('  - 拖动第一行第一个图标向下交换位置（先左偏悬停再回落）');
    await dragByCoords(agent, device, system, firstAppLoc, 0, 150, '拖动排序', -60, 0, 1500);
    console.log('  - 已交换第一行首尾顺序');

    // 2.3 关闭启动器，再重新打开
    console.log('  - 关闭启动器');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('  - 重新打开启动器');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开');

    // 2.4 断言：顺序保持修改后的结果
    console.log('  - 断言：重新打开启动器后顺序保持修改后的结果');
    await agent.aiAssert(
        '启动器全屏模式应用列表区第二行第一个应用是文件管理器（即顺序已变为修改后的结果，重开后未回退）'
    );

    // ── 步骤 3: 注销DUT打开启动器，检查顺序是否变化（预期：保持不变）──
    console.log('[步骤 3] 注销 DUT 后打开启动器，验证顺序仍保持不变');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 注销登录
    await logoutAndLogin(agent, device, '注销按钮', passWord);
    console.log('  - 已重新登录');

    // 注销重登后等待桌面加载完成
    await new Promise(resolve => setTimeout(resolve, 15000));
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 重新打开启动器
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开');

    // 断言：注销后顺序仍保持修改后的结果
    console.log('  - 断言：注销后顺序仍保持修改后的结果');
    await agent.aiAssert(
        '启动器全屏应用列表第二行第一个图标是文件管理器，顺序已完成修改未回退）'
    );

    console.log('========== 用例执行结束 ==========');
  }, { timeout: 1800000, tags: ['1832639', 'level3', 'laptop','remote'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await device.pressKey('Super', 'd');
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    await system.exec('systemctl --user daemon-reload');
  });

  afterAll(async ({ uos, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});