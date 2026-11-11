/**
 * 用例 PMSID: 1963969
 * 用例标题: 【任务栏】【应用区域】驻留应用图标在应用区域内拖动可调整位置
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1963969-【任务栏】【应用区域】驻留应用图标在应用区域内拖动可调整位置', () => {

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 确保音乐应用已驻留在任务栏
    await system.exec(`busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_App_Region' 'deepin-music' 1`);
    await new Promise(r => setTimeout(r, 1000));
    console.log('已确保音乐应用驻留在任务栏');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1963969-【任务栏】【应用区域】驻留应用图标在应用区域内拖动可调整位置', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 步骤 1: 拖动日历应用图标到任务栏最左侧
    console.log('步骤 1: 拖动日历应用图标到任务栏最左侧');
    await agent.aiHover('底部任务栏应用区域中的日历应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const calendarPos = await pcService.mouse.getPosition();
    // 任务栏最右侧区域（启动器图标右侧）
    const leftTargetX = 200;
    console.log(`日历图标坐标: (${calendarPos.x}, ${calendarPos.y}), 目标X: ${leftTargetX}`);

    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));
    const steps = 20;
    const stepX = (leftTargetX - calendarPos.x) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(calendarPos.x + stepX * i), y: calendarPos.y }]);   
      await new Promise(r => setTimeout(r, 25));
    }
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已拖动日历应用图标到最左侧');
    
    // 检查1: 已拖动日历应用图标到最左侧
    await agent.aiAssert('底部任务栏上日历应用图标显示在应用区域的相对最左侧第4个位置');

    // 步骤 2: 拖动日历应用图标到中间位置
    console.log('步骤 2: 拖动日历应用图标到中间位置');
    await agent.aiHover('底部任务栏应用区域中的日历应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const calendarPos2 = await pcService.mouse.getPosition();
    const midTargetX = 600;
    console.log(`日历应用图标坐标: (${calendarPos2.x}, ${calendarPos2.y}), 目标X: ${midTargetX}`);

    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));
    const steps2 = 20;
    const stepX2 = (midTargetX - calendarPos2.x) / steps2;
    for (let i = 1; i <= steps2; i++) {
      await pcService.mouse.move([{ x: Math.round(calendarPos2.x + stepX2 * i), y: calendarPos2.y }]);
      await new Promise(r => setTimeout(r, 25));
    }
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已拖动日历应用图标到中间位置');

    // 检查2: 已拖动日历应用图标到中间位置
    await agent.aiAssert('底部任务栏上日历应用图标显示在应用区域的相对中间的位置,非整个任务栏的中间位置');

    // 步骤 3: 拖动日历应用图标到最右侧
    console.log('步骤 3: 拖动日历应用图标到最右侧');
    await agent.aiHover('底部任务栏应用区域中的日历应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const calendarPos3 = await pcService.mouse.getPosition();
    const rightTargetX = 960;
    console.log(`日历应用图标坐标: (${calendarPos3.x}, ${calendarPos3.y}), 目标X: ${rightTargetX}`);  

    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));
    const steps3 = 20;
    const stepX3 = (rightTargetX - calendarPos3.x) / steps3;
    for (let i = 1; i <= steps3; i++) {
      await pcService.mouse.move([{ x: Math.round(calendarPos3.x + stepX3 * i), y: calendarPos3.y }]);        
      await new Promise(r => setTimeout(r, 25));
    }
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已拖动日历应用图标到最右侧');
    
    // 检查3: 已拖动日历应用图标到最右侧
    await agent.aiAssert('底部任务栏上日历应用图标显示在应用区域的相对最右侧的位置,非最右侧的托盘区域');


    // 步骤 4: 还原拖动日历应用图标到原位置
    console.log('步骤 4: 还原拖动日历应用图标到原位置');  
    await agent.aiHover('底部任务栏应用区域中的日历应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));

    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));
    await pcService.mouse.move(calendarPos.x, calendarPos.y);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已还原拖动日历应用图标到原位置');

  }, { timeout: 300000, tags: ['1963969', 'level2','smoke', 'dock'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
