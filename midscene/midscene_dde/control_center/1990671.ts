/**
 * 用例 PMSID: 1990671
 * 用例标题:【控制中心】【系统】【开发者选项】磐石只读保护开关关闭需要管理员授权认证
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1990671-【控制中心】【系统】【开发者选项】磐石只读保护开关关闭需要管理员授权认证', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1990671-【控制中心】【系统】【开发者选项】磐石只读保护开关关闭需要管理员授权认证', async ({ device, agent, uos, env }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击开发者选项
      await agent.aiAssert("导航栏显示：系统");
      await agent.aiTap("开发者选项", { deepThink: true });
      await agent.aiAssert("导航栏显示：系统 / 开发者选项");
      await agent.aiAssert("右侧区域存在标题项：磐石只读保护，默认开关活动色开启状态");

      //检查1: 关闭磐石只读保护开关需要授权
      await agent.aiTap("点击磐石只读保护项右侧的开关按钮", { deepThink: true }); 
      await agent.aiAssert("弹框中的标题文案：关闭磐石只读保护需认证，下方的账户默认为：uos，密码框有焦点和灰色提示文案：请输入密码，底部存在按钮：取消和确定");

      //步骤 3：输入正确密码授权成功
      await device.typeText(env.testPassword);
      await agent.aiTap("点击确定按钮", { deepThink: true }); 
      await agent.aiAssert("认证成功，弹框不存在");

      //检查2: 开启磐石只读保护开关弹出授权框
      await agent.aiTap("点击磐石只读保护项右侧的开关按钮", { deepThink: true }); 
      await agent.aiAssert("弹框中的标题文案：关闭磐石只读保护需认证，下方的账户默认为：uos，密码框有焦点和灰色提示文案：请输入密码，底部存在按钮：取消和确定");

      //步骤 4：输入正确密码展示     
      await device.typeText(env.testPassword);
      await agent.aiTap("点击确定按钮", { deepThink: true }); 
      await agent.aiAssert("认证成功，弹框不存在");

    }, { timeout: 600000, tags: ["1990671", "level2", "smoke"] });
  
    afterEach(async ({ device, system, env }) => {
      console.log('3. afterEach: 每个测试后的清理');
        //清理环境2，清理polkit 弹窗
        console.log('检查是否存在 polkit 弹窗...');
        const checkResult = await system.exec('pgrep -f polkit-agent-helper-deepin');
        if (checkResult.success && checkResult.stdout.trim() !== '') {
            console.log('检测到 polkit 弹窗进程，准备强杀...');
            await system.exec(`echo ${env.testPassword} | sudo -S pkill -9 -f polkit-agent-helper-deepin`);
            console.log('polkit 弹窗进程已强杀');
        } else {
            console.log('未检测到 polkit 弹窗');
        }
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await system.exec(`killall dde-control-center`);
    });
  });