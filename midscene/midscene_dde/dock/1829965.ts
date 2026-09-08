/**
 * 用例 PMSID: 1829965
 * 用例标题: 【任务栏】【位置】任务栏右键菜单中，设置位置"下"即时生效
 * 生成时间: 2026-02-06 14:55:00
 * 用例编写人：UT000224(何权)
 */

describe('1829965-【任务栏】【位置】任务栏右键菜单中，设置位置"下"即时生效', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1829965-【任务栏】【位置】任务栏右键菜单中，设置位置"下"即时生效', async ({ device, agent, uos, system }) => {
    // 位置映射表：索引 -> 位置名称
    const positionNames = ["上", "右", "下", "左"];
    
    // 位置提示词映射表：索引 -> AI识别提示词
    const positionPrompts = [
      "顶部任务栏靠近插件区域右侧空白处",
      "右侧任务栏靠近插件区域上方空白处", 
      "底部任务栏靠近插件区域右侧空白处",
      "左侧任务栏靠近插件区域上方空白处"
    ];
    
    // 当前位置索引（假设初始为底部）
    let currentPositionIndex = 2; // 2=下

    // 辅助函数：根据当前位置索引生成右键点击提示词
    function generateRightClickPrompt() {
      const prompt = positionPrompts[currentPositionIndex];
      console.log(`当前任务栏位置: ${positionNames[currentPositionIndex]}, 生成的右键提示词: ${prompt}`);
      return prompt;
    }

    // 辅助函数：设置任务栏位置
    async function setDockPosition(targetPosition) {
      console.log(`设置任务栏位置为: ${targetPosition}`);
      
      // 生成精确的右键点击提示词
      const rightClickPrompt = generateRightClickPrompt();
      
      await agent.aiRightClick(rightClickPrompt);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("位置", { deepThink: true });
      await agent.aiTap(targetPosition, { deepThink: true });
      
      // 更新当前位置索引
      const targetIndex = positionNames.indexOf(targetPosition);
      if (targetIndex !== -1) {
        currentPositionIndex = targetIndex;
      }
    }

    // 辅助函数：验证任务栏位置和菜单状态
    async function verifyDockPosition(expectedPosition) {
      const positionMap = {
        "上": "屏幕顶部",
        "下": "屏幕底部", 
        "左": "屏幕左侧",
        "右": "屏幕右侧"
      };
      
      await agent.aiAssert(`任务栏位置显示到${positionMap[expectedPosition]}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 测试场景列表
    const testScenarios = [
      { name: "测试1: 设置任务栏位置为上", positions: ["上"] },
      { name: "测试2: 设置任务栏位置为下", positions: ["下"] },
      { name: "测试3: 先设置任务栏位置为左，再设置为下", positions: ["左", "下"] },
      { name: "测试4: 先设置任务栏位置为右，再设置为下", positions: ["右", "下"] }
    ];

    // 遍历执行所有测试场景
    for (const scenario of testScenarios) {
      console.log(scenario.name);
      
      // 执行位置设置序列
      for (const position of scenario.positions) {
        await setDockPosition(position);
        await verifyDockPosition(position);
      }
    }

  }, { timeout: 1200000, tags: ['1829965', 'level2', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复任务栏位置为底部
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );
  });
});