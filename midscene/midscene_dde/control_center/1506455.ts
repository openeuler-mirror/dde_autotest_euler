/**
 * 用例 PMSID: 1506455
 * 用例标题: 【控制中心】【账户】修改密码界面检查
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1506455-【控制中心】【账户】修改密码界面检查', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506455-【控制中心】【账户】修改密码界面检查', async ({ device,env, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心", {maximizeWindow: true});
     
      // 步骤 2: 账户
      await agent.aiTap("左侧区域的菜单项：账户", { deepThink: true });
      await agent.aiAssert("导航栏显示：账户，右侧区域中存在标题项：密码");

      // 步骤 3: 点击密码
      await agent.aiTap("右侧区域的标题项：密码", { deepThink: true });
      await agent.aiAssert("导航栏显示：账户 / 密码，右侧区域中存在标题项：修改密码");

      // 步骤 4: 点击修改密码
      await agent.aiTap("右侧区域的标题项：修改密码", { deepThink: true });

      // 检查1: 修改密码界面展示检查
      await agent.aiAssert("弹框的标题：修改密码，各输入项标题从上到下为：当前密码，新密码，重复密码，密码提示，前三项都有灰色文案：必填，右侧都为眼形图标，最后的密码提示项的灰色文案：选填；底部有两个按钮：取消，修改密码");

    }, { timeout: 300000, tags: ["1506455", "level3"] });
  
    afterEach(async ({ device ,agent, uos}) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清理环境1，关闭修改密码弹框
      await agent.aiTap("弹框中的按钮：取消", { deepThink: true });

      // 清理环境2，关闭控制中心
      await device.pressKey("Super", "Down");
      await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ device, uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Alt", "F4");
    });
});