/**
 * 用例 PMSID: 1813199
 * 用例标题: [064][core]右键菜单-侧边栏smb目录右键呼出正常
 * 生成时间: 2026-02-03 20:11:23
 * 用例编写人：UT006252(杨通)
 */

describe('1813199-[064][core]右键菜单-侧边栏smb目录右键呼出正常', () => {
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
    // 重置smb密码
    const {ResetSmbPwd}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await ResetSmbPwd(system);
  });

  beforeEach(async ({ device, agent,system}) => {
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    const dir=process.env.SMB_DIR;
    const ip=process.env.SMB_IP;
    console.log('2. beforeEach: 每个测试前的准备');
    console.log('挂载smb-地址栏-匿名');
    await device.pressKey('Ctrl','l');
    for (let i = 0; i < 15; i++) 
      {
        await device.pressKey('Backspace');
      }
    await device.typeText(`smb://${ip}/${dir}`, true);
    await agent.aiWaitFor("出现需要授权来访问文本");
    await agent.aiTap("匿名选项");
    await system.exec("sleep 2");
    await agent.aiTap("连接选项");
    await system.exec("sleep 2");
    const boolA = await agent.aiBoolean(`页面出现卸载文件系统需要认证文本`);
    if (boolA) {
        console.log('触发弹窗认证，输入密码');
        await device.typeText(`${TEST_PASSWORD}`, true);
    } else {
        console.log('未触发弹窗认证');
    }
  });

  test('1813199-[064][core]右键菜单-侧边栏smb目录右键呼出正常', async ({ device, agent, uos }) => {
    const ip=process.env.SMB_IP;
    console.log('检测侧边栏菜单呼出是否正确');
    await agent.aiRightClick(`侧边栏中的${ip}文本`);
    await agent.aiWaitFor("出现重命名文本");
    await agent.aiAssert('菜单中出现卸载、取消记住密码并卸载、重命名选项');
  }, { timeout: 1200000, tags: ['1813199', 'level2','smb','DITT','yangtong'] });

  afterEach(async ({ device,agent,system }) => {
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
