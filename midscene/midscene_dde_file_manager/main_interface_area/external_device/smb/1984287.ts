/**
 * 用例 PMSID: 1984287
 * 用例标题: 【smb】smb多页签切换
 * 生成时间: 2026-07-07
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;

describe('1984287-【smb】smb多页签切换', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    // await system.cleanupFileManager();
    await uos.showDesktop();

    console.log('前置条件：在文档目录创建1984287文件夹');
    await system.exec('mkdir -p ~/Documents/1984287');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1984287-【smb】smb多页签切换', async ({ device, agent, uos, system, env }) => {
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

    console.log('步骤1：启动器-打开文件管理器，窗口最大化');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');

    const isMaximized = await agent.aiBoolean('文管窗口是最大化状态');
    if (!isMaximized) {
      await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    }

    console.log('步骤1：点击文件管理器右上角设置按钮，设置共享密码');
    await agent.aiTap('文件管理器右上角的设置按钮', { deepThink: true });
    await agent.aiTap('设置共享密码', { deepThink: true });
    await device.typeText('123', true);
    await device.pressKey('Enter');
    await system.exec('sleep 5');
    const hasAuth = await agent.aiBoolean('存在用户鉴权弹框或需要认证文本');
    if (hasAuth) {
      console.log('检测到用户鉴权弹框，输入当前机器密码');
      await device.typeText(env.testPassword, true);
      await device.pressKey('Enter');
      await system.exec('sleep 5');
    }

    console.log('步骤1：点击左侧栏的文档目录');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：右键"1984287"点击"共享文件夹"');
    await agent.aiRightClick('1984287', { deepThink: true });
    await agent.aiWaitFor('右键加载完成');
    await agent.aiTap('共享文件夹');
    await system.exec('sleep 5');
    await agent.aiWaitFor('共享文件夹弹框加载完成');

    console.log('步骤1：若"共享此文件夹"未勾选，则勾选');
    const isShared = await agent.aiBoolean('共享此文件夹已勾选');
    if (!isShared) {
      await agent.aiTap('共享此文件夹前面的勾选框', { deepThink: true });
      await system.exec('sleep 5');
    }
    await system.exec('sleep 5');

    console.log('步骤1：若存在用户鉴权框，输入用户密码，点击"确认"');
    const hasAuthDialog = await agent.aiBoolean('存在鉴权弹框或需要认证文本');
    if (hasAuthDialog) {
      await device.typeText(env.testPassword, true);
      await device.pressKey('Enter');
      await system.exec('sleep 2');
    }

    console.log('步骤1：若匿名选择框为"不允许"，点击并勾选"允许"');
    const isAnonymousAllowed = await agent.aiBoolean('匿名访问已选择允许');
    if (!isAnonymousAllowed) {
      await agent.aiTap('匿名下拉框', { deepThink: true });
      await agent.aiTap('允许');
      await system.exec('sleep 1');
    }

    console.log('步骤1：关闭共享弹框');
    await device.pressKey('Escape');

    console.log('步骤1：通过地址栏输入smb地址连接');
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const localIp = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${localIp}`);

    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${localIp}/1984287`, true);
    const hasAccessAuth = await agent.aiBoolean('出现需要授权来访问文本');
    if (hasAccessAuth) {
      await agent.aiTap('匿名选项');
      await system.exec('sleep 2');
      await agent.aiTap('连接选项');
      await system.exec('sleep 2');
    }
    const needAuth = await agent.aiBoolean('页面出现卸载文件系统需要认证文本');
    if (needAuth) {
      console.log('触发弹窗认证，输入密码');
      await device.typeText(env.testPassword, true);
    }

    await agent.aiAssert(`有显示"1984287"文件夹`);
    console.log('断言通过：显示"1984287"文件夹');

    console.log('步骤2：点击文件管理器顶部的"+"号');
    await agent.aiTap('左上角+号', { deepThink: true });
    await agent.aiAssert(`有显示"1984287"文件夹`);
    console.log(`断言通过：显示"1984287"文件夹`);

    console.log('步骤3：在文件管理器顶部的最右侧的标签，右键点击"关闭标签"');
    await agent.aiRightClick('右侧的smb的标签页');
    await agent.aiTap('关闭标签');
    await agent.aiAssert(`有显示"1984287"文件夹`);
    console.log(`断言通过：显示"1984287"文件夹`);

  }, { timeout: 1200000, tags: ['1984287', 'level3', 'smb', 'DITT','lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.exec('rm -rf ~/Documents/1984287');
    await device.pressKey('Escape')
    // await system.cleanupFileManager();
    // await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
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