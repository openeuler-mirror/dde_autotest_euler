/**
 * 用例 PMSID: 1881021
 * 用例标题: 【SMB】密码含特殊字符时访问smb
 * 生成时间: 2026-07-16
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

describe('1881021-【SMB】密码含特殊字符时访问smb', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    
    console.log('前置条件：创建021smb文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/021smb`, 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1881021-【SMB】密码含特殊字符时访问smb', async ({ device, agent, uos, system, env }) => {
    console.log('前置操作：关闭桌面上存在的弹框');
    for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
    
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${ip}`);

    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    // await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击右上角的设置按钮');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    
    console.log('步骤1：点击设置共享密码');
    await agent.aiTap('设置共享密码', { deepThink: true });
    
    console.log('步骤1：输入共享密码uos,,,,!!');
    await agent.aiTap('密码输入框');
    await device.typeText('uos,,,,!!', true);
    
    // const hasConfirmPassword = await agent.aiBoolean('存在确认密码输入框');
    // if (hasConfirmPassword) {
    //   await agent.aiTap('确认密码输入框');
    //   await device.typeText('uos,,,,!!', true);
    // }
    
    
    const hasAuthDialog1 = await agent.aiBoolean('存在鉴权弹框');
    if (hasAuthDialog1) {
      console.log('存在鉴权框，输入当前用户密码');
      await agent.aiTap('密码输入框');
      await device.typeText(env.testPassword, true);
    }

    console.log('步骤2：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤2：检查021smb文件夹是否已共享');
    const hasShareIcon = await agent.aiBoolean('021smb文件夹右下角有共享图标');
    if (!hasShareIcon) {
      console.log('步骤2：右键021smb点击共享文件夹');
      await agent.aiRightClick('021smb');
      await agent.aiTap('共享文件夹');

      console.log('步骤2：点击共享此文件夹');
      await agent.aiTap('共享此文件夹前面的勾选框', { deepThink: true });

      const hasAuthDialog2 = await agent.aiBoolean('存在鉴权弹框');
      if (hasAuthDialog2) {
        console.log('存在鉴权框，输入当前用户密码');
        await agent.aiTap('密码输入框');
        await device.typeText(env.testPassword, true);
      }
      await device.pressKey('esc');
    } else {
      console.log('021smb文件夹已共享，跳过共享操作');
    }

    console.log('步骤4：点击右上角的设置按钮');
    await agent.aiTap('右上角的设置按钮', { deepThink: true });
    
    console.log('步骤4：点击连接到服务器');
    await agent.aiTap('连接到服务器', { deepThink: true });
    
    console.log('步骤4：输入当前机器的IP');
    await agent.aiTap('服务器地址输入框', { deepThink: true });
    await device.typeText(ip, true);
    
    const hasSmbPasswordDialog = await agent.aiBoolean('存在连接smb密码框');
    if (hasSmbPasswordDialog) {
      console.log('存在smb密码框，输入密码uos,,,,!!');
      await agent.aiTap('密码输入框');
      await device.typeText('uos,,,,!!', true);
    }
    
    await agent.aiAssert('smb连接成功');
    console.log('断言通过：smb连接成功');

    console.log('测试完成');

  }, { timeout: 1200000, tags: ['1881021', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    
    await system.cleanupFileManager();
    
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('卸载smb连接');
    const hasSmbIp = await agent.aiBoolean(`侧边栏存在${ip}`);
    if (hasSmbIp) {
      await agent.aiRightClick(`${ip}`);
      try {
        await agent.aiTap('取消记住密码并卸载');
        await agent.aiWaitFor('挂载或卸载文件系统需要授权', 500);
        await device.typeText(env.testPassword, true);
      } catch (error) {
        await agent.aiTap('移除');
      }
    }
    await system.exec("kill -TERM $(pidof dde-file-manager)");      
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/021smb`, 500);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});