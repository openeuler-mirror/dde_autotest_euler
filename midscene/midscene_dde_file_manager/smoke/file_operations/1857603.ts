// @ts-nocheck
/**
 * 用例 PMSID: 1857603
 * 用例标题: Bug转用例场景-文件夹添加到快捷访问
 * 生成时间: 2026-04-20
 * 用例编写人: UT000686（李双双）
 */

describe('1857603-Bug转用例场景-文件夹添加到快捷访问', () => {
  const folderLocal = '1857603';
  const folderUsb = '1857603u';
  const usbFlash = process.env.USB_FLASH;

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
    // 前置条件：在文档目录创建1857603文件夹及1857603.txt文件
    await system.exec(`mkdir -p ~/Documents/${folderLocal}`);
    await system.exec(`touch ~/Documents/${folderLocal}/${folderLocal}.txt`);
    // 前置条件：在U盘创建1857603u文件夹及1857603u.txt文件
    await system.exec(`mkdir -p /media/${process.env.USER}/${usbFlash}/${folderUsb}`);
    await system.exec(`touch /media/${process.env.USER}/${usbFlash}/${folderUsb}/${folderUsb}.txt`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1857603-Bug转用例场景-文件夹添加到快捷访问', async ({ device, agent, uos, system, env }) => {

    // 步骤1: 打开文件管理器，点击文档，右键1857603文件夹点击"添加到快捷访问"，文件管理器左侧栏新增一个"1857603"目录，点击1857603，双击1857603.txt文件，输入1857603，点击CTRL+S，点击ALT+F4
    console.log('步骤1: 文档目录1857603文件夹添加到快捷访问并编辑文件');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器左侧栏的文档");
    await agent.aiWaitFor("文档目录已加载");

    // 右键1857603文件夹，点击"添加到快捷访问"
    await agent.aiRightClick(`${folderLocal}文件夹`);
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("添加到快捷访问");
    await agent.aiAssert(`文件管理器左侧栏新增"${folderLocal}"目录`);

    // 点击左侧栏1857603，双击1857603.txt文件
    await agent.aiTap(`左侧栏的${folderLocal}`);
    await agent.aiWaitFor(`进入${folderLocal}目录`);
    await agent.aiDoubleClick(`${folderLocal}.txt`);
    await agent.aiWaitFor("文本编辑器已打开文件", { timeoutMs: 10000 });

    // 输入1857603，Ctrl+S保存，Alt+F4关闭
    await device.typeText(folderLocal);
    await device.pressKey("Ctrl+S");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("Alt+F4");
    await agent.aiWaitFor("文本编辑器已关闭", { timeoutMs: 5000 });

    // 步骤2: 打开文件管理器，U盘，右键1857603u文件夹点击"添加到快捷访问"，文件管理器左侧栏新增一个"1857603u"目录，点击1857603u，双击1857603u.txt文件，输入1857603u，点击CTRL+S，点击ALT+F4
    console.log('步骤2: U盘1857603u文件夹添加到快捷访问并编辑文件');
    await agent.aiTap(`侧边栏中的${usbFlash}磁盘`);
    await agent.aiWaitFor("U盘目录已加载");

    // 右键1857603u文件夹，点击"添加到快捷访问"
    await agent.aiRightClick(`${folderUsb}文件夹`);
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("添加到快捷访问");
    await agent.aiAssert(`文件管理器左侧栏新增"${folderUsb}"目录`);

    // 点击左侧栏1857603u，双击1857603u.txt文件
    await agent.aiTap(`左侧栏的${folderUsb}`);
    await agent.aiWaitFor(`进入${folderUsb}目录`);
    await agent.aiDoubleClick(`${folderUsb}.txt`);
    await agent.aiWaitFor("文本编辑器已打开文件", { timeoutMs: 10000 });

    // 输入1857603u，Ctrl+S保存，Alt+F4关闭
    await device.typeText(folderUsb);
    await device.pressKey("Ctrl+S");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("Alt+F4");
    await agent.aiWaitFor("文本编辑器已关闭", { timeoutMs: 5000 });

  }, { timeout: 600000, tags: ['1857603', 'level2', 'bookmark', 'yefei'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 移除快捷访问
    try {
      await agent.aiRightClick(`左侧栏的${folderLocal}`);
      await agent.aiTap("从快捷访问移除");
    } catch (error) {
      console.log('移除文档快捷访问失败，继续清理');
    }
    try {
      await agent.aiRightClick(`左侧栏的${folderUsb}`);
      await agent.aiTap("从快捷访问移除");
    } catch (error) {
      console.log('移除U盘快捷访问失败，继续清理');
    }
    // 清理测试文件
    await system.exec(`rm -rf ~/Documents/${folderLocal}`);
    await system.exec(`rm -rf /media/${process.env.USER}/${usbFlash}/${folderUsb}`);
    await system.exec('killall -15 dde-file-manager');
    await system.exec('killall -15 deepin-editor');
    await system.exec('killall dde-file-dialog');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
