/**
 * 用例 PMSID: 1813695
 * 用例标题: smb共享密码中存在全角（中文）逗号，共享后进行挂载访问
 * 生成时间: 2026-07-28
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const folderName = "3695smb";
const smbPassword = "123，123";

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

  console.log('检查是否存在用户鉴权，若存在则输入用户密码并点击确认');
  const hasAuth = await agent.aiBoolean('存在鉴权弹框或需要认证文本');
  if (hasAuth) {
    console.log('检测到鉴权弹框，输入用户密码');
    await device.typeText(env.testPassword, true);
    await agent.aiTap('确认');
  }
}

describe('1813695-smb共享密码中存在全角（中文）逗号，共享后进行挂载访问', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的${folderName}文件夹`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${folderName}`, 500);
    
    console.log('前置条件：在文档目录创建3695smb文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/${folderName}`, 500);
    
    console.log('前置条件：清理文件管理器');
    await system.cleanupFileManager();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813695-smb共享密码中存在全角（中文）逗号，共享后进行挂载访问', async ({ device, agent, uos, system, env }) => {
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
    await uos.maximizeWindow();
    
    console.log('步骤1：点击右上角主菜单');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    
    console.log('步骤1：点击设置共享密码');
    await agent.aiTap('共享密码');
    
    console.log('步骤1：输入密码123，123（全角逗号）');
    await agent.aiTap('密码输入框');
    await device.typeText(smbPassword);
    await device.pressKey('Enter');
    
    console.log('步骤1：检查是否存在账户鉴权');
    const hasAuth1 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth1) {
      console.log('检测到账户鉴权弹框，输入密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await device.pressKey('Enter');
    } else {
      console.log('未检测到账户鉴权弹框');
    }
    
    console.log('步骤2：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤2：右键3695smb文件夹');
    await agent.aiRightClick(folderName);
    
    console.log('步骤2：点击共享文件夹');
    await agent.aiTap('共享文件夹', { deepThink: true });
    
    console.log('步骤2：点击共享文件夹前面的勾选框');
    await enableShareFolder(agent, device, env);
    
    console.log('步骤2：检查是否存在账户鉴权');
    const hasAuth2 = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth2) {
      console.log('检测到账户鉴权弹框，输入密码');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    } else {
      console.log('未检测到账户鉴权弹框');
    }
    
    console.log('步骤2：点击Esc关闭共享设置窗口');
    await device.pressKey('Esc');
    
    console.log('步骤3：获取本机IP');
    const ipResult = await system.exec('hostname -I');
    const localIp = (ipResult.stdout || ipResult).trim().split(' ')[0];
    console.log(`获取到本机IP：${localIp}`);
    
    console.log('步骤3：连接当前机器的smb');
    await system.exec(`/usr/bin/dde-file-manager smb://${localIp}`, 500);
    await agent.aiWaitFor('smb连接已显示');
    
    console.log('步骤3：点击左侧栏的本机IP');
    await agent.aiTap(`左侧栏的${localIp}`);
    await agent.aiWaitFor('smb连接已显示');
    
    console.log('步骤3：双击3695smb文件夹');
    await agent.aiDoubleClick(folderName);
    
    console.log('步骤3：检查是否存在密码弹框');
    const hasPwdDialog = await agent.aiBoolean(`页面出现密码输入框`);
    if (hasPwdDialog) {
      console.log('检测到密码弹框，输入密码123，123（全角逗号）');
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText(smbPassword);
      await device.pressKey('Enter');
    }
    
    console.log('断言：smb连接成功');
    await agent.aiAssert('smb连接成功');
    console.log('断言通过：smb连接成功');
    
  }, { timeout: 600000, tags: ['1813695', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

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
      await agent.aiRightClick(folderName);
      await agent.aiTap('取消共享');
      
      const hasAuth = await agent.aiBoolean(`页面出现需要认证文本`);
      if (hasAuth) {
        await device.typeText(env.testPassword);
        await agent.aiTap('确定');
      }
    } catch (error) {
      console.log('取消共享失败，跳过此步骤');
    }
    
    console.log(`清理步骤：删除文档目录下的${folderName}文件夹`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${folderName}`, 500);
    
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
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});