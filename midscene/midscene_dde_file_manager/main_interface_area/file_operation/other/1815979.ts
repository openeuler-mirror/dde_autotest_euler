/**
 * 用例 PMSID: 1815979
 * 用例标题: 长文件名功能 - 粘贴字符数超出新规则
 * 生成时间: 2026-07-20
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "979时代环境数据库好久好久圣诞节客服数据库是房价开始放假快乐十分首付款稍等返款了孤苦伶仃法规卡兰尼克国际快递股份健康法国进口大法官双方就开始房价开始放假康师傅艰苦奋斗黄金时代环境数据库好久好久圣诞节客服数据库是房价开始放假快乐十分首付款稍等返款了孤苦伶仃法规卡兰尼克国际快递股份健康法国进口大法官双方就开始房价开始放假康师傅艰苦奋斗黄金时代环境数据库好久好久圣诞节客服数据库是房价开始放假快乐十分首付款稍等返款了孤苦伶仃法规卡兰尼克国际快递股份健康法国进口大法官双方就开始房价开始放假康师傅艰苦奋斗放假康师";
describe('1815979-长文件名功能 - 粘贴字符数超出新规则', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    console.log(`前置条件：在文档目录创建长文件名文件夹 ${longFileName}`);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1815979-长文件名功能 - 粘贴字符数超出新规则', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('步骤2：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤3：右键长文件名文件夹，点击复制');
    await agent.aiRightClick(`以979时代'开头的文件夹`);
    await agent.aiTap('复制');
    
    console.log('步骤4：右键空白区域，点击粘贴');
    await agent.aiRightClick('文档目录空白区域');
    await agent.aiTap('粘贴');
    
    console.log('步骤5：断言文件粘贴失败，有文件名过长的提示信息');
    await agent.aiWaitFor('文件名过长');
    await agent.aiAssert('文件名过长');
    console.log('断言通过：文件粘贴失败，出现文件名过长提示');
    
    console.log('步骤6：关闭错误提示对话框');
    await device.pressKey('Enter');
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  }, { timeout: 600000, tags: ['1815979', 'level3', 'remote', 'longfilename', 'DITT'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});