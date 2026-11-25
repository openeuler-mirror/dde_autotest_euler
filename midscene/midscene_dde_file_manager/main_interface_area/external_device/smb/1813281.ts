/**
 * 用例 PMSID: 1813281
 * 用例标题: 【SMB】共享不同权限文件夹
 * 生成时间: 2026-07-28
 * 用例编写人：UT000686(李双双)
 */

// @ts-nocheck
require("dotenv/config");

/**
 * 公共函数：开启共享文件夹
 * 点击共享文件夹后，若弹框中无"共享此文件"，则点击"共享管理"，否则直接点击"共享此文件"前面的勾选框
 * @param agent - 代理对象
 */
async function enableShareFolder(agent, device, env) {
  console.log('开启共享文件夹：检查弹框中是否有共享此文件');
  const hasShareFile = await agent.aiBoolean('共享此文件');
  if (hasShareFile) {
    console.log('弹框中无共享此文件，点击共享管理');
    await agent.aiTap("共享管理");
    await agent.aiTap("共享此文件前面的勾选框");
  } else {
    console.log('弹框中有共享此文件，直接点击勾选框');
    await agent.aiTap("共享此文件前面的勾选框");
  }

  console.log('检查是否存在用户鉴权弹框');
  const hasAuth = await agent.aiBoolean('存在鉴权弹框或需要认证文本');
  if (hasAuth) {
    console.log('检测到鉴权弹框，输入用户密码');
    await device.typeText(env.testPassword, true);
    await agent.aiTap('确定');
  }
}

