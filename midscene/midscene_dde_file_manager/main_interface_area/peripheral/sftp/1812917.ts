
/**
 * 用例 PMSID: 1812917
 * 用例标题: [008]sftp-输入错误账号密码不能访问sftp
 * 生成时间: 2026-02-09 20:40:40
 * 用例编写人：UT006252(杨通)
 */

describe('1812917-[008]sftp-输入错误账号密码不能访问sftp', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    //打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    //卸载sftp
    const caseDir = process.env.TESTCASE_DIR;
    const {cleanSftpMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent,system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1812917-[008]sftp-输入错误账号密码不能访问sftp', async ({ device, agent, uos,system }) => {
    const ip=process.env.SFTP_IP
    const sftppwd = process.env.SFTP_PASSWORD;
    const sftpname = process.env.SFTP_USERNAME;
    //输入错误的账户
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://${ip}`, true);
    const boolA = await agent.aiBoolean(`页面出现标识验证失败文本`);
    if (boolA) {
        console.log('触发弹窗，点击仍然登陆');
        await agent.aiTap("仍然登陆文本");
    } else {
        console.log('未触发弹窗认证');
    }
    await agent.aiWaitFor("需要认证文本");
    await device.typeText(`error`);
    await agent.aiInput( `${sftppwd}`,'密码输入框');
    await agent.aiTap("连接文本");
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");
    //输入错误的密码
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://${ip}`, true);
    await agent.aiWaitFor("需要认证文本");
    await device.typeText(`${sftpname}`);
    await agent.aiInput( `error`,'密码输入框');
    await agent.aiTap("连接文本");
    //等待8s
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");
    //输入错误的账户和密码
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://${ip}`, true);
    await agent.aiWaitFor("需要认证文本");
    await device.typeText(`error`);
    await agent.aiInput( `error`,'密码输入框');
    await agent.aiTap("连接文本");
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");
  }, { timeout: 1200000, tags: ['1812917', 'level2','sftp','DITT','yangtong'] });

  afterEach(async ({ device,system}) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
