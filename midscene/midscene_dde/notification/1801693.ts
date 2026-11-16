/**
 * 用例 PMSID: 1801693
 * 用例标题: 【通知中心】通知中心键盘tab键将焦点定位到标题栏的【设置】按钮上，敲击键盘回车键，正常响应
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801693-【通知中心】通知中心键盘tab键将焦点定位到标题栏的【设置】按钮上，敲击键盘回车键，正常响应', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801693-【通知中心】通知中心键盘tab键将焦点定位到标题栏的【设置】按钮上，敲击键盘回车键，正常响应', async ({ device, agent, uos, system }) => {
    // 前置数据构造：发送通知，使通知中心有内容展示
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域；用短超时让横幅过期后进入通知中心
    for (let i = 1; i <= 2; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容" -t 1000`);
      await new Promise(r => setTimeout(r, 400));
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域
    await new Promise(r => setTimeout(r, 12000));

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('通知中心界面已显示，通知中心长驻区域有通知信息', { deepThink: true });

    // 显式聚焦通知中心窗口，确保 Qt 键盘焦点就绪，Tab 导航才能生效
    const focusNC = async () => {
      const win = await system.exec(`xdotool search --name 'org.deepin.dde-shell' | head -1`);
      const winId = String(win.stdout || '').trim().split('\n')[0];
      if (winId) {
        await system.exec(`xdotool windowfocus ${winId}`);
        await new Promise(r => setTimeout(r, 600));
      }
    };
    await focusNC();

    // 按 tab 直到焦点定位到标题栏的【设置】(更多/三点)按钮，或达到最大次数
    const TAB_WAIT = 1100;
    const TB_MORE = "通知中心顶部标题栏(显示'通知中心'文字的那一行)的更多(三点)按钮处于键盘焦点状态(蓝色高亮边框或弹出'更多'文字提示)";
    let focused = false;
    for (let i = 0; i < 15; i++) {
      await device.pressKey('tab');
      await new Promise(r => setTimeout(r, TAB_WAIT));
      if (await agent.aiBoolean(TB_MORE, { deepThink: true })) {
        focused = true;
        break;
      }
    }
    // 检查1: 焦点已定位到标题栏的【设置】按钮上
    await agent.aiAssert(TB_MORE, { deepThink: true });

    // 步骤: 敲击键盘回车键，正常响应
    await device.pressKey('Enter');
    await new Promise(r => setTimeout(r, 1500));
    // 检查2: 回车键打开标题栏下方的下拉菜单(设置菜单)，正常响应
    await agent.aiAssert('标题栏下方有下拉菜单展开，显示"通知设置"选项', { deepThink: true });

    // 收尾：关闭通知中心
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  }, { timeout: 1200000, tags: ['1801693', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
