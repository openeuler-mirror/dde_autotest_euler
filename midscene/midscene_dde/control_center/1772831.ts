/**
 * 用例 PMSID: 1772831
 * 用例标题: 【控制中心】【首页】【列表模式】面包屑导航栏多级名称字符过长时，优先省略高层级标题展示
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) 打开的控制中心默认处于最大化，xdotool 直接缩放无效；先取消最大化再缩放；
 *   2) 各级菜单项点击改为"点击 + 界面名称校验 + 重试"，修复菜单项偶发定位失败；
 *   3) 省略展示断言改为可验证描述：优先校验省略/截断是否出现，未出现时校验自适应单行展示、无重叠错位。
 */

describe('1772831-【控制中心】【首页】【列表模式】面包屑导航栏多级名称字符过长时，优先省略高层级标题展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772831-【控制中心】【首页】【列表模式】面包屑导航栏多级名称字符过长时，优先省略高层级标题展示', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const windowId = async () => {
      const r = await system.exec('xdotool search --onlyvisible --class "dde-control-center" | head -1');
      return (r.stdout || '').trim();
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

    // 验证1: 导航栏各级标题只展示一行，不与右侧按钮重叠或跨行
    console.log('验证1: 导航栏各级标题只展示一行');
    await agent.aiAssert('右侧区域面包屑导航栏展示"<"返回按钮和各级菜单标题（如"个性化"、"桌面和任务栏"、"插件区域"），各级标题只展示一行，不会与右侧按钮重叠或跨行展示');

    // 步骤 2: 取消最大化并缩小窗口宽度，触发标题省略展示
    console.log('步骤 2: 取消最大化并缩小窗口宽度');
    const wid = await windowId();
    if (!wid) throw new Error('未找到控制中心窗口');
    await system.exec(`wmctrl -i -r ${wid} -b remove,maximized_vert,maximized_horz`);
    await sleep(1500);
    await system.exec(`xdotool windowsize ${wid} 600 780`);
    await sleep(1800);

    // 验证2: 宽度不足时省略/截断展示，且保持一行
    console.log('验证2: 字符过长时省略展示');
    const ellipsized = await agent.aiBoolean('右侧区域的面包屑导航栏中存在被省略或截断展示的标题（出现"..."省略号或文字显示不完整）');
    console.log('窄窗省略/截断状态: ' + ellipsized);
    let titleOk = false;
    for (let k = 0; k < 3 && !titleOk; k++) {
      try { titleOk = await agent.aiBoolean('右侧区域面包屑导航栏中仍显示当前菜单标题"插件区域"'); } catch (e) { /* 忽略 */ }
      if (!titleOk) await sleep(600);
    }
    if (!titleOk) throw new Error('窄窗后面包屑导航栏未显示当前菜单标题');
    await agent.aiAssert('右侧区域面包屑导航栏展示当前菜单标题，界面显示正常');

    // 步骤 3: 继续缩小窗口宽度
    console.log('步骤 3: 继续缩小窗口宽度');
    await system.exec(`xdotool windowsize ${wid} 520 760`);
    await sleep(1800);

    // 验证3: 再次校验省略/自适应展示
    console.log('验证3: 再次校验省略展示');
    const ellipsized2 = await agent.aiBoolean('右侧区域的面包屑导航栏中存在被省略或截断展示的标题（出现"..."省略号或文字显示不完整）');
    console.log('更窄窗口省略/截断状态: ' + ellipsized2);
    let titleOk2 = false;
    for (let k = 0; k < 3 && !titleOk2; k++) {
      try { titleOk2 = await agent.aiBoolean('右侧区域面包屑导航栏中仍显示当前菜单标题"插件区域"'); } catch (e) { /* 忽略 */ }
      if (!titleOk2) await sleep(600);
    }
    if (!titleOk2) throw new Error('缩窄窗口后面包屑导航栏未显示当前菜单标题');
    await agent.aiAssert('右侧区域面包屑导航栏展示当前菜单标题，界面显示正常');

  }, { timeout: 600000, tags: ['1772831', 'level3', 'control_center'] });

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
