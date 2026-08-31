
/**
 * 用例 PMSID: 1812441
 * 用例标题: 右键菜单--计算机页面ftp目录右键-属性
 * 生成时间: 2026-02-28 16:46:09
 * 用例编写人：UT006252(杨通)
 */

describe('1812441-右键菜单--计算机页面ftp目录右键-属性', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置卸载 ftp，避免已有挂载影响
    const ip = process.env.FTP_IP;
    await system.exec(`gio mount -u "ftp://${ip}"`);
  });

  test('1812441-右键菜单--计算机页面ftp目录右键-属性', async ({ device, agent, uos }) => {
    const ip = process.env.FTP_IP;
    const ftpname = process.env.FTP_USERNAME;
    const ftppwd = process.env.FTP_PASSWORD;
    const TEST_PASSWORD = process.env.TEST_PASSWORD;

    console.log('通过地址栏挂载 ftp');
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`ftp://${ip}`, true);
    await device.typeText(`${ftpname}`);
    await agent.aiInput(`${ftppwd}`, '密码输入框');
    await agent.aiTap('连接按钮');

    const boolA = await agent.aiBoolean('页面出现卸载文件系统需要认证文本');
    if (boolA) {
      console.log('触发弹窗认证，输入密码');
      await device.typeText(`${TEST_PASSWORD}`, true);
    } else {
      console.log('未触发弹窗认证');
    }

    // 确认侧边栏已出现 ftp 目录
    await agent.aiAssert(`侧边栏出现${ip}文本`);

    console.log('右键点击 ftp 目录并打开属性');
    await agent.aiRightClick(`侧边栏中的${ip}文本`);
    await agent.aiTap('属性');

    console.log('验证属性弹窗信息');
    await agent.aiAssert('正常弹出属性弹窗，显示该ftp目录的图标、文件名、使用容量/总容量、基本信息：设备类型、总容量、文件系统、文件个数、可用空间');
  }, { timeout: 1200000, tags: ['1812441', 'level3', 'ftp', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const ip = process.env.FTP_IP;
    await system.exec(`gio mount -u "ftp://${ip}"`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
