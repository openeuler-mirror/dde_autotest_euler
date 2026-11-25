/**
 * 用例 PMSID: 1813353
 * 用例标题: smb引导打开-smb关闭状态，授权提示框操作
 * 生成时间: 2026-08-05
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813353-smb引导打开-smb关闭状态，授权提示框操作', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    console.log('前置条件：检查smb.service服务状态，如果是active状态则关闭');
    const smbStatusResult = await system.exec('systemctl is-active smb.service');
    const smbStatus = (smbStatusResult.stdout || smbStatusResult).trim();
    console.log(`smb服务状态：${smbStatus}`);
    if (smbStatus === 'active') {
      console.log('smb.service处于active状态，正在关闭...');
      await system.exec(`echo "${env.testPassword}" | sudo -S systemctl stop smb.service`);
    } else {
      console.log('smb.service处于非active状态，无需关闭');
    }

    console.log('前置条件：在文档目录创建3353smb文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/3353smb`);

    await system.cleanupFileManager();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813353-smb引导打开-smb关闭状态，授权提示框操作', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000, true);

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：右键3353smb文件夹');
    await agent.aiRightClick('3353smb');

    console.log('步骤1：点击共享文件夹');
    await agent.aiTap('共享文件夹');

    console.log('步骤1：勾选共享此文件夹前面的勾选框');
    await agent.aiTap('共享此文件夹前面的勾选框');

    console.log('断言：出现用户鉴权框');
    const hasAuthDialog = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuthDialog) {
      console.log('断言通过：出现用户鉴权框');
    } else {
      console.log('断言失败：未出现用户鉴权框');
      throw new Error('未出现用户鉴权框');
    }

    console.log('步骤1：在鉴权框中点击"取消"按钮');
    await agent.aiTap('取消');
    await agent.aiWaitFor('鉴权框消失');

    console.log('断言：鉴权框消失，共享此文件夹前面的勾选框处于未勾选状态');
    await agent.aiAssert('共享此文件夹前面的勾选框处于未勾选状态');

    console.log('步骤2：再次勾选共享此文件夹前面的勾选框');
    await agent.aiTap('共享此文件夹前面的勾选框');
    await agent.aiWaitFor('出现用户鉴权框');

    console.log('步骤2：输入错误密码"9"');
    await agent.aiTap('含有请输入密码文字的输入框');
    await device.typeText('9');
    await device.pressKey('Enter');
    await agent.aiWaitFor('密码输入框显示浅红色');
    await device.pressKey('esc');
    
    console.log('步骤4：点击确定');
    await agent.aiTap('共享此文件夹前面的勾选框');
    await device.typeText(env.testPassword);
    await agent.aiTap('确定');
    await agent.aiWaitFor('共享此文件夹已勾选');

    console.log('断言：文件共享成功');
    await agent.aiAssert('共享此文件夹前面的勾选框已勾选');
    console.log('断言通过：文件共享成功');

  }, { timeout: 600000, tags: ['1813353', 'level2', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：删除测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/3353smb`);

    console.log('清理步骤：检查smb.service服务状态');
    const smbStatusResult = await system.exec('systemctl is-active smb.service');
    const smbStatus = (smbStatusResult.stdout || smbStatusResult).trim();
    console.log(`smb服务状态：${smbStatus}`);
    if (smbStatus === 'active') {
      console.log('smb.service处于active状态，不处理');
    } else {
      console.log('smb.service处于非active状态，开启smb.service服务');
      await system.exec(`echo "${env.testPassword}" | sudo -S systemctl start smb.service`);
      console.log('smb.service服务已开启');
    }

    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall dde-file-manager');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});