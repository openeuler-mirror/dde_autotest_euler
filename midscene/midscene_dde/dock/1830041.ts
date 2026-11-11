/**
 * 用例 PMSID: 1830041
 * 用例标题: 【任务栏】【状态】任务栏智能隐藏状态展示
 * 生成时间: 2026-09-21
 * 用例编写人: UT005044(王亮)
 */

describe('1830041-【任务栏】【状态】任务栏智能隐藏状态展示', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1830041-【任务栏】【状态】任务栏智能隐藏状态展示', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 前置: 右键任务栏设置"智能隐藏"
    console.log('前置: 通过右键菜单设置任务栏为智能隐藏');
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiHover('状态');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('智能隐藏');
    await new Promise(r => setTimeout(r, 3000));
    console.log('已设置智能隐藏');

    // 步骤 1: 桌面无窗口时任务栏显示（智能隐藏默认不隐藏）
    console.log('步骤 1: 验证智能隐藏默认不隐藏');
    await pcService.mouse.move([{ x: 960, y: 540 }]);
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('屏幕上显示了任务栏，任务栏可见');
    console.log('步骤1验证完成：任务栏默认显示');

    // 步骤 2: 打开应用窗口（不覆盖任务栏），任务栏保持显示
    console.log('步骤 2: 打开应用窗口靠近任务栏不重叠');
    await system.exec('deepin-terminal &');
    await new Promise(r => setTimeout(r, 3000));
    await pcService.mouse.move([{ x: 960, y: 540 }]);
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('屏幕上显示了任务栏，任务栏可见，终端窗口没有覆盖任务栏');
    console.log('步骤2验证完成：任务栏保持显示');

    // 步骤 3: 用AI agent拖动终端窗口到屏幕底部覆盖任务栏
    console.log('步骤 3: 拖动窗口与任务栏重叠');
    await agent.aiHover('终端窗口的标题栏区域', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const titlePos = await pcService.mouse.getPosition();
    const titleX = titlePos.x;
    const titleY = titlePos.y;
    console.log(`终端标题栏坐标: (${titleX}, ${titleY})`);

    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));
    const targetY = Math.min(titleY + 500, 1050);
    const dragSteps = 25;
    const dragStepY = (targetY - titleY) / dragSteps;
    for (let i = 1; i <= dragSteps; i++) {
      await pcService.mouse.move([{ x: titleX, y: Math.round(titleY + dragStepY * i) }]);
      await new Promise(r => setTimeout(r, 40));
    }
    await new Promise(r => setTimeout(r, 1000));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 5000));
    console.log('已拖动终端窗口向下覆盖任务栏');

    // 验证任务栏已隐藏
    await agent.aiAssert('屏幕底部没有显示任务栏，任务栏已被应用窗口覆盖自动隐藏');
    console.log('步骤3验证完成：任务栏已自动隐藏');

    // 步骤 4: 窗口保持覆盖任务栏，任务栏保持隐藏
    console.log('步骤 4: 窗口持续覆盖任务栏，任务栏保持隐藏');
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('屏幕底部仍然没有显示任务栏，任务栏保持隐藏状态');
    console.log('步骤4验证完成：任务栏保持隐藏');

  }, { timeout: 600000, tags: ['1830041', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await system.exec('killall deepin-terminal 2>/dev/null || true');
    await new Promise(r => setTimeout(r, 1000));
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall deepin-terminal 2>/dev/null || true');
    // 恢复任务栏为一直显示
    const pcService = device.getPCService();
    await pcService.mouse.move([{ x: 960, y: 1079 }]);
    await new Promise(r => setTimeout(r, 2000));
    try {
      await agent.aiRightClick('任务栏空白区域');
      await new Promise(r => setTimeout(r, 1000));
      await agent.aiHover('状态');
      await new Promise(r => setTimeout(r, 500));
      await agent.aiTap('一直显示');
      await new Promise(r => setTimeout(r, 2000));
      console.log('已恢复任务栏为一直显示');
    } catch (e) {
      console.log('恢复任务栏状态失败');
      await system.exec("dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v 'keep-showing'");
      await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null || true');
      await new Promise(r => setTimeout(r, 5000));
    }
    await uos.showDesktop();
  });
});
