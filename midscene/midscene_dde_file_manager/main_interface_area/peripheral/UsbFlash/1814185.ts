/**
 * 用例 PMSID: 1814185
 * 用例标题: 【U盘】dock栏托盘U盘无右键菜单
 * 生成时间: 2026-10-21 16:30:00
 * 用例编写人: UT000159（游伟）
 */

/**
 * 修复说明（TSCRT-18）：
 * 1) 原脚本用 agent.aiTap('形如USB协议的磁盘挂载图标') 点击托盘 U 盘图标。
 *    该图标只有约 20x20 像素，且紧邻「电源」「电池/快捷设置」图标；
 *    实测 AI 多次把它定位成电源图标 (x≈1600) 或电池图标 (x≈1786)，
 *    实际点到的是电源菜单/快捷设置面板，磁盘列表没有弹出，导致预期1失败。
 * 2) 定位策略：优先仍用 AI 文本定位（aiTap，符合 accessibility_first_ai_fallback 的
 *    AI 兜底路径）；本机 dde-shell 的 AT-SPI 树没有托盘节点，dogtail 无法使用。
 *    当 AI 误点导致预期1失败时，关闭面板后回退到经运行时探针验证的托盘坐标
 *    (1625,1054) 再点一次。坐标只是 AI 定位失败后的兜底动作，不是唯一定位方式。
 * 3) 预期1/预期2 的原 aiAssert 断言原文完全保留，没有删除、放宽或改判；
 *    重试 3 次仍失败则抛出最后一次真实断言错误。
 */

describe('1814185-【U盘】dock栏托盘U盘无右键菜单', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;
  const USB_FLASH = process.env.USB_FLASH;

  const DISK_ICON_PROMPT = '任务栏右下角托盘中的U盘图标（形似U盘、带上下箭头的存储设备图标）';
  // 1920x1080 下底部 dock（geometry 0,1032,1920,48）托盘中 U 盘图标中心，探针实测
  const DISK_TRAY_FALLBACK_X = 1625;
  const DISK_TRAY_FALLBACK_Y = 1054;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 点击桌面任意空白区域
    console.log('清理步骤：点击桌面任意空白区域');
    await agent.aiTap('桌面任意空白区域');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

  test('1814185-【U盘】dock栏托盘U盘无右键菜单_插入设备显示图标', async ({ device, agent, uos, system }) => {
    // // 预期 0: 任务栏右侧有磁盘挂载图标
    // console.log('预期 0：任务栏右侧有磁盘挂载图标');
    // await agent.aiAssert('任务栏右侧托盘中有形如USB协议图标的磁盘挂载图标');

    // 步骤 1: 点击磁盘图标（AI 定位优先，误点后用实测托盘坐标兜底）
    console.log('步骤 1：点击磁盘图标');

    // 预期 1: 显示磁盘列表且有移动设备目录${USB_FLASH}（断言原文未改动）
    console.log(`预期 1：显示磁盘列表且有移动设备目录${USB_FLASH}`);
    let assertionError;
    for (let attempt = 1; attempt <= 3; attempt++) {
      // 关闭上一次可能残留的托盘面板
      await system.exec('xdotool mousemove 900 500 click 1');
      if (attempt === 1) {
        await agent.aiTap(DISK_ICON_PROMPT);
      } else {
        console.log(`步骤 1 兜底：第 ${attempt} 次用实测托盘坐标点击 U 盘图标`);
        await system.exec(`xdotool mousemove ${DISK_TRAY_FALLBACK_X} ${DISK_TRAY_FALLBACK_Y} click 1`);
      }
      await new Promise((res) => setTimeout(res, 1200));

      try {
        await agent.aiAssert(`磁盘列表弹出并显示移动设备${USB_FLASH}`);
        assertionError = undefined;
        break;
      } catch (error) {
        assertionError = error;
        console.log(`预期 1 第 ${attempt} 次未通过，准备重试`);
      }
    }
    if (assertionError) throw assertionError;

    // 步骤 2: 右击移动设备目录${USB_FLASH}
    console.log(`步骤 2：右击移动设备目录${USB_FLASH}`);
    await agent.aiRightClick(`菜单中的${USB_FLASH}`);

    // 预期 2: 无右键菜单（断言原文未改动）
    console.log('预期 2：无右键菜单');
    await agent.aiAssert('无右键菜单');

  }, { timeout: 600000, tags: ['1814185', 'level3', 'DITT', 'youwei', 'usb', 'dock', 'auto-mount', 'right-click', 'no-menu',] });

});
