/**
 * 用例 PMSID: 1815995
 * 用例标题: 长文件名功能 - 文件夹，以新标签打开
 * 生成时间: 2026-07-16
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "995长文件名功能文件夹以新标签打开长文件名功能文件夹以新标签打开长文件名功能文件夹以新标签打开长文件名功能文件夹以新标签打开长文件名功能文件夹以新标签打开长文件名功能文件夹以新标签打开";

describe('1815995-长文件名功能 - 文件夹，以新标签打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    console.log(`前置条件：在文档目录创建长文件名文件夹 ${longFileName}`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815995-长文件名功能 - 文件夹，以新标签打开', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：右键长文件名文件夹，点击在新标签中打开');
    await agent.aiRightClick(`以995长文件名功能文件夹以新标签打开开头的文件夹`);
    await agent.aiTap('在新标签中打开');
    
    await agent.aiAssert('文件管理器中存在新的标签页且显示长文件名文件夹内容');
    console.log('断言通过：新标签打开正常');

    console.log('测试完成');

  }, { timeout: 600000, tags: ['1815995', 'level3', 'remote', 'other', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});