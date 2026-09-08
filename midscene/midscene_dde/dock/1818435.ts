/**
 * 用例 PMSID: 1818435
 * 用例标题:【任务栏】【快捷面板】【声音】快捷操作面板界面，调节音量
 * 生成时间: 2025-2-9 14:30:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1818435-【任务栏】【快捷面板】【声音】快捷操作面板界面，调节音量', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1818435-【任务栏】【快捷面板】【声音】快捷操作面板界面，调节音量', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 点击音量调节滑块最左侧位置
      await agent.aiAction("UOS系统控制中心快捷面板内，音量调节滑块到音量调节条的最左侧位置", { deepThink: true });

      // 检查： 调节音量成功
    //   await agent.aiAssert({
    //   prompt: '识别指定图标坐标：输出音量区域中，喇叭音量图标为静音图标',
    //   images: [
    //     {
    //       name: '静音图标',
    //       url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1818431.png',
    //     },
    //   ],
    //   deepThink: true
    // });
      await agent.aiAssert("桌面右下角的音量控制区域，喇叭音量图标为静音图标");
  
    }, { timeout: 1200000, tags: ["1818435", "level3"] });
  
    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
      await agent.aiAction("UOS系统控制中心快捷面板内，拖动音量调节滑块到音量调节条的中间位置", { deepThink: true });
      const resetDefaultVolumeLevel = "amixer set Master 50%";
      system.exec(resetDefaultVolumeLevel);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });