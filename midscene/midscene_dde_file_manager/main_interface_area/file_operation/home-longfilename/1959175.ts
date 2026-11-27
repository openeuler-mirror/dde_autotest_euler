/**
 * 用例 PMSID: 1959175
 * 用例标题: 【home目录支持长文件名】删除长文件名文件到回收站
 * 生成时间: 2026-07-15
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "175删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站删除长文件名文件到回收站";

describe('1959175-【home目录支持长文件名】删除长文件名文件到回收站', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
     // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    
    console.log(`前置条件：创建长文件名文件 ${longFileName}.txt`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}".txt`, 500);
    console.log(`第二次显示桌面`);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1959175-【home目录支持长文件名】删除长文件名文件到回收站', async ({ device, agent, uos, system, env }) => {

    console.log('步骤1：打开文件管理器，最大化窗口，点击左侧栏回收站');
    await uos.openApp('文件管理器', 2000, 100000);
    const isMaximized = await agent.aiBoolean('文管窗口是最大化状态');
    if (!isMaximized) {
      await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    }
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    await system.exec('sleep 2');
    await agent.aiTap(`以175删除开头的txt文件`);
    await device.pressKey('Delete');
    await system.exec('sleep 2');

    await agent.aiTap('左侧栏的回收站');
    await agent.aiWaitFor('回收站目录已打开');
    
    await agent.aiAssert(`回收站存在以175删除开头的txt文件`);
    console.log('断言通过：回收站存在长文件名文件');

    console.log('步骤2：点击回收站右上角的清空');
    await agent.aiTap('回收站右上角的清空');
    
    const hasConfirmDialog = await agent.aiBoolean('存在清空回收站确认弹框');
    if (hasConfirmDialog) {
      console.log('存在清空弹框，点击清空');
      await agent.aiTap('清空');
    }
    
    console.log('测试完成');

  }, { timeout: 600000, tags: ['1959175', 'level3', 'remote','longfilename', 'DITT','lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}".txt`, 500);
    await system.exec('rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/*');
    await system.cleanupFileManager();
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
  });
});