/**
 * 用例 PMSID: 1506531
 * 用例标题:【控制中心】【首页】控制中心首页打开入口 
 * 生成时间: 2025-12-17 15:54:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1506531-【控制中心】【首页】控制中心首页打开入口', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      await uos.openApp("控制中心", 2000, 20000, true);
      await agent.aiTap("窗口切换窗口大小按钮", { deepThink: true });
      await uos.closeCurrentWindow();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506531-【控制中心】【首页】控制中心首页打开入口', async ({ device, agent, uos }) => {
      // 步骤 1: 打开启动器窗口模式，点击左下角“控制中心”图标
      await uos.openLauncher("");
      await agent.aiTap("左下侧系统设置控制中心图标", { deepThink: true });
      await agent.aiAssert("控制中心系统设置首页窗口界面，默认小窗口，显示正常");
      await uos.closeCurrentWindow(); 
 
      // 步骤 2: 点击任务栏应用区域“控制中心”图标，打开控制中心
      const tapDescriptions = [
        "任务栏上的控制中心图标(齿轮图标)",
        "任务栏上的系统设置图标",
        "任务栏中齿轮形状的设置图标",
        "任务栏上系统设置控制中心图标",
        "任务栏应用区域的控制中心图标"
      ];
      
      let controlCenterOpened = false;
      for (let i = 0; i < tapDescriptions.length; i++) {
        try {
          console.log(`正在尝试点击控制中心图标，描述: ${tapDescriptions[i]}`);
          await agent.aiTap(tapDescriptions[i], { deepThink: true });
          await agent.aiAssert("控制中心系统设置首页窗口界面，默认小窗口，显示正常", { timeout: 5000 });
          controlCenterOpened = true;
          break;
        } catch {
          console.log(`第${i+1}次点击失败，尝试下一种描述...`);
        }
      }
      
      if (!controlCenterOpened) {
        throw new Error('无法点击打开控制中心');
      }
    
    }, { timeout: 1200000, tags: ["1506531", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });