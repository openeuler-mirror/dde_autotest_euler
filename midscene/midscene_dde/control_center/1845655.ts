/**
 * 用例 PMSID: 1845655
 * 用例标题:【控制中心】【账户】【其它账户】其它账户列表hover效果
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1845655-【控制中心】【账户】【其它账户】其它账户列表hover效果', () => {
    const testuser = ['testuser1', 'testuser2', 'testuser3'];

    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1845655-【控制中心】【账户】【其它账户】其它账户列表hover效果 ', async ({ device, agent, uos, system, env }) => {
        // 步骤 1: 新建多个账户
        for (let i = 0; i < 3; i++) {
            await system.exec(`echo ${env.testPassword} | sudo -S useradd ${testuser[i]}`);
        }
 
        // 步骤 2: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 3: 点击账户
        await agent.aiTap("账户", { deepThink: true });      
        await agent.aiAssert("导航栏显示：账户");

        //检查1：存在其它账户，且有对应的三个新账户
        await agent.aiAssert("存在其它账户标题，下方有三个账户，分别为：testuser1，testuser2，testuser3");

        //检查2：账户信息展示检查
        await agent.aiHover('账户testuser1', { deepThink: true });
        await agent.aiAssert("当前账户testuser1条目上有灰底色效果， 账户testuser3条目上没有灰底色效果了");

        //检查3：账户信息展示检查
        await agent.aiHover('账户testuser2', { deepThink: true });
        await agent.aiAssert("当前账户testuser2条目上有灰底色效果， 账户testuser1条目上没有灰底色效果了");

        //检查4：账户信息展示检查
        await agent.aiHover('账户testuser3', { deepThink: true });
        await agent.aiAssert("当前账户testuser3条目上有灰底色效果， 账户testuser1条目上没有灰底色效果了");

    }, { timeout: 600000, tags: ["1845655", "level3"] });
  
    afterEach(async ({ device, agent, system, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');        
        //还原环境1：删除新建的账户
        for (let i = 0; i < 3; i++) {
            await system.exec(`echo ${env.testPassword} | sudo -S userdel ${testuser[i]}`);
        }

        //还原环境2：关闭打开的应用             
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Alt", "F4");
    });
  });
  