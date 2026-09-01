/**
 * 用例 PMSID: 2004525
 * 用例标题:【任务栏】【固定区域】【UOS AI】UOS AI插件图标左键点击打开应用
 * 生成时间: 2026-05-29 11:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('2004525-【任务栏】【固定区域】【UOS AI】UOS AI插件图标左键点击打开应用', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    async function handleUOSAILogin({ agent, device }) {
      console.log('检查UOS AI账号领取状态...');
      await agent.aiTap("任务栏上最右侧的UOS AI插件图标", { deepThink: true });
      
      try {
        await agent.aiWaitFor("小U同学欢迎弹窗出现", { timeout: 5000 });
        console.log('检测到未领取账号，执行领取流程...');
        await agent.aiTap("小U同学欢迎弹窗上的协议复选框", { deepThink: true });
        await agent.aiWaitFor("小U同学欢迎弹窗上的协议复选框已选中");
        await agent.aiTap("小U同学欢迎弹窗上的领取免费账号按钮", { deepThink: true });
        await agent.aiTap("小U同学领取弹窗上的开始试用按钮", { deepThink: true });
        await device.pressKey("alt", "F4");
        console.log('账号领取完成');
      } catch (error) {
        console.log('用户已领取过账号，跳过领取流程');
      }
    }

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      await handleUOSAILogin({ agent, device });
      await device.pressKey("alt", "F4");
    });

    test('2004525-【任务栏】【固定区域】【UOS AI】UOS AI插件图标左键点击打开应用', async ({ device, agent, uos }) => {
      // 步骤 1: 点击任务栏上UOS AI插件图标
      await agent.aiTap("任务栏上最右侧的UOS AI插件图标", { deepThink: true });
      await agent.aiWaitFor("小U同学应用窗口已显示");

      //检查: 正常打开UOS AI应用窗口
      await agent.aiAssert("小U同学应用窗口已正常打开");

      // 步骤 2: UOS AI应用激活后，再点击任务栏上UOS AI插件图标
      await agent.aiTap("任务栏上最右侧的UOS AI插件图标", { deepThink: true });
      await agent.aiWaitFor("小U同学应用窗口已消失");
      await agent.aiTap("任务栏上最右侧的UOS AI插件图标", { deepThink: true });
      await agent.aiWaitFor("小U同学应用窗口已显示");

      //检查: 正常打开UOS AI应用窗口
      await agent.aiAssert("小U同学应用窗口已正常打开");

    }, { timeout: 1200000, tags: ["2004525", "level3"] });

    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
