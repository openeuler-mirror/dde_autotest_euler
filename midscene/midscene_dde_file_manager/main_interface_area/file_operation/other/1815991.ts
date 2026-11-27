/**
 * 用例 PMSID: 1815991
 * 用例标题: 长文件名功能 - 文件夹，以管理员身份打开
 * 生成时间: 2026-07-20
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "991长文件名功能文件夹以管理员身份打开长文件名功能文件夹以管理员身份打开长文件名功能文件夹以管理员身份打开长文件名功能文件夹以管理员身份打开长文件名功能文件夹以管理员身份打开";
describe('1815991-长文件名功能 - 文件夹，以管理员身份打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    console.log('1. beforeAll: 初始化测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);

    // 清理U盘内以991开头的所有文件和文件夹
    const USB_FLASH = process.env.USB_FLASH;
    const testUsername = process.env.TEST_USERNAME;
    const usbMountPoint = `/media/${testUsername}/${USB_FLASH}`;
    console.log(`清理步骤：删除U盘内以991开头的所有文件和文件夹`);
    await system.exec(`find "${usbMountPoint}" -maxdepth 1 -name "991*" -exec rm -rf {} \\; 2>/dev/null`, 2000);

    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    console.log(`前置条件：在文档目录创建长文件名文件夹 ${longFileName}`);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/"${longFileName}"`, 500);
    
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1815991-长文件名功能 - 文件夹，以管理员身份打开', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器');
    for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');
    
    console.log('步骤2：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    
    console.log('步骤3：右键长文件名文件夹，点击以管理员身份打开');
    await agent.aiRightClick(`以991长文'开头的文件夹`);
    await agent.aiTap('以管理员身份打开');
    
    console.log('步骤4：检查是否出现用户管理员鉴权弹框');
    const hasAuthDialog = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuthDialog) {
      console.log('检测到管理员鉴权弹框，输入密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    } else {
      console.log('未检测到管理员鉴权弹框');
    }

    await agent.aiAssert('文件夹打开成功');
    console.log('断言通过：文件夹以管理员身份打开成功');
    
    console.log('步骤5：关闭以管理员身份打开的窗口');
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });
    const USB_FLASH = process.env.USB_FLASH;
    console.log(`获取到U盘名称：${USB_FLASH}`);

    console.log('步骤2：点击左侧栏的U盘');
    await agent.aiTap(`左侧栏的${USB_FLASH}`);
  
    console.log('步骤2：右键创建长文件名文件夹'); 
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    // await agent.aiTap('文本文档');
    await device.typeText(longFileName, true);
    
    await agent.aiAssert(`以991长文'开头的文件夹`);
    console.log('断言通过：U盘上长文件名文件创建成功');

    console.log('步骤3：右键长文件名文件，点击打开方式，选择文本编辑器');
    await agent.aiRightClick(`以991长文'开头的文件夹`);
   await agent.aiTap('以管理员身份打开');
    
    console.log('步骤4：检查是否出现用户管理员鉴权弹框');
    const hasAuthDialogUsb = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuthDialogUsb) {
      console.log('检测到管理员鉴权弹框，输入密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    } else {
      console.log('未检测到管理员鉴权弹框');
    }

    await agent.aiAssert('文件夹打开成功');
    console.log('断言通过：文件夹以管理员身份打开成功');
    await agent.aiTap('新的文件管理器窗口右上角关闭按钮:X', { deepThink: true });
    await agent.aiRightClick(`以991长文'开头的文件夹`);
    await agent.aiTap('删除');
    await device.pressKey('Enter');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  }, { timeout: 600000, tags: ['1815991', 'level3', 'remote', 'longfilename', 'DITT', 'lishuangshuang'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log(`清理步骤：删除文档目录下的长文件名文件夹 ${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);

    // 清理U盘内以991开头的所有文件和文件夹
    const USB_FLASH = process.env.USB_FLASH;
    const testUsername = process.env.TEST_USERNAME;
    const usbMountPoint = `/media/${testUsername}/${USB_FLASH}`;
    console.log(`清理步骤：删除U盘内以991开头的所有文件和文件夹`);
    await system.exec(`find "${usbMountPoint}" -maxdepth 1 -name "991*" -exec rm -rf {} \\; 2>/dev/null`, 2000);
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});