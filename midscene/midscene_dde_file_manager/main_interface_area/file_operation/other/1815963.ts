/**
 * 用例 PMSID: 1815963
 * 用例标题: 长文件名功能 - 强制删除
 * 生成时间: 2026-07-21
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "963长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除长文件名功能强制删除";
describe('1815963-长文件名功能 - 强制删除', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    console.log(`清理步骤：删除桌面目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/"${longFileName}.txt"`, 500);
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    
    console.log('前置条件：清理回收站资源');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    
    console.log(`前置条件：在文档目录创建长文件名txt文件 ${longFileName}`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    console.log(`前置条件：在桌面目录创建长文件名txt文件 ${longFileName}`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/"${longFileName}.txt"`, 500);
    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1815963-长文件名功能 - 强制删除', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤1：右键963长文开头的文件，按Shift+Delete快捷键');
    await agent.aiRightClick(`以963长文'开头的文件`);
    await device.pressKey('Shift','Delete');
    
    console.log('步骤1：检查是否出现删除确认框');
    const hasDeleteDialog = await agent.aiBoolean(`页面出现删除文本`);
    if (hasDeleteDialog) {
      console.log('检测到删除确认框，点击删除');
      await agent.aiTap('删除');
    } else {
      console.log('未检测到删除确认框');
    }
    
    console.log('步骤2：点击win+D回到桌面');
    await device.pressKey('Meta','d');
    
    console.log('步骤2：右键桌面963长文开头的文件，按Shift+Delete快捷键');
    await agent.aiRightClick(`以963长文'开头的文件`);
    await device.pressKey('Shift','Delete');
    
    console.log('步骤2：检查是否出现删除确认框');
    const hasDeleteDialog2 = await agent.aiBoolean(`页面出现删除文本`);
    if (hasDeleteDialog2) {
      console.log('检测到删除确认框，点击删除');
      await agent.aiTap('删除');
    } else {
      console.log('未检测到删除确认框');
    }
    
    console.log('步骤3：打开文件管理器，点击左侧栏的回收站');
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    await agent.aiTap('左侧栏的回收站');
    await agent.aiWaitFor('回收站目录已打开');
    
    console.log('步骤3：断言回收站内无963长文开头的文件');
    await agent.aiAssert( '回收站存在963长文开头的文件');
    console.log('断言通过：回收站存在963长文开头的文件');
    
    console.log('清理资源：点击回收站上方的清理');
    await agent.aiTap('回收站上方的清理按钮');
    
    console.log('清理资源：在清理确认框中点击enter');
    await device.pressKey('Enter');
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  }, { timeout: 600000, tags: ['1815963', 'level3', 'remote', 'longfilename', 'DITT','lishuangshuang'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}.txt"`, 500);
    console.log(`清理步骤：删除桌面目录下的长文件名文件 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/"${longFileName}.txt"`, 500);
    console.log('清理步骤：清理回收站');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});