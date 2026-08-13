/**
 * 用例 PMSID: 1990663
 * 用例标题:【控制中心】【系统】【开发者选项】磐石只读保护开关设置项（默认状态）展示
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1990663-【控制中心】【系统】【开发者选项】磐石只读保护开关设置项（默认状态）展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1990663-【控制中心】【系统】【开发者选项】磐石只读保护开关设置项（默认状态）展示', async ({ device, agent, uos, env }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击开发者选项
      await agent.aiAssert("导航栏显示：系统");
      await agent.aiTap("开发者选项", { deepThink: true });
      await agent.aiAssert("导航栏显示：系统 / 开发者选项");

      //检查1: 磐石只读保护开关需要授权
      await agent.aiAssert("右侧区域存在标题项：磐石只读保护，默认开关活动色开启状态，标题下方的说明文案：关闭保护会解锁系统目录，可能导致系统损坏的高风险。");

    }, { timeout: 600000, tags: ["1990663", "level2", "smoke"] });
  
    afterEach(async ({ device, system, env }) => {
      console.log('3. afterEach: 每个测试后的清理');
        //清理环境1，关闭控制中心
        await system.exec(`killall dde-control-center`);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
    });
  });