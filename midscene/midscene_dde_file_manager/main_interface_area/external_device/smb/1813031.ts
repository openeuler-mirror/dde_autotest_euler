/**
 * 用例 PMSID: 1813031
 * 用例标题: smb连接服务器地址优化 - 允许输入其他各种字符
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1813031-smb连接服务器地址优化-允许输入其他各种字符', () => {
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

  test('1813031-smb连接服务器地址优化-允许输入其他各种字符', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log('步骤2：点击服务器IP输入框，Ctrl+A，输入uos.123.!@#,^&*');
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await agent.aiInput('uos.123.!@#,^&*', '服务器IP输入框');

    console.log('步骤2：点击服务器IP右侧的收藏按钮');
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');

    console.log('步骤2：断言收藏失败，有"错误信息"的提示');
    await agent.aiAssert('页面显示错误信息提示');

    console.log('步骤2：点击ESC快捷键');
    await device.pressKey('Escape');
    await system.exec('sleep 1');

    console.log('步骤3：点击Enter，有"错误信息"的提示，点击ESC');
    await device.pressKey('Enter');
    await system.exec('sleep 1');
    await agent.aiAssert('页面显示错误信息提示');
    await device.pressKey('Escape');

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1813031', 'level4', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
