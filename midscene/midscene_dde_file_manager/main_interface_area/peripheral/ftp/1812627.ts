
/**
 * 用例 PMSID: 1812627
 * 用例标题: 【FTP】FTP挂载-不勾选记住密码
 * 生成时间: 2026-02-06 20:08:38
 * 用例编写人：UT006252(杨通)
 */

describe('1812627-【FTP】FTP挂载-不勾选记住密码', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    //打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置卸载ftp
    const ip=process.env.FTP_IP
    await system.exec(`gio mount -u "ftp://${ip}"`);
  });

  test('1812627-【FTP】FTP挂载-不勾选记住密码', async ({ device, agent, uos }) => {
    const ip=process.env.FTP_IP
    const ftpname = process.env.FTP_USERNAME;
    const ftppwd = process.env.FTP_PASSWORD;
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp://${ip}`, true);
    await device.typeText(`${ftpname}`);
    await agent.aiInput( `${ftppwd}`,'密码输入框');
    await agent.aiTap("连接按钮");
    const boolA = await agent.aiBoolean(`页面出现卸载文件系统需要认证文本`);
    if (boolA) {
        console.log('触发弹窗认证，输入密码');
        await device.typeText(`${TEST_PASSWORD}`, true);
    } else {
        console.log('未触发弹窗认证');
    }
    await agent.aiAssert(`侧边栏中出现${ip}文本`);
    await agent.aiRightClick(`侧边栏中的${ip}文本`);
    await agent.aiWaitFor("出现重命名文本");
    await agent.aiTap("卸载选项");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp://${ip}`, true);
    await agent.aiAssert("出现需要认证文本");
  }, { timeout: 1200000, tags: ['1812627', 'level2','ftp','DITT','yangtong'] });

  afterEach(async ({ device ,system}) => {
    console.log('4. afterEach: 每个测试后的清理');
    const ip=process.env.FTP_IP
    await system.exec(`gio mount -u "ftp://${ip}"`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
