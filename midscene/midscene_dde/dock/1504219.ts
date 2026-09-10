/**
 * 用例 PMSID: 1504219
 * 用例标题:【任务栏】【托盘区域】【护眼模式】拖拽护眼模式图标到任务栏 
 * 生成时间: 2025-12-17 11:22:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1504219-【任务栏】【托盘区域】【护眼模式】拖拽护眼模式图标到任务栏', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504219-【任务栏】【托盘区域】【护眼模式】拖拽护眼模式图标到任务栏', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 拖拽【护眼模式】图标到任务栏托盘区域
      await agent.aiAction("拖拽UOS系统控制中心快捷面板内, 护眼模式面板到任务栏托盘区域");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 方案：通过hover托盘区域图标，检测tooltip是否显示"护眼模式"来确认图标存在
      const trayPositions = [
        "任务栏右下角喇叭图标左侧的图标",
        "任务栏右下角喇叭图标左侧第2个图标",
        "任务栏右下角喇叭图标左侧第3个图标",
        "任务栏右下角喇叭图标左侧第4个图标",
        "任务栏右下角喇叭图标左侧第5个图标",
        "任务栏右下角喇叭图标左侧第6个图标"
      ];
      
      let iconFound = false;
      for (let i = 0; i < trayPositions.length; i++) {
        try {
          console.log(`正在hover第${i+1}个托盘图标: ${trayPositions[i]}`);
          // hover图标，等待tooltip显示
          await agent.aiHover(trayPositions[i]);
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 检查tooltip是否显示"护眼模式"
          await agent.aiAssert("屏幕上显示包含'护眼模式'字样的tooltip提示", { timeout: 2000 });
          console.log('检测到护眼模式tooltip，图标确认存在');
          iconFound = true;
          break;
        } catch {
          console.log(`第${i+1}个图标不是护眼模式，继续检测下一个...`);
        }
      }
      
      if (!iconFound) {
        throw new Error('护眼模式图标未成功添加到任务栏托盘区域');
      }
  
    }, { timeout: 1200000, tags: ["1504219", "level1", "smoke"] });
  
    afterEach(async ({ device, agent }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiRightClick("UOS系统控制中心快捷面板内, 护眼模式", { deepThink: true });
      await agent.aiTap("在任务栏上移除", { deepThink: true });
      await agent.aiAssert("任务栏托盘区域不存在护眼模式图标");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });