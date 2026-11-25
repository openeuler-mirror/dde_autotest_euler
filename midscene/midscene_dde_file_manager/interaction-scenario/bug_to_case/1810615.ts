// @ts-nocheck

/**
 * 用例 PMSID: 1810615
 * 用例标题: 从回收站拖拽文件到U盘后进行撤销
 * 生成时间：2026-07-09 10:00:00
 * 用例编写人：UT000649（黄甜）
 */
const TEST_USERNAME = process.env.TEST_USERNAME;

describe('1810615-从回收站拖拽文件到U盘后进行撤销', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`rm -rf /home/${TEST_USERNAME}/.local/share/Trash/files/*`);
    await system.exec('mkdir -p ~/Desktop/1810615_test');
    await system.exec('touch ~/Desktop/1810615_test/test.txt');
  });

  test('1810615-从回收站拖拽文件到U盘后进行撤销', async ({ device, agent, uos, system}) => {
    console.log('=== 开始测试：1810615 ===');

    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('文件管理器侧边栏的桌面图标');

    console.log('前置条件：删除文件到回收站');
    await agent.aiDoubleClick('1810615_test');
    await agent.aiRightClick('test.txt');
    await agent.aiTap('删除');
    await agent.aiTap('文件管理器侧边栏的回收站');
    await agent.aiAssert('回收站内存在test.txt文件');

    const usbFlash = process.env.USB_FLASH;

    console.log('步骤1：将回收站中任意文件拖入到U盘中');
    await agent.aiDrag('test.txt', `文件管理器侧边栏的${usbFlash}`);
    await agent.aiTap(`文件管理器侧边栏的${usbFlash}`);
    await agent.aiAssert('U盘中存在test.txt文件');  
    console.log('文件正常拖入U盘');

    console.log('步骤2：按下Ctrl+Z进行撤销');
    await device.pressKey('Ctrl+Z');
    await agent.aiAssert('删除确认弹窗已显示');
    console.log('弹出删除确认窗口');

    console.log('步骤3：点击"确认"');
    await agent.aiTap('确认');
    await agent.aiAssert('U盘中不存在test.txt文件');
    console.log('U盘中被拖入的文件被删除');

    await uos.closeCurrentWindow();

    console.log('✅ 1810615用例测试完成');
  }, { timeout: 600000, tags: ['1810615', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const usbFlash = process.env.USB_FLASH;
    await system.exec('rm -rf ~/Desktop/1810615_test');
    await system.exec(`rm -rf /media/$USER/${usbFlash}/test.txt`);
    await system.exec(`rm -rf /home/${TEST_USERNAME}/.local/share/Trash/files/*`);
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});