
/**
 * 用例 PMSID: 1813193
 * 用例标题: [088][core]保存密码挂载smb，卸载后直接连接
 * 生成时间: 2026-02-06 16:00:35
 * 用例编写人：UT006252(杨通)
 */


describe('1813193-[088][core]保存密码挂载smb，卸载后直接连接', () => {
  beforeAll(async ({ device, uos, agent,system}) => {
    const caseDir = process.env.TESTCASE_DIR;
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    //打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    //前置完全卸载smb
    const {cleanSmbMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent,system);
    // 重置smb密码
    const {ResetSmbPwd}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await ResetSmbPwd(system);
  });

  beforeEach(async ({ device, agent,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const caseDir = process.env.TESTCASE_DIR;
    //用户名挂载smb
    const {SmbMount}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent,system,device,1);
  });

  test('1813193-[088][core]保存密码挂载smb，卸载后直接连接', async ({ device, agent, uos }) => {
     const ip=process.env.SMB_IP;
     const dir=process.env.SMB_DIR;
    await agent.aiRightClick(`侧边栏中的${ip}文本`);
    await agent.aiWaitFor("出现重命名文本");
    await agent.aiTap("卸载选项");
    await agent.aiTap(`侧边栏中的${ip}文本`);
    await agent.aiWaitFor("出现print文本");
    await agent.aiDoubleClick(`${dir}文本`);
    await agent.aiAssert("不出现需要授权来访问文本");
  }, { timeout: 1200000, tags: ['1813193', 'level2','smb','DITT','yangtong'] });

  afterEach(async ({ device,agent,system, }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    console.log('卸载smb');
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
