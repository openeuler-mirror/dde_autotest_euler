/**
 * 用例 PMSID: 1850143
 * 用例标题: 访问闪存盘
 * 生成时间: 2026-04-23 20:00:30
 * 用例编写人: UT000159（游伟）
 */

describe('1850143-访问闪存盘', () => {

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await device.pressKey('Super', 'Down');
    await system.exec(`killall dde-file-manager`);
    await agent.aiWaitFor('没有打开的文件管理器窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850143-访问闪存盘', async ({ device, system, agent, uos }) => {
    const USB_FLASH = process.env.USB_FLASH;

    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器打开成功');

    // 预期 1: 侧边栏有${USB_FLASH}磁盘
    console.log(`预期 1: 侧边栏有${USB_FLASH}磁盘`);
    await agent.aiAssert(`文件管理器侧边栏有${USB_FLASH}磁盘`);

    // 步骤 2: 侧边栏点击闪存盘${USB_FLASH}
    console.log(`步骤 2: 侧边栏点击闪存盘${USB_FLASH}`);
    await agent.aiTap(`文件管理器侧边栏的${USB_FLASH}磁盘`);

    // 预期 2: ${USB_FLASH}磁盘打开成功
    console.log(`预期 2: ${USB_FLASH}磁盘打开成功`);
    await agent.aiWaitFor(`${USB_FLASH}磁盘打开成功`);

  }, { timeout: 600000, tags: ['1850143', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'USB'] });

});