describe('1813281-【SMB】共享不同权限文件夹', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    console.log('前置条件：清理文档目录下的测试文件夹');
    const folders = ['2810smb', '2811smb', '2812smb', '2813smb', '2814smb', '2815smb', '2816smb'];
    for (const folder of folders) {
      await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${folder}`, 500);
    }
    
    console.log('前置条件：创建不同权限的文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2810smb && chmod 000 /home/${process.env.TEST_USERNAME}/Documents/2810smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2811smb && chmod 111 /home/${process.env.TEST_USERNAME}/Documents/2811smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2812smb && chmod 222 /home/${process.env.TEST_USERNAME}/Documents/2812smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2813smb && chmod 333 /home/${process.env.TEST_USERNAME}/Documents/2813smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2814smb && chmod 444 /home/${process.env.TEST_USERNAME}/Documents/2814smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2815smb && chmod 544 /home/${process.env.TEST_USERNAME}/Documents/2815smb`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/2816smb && chmod 775 /home/${process.env.TEST_USERNAME}/Documents/2816smb`, 500);
    
    console.log('前置条件：清理文件管理器');
    await system.cleanupFileManager();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813281-【SMB】共享不同权限文件夹', async ({ device, agent, uos, system, env }) => {
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

    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 3000, 20000, true);
    
    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤1：点击右上角的主菜单');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    
    console.log('步骤1：点击设置共享密码');
    await agent.aiTap('共享密码');
    
    console.log('步骤1：输入密码123');
    await agent.aiTap('密码输入框');
    await device.typeText('123');
    await device.pressKey('Enter');
    
    console.log('步骤1：检查是否存在用户鉴权框');
    const hasAuth1 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth1) {
      console.log('检测到用户鉴权弹框，输入当前账户密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    } else {
      console.log('未检测到用户鉴权弹框');
    }
    
    console.log('步骤2：2810smb右键');
    await agent.aiRightClick('2810smb');
    
    await agent.aiAssert('右键弹框无共享文件夹');
    
    console.log('关闭右键弹框');
    await device.pressKey('Esc');
    
    console.log('步骤3：2811smb右键');
    await agent.aiRightClick('2811smb');
    
    await agent.aiAssert('右键弹框无共享文件夹');
    
    console.log('关闭右键弹框');
    await device.pressKey('Esc');
    
    console.log('步骤4：2812smb右键');
    await agent.aiRightClick('2812smb');
    
     await agent.aiAssert('右键弹框无共享文件夹');
    
    console.log('关闭右键弹框');
    await device.pressKey('Esc');
    
    console.log('步骤5：2813smb右键');
    await agent.aiRightClick('2813smb');
    
    await agent.aiAssert('右键弹框无共享文件夹');
    
    console.log('关闭右键弹框');
    await device.pressKey('Esc');
    
    console.log('步骤6：2814smb右键');
    await agent.aiRightClick('2814smb');
    
    console.log('步骤6：点击共享文件夹');
    await agent.aiTap('共享文件夹');
    
    console.log('步骤6：勾选共享此文件夹');
    await enableShareFolder(agent, device, env);
    
    console.log('步骤6：检查是否存在用户鉴权框');
    const hasAuth6 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth6) {
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    
    console.log('步骤6：关闭共享设置窗口');
    await device.pressKey('Esc');
    
    console.log('步骤7：2815smb右键');
    await agent.aiRightClick('2815smb');
    
    console.log('步骤7：点击共享文件夹');
    await agent.aiTap('共享文件夹');
    
    console.log('步骤7：勾选共享此文件夹');
    await enableShareFolder(agent, device, env);
    
    console.log('步骤7：检查是否存在用户鉴权框');
    const hasAuth7 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth7) {
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    }
    
    console.log('步骤7：关闭共享设置窗口');
    await device.pressKey('Esc');
    
    console.log('步骤8：2816smb右键');
    await agent.aiRightClick('2816smb');
    
    console.log('步骤8：点击共享文件夹');
    await agent.aiTap('共享文件夹');
    
    console.log('步骤8：勾选共享此文件夹');
    await enableShareFolder(agent, device, env);
    
    console.log('步骤8：检查是否存在用户鉴权框');
    const hasAuth8 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth8) {
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    }
    
    console.log('步骤8：关闭共享设置窗口');
    await device.pressKey('Esc');
    
    console.log('步骤9：获取本机IP');
    const ipResult = await system.exec('hostname -I');
    const localIp = (ipResult.stdout || ipResult).trim().split(' ')[0];
    console.log(`获取到本机IP：${localIp}`);
    
    console.log('步骤9：连接本机的smb');
    await system.exec(`/usr/bin/dde-file-manager smb://${localIp}`, 500);
    await agent.aiWaitFor('smb连接已显示');
    await uos.maximizeWindow();
    
    console.log('步骤9：点击左侧栏的本机IP');
    await agent.aiTap(`左侧栏的${localIp}`);
    await agent.aiWaitFor('smb连接已显示');
    
    console.log('步骤9：双击2814smb');
    await agent.aiDoubleClick('2814smb');
    
    console.log('步骤9：检查是否存在密码弹框');
    const hasPwd9 = await agent.aiBoolean(`页面出现密码输入框`);
    if (hasPwd9) {
      console.log('检测到密码弹框，输入密码123');
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText('123');
      await device.pressKey('Enter');
    }
    
    console.log('断言：提示权限不足');
    await agent.aiAssert('权限不足');
    console.log('断言通过：提示权限不足');
    await device.pressKey('Esc');

    
    console.log('步骤10：双击2815smb');
    await agent.aiTap(`左侧栏的${localIp}`);
    await agent.aiDoubleClick('2815smb');
    
    console.log('步骤10：检查是否存在密码弹框');
    const hasPwd10 = await agent.aiBoolean(`页面出现密码输入框`);
    if (hasPwd10) {
      console.log('检测到密码弹框，输入密码123');
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText('123');
      await device.pressKey('Enter');
    }
    
    console.log('步骤10：右键创建文件夹');
    device.pressKey('Ctrl+shift+N');
    await system.exec('sleep 2'); 
    device.pressKey('Esc');
    
    console.log('断言：文件创建失败');
    await agent.aiAssert('文件夹为空');
    // await device.pressKey('Esc');
    
    console.log('步骤11：双击2816smb');
    await agent.aiTap(`左侧栏的${localIp}`);
    await agent.aiDoubleClick('2816smb');
    
    console.log('步骤11：检查是否存在密码弹框');
    const hasPwd11 = await agent.aiBoolean(`页面出现密码输入框`);
    if (hasPwd11) {
      console.log('检测到密码弹框，输入密码123');
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText('123');
      await device.pressKey('Enter');
    }
    
    console.log('步骤11：右键创建文件夹');
    device.pressKey('Ctrl+shift+N');
    await system.exec('sleep 2');  
    
    
    console.log('断言：文件夹创建成功');
    await agent.aiAssert('文件夹创建成功');
    console.log('断言通过：文件夹创建成功');
    
  }, { timeout: 1200000, tags: ['1813281', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    console.log('清理步骤：取消共享');
    try {
      await uos.openApp('文件管理器', 2000, 100000);
      await agent.aiWaitFor('文管窗口显示');
      await agent.aiTap('左侧栏的文档');
      await agent.aiWaitFor('文档目录已打开');
      
      const shareFolders = ['2814smb', '2815smb', '2816smb'];
      for (const folder of shareFolders) {
        try {
          await agent.aiRightClick(folder);
          await agent.aiTap('取消共享');
          
          const hasAuth = await agent.aiBoolean(`页面出现需要认证文本`);
          if (hasAuth) {
            await device.typeText(env.testPassword);
            await agent.aiTap('确定');
          }
        } catch (error) {
          console.log(`取消${folder}共享失败，跳过此步骤`);
        }
      }
    } catch (error) {
      console.log('取消共享失败，跳过此步骤');
    }
    
    console.log('清理步骤：删除测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/2810smb /home/${process.env.TEST_USERNAME}/Documents/2811smb /home/${process.env.TEST_USERNAME}/Documents/2812smb /home/${process.env.TEST_USERNAME}/Documents/2813smb /home/${process.env.TEST_USERNAME}/Documents/2814smb /home/${process.env.TEST_USERNAME}/Documents/2815smb /home/${process.env.TEST_USERNAME}/Documents/2816smb`, 500);
    
    console.log('清理步骤：卸载smb连接');
    const ipResult = await system.exec('hostname -I');
    const localIp = (ipResult.stdout || ipResult).trim().split(' ')[0];
    try {
      await agent.aiRightClick(`左侧栏的${localIp}`);
      await agent.aiTap('移除');
    } catch (error) {
      console.log('卸载smb失败，跳过此步骤');
    }
    
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall dde-file-manager');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});