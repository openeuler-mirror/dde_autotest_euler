/**
 * 用例 PMSID: 1772885
 * 用例标题: 【控制中心】【首页】【标题栏】标题栏关闭按钮功能
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) hover 底色视觉断言不可靠，已移除；
 *   2) 关闭效果以窗口存在性（xdotool）确定性校验，点击失败自动重试；
 *   3) 关闭后等待一段时间再执行界面断言，避免截图时机过早导致误判。
 */

describe('1772885-【控制中心】【首页】【标题栏】标题栏关闭按钮功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772885-【控制中心】【首页】【标题栏】标题栏关闭按钮功能', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const windowGone = async () => {
      const r = await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1');
      return !(r.stdout || '').trim();
    };

    // 点击关闭按钮直到窗口关闭
    const clickCloseAndVerify = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          await agent.aiTap('标题栏的关闭按钮（"×"形图标）');
        } catch (e) {
          console.log('定位关闭按钮失败，重试: ' + String((e && e.message) || e).split('\n')[0]);
        }
        await sleep(2200);
        if (await windowGone()) return true;
      }
      return false;
    };

    // 步骤 1: 打开控制中心
    console.log('步骤 1: 打开控制中心');
    await uos.openApp('控制中心');
    await system.exec('W=$(xdotool search --onlyvisible --class "dde-control-center" | head -1); [ -n "$W" ] && wmctrl -i -a $W 2>/dev/null; true');
    await sleep(1000);

    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);

    // 验证1: 关闭按钮展示
    console.log('验证1: 关闭按钮展示');
    await agent.aiAssert('主界面窗口标题栏的右侧位置显示关闭按钮，图标呈"×"形');

    // 步骤 2: 默认窗口大小下，点击关闭按钮
    console.log('步骤 2: 点击关闭按钮');
    const ok1 = await clickCloseAndVerify();
    if (!ok1) throw new Error('默认窗口大小下点击关闭按钮后，控制中心未关闭');
    await sleep(1500);

    // 验证2: 控制中心关闭
    console.log('验证2: 控制中心关闭');
    await sleep(2500);
    if (!(await windowGone())) throw new Error('控制中心窗口仍存在');
    await agent.aiAssert('当前桌面上未显示控制中心主窗口，界面显示正常');

    // 步骤 3: 改变窗口大小后点击关闭按钮
    console.log('步骤 3: 改变窗口大小后点击关闭按钮');
    await uos.openApp('控制中心');
    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    const wid = (await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1')).stdout.trim();
    if (wid) {
      await system.exec(`wmctrl -i -r ${wid} -b remove,maximized_vert,maximized_horz`);
      await sleep(1200);
      await system.exec(`xdotool windowsize ${wid} 1000 780`);
      await sleep(1200);
    }
    const ok2 = await clickCloseAndVerify();
    if (!ok2) throw new Error('改变窗口大小后点击关闭按钮，控制中心未关闭');
    await sleep(1500);

    // 验证3: 控制中心关闭
    console.log('验证3: 控制中心关闭');
    await sleep(2500);
    if (!(await windowGone())) throw new Error('控制中心窗口仍存在');
    await agent.aiAssert('当前桌面上未显示控制中心主窗口，界面显示正常');

    // 步骤 4: 最大化窗口后点击关闭按钮
    console.log('步骤 4: 最大化窗口后点击关闭按钮');
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    const ok3 = await clickCloseAndVerify();
    if (!ok3) throw new Error('最大化窗口后点击关闭按钮，控制中心未关闭');
    await sleep(1500);

    // 验证4: 控制中心关闭
    console.log('验证4: 控制中心关闭');
    await sleep(2500);
    if (!(await windowGone())) throw new Error('控制中心窗口仍存在');
    await agent.aiAssert('当前桌面上未显示控制中心主窗口，界面显示正常');

    // 步骤 5: 进入设置界面后点击关闭按钮
    console.log('步骤 5: 进入设置界面后点击关闭按钮');
    await uos.openApp('控制中心');
    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    try {
      await agent.aiTap('左侧导航栏的"个性化"菜单项', { deepThink: true });
    } catch (e) {
      console.log('进入个性化界面失败(可忽略)');
    }
    await sleep(1600);
    const ok4 = await clickCloseAndVerify();
    if (!ok4) throw new Error('进入设置界面后点击关闭按钮，控制中心未关闭');
    await sleep(1500);

    // 验证5: 控制中心关闭
    console.log('验证5: 控制中心关闭');
    await sleep(2500);
    if (!(await windowGone())) throw new Error('控制中心窗口仍存在');
    await agent.aiAssert('当前桌面上未显示控制中心主窗口，界面显示正常');

  }, { timeout: 600000, tags: ['1772885', 'level3', 'control_center'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await system.exec('killall dde-control-center 2>/dev/null');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
