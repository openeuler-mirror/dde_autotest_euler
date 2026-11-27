/**
 * 用例 PMSID: 1815959
 * 用例标题: 长文件名功能 - 删除、撤销
 * 生成时间: 2026-07-21
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "959删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能删除撤销长文件名功能";
describe('1815959-长文件名功能 - 删除、撤销', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    
    console.log('前置条件：清理回收站资源');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    
    console.log(`前置条件：在文档目录创建长文件名txt文件 ${longFileName}`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1815959-长文件名功能 - 删除、撤销', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤1：右键959删除开头的文件，按Delete键');
    await agent.aiRightClick(`以959删除'开头的文件`);
    await device.pressKey('Delete');
    
    console.log('步骤1：检查是否出现删除确认框');
    const hasDeleteDialog = await agent.aiBoolean(`页面出现删除文本`);
    if (hasDeleteDialog) {
      console.log('检测到删除确认框，点击删除');
      await agent.aiTap('删除');
    } else {
      console.log('未检测到删除确认框');
    }
    
    console.log('步骤1：断言文档目录无959删除开头的文件');
    await agent.aiAssert('文档目录无959删除开头的文件');
    console.log('断言通过：文档目录无959删除开头的文件');
    
    console.log('步骤2：点击快捷键Ctrl + z');
    await device.pressKey('Control','z');
    
    console.log('步骤2：断言文档目录存在959删除开头的文件');
    await agent.aiAssert('文档目录存在959删除开头的文件');
    console.log('断言通过：文档目录存在959删除开头的文件');
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  }, { timeout: 600000, tags: ['1815959', 'level3', 'remote', 'longfilename', 'DITT', 'lishuangshuang'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    console.log('清理步骤：清理回收站');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});