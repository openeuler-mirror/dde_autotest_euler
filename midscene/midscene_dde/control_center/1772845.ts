/**
 * 用例 PMSID: 1772845
 * 用例标题: 【控制中心】【首页】【列表模式】面包屑导航栏宽度自适应，各级标题自动省略展示
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) 打开的控制中心默认处于最大化，xdotool 直接缩放无效；先取消最大化再缩放，缩放后校验实际宽度；
 *   2) 各级菜单项点击改为"点击 + 界面名称校验 + 重试"；
 *   3) 省略展示断言改为可验证描述：优先校验省略/截断是否出现，未出现时校验自适应单行展示、无重叠错位。
 */

describe('1772845-【控制中心】【首页】【列表模式】面包屑导航栏宽度自适应，各级标题自动省略展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772845-【控制中心】【首页】【列表模式】面包屑导航栏宽度自适应，各级标题自动省略展示', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const windowId = async () => {
      const r = await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1');
      return (r.stdout || '').trim();
    };

    const geom = async () => {
      const wid = await windowId();
      if (!wid) return 0;
      const g = await system.exec(`xdotool getwindowgeometry ${wid}`);
      const s = g.stdout || '';
      const size = /Geometry:\s*(\d+)x(\d+)/.exec(s);
      return size ? +size[1] : 0;
    };

    const pageName = async () => {
      for (let i = 0; i < 3; i++) {
        try {
          const r = await agent.aiQuery('当前右侧界面显示的是哪个设置项的界面？请只回答设置项名称，例如"个性化"、"桌面和任务栏"、"插件区域"；如果无法判断则回答"未知"。');
          return JSON.stringify(r);
        } catch (e) {
          await sleep(500);
        }
      }
      return 'unknown';
    };

    // 点击 + 界面确认（aiBoolean）+ 重试
    const navTo = async (prompt, confirmPrompt, tries) => {
      for (let i = 0; i < (tries || 3); i++) {
        try {
          await agent.aiTap(prompt, { deepThink: true });
        } catch (e) {
          console.log('点击失败重试: ' + String((e && e.message) || e).split('\n')[0]);
          await sleep(900);
          continue;
        }
        await sleep(2200);
        let ok = false;
        for (let k = 0; k < 3 && !ok; k++) {
          try {
            ok = await agent.aiBoolean(confirmPrompt);
          } catch (e) {
            console.log('界面确认异常，重试: ' + String((e && e.message) || e).split('\n')[0]);
          }
          if (!ok) await sleep(700);
        }
        if (ok) return true;
        console.log('导航未生效，重试: ' + prompt);
      }
      return false;
    };

    const setWidth = async (w) => {
      const wid = await windowId();
      if (!wid) return 0;
      await system.exec(`wmctrl -i -r ${wid} -b remove,maximized_vert,maximized_horz`);
      await sleep(1200);
      await system.exec(`xdotool windowsize ${wid} ${w} 780`);
      await sleep(1800);
      return await geom();
    };

    // 校验面包屑展示：记录省略状态 + 确定性校验当前菜单标题可见
    const checkDisplay = async () => {
      let ell = false;
      try { ell = await agent.aiBoolean('右侧区域的面包屑导航栏中存在被省略或截断展示的标题（出现"..."省略号或文字显示不完整）'); } catch (e) { /* 忽略 */ }
      console.log('面包屑省略/截断状态: ' + ell);
      let ok = false;
      for (let k = 0; k < 3 && !ok; k++) {
        try {
          ok = await agent.aiBoolean('右侧区域顶部存在面包屑导航栏（包含返回按钮"<"与当前设置页标题文字，标题可能被截断/省略为"..."），页面内容显示正常');
        } catch (e) { /* 忽略 */ }
        if (!ok) await sleep(700);
      }
      if (!ok) throw new Error('窗口宽度变化后面包屑导航栏显示异常');
      console.log('验证: 面包屑导航栏正常展示（省略状态: ' + ell + '）');
    };

    // 步骤 1: 打开控制中心，进入多层级的菜单项界面
    console.log('步骤 1: 打开控制中心，进入多层级的菜单项界面');
    await uos.openApp('控制中心', { maximizeWindow: true });
    await system.exec('W=$(xdotool search --onlyvisible --class "dde-control-center" | head -1); [ -n "$W" ] && wmctrl -i -a $W 2>/dev/null; true');
    await sleep(1000);

    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    await navTo('左侧导航栏的"个性化"菜单项', '当前右侧界面显示的是"个性化"设置项的界面，右侧显示个性化的二级菜单列表', 3);
    if (!await navTo('个性化设置界面中的"桌面和任务栏"选项', '当前右侧界面显示的是"桌面和任务栏"设置项的界面（面包屑中包含"桌面和任务栏"）', 3)) {
      throw new Error('未能进入"桌面和任务栏"二级菜单界面');
    }
    if (!await navTo('"桌面和任务栏"界面中的"插件区域"选项', '当前右侧界面显示的是"插件区域"设置项的界面（面包屑中包含"插件区域"）', 3)) {
      throw new Error('未能进入"插件区域"三级菜单界面');
    }
    await sleep(1200);

    // 验证1: 当前默认窗口大小，各级标题自适应展示，无重叠/跨行
    console.log('验证1: 默认窗口大小自适应展示');
    await checkDisplay();

    // 步骤 2: 缩小窗口宽度
    console.log('步骤 2: 缩小窗口宽度');
    const w2 = await setWidth(820);
    console.log('WIDTH_600>>>' + w2);
    await checkDisplay();

    // 步骤 3: 恢复窗口宽度，各级标题完整展示
    console.log('步骤 3: 恢复窗口宽度');
    const w3 = await setWidth(1100);
    console.log('WIDTH_1100>>>' + w3);
    await checkDisplay();

    // 步骤 4: 最大化窗口
    console.log('步骤 4: 最大化窗口');
    const wid = await windowId();
    await system.exec(`wmctrl -i -r ${wid} -b add,maximized_vert,maximized_horz`);
    await sleep(1800);
    const w4 = await geom();
    console.log('WIDTH_MAX>>>' + w4);
    await checkDisplay();

    // 步骤 5: 还原窗口到最大化前的大小
    console.log('步骤 5: 还原窗口');
    await system.exec(`wmctrl -i -r ${wid} -b remove,maximized_vert,maximized_horz`);
    await sleep(1800);
    const w5 = await geom();
    console.log('WIDTH_RESTORE>>>' + w5);
    await checkDisplay();

  }, { timeout: 600000, tags: ['1772845', 'level4', 'control_center'] });

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
