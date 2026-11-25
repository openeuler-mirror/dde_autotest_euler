/**
 * 用例 PMSID: 1813029
 * 用例标题: smb连接服务器地址优化 - 允许输入域名
 * 生成时间: 2026-09-03
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;
const smbDir = process.env.SMB_DIR;
// const smbDir = process.env.SMB_DIR1;

describe('1813029-smb连接服务器地址优化-允许输入域名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813029-smb连接服务器地址优化-允许输入域名', async ({ device, agent, uos, system, env }) => {
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

    console.log('步骤1：启动器文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤2：点击服务器IP输入框，Ctrl+A，输入localhost/smbtest');

     await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');
    await device.typeText(`localhost/${smbDir}`, false);
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');


    console.log('步骤2：断言收藏成功');
    await agent.aiAssert(`我收藏的服务器中存在smb://localhost/${smbDir}`);
    console.log('断言通过：收藏成功');

    console.log('步骤3：选中步骤2收藏的信息，点击"连接"');
    await agent.aiTap(`我收藏的服务器中的smb://localhost/${smbDir}`);
    await agent.aiTap('连接按钮');
    await system.exec('sleep 2');

    console.log('步骤3：若有用户鉴权弹框，输入用户密码，点击"确定"');
    const hasAuth = await agent.aiBoolean('存在用户鉴权弹框或需要认证文本');
    if (hasAuth) {
      await device.typeText(env.testPassword, true);
      await agent.aiTap('确定');
      await system.exec('sleep 2');
    }

    console.log('步骤3：若出现smb连接弹框，点击"匿名"，点击"连接"');
    const hasSmbDialog = await agent.aiBoolean('存在smb连接弹框');
    if (hasSmbDialog) {
      await agent.aiTap('匿名');
      await agent.aiTap('连接');
      await system.exec('sleep 3');
    }

    console.log('步骤4：若连接成功则可正常smb，若连接失败则有连接失败的提示信息');
    const isConnected = await agent.aiBoolean(`文件管理器页面最上方有显示"${smbDir}"`);
    if (isConnected) {
      console.log('断言通过：连接成功，可正常访问smb');
    } else {
      await agent.aiAssert('页面显示连挂载失败的提示信息');
      console.log('断言通过：连接失败，有连接失败的提示信息');
    }

    await device.pressKey('Escape');

    console.log('清理：清除已收藏的smb信息');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');
    await agent.aiHover(`我收藏的服务器中的smb://localhost/${smbDir}`);
    await agent.aiTap(`smb://localhost/${smbDir}旁边的关闭按钮:X`);
    await system.exec('sleep 1');
    await agent.aiAssert(`我收藏的服务器列表不存在smb://localhost/${smbDir}`);
    console.log('清理完成：已清除收藏的smb信息');

    await device.pressKey('Escape');

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1813029', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
