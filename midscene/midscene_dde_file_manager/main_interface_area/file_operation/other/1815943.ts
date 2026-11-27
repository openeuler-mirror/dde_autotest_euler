/**
 * 用例 PMSID: 1815943
 * 用例标题: 长文件名功能 - 在终端中打开
 * 生成时间: 2026-07-22
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "943在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开在终端打开";
describe('1815943-长文件名功能 - 在终端中打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    
    const USB_FLASH = process.env.USB_FLASH;
    console.log(`获取到U盘名称：${USB_FLASH}`);
    console.log(`清理步骤：删除U盘目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /media/${process.env.TEST_USERNAME}/${USB_FLASH}/"${longFileName}"`, 500);
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    
    console.log('前置条件：清理回收站资源');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    
    console.log(`前置条件：在文档目录创建长文件名文件夹 ${longFileName}`);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);

    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1815943-长文件名功能 - 在终端中打开', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤1：右键943在终端开头的文件夹，点击在终端中打开');
    await agent.aiRightClick(`以943在终端'开头的文件夹`);
    await agent.aiTap('在终端中打开');
    
    console.log('步骤1：断言可在终端打开文件夹，路径是943在终端');
    await agent.aiWaitFor('943在终端');
    await agent.aiAssert('943在终端');
    console.log('断言通过：终端已打开，路径包含943在终端');
    
    console.log('步骤1：关闭当前终端窗口');
    await agent.aiTap('终端窗口右上角关闭按钮:X', { deepThink: true });
    await agent.aiWaitFor('终端窗口已关闭');
    
    console.log('步骤2：双击943在终端开头的文件夹');
    await agent.aiTap("左侧栏的文档目录");
    await agent.aiTap('文档目录空白区域');
    await agent.aiDoubleClick(`以943在终端'开头的文件夹`);
    await agent.aiWaitFor('文件夹已打开');
    
    console.log('步骤2：在空白处右键点击在终端中打开');
    await agent.aiRightClick('文件夹空白区域');
    await agent.aiTap('在终端中打开');
    
    console.log('步骤2：断言可在终端打开文件夹，路径是943在终端');
    await agent.aiWaitFor('943在终端');
    await agent.aiAssert('943在终端');
    console.log('断言通过：终端已打开，路径包含943在终端');
    
    console.log('步骤2：关闭当前终端窗口');
    await agent.aiTap('终端窗口右上角关闭按钮:X', { deepThink: true });
    
    console.log('将943在终端开头的文件夹复制到U盘');
    await agent.aiTap("左侧栏的文档目录");
    await agent.aiTap('文档目录空白区域');
    
    
    const USB_FLASH = process.env.USB_FLASH;
    console.log(`步骤3：点击左侧栏的U盘 ${USB_FLASH}`);
    await agent.aiTap(`左侧栏的${USB_FLASH}`);
    // await agent.aiWaitFor('U盘目录已打开');
    await agent.aiRightClick('U盘目录空白区域');
    await agent.aiTap('创建文件夹');
    await device.typeText(longFileName, true);
    
    console.log('步骤3：右键943在终端开头的文件夹，点击在终端中打开');
    await agent.aiRightClick(`以943在终端'开头的文件夹`);
    await agent.aiTap('在终端中打开');
    
    console.log('步骤3：断言可在终端打开文件夹，路径是943在终端');
    await agent.aiWaitFor('943在终端');
    await agent.aiAssert('943在终端');
    console.log('断言通过：终端已打开，路径包含943在终端');
    
    console.log('步骤3：关闭当前终端窗口');
    await agent.aiTap('终端窗口右上角关闭按钮:X', { deepThink: true });
    await agent.aiTap(`左侧栏的${USB_FLASH}`);
    console.log('步骤4：双击943在终端开头的文件夹');
    await agent.aiTap('U盘目录空白区域');
    await agent.aiDoubleClick(`以943在终端'开头的文件夹`);
    await agent.aiWaitFor('文件夹已打开');
    
    console.log('步骤4：在空白处右键点击在终端中打开');
    await agent.aiRightClick('文件夹空白区域');
    await agent.aiTap('在终端中打开');
    
    console.log('步骤4：断言可在终端打开文件夹，路径是943在终端');
    await agent.aiWaitFor('943在终端');
    await agent.aiAssert('943在终端');
    console.log('断言通过：终端已打开，路径包含943在终端');
    
    console.log('步骤4：关闭当前终端窗口');
    await agent.aiTap('终端窗口右上角关闭按钮:X', { deepThink: true });
    await agent.aiTap(`左侧栏的${USB_FLASH}`);
  }, { timeout: 600000, tags: ['1815943', 'level3', 'remote', 'longfilename', 'DITT', 'lishuangshuang'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await device.pressKey('delete');
    await device.pressKey('enter');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    
    const USB_FLASH = process.env.USB_FLASH;
    console.log(`清理步骤：删除U盘目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /media/${process.env.TEST_USERNAME}/${USB_FLASH}/"${longFileName}"`, 500);
    
    console.log('清理步骤：清理回收站');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/files/*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/.local/share/Trash/info/*`, 500);
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});