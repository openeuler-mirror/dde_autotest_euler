/**
 * 用例 PMSID: 1832847
 * 用例标题:【任务栏】【应用区域】hover未打开应用的图标，即时展示tooltips
 * 生成时间: 2026-1-20 13:30:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1832847-【任务栏】【应用区域】hover未打开应用的图标，即时展示tooltips', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1832847-【任务栏】【应用区域】hover未打开应用的图标，即时展示tooltips', async ({ device, agent, uos }) => {
      // 步骤 1: hover到文件管理器
      await agent.aiHover("任务栏处的文件管理器");
      await agent.aiAssert("文件管理器");

      // 步骤 2： hover到控制中心上
      const hoverDescriptions = [
        "任务栏窗口应用区域的控制中心图标",
        "任务栏上的控制中心图标",
        "任务栏应用区域的齿轮图标",
        "任务栏中的系统设置图标",
        "任务栏上的系统设置控制中心图标"
      ];
      
      let controlCenterHovered = false;
      for (let i = 0; i < hoverDescriptions.length; i++) {
        try {
          console.log(`正在尝试hover控制中心图标，描述: ${hoverDescriptions[i]}`);
          await agent.aiHover(hoverDescriptions[i]);
          await new Promise(resolve => setTimeout(resolve, 500));
          await agent.aiAssert("控制中心", { timeout: 3000 });
          controlCenterHovered = true;
          break;
        } catch {
          console.log(`第${i+1}次hover失败，尝试下一种描述...`);
        }
      }
      
      if (!controlCenterHovered) {
        throw new Error('无法hover到控制中心图标');
      }

      // 步骤 3： hover到日历
      await agent.aiHover("任务栏处的日历");
      await agent.aiAssert("日历");
  
    }, { timeout: 1200000, tags: ["1832847", "level3"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
