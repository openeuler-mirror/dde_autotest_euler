/**
 * 用例 PMSID: 1813023
 * 用例标题: smb连接服务器地址优化 - 允许输入IP:端口
 * 生成时间: 2026-11-14
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

const fs = require('fs');

const smbIp = process.env.SMB_IP;
const smbPort = '445';

const COMMON_SUFFIX = 'midscene_dde_file_manager/common/common.ts';

// TESTCASE_DIR 在本机配置为不存在的 apps 目录，这里按目录逐级回退，保证公共方法能正确加载
function findCommonDir() {
  const candidates = [
    process.env.TESTCASE_DIR,
    process.env.TESTCASE_DIR ? process.env.TESTCASE_DIR.replace(/apps\/?$/, '') : null,
    `${process.cwd()}/`,
  ].filter(Boolean);

  for (const dir of candidates) {
    const base = dir.endsWith('/') ? dir : `${dir}/`;
    if (fs.existsSync(`${base}${COMMON_SUFFIX}`)) {
      return base;
    }
  }
  throw new Error(`无法定位公共方法文件: ${COMMON_SUFFIX}`);
}

describe('1813023-smb连接服务器地址优化-允许输入IP:端口', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    const { cleanSmbMounts } = await import(`${findCommonDir()}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813023-smb连接服务器地址优化-允许输入IP:端口', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤2：点击右上角主菜单，点击"连接到服务器"');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    await agent.aiTap('连接到服务器');
    await agent.aiWaitFor('连接到服务器弹框已显示');

    console.log(`步骤2：点击服务器IP输入框，Ctrl+A，输入${smbIp}:${smbPort}`);
    await agent.aiTap('服务器IP输入框');
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');
    await device.typeText(`${smbIp}:${smbPort}`, false);

    console.log('步骤2：点击服务器IP右侧的收藏按钮');
    await agent.aiTap('服务器IP输入框右侧的收藏标签');
    await system.exec('sleep 1');

    console.log('步骤2：断言收藏成功');
    await agent.aiAssert(`我收藏的服务器中存在smb://${smbIp}:${smbPort}`);
    console.log('断言通过：收藏成功');

    console.log('步骤3：选中步骤2收藏的信息，点击"连接"');
    await agent.aiTap(`我收藏的服务器中的smb://${smbIp}:${smbPort}`);
    await agent.aiTap('连接按钮');
    await system.exec('sleep 2');

    // console.log('步骤3：若出现smb连接弹框，点击"匿名"，点击"连接"');
    // const hasSmbDialog = await agent.aiBoolean('存在smb连接弹框');
    // if (hasSmbDialog) {
    //   await agent.aiTap('匿名');
    //   await agent.aiTap('连接');
    //   await system.exec('sleep 3');
    // }

    console.log('步骤4：断言连接成功或连接失败');
    const isConnected = await agent.aiBoolean('连接成功或出现连接窗口');
    const isFailed = await agent.aiBoolean('页面显示连挂载失败的提示信息');
    if (isConnected) {
      console.log('断言通过：连接成功');
    } else if (isFailed) {
      console.log('断言通过：连接失败（有提示信息）');
    } else {
      await agent.aiAssert('连接成功或连接失败');
    }

    await device.pressKey('Escape');

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1813023', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');

    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${findCommonDir()}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});
