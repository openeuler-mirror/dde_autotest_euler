
/**
 * 用例 PMSID: 1812907
 * 用例标题: sftp挂载-连接到服务器输入框输入无效sftp地址
 * 生成时间: 2026-02-25 15:18:12
 * 用例编写人：UT006252(杨通)
 */

describe('1812907-sftp挂载-连接到服务器输入框输入无效sftp地址', () => {
  beforeAll(async ({ device, uos, agent ,system}) => {
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

  test('1812907-sftp挂载-连接到服务器输入框输入无效sftp地址', async ({ device, agent, uos,system }) => {
    //输入sftp:///
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp:///`, true);
    await agent.aiWaitFor("未指定主机名文本");
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");

    //输入sftp://
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://`, true);
    await agent.aiWaitFor("未指定主机名文本");
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");

    //输入sftp:/
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp:/`, true);
    await agent.aiWaitFor("未指定主机名文本");
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");

    //输入无效ip
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`sftp://256.256.256.256`, true);
    await system.exec(`sleep 10`);
    await agent.aiAssert("页面出现挂载失败文本");
    await agent.aiTap("确定文本");

  }, { timeout: 1200000, tags: ['1812907', 'level3','sftp','DITT','yangtong'] });

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
