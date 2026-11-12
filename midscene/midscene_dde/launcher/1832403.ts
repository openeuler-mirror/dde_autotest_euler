/**
 * 用例 PMSID: 1832403
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页
 * 生成时间: 2026-09-10
 * 用例编写人: UT005571（王艺桥）
 * 前置条件:
 *   1、UI设计图：https://www.sketch.com/s/2c059c90-2632-4eca-9d04-79b88108da7e
 *   2、存在应用文件夹，应用文件夹内有 2~3 页应用
 * 用例步骤:
 *   1. 打开启动器窗口模式，切换到"自由排序"分类
 *   2. 打开应用文件夹，向下滑动鼠标滚轮 → 预期：向右翻页
 */

describe('1832403-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页', () => {
  // 配置文件路径（备份文件名带用例 ID，避免多个用例共享备份互相污染）
  const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
  const INIT_INI_PATH = '/tmp/item-arrangement-1832403.backup.ini';
  const SETTINGS_INI = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
  const INIT_SETTINGS_PATH = '/tmp/settings-1832403.backup.ini';
  // 记录用例前配置文件是否存在（初始不存在时 afterAll 必须删除而非恢复出一个残留文件）
  let iniExisted = false;
  // 记录用例前分类值（默认应为 1），afterAll 按原值用 -a 方式恢复（实测 -F 恢复不生效）
  let prevCategoryType = '1';

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 前置准备 - 构造 2~3 页应用文件夹、自由排序分类、窗口模式');
    await uos.showDesktop();

    // 备份当前配置（用于 afterAll 恢复）；先探测 ini 是否真实存在，避免初始无 ini 时恢复出残留测试文件
    const iniProbe = await system.exec(`test -f ${INI_PATH} && echo yes || echo no`);
    iniExisted = (iniProbe.stdout || '').trim() === 'yes';
    await system.exec(`rm -f ${INIT_INI_PATH}; [ -f ${INI_PATH} ] && cp -f ${INI_PATH} ${INIT_INI_PATH}; true`);
    await system.exec(`cp -f ${SETTINGS_INI} ${INIT_SETTINGS_PATH} 2>/dev/null`);
    console.log(`前置：配置已备份（item-arrangement.ini 初始${iniExisted ? '存在' : '不存在'}）`);

    // 写 3 页应用文件夹配置（文件夹 ID=1，名称为"系统管理"，含 18 个应用，窗口模式弹窗按 2~3 页展示）
    // 说明：downloader.desktop 在 V25 测试机不存在，替换为 dde-introduction.desktop（欢迎）
    const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=3
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, dde-introduction.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
1\\pageItems\\2=deepin-calculator.desktop, deepin-font-manager.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop, dde-computer.desktop, dde-trash.desktop, dde-printer.desktop, dde-calendar.desktop, uos-service-support.desktop, org.remmina.Remmina.desktop, uos-remote-assistance.desktop, deepin-boot-maker.desktop, deepin-log-viewer.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, deepin-data-transfer.desktop, uos-recovery-gui.desktop, org.deepin.dde.control-center.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-voice-note.desktop, deepin-manual.desktop
MIDSCEOF`;
    const writeResult = await system.exec(writeCmd);
    if (!writeResult.success) {
      throw new Error('写入 3 页应用文件夹配置失败');
    }
    console.log('前置：3 页应用文件夹配置已写入');

    // 设置排序模式为"自由排序"分类（categoryType=2），并记录原值用于恢复
    const ctResult = await system.exec(`dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType`);
    if (ctResult.success && ctResult.stdout.trim()) {
      prevCategoryType = ctResult.stdout.trim().replace(/"/g, '');
    }
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v 2`);
    console.log(`前置：已设置自由排序分类（categoryType=2，原值=${prevCategoryType}）`);

    // 确保启动器为窗口模式（无条件写）
    await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${SETTINGS_INI}`);
    console.log('前置：已写入窗口模式配置');

    // 重启 dde-shell 使所有配置生效（等待时间留足，让任务栏图标加载完成）
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise(resolve => setTimeout(resolve, 8000));
    console.log('前置：dde-shell 服务重启成功，配置已生效');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 清理桌面残留窗口');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

  test('1832403-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】鼠标滚轮操作，向下滑动翻页', async ({ device, agent, uos, system }) => {
    // 步骤 1：打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1：打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器以窗口模式显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 说明：categoryType=2 已由 beforeAll 设置，启动器打开即为"自由排序"分类模式——
    // 实测该模式下无"自由排序"文字入口，系统分类被折叠为应用文件夹（如"系统管理"），
    // 主区域应用直接排列；故断言以"系统管理文件夹存在 + 无分类分组平铺"为自由排序特征
    await agent.aiAssert('启动器窗口模式已显示，处于自由排序分类模式：应用列表中含"系统管理"应用文件夹（分类折叠为文件夹），且应用未按系统分类分组平铺');
    console.log('步骤 1 完成：窗口模式 + 自由排序分类');

    // 步骤 2：打开应用文件夹，向下滑动鼠标滚轮 → 预期：向右翻页
    console.log('步骤 2：打开应用文件夹，向下滑动鼠标滚轮');
    await agent.aiTap('应用列表中的"系统管理"应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor('应用文件夹弹窗已打开，显示文件夹内应用列表，底部有分页指示圆点', { timeoutMs: 15000 });
    // 确认当前在第 1 页（第一个圆点高亮）
    try {
      await agent.aiWaitFor('文件夹底部第一个分页指示圆点为高亮（当前在第1页）', { timeoutMs: 6000 });
      console.log('步骤 2：确认文件夹第 1 页');
    } catch (e) {
      console.log('步骤 2：第 1 页判定未通过（继续滚轮测试，以最终翻页结果为准）');
    }

    // 移动鼠标到文件夹弹窗内（窗口模式文件夹弹窗中心约 (420, 781)，探针验证过的坐标），向下滑动滚轮
    // 注意：实测每 tick 滚动幅度较大（15 tick 会从第1页直接翻到第3页），故每次只滚动少量 tick 翻一页
    await system.exec('xdotool mousemove 420 781');
    await new Promise(resolve => setTimeout(resolve, 400));

    // 预期：向右翻页（向下滑动滚轮后从第1页翻到下一页）
    // 用弹窗内容判据：第1页含"文件管理器/终端/欢迎/安全中心/系统监视器/设备管理器"，
    // 翻页后显示其余应用（压缩/磁盘/扫描仪/录屏/取色器/计算器/字体管理器/画板/文档/文本编辑器/邮箱 等），比圆点高亮判定可靠
    let flipped = false;
    for (let round = 1; round <= 3; round++) {
      for (let i = 0; i < 5; i++) {
        await system.exec('xdotool click 5');
        await new Promise(resolve => setTimeout(resolve, 80));
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
      try {
        await agent.aiWaitFor('文件夹弹窗已向右翻页：当前显示的应用不再是第1页的"文件管理器""终端""欢迎""安全中心""系统监视器""设备管理器"，而是显示其中任意新应用（如"压缩""磁盘""扫描""录屏""取色器""计算器""字体管理器""画板""邮箱"等）', { timeoutMs: 6000 });
        console.log(`步骤 2 完成：向下滑动滚轮已向右翻页（第${round}轮滚动生效）`);
        flipped = true;
        break;
      } catch (e) {
        console.log(`步骤 2：第${round}轮滚动后未判定翻页，继续`);
      }
    }
    if (!flipped) {
      throw new Error('1832403: 向下滑动鼠标滚轮多次后文件夹仍未翻页（未出现新页面内容）');
    }
    await agent.logScreenshot('1832403-向下滚动翻页', { content: '应用文件夹内向下滑动鼠标滚轮后已向右翻页' });

    // 收尾：关闭启动器
    await device.pressKey('ESC');
  }, { timeout: 600000, tags: ['1832403', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, device, system }) => {
    console.log('5. afterAll: 后置清理 - 恢复配置');
    // 恢复"自由排序"分类为用例前的分类值（用 -a 方式写回，实测 -F 恢复不生效）
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v ${prevCategoryType}`);
    console.log(`后置：分类已恢复为 ${prevCategoryType}`);
    // 恢复 item-arrangement.ini 与 settings.ini 备份
    // ini 初始不存在时必须删除测试写入的文件，否则会残留测试布局污染后续用例
    if (iniExisted) {
      await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
      console.log('后置：item-arrangement.ini 已从备份恢复');
    } else {
      await system.exec(`rm -f ${INI_PATH} ${INIT_INI_PATH}`);
      console.log('后置：item-arrangement.ini 初始不存在，已删除测试文件恢复初始环境');
    }
    await system.exec(`cp -f ${INIT_SETTINGS_PATH} ${SETTINGS_INI} 2>/dev/null`);
    console.log('后置：settings.ini 已恢复');
    // 重启 dde-shell 使恢复的配置生效
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise(resolve => setTimeout(resolve, 8000));
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});