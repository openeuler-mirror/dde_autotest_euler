/**
 * 用例 PMSID: 1813385
 * 用例标题: 连接到服务器，清除最近使用的服务器
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1813385-连接到服务器，清除最近使用的服务器', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 清理已挂载的SMB
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813385-连接到服务器，清除最近使用的服务器', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤2：点击服务器IP输入框，Ctrl+A，输入当前机器IP，点击Enter');
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const localIp = ipResult.stdout.trim();
    console.log(`本机IP: ${localIp}`);
    await device.typeText(`${localIp}`, true);
    await device.pressKey('Enter');
    await system.exec('sleep 2');

    console.log('步骤3：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤3：点击服务器IP输入框的下拉框，点击"清除最近使用的服务器"');
    await agent.aiTap('服务器IP输入框的下拉框');
    await system.exec('sleep 1');
    await agent.aiTap('清除最近使用的服务器');
    await system.exec('sleep 1');

    console.log('步骤3：关闭弹框');
    await device.pressKey('Escape');
    
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();

    console.log('步骤4：点击右上角主菜单，点击"连接到服务器"');

    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤4：断言服务器IP输入框为空');
    await agent.aiAssert('服务器IP输入框为空');

    console.log('步骤4：点击服务器IP输入框的下拉框，断言提示无历史记录');
    await agent.aiTap('服务器IP输入框的下拉框');
    await system.exec('sleep 1');
    await agent.aiAssert('下拉框中提示无历史记录');

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1813385', 'level2', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 卸载可能挂载的SMB
    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);

    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
