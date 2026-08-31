
/**
 * 用例 PMSID: 1812635
 * 用例标题: [052]FTP挂载-连接到服务器输入框输入无效FTP地址
 * 生成时间: 2026-02-06 21:38:22
 * 用例编写人：UT006252(杨通)
 */

describe('1812635-[052]FTP挂载-连接到服务器输入框输入无效FTP地址', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
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

  test('1812635-[052]FTP挂载-连接到服务器输入框输入无效FTP地址', async ({ device, agent, uos,system }) => {
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp:///`, true);
    await system.exec("sleep 2");
    await agent.aiAssert(`出现挂载失败文本`);
    await agent.aiTap("确定按钮");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp:/`, true);
    await system.exec("sleep 2");
    await agent.aiAssert(`出现挂载失败文本`);
    await agent.aiTap("确定按钮");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp://`, true);
    await system.exec("sleep 2");
    await agent.aiAssert(`出现挂载失败文本`);
    await agent.aiTap("确定按钮");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`ftp://1.2.3.4`, true);
    await system.exec("sleep 2");
    await agent.aiAssert(`出现挂载失败文本`);
    await agent.aiTap("确定按钮");
  }, { timeout: 1200000, tags: ['1812635', 'level3','ftp','DITT','yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
