/**
 * 用例 PMSID: 1801695
 * 用例标题: 【通知中心】通知中心标题来展示设置菜单列表后，继续按tab键，焦点进入菜单列表循环
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801695-通知中心标题来展示设置菜单列表后继续按tab键焦点进入菜单列表循环', () => {
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

  test('1801695-通知中心标题来展示设置菜单列表后继续按tab键焦点进入菜单列表循环', async ({ device, agent, uos, system }) => {
    // 前置：发送通知使通知中心有内容展示，确保通知中心面板完整渲染
    await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第1条通知内容" -t 1000`);
    await new Promise(r => setTimeout(r, 400));
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域
    await new Promise(r => setTimeout(r, 12000));

    // 步骤1: 打开通知中心
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

    // 步骤2: 点击标题栏的[设置](更多/三点)按钮，打开设置菜单
    await agent.aiTap("通知中心标题栏右侧的更多按钮(三点图标)", { deepThink: true });
    await new Promise(r => setTimeout(r, 1500));
    // 检查1: 设置菜单已展开，显示"通知设置"选项
    await agent.aiAssert('标题栏下方有下拉菜单展开，显示"通知设置"选项', { deepThink: true });

    // 步骤3: 多次按 tab 键，焦点进入菜单列表循环
    const TAB_WAIT = 1100;
    for (let i = 0; i < 3; i++) {
      await device.pressKey('tab');
      await new Promise(r => setTimeout(r, TAB_WAIT));
    }
    // 检查2: 焦点进入设置菜单循环，菜单中的选项有焦点高亮状态，焦点没有跳出下拉菜单
    await agent.aiAssert('下拉菜单(设置菜单)中的"通知设置"选项有焦点高亮状态(蓝色高亮边框或背景)', { deepThink: true });
    await agent.aiAssert('焦点没有跳出下拉菜单，仍然在设置菜单范围内', { deepThink: true });

    // 收尾：关闭通知中心
    await device.pressKey('Escape');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  }, { timeout: 1200000, tags: ['1801695', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
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
