/**
 * 用例 PMSID: 1813435
 * 用例标题: smb挂载目录下快捷键操作
 * 生成时间: 2026-08-13
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

describe('1813435-smb挂载目录下快捷键操作', () => {
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

  test('1813435-smb挂载目录下快捷键操作', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：启动器-文件管理器，点击连接的smb，进入smb');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    // 挂载SMB（使用用户名方式）
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    await system.exec('sleep 2');
    await agent.aiWaitFor('smb目录已打开');
    console.log('步骤1完成：已进入smb目录');

    // 进入smb后，利用命令将*smb的文件全部删除
    console.log('步骤2：清理smb挂载目录下的*smb文件');
    const smbIp = process.env.SMB_IP;
    const smbDir = process.env.SMB_DIR;
    const testUsername = process.env.TEST_USERNAME;
    const smbMountPath = `/media/${testUsername}/smbmounts/smb-share:server=${smbIp},share=${smbDir}`;
    console.log(`清理smb挂载目录下的*smb文件: ${smbMountPath}`);
    await system.exec(`find "${smbMountPath}" -maxdepth 1 -name "*smb" -exec rm -rf {} \\;`, 2000);
    await system.exec('sleep 1');

    console.log('步骤2：点击"ctrl+shift+N"，创建一个文件夹，重命名为"13435smb"');
    await device.pressKey('Control', 'Shift', 'n');
    await system.exec('sleep 1');
    await device.typeText('13435smb', true);
    // await device.pressKey('Enter');
    await agent.aiWaitFor('13435smb');
    await agent.aiTap('空白处');
    console.log('步骤2完成：13435smb文件夹创建成功');

    console.log('步骤3：点击"ctrl+shift+N"，创建一个文件夹，重命名为"23435smb"');
    await device.pressKey('Control', 'Shift', 'n');
    await system.exec('sleep 1');
    await device.typeText('23435smb', true);
    // await device.pressKey('Enter');
    await agent.aiWaitFor('23435smb');
    await agent.aiTap('空白处');
    console.log('步骤3完成：23435smb文件夹创建成功');

    console.log('步骤3(2)：鼠标点击"13435smb"，点击"enter"，断言进入文件夹内，点击回退按钮');
    await agent.aiTap('23435smb');
    await device.pressKey('Enter');
    // await agent.aiWaitFor('进入13435smb文件夹内');
    await agent.aiAssert('已进入23435smb文件夹内');
    await agent.aiTap('文件管理器页面左上角的后退按钮');
    // await agent.aiWaitFor('13435smb');
    console.log('断言通过：进入文件夹内并回退成功');

    console.log('步骤4：鼠标点击"13435smb"，点击空格快捷键，断言弹出预览弹框，关闭预览弹框');
    await agent.aiTap('13435smb');
    await device.pressKey('Space');
    // await agent.aiWaitFor('预览弹框');
    await agent.aiAssert('弹出预览弹框');
    await device.pressKey('Escape');
    await agent.aiTap('空白处');
    console.log('断言通过：预览弹框弹出并关闭');

    console.log('步骤5：点击"13435smb"，点击delete，若弹出删除弹框，点击"enter"，断言"13435smb"已不存在');
    await agent.aiTap('13435smb');
    await device.pressKey('Delete');
    await system.exec('sleep 1');
    const hasDeleteDialog = await agent.aiBoolean('出现删除确认弹框');
    if (hasDeleteDialog) {
      await device.pressKey('Enter');
    }
    await system.exec('sleep 1');
    const has13435 = await agent.aiBoolean('页面存在13435smb');
    if (has13435) {
      throw new Error('13435smb文件夹未删除');
    }
    await agent.aiTap('空白处');
    console.log('断言通过：13435smb已删除');

    console.log('步骤6：点击"23435smb"，点击"ctrl+c"，点击"ctrl+v"，断言新增一个文件夹');
    await agent.aiTap('23435smb');
    await device.pressKey('Control', 'c');
    await system.exec('sleep 1');
    await device.pressKey('Control', 'v');
    await system.exec('sleep 2');
    await agent.aiAssert('新增了一个23435smb的副本文件夹');
    await agent.aiTap('空白处');
    console.log('断言通过：复制粘贴新增文件夹成功');

    console.log('步骤7：点击"23435smb"，点击"ctrl+i"，断言弹出属性弹框，关闭弹框');
    await agent.aiTap('23435smb');
    await device.pressKey('Control', 'i');
    // await agent.aiWaitFor('属性弹框');
    await agent.aiAssert('弹出属性弹框');
    await device.pressKey('Escape');
    await agent.aiTap('空白处');
    console.log('断言通过：属性弹框弹出并关闭');

    console.log('步骤8：将"23435smb"重命名为".23smb"，点击"ctrl+h"，断言显示".23smb"');
    await agent.aiRightClick('23435smb');
    await agent.aiTap('重命名');
    await system.exec('sleep 1');
    await device.pressKey('Control', 'a');
    await device.typeText('.23smb', true);
    // await device.pressKey('Enter');
    await device.pressKey('Enter');
    await system.exec('sleep 1');
    await agent.aiTap('空白处');
    
    // 点击ctrl+h显示隐藏文件
    await device.pressKey('Control', 'h');
    await system.exec('sleep 1');
    await agent.aiWaitFor('.23smb');
    await agent.aiAssert('显示.23smb文件夹');
    console.log('断言通过：.23smb显示成功');

    console.log('测试完成');
  }, { timeout: 1200000, tags: ['1813435', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理SMB挂载（mode=1强制卸载）
    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
