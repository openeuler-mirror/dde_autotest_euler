
/**
 * 用例 PMSID: 1812811
 * 用例标题: sftp-右键菜单右键病毒查杀
 * 生成时间: 2026-02-25 17:12:47
 * 用例编写人：UT006252(杨通)
 */

describe('1812811-sftp-右键菜单右键病毒查杀', () => {
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

  test('1812811-sftp-右键菜单右键病毒查杀', async ({ device, agent, uos,system}) => {
    const caseDir = process.env.TESTCASE_DIR;
    let result = await system.exec(`id -u`);
    const uid = result.stdout.trim();
    const ip=process.env.SFTP_IP
    //挂载SFTP
    const {SftpMount}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SftpMount(agent,system,device);
    await system.exec(`rm /run/user/${uid}/gvfs/sftp:host=${ip}//sftp/upload/* -rf`);
    await system.exec(`sleep 3`);
    //在sftp目录内新建文件夹
    await agent.aiRightClick("页面空白处");
    await agent.aiTap("新建文件夹文本");
    await device.typeText(`18目录`, true);

    //在sftp目录内新建文本文档
    await agent.aiRightClick("页面空白处");
    await agent.aiTap("新建文档文本");
    await agent.aiTap("文本文档文本")
    await device.typeText(`1812811`, true);

    //右键文件夹进行病毒查杀
    await agent.aiRightClick(`18目录上面的图标`);
    await agent.aiTap("病毒查杀文本");
    await system.exec(`sleep 3`);
    await agent.aiAssert("页面出现没有发现异常文本");
    await system.exec(`killall deepin-defender`);

    //右键文本文档进行病毒查杀
    await agent.aiRightClick(`1812811上面的图标`);
    await agent.aiTap("病毒查杀文本");
    await system.exec(`sleep 3`);
    await agent.aiAssert("页面出现没有发现异常文本");
    await system.exec(`killall deepin-defender`);
  }, { timeout: 1200000, tags: ['1812811', 'level3','sftp','DITT','yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const sftpname = process.env.SFTP_USERNAME;
    const ip=process.env.SFTP_IP
    await system.exec(`rm /run/user/1000/gvfs/sftp:host=${ip}/home/${sftpname}/18目录 -rf`);
    await system.exec(`rm /run/user/1000/gvfs/sftp:host=${ip}/home/${sftpname}/1812811.txt`);
    const {cleanSftpMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent,system);
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    
  });
});
