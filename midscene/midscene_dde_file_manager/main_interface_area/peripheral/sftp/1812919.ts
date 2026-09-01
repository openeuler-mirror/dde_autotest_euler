
/**
 * 用例 PMSID: 1812919
 * 用例标题: [t][core]sftp挂载-不勾选记住密码
 * 生成时间: 2026-02-09 20:02:31
 * 用例编写人：UT006252(杨通)
 */

describe('1812919-[t][core]sftp挂载-不勾选记住密码', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
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

  test('1812919-[t][core]sftp挂载-不勾选记住密码', async ({ device, agent, uos,system}) => {
    const ip=process.env.SFTP_IP
    const sftppwd = process.env.SFTP_PASSWORD;
    const sftpname = process.env.SFTP_USERNAME;
    //挂载SFTP
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
    await device.typeText(`${sftpname}`);
    await agent.aiInput( `${sftppwd}`,'密码输入框');
    await agent.aiTap("连接文本");
    await system.exec(`sleep 3`);
    await agent.aiRightClick(`侧边栏的${ip}`);
    await system.exec(`sleep 1`);
    await agent.aiTap("取消记住密码并卸载文本");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://${ip}`, true);
    await system.exec(`sleep 1`);
    await agent.aiAssert("出现需要认证文本");
    
  }, { timeout: 1200000, tags: ['1812919', 'level2','sftp','DITT','yangtong'] });

  afterEach(async ({ device ,system}) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const ip=process.env.SFTP_IP
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    
  });
});
