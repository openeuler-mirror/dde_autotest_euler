
/**
 * 用例 PMSID: 1813209
 * 用例标题: [061]访问-不能访问的smb地址
 * 生成时间: 2026-02-09 11:14:19
 * 用例编写人：UT006252(杨通)
 */
describe('1813209-[061]访问-不能访问的smb地址', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    await uos.showDesktop();
    //打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    //前置完全卸载smb
    const {cleanSmbMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent,system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813209-[061]访问-不能访问的smb地址', async ({ device, agent, uos }) => {
    const dir=process.env.SMB_DIR;
    const ip=process.env.SMB_IP;
    await device.pressKey('Ctrl','l');
    for (let i = 0; i < 15; i++) 
      {
        await device.pressKey('Backspace');
      }
    await device.typeText(`smb://10.22.22.22`, true);
    await agent.aiWaitFor("出现挂载失败文本",{ timeoutMs:60000});
    await agent.aiTap("确定文本");
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`smb://${ip}`, true);
    await agent.aiWaitFor("出现print文本",{ timeoutMs:60000});
    await agent.aiAssert(`出现${dir}文本`);
  }, { timeout: 1200000, tags: ['1813209', 'level3','smb','DITT','yangtong'] });

  afterEach(async ({ device,agent,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    console.log('卸载smb');
    const caseDir = process.env.TESTCASE_DIR;
    const {cleanSmbMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent,system,1);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
