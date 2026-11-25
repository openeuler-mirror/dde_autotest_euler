/**
 * 用例 PMSID: 1977361
 * 用例标题: 【SMB】匿名挂载后home目录权限检查
 * 生成时间: 2026-07-09
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;

describe('1977361-【SMB】匿名挂载后home目录权限检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    await system.exec(`mkdir ~/Desktop/share361`, 500);
    await system.exec(`echo "share361" > ~/Desktop/share361/361.txt`, 500);
    console.log('前置条件：创建share361文件夹和361.txt文件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1977361-【SMB】匿名挂载后home目录权限检查', async ({ device, agent, uos, system, env }) => {
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
    
    console.log('步骤1：右键share361，点击属性，点击共享管理，勾选共享此文件夹，设置匿名允许');
    await agent.aiRightClick('share361', 300);
    await agent.aiTap('共享文件夹');
    await agent.aiTap('共享此文件夹前面的勾选框');
    
    const resulta = await agent.aiBoolean('存在需要授权弹框');
    if (resulta) {
      console.log('需要授权，输入系统认证密码');
       await agent.aiHover('修改您的共享信息需要认证');
      await agent.aiTap('密码输入框', { deepThink: true });
      await device.typeText(env.testPassword, true);
    }
    
    // await system.exec("sleep 2");
    await agent.aiAssert('成功勾选共享此文件夹');
    
    await agent.aiTap('匿名的下拉框');
    await agent.aiTap('允许');
    await device.pressKey('Esc');

    console.log('步骤2：获取当前用户名，打开终端，检查/home目录权限');
    const whoamiResult = await system.exec('whoami');
    const currentUserName = (whoamiResult.stdout || whoamiResult).trim();
    console.log(`当前用户名：${currentUserName}`);

    await device.pressKey('Control', 'Alt', 'T');
    await agent.aiWaitFor('终端窗口显示');
    await device.typeText(`ls -la /home`, true);
    await device.pressKey('Enter');
    await agent.aiAssert(`${currentUserName}目录权限是drwxr-xr-x`);
    console.log(`断言通过：${currentUserName}目录权限是drwxr-xr-x`);

    await device.pressKey('win+D');

    console.log('步骤3：取消共享，再次检查/home目录权限');
    await agent.aiRightClick('share361', 300);
    await agent.aiTap('取消共享');
    
    const resultc = await agent.aiBoolean('存在需要授权弹框');
    if (resultc) {
      console.log('需要授权，输入系统认证密码');
      // await agent.aiTap('密码输入框');
      await device.typeText(env.testPassword, true);
      // await agent.aiTap('确定');
    }

    console.log('步骤4：打开终端，检查/home目录权限');
    await device.pressKey('Control', 'Alt', 'T');
    await agent.aiWaitFor('终端窗口显示');
    await device.typeText('ls -la /home', true);
    await device.pressKey('Enter');
    await agent.aiAssert(`${currentUserName}目录权限是drwxr-x---`);
    console.log(`断言通过：${currentUserName}目录权限是drwxr-x---`);
    
    await device.pressKey('win+D');
    await system.exec("sleep 1");

  }, { timeout: 1200000, tags: ['1977361', 'level2', 'smb', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/share361`, 500);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
     for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
  });
});