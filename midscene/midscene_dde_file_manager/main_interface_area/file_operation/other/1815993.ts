/**
 * 用例 PMSID: 1815993
 * 用例标题: 长文件名功能 - 文件夹/文件，以打开方式打开
 * 生成时间: 2026-07-16
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "993长文件名功能文件夹-文件以打开方式打开长文件名功能文件夹-文件以打开方式打开长文件名功能文件夹-文件以打开方式打开长文件名功能文件夹-文件以打开方式打开长文件名功能文件夹-文件以打开方式打开";
const usbFlash = process.env.USB_FLASH || 'UOS';
const testUsername = process.env.TEST_USERNAME;

describe('1815993-长文件名功能 - 文件夹/文件，以打开方式打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf "/home/${testUsername}/Documents/${longFileName}"`, 500);
    
    // 清理U盘内以"993"开头的所有文件和文件夹
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      console.log(`清理U盘(${usbPath})内以"993"开头的所有文件和文件夹`);
      await system.exec(`find "${usbPath}" -maxdepth 1 -name "993*" -exec rm -rf {} \\;`, 2000);
    }
    
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    console.log(`前置条件：在文档目录创建长文件名文件夹 ${longFileName}`);
    await system.exec(`mkdir -p "/home/${testUsername}/Documents/${longFileName}"`, 500);
    
    
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815993-长文件名功能 - 文件夹/文件，以打开方式打开', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：右键长文件名文件夹，点击打开方式，选择文件管理器');
    await agent.aiRightClick(`以993长文'开头的文件夹`);
    await agent.aiTap('打开方式');
    await agent.aiTap('文件管理器');
    
    await agent.aiAssert('文件利用文件管理器打开成功');
    console.log('断言通过：文件利用文件管理器打开成功');
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });
    const USB_FLASH = process.env.USB_FLASH;
    console.log(`获取到U盘名称：${USB_FLASH}`);

    console.log('步骤2：点击左侧栏的U盘');
    await agent.aiTap(`左侧栏的${USB_FLASH}`);
  
    console.log('步骤2：右键创建长文件名文件夹'); 
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText(longFileName, true);
    
    await agent.aiAssert(`以993长文'开头的txt文件`);
    console.log('断言通过：U盘上长文件名文件创建成功');

    console.log('步骤3：右键长文件名文件，点击打开方式，选择文本编辑器');
    await agent.aiRightClick(`以993长文'开头的文档`);
    await agent.aiTap('打开方式');
    await agent.aiTap('文本编辑器');

    
    await agent.aiAssert('文本编辑器打开成功,文本编辑器页面上方存在“以993长文"的标签');
    console.log('断言通过：文件利用文本编辑器打开成功');
    await agent.aiTap('新的文本编辑器窗口右上角关闭按钮:X', { deepThink: true });
    await agent.aiRightClick(`以993长文'开头的文档`);
    await agent.aiTap('删除');
    await device.pressKey('Enter');

   await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });
   await system.exec("kill -TERM $(pidof dde-file-manager)");

  }, { timeout: 1200000, tags: ['1815993', 'level3', 'remote', 'longfilename', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf "/home/${testUsername}/Documents/${longFileName}"`, 500);
    
    // 清理U盘内以"993"开头的所有文件和文件夹
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      console.log(`清理U盘(${usbPath})内以"993"开头的所有文件和文件夹`);
      await system.exec(`find "${usbPath}" -maxdepth 1 -name "993*" -exec rm -rf {} \\;`, 2000);
    }
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});