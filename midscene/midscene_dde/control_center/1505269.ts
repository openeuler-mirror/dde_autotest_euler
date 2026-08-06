/**
 * 用例 PMSID: 1505269
 * 用例标题:【控制中心】【账户】删除账户
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1505269-【控制中心】【账户】删除账户', () => {
    const testUser = 'testuser1';

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
        await system.exec(`echo ${env.testPassword} | sudo -S useradd ${testUser}`);
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1505269-【控制中心】【账户】删除账户', async ({ device, agent, uos, env, system }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 打开账户
      await agent.aiTap("左侧区域的菜单项：账户", { deepThink: true });
      await agent.aiAssert(`导航栏显示：账户，右侧区域中存在分类标题：其他账户，下方存在账户名：${testUser}`);

      // 步骤 3: 点击新账户下
      await agent.aiTap(`右侧区域的账户名：${testUser}`, { deepThink: true });
      await agent.aiAssert(`导航栏显示：账户 / "${testUser}"，底部左侧存在按钮：删除当前账户，红色字体`);

      // 步骤 4: 删除账户
      await agent.aiTap("删除当前账户", { deepThink: true });
      await agent.aiAssert("弹出确认提示框，文案：您确定要删除此账户吗？，第二行显示复选标题：删除账户目录，默认勾选状态，底部展示2个按钮：取消和删除");
      await agent.aiTap("弹框中的按钮：删除", { deepThink: true });
      await agent.aiAssert(`弹出授权提示框，标题：修改用户数据需要认证，用户名默认选择为：${env.testUsername}，密码框有默认焦点和底色文案：请输入密码，底部展示2个按钮：取消和确定`);
      await device.typeText(`${env.testPassword}`);
      await agent.aiTap("弹框中的按钮：确定", { deepThink: true });

      //检查1：账户界面中不存在新建的账户
      await agent.aiAssert(`界面返回到账户主界面，导航栏显示：账户，右侧区域中不存在账户名：${testUser}`);

      //检查2：相关账户信息也不存在
      const ret1 = await system.exec(`echo ${env.testPassword} | sudo -S cat /etc/passwd 2>/dev/null |grep -c "^${testUser}:"`);
      const ret2 = await system.exec(`echo ${env.testPassword} | sudo -S ls /home 2>/dev/null | grep -c "${testUser}"`);

      // // 过滤账户相关信息结果
      const passwdEmpty = ret1.stdout.trim();
      const homeEmpty = ret2.stdout.trim();
      console.log(`账户清理后的状态信息-passwd文件：${passwdEmpty}"===="home目录：${homeEmpty}`);

      // 删除账户信息返回判断
      if ( passwdEmpty === 0 && homeEmpty === 0) {
        console.log(`✅ 检查通过：账户【${testUser}】已从系统完全删除`);
        await agent.aiAssert(`${passwdEmpty}等于0`);
        await agent.aiAssert(`${homeEmpty}等于0`);
      } else {
        console.log(`❌ 检查失败：账户【${testUser}】删除不彻底`);
        console.log(`/etc/passwd 状态：${Boolean(passwdEmpty) ? '仍存在' : '已删除'}`);
        console.log(`/home 目录状态：${Boolean(homeEmpty) ? '仍存在' : '已删除'}`);
        await agent.aiAssert(`${passwdEmpty}等于0`);
        await agent.aiAssert(`${homeEmpty}等于0`);
      }

    }, { timeout: 600000, tags: ["1505269", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos, system, env }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清理环境1，关闭控制中心
      await device.pressKey("Super", "Down");
      await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ device, uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Alt", "F4");
    });
  });
  