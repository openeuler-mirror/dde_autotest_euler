
/**
 * 用例 PMSID: 1812911
 * 用例标题: [smoke]sftp挂载-非首次访问某一主机sftp地址
 * 生成时间: 2026-02-27 13:41:50
 * 用例编写人：UT006252(杨通)
 */

describe('1812911-[smoke]sftp挂载-非首次访问某一主机sftp地址', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
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
    //挂载SFTP
    const {SftpMount}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SftpMount(agent,system,device);
    await new Promise(resolve => setTimeout(resolve, 3000));
    //卸载sftp
    await cleanSftpMounts(agent,system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1812911-[smoke]sftp挂载-非首次访问某一主机sftp地址', async ({ device, agent, uos }) => {
  //再次挂载sftp
  const ip=process.env.SFTP_IP;
  const sftppwd = process.env.SFTP_PASSWORD;
  const sftpname = process.env.SFTP_USERNAME;
  const TEST_PASSWORD = process.env.TEST_PASSWORD;
  console.log('挂载sftp-地址栏-用户名');
  await device.pressKey('Ctrl','l');
  await device.pressKey('Ctrl','a');
  await device.typeText(`sftp://${ip}`, true);
  await agent.aiWaitFor("需要认证文本");
  }, { timeout: 1200000, tags: ['1812911', 'level2','sftp','DITT','yangtong'] });

  afterEach(async ({ device }) => {
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
