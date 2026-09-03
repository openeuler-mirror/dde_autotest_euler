/**
 * 用例 PMSID: 1818415
 * 用例标题:【任务栏】【快捷面板】【声音】声音面板设置界面，调节音量，音量同步正常
 * 生成时间: 2025-2-5 20:25:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1818415-【任务栏】【快捷面板】【声音】声音面板设置界面，调节音量，音量同步正常', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1818415-【任务栏】【快捷面板】【声音】声音面板设置界面，调节音量，音量同步正常', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 调节音量到最右侧位置
      await agent.aiAction("UOS系统控制中心快捷面板内，音量调节滑块到音量调节条的最右侧位置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 兜底：未到达100%时用键盘右箭头微调
      for (let i = 0; i < 10; i++) {
        try {
          await agent.aiAssert("音量", "100%", { timeout: 2000 });
          break;
        } catch {
          console.log(`音量未到达100%，第${i+1}次微调...`);
          await device.pressKey("right");
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      // 步骤 3: 点击音量模块右侧的设备按钮
      await agent.aiTap("UOS系统控制中心快捷面板内，音量调节条右端的设备形状功能按钮", { deepThink: true });

      // 检查： 音量调整到100%
      await agent.aiAssert("音量", "100%");
      
      // 步骤 4: 打开控制中心-声音
      await uos.openApp("控制中心", 2000, 20000, true);
      await agent.aiTap("声音", { deepThink: true });

      // 检查： 音量调整到100%
      await agent.aiAssert("音量100%");

    }, { timeout: 1200000, tags: ["1818415", "level3", "laptop"] });
  
    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
      const resetDefaultVolumeLevel = "amixer set Master 50%";
      system.exec(resetDefaultVolumeLevel);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });