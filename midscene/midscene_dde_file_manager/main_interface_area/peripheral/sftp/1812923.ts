
/**
 * 用例 PMSID: 1812923
 * 用例标题: sftp目录内文件夹添加书签_
 * 生成时间: 2026-02-25 16:39:14
 * 用例编写人：UT006252(杨通)
 */

describe('1812923-sftp目录内文件夹添加书签_', () => {
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

  test('1812923-sftp目录内文件夹添加书签_', async ({ device, agent, uos,system }) => {
    const caseDir = process.env.TESTCASE_DIR;
    let result = await system.exec(`id -u`);
    const uid = result.stdout.trim();
    //挂载SFTP
    const {SftpMount}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SftpMount(agent,system,device);
    await system.exec(`sleep 3`);
    //清除sftp目录文件和目录
    const ip=process.env.SFTP_IP
    await system.exec(`rm /run/user/${uid}/gvfs/sftp:host=${ip}//sftp/upload/* -rf`);
    await device.pressKey('F5');
    //在sftp目录内新建文件夹
    await agent.aiRightClick("页面空白处");
    await agent.aiTap("新建文件夹文本");
    await device.typeText(`1812923`, true);

    //给文件夹添加快捷访问
    await agent.aiRightClick(`1812923文件夹`);
    await agent.aiTap("添加到快捷访问文本");
    await agent.aiAssert("侧边栏出现1812923文本");

    //访问快捷访问
    await agent.aiTap(`侧边栏的1812923文本`);
    await system.exec(`sleep 1`);
    await agent.aiAssert("页面出现文件夹为空文本");
  }, { timeout: 1200000, tags: ['1812923', 'level2','sftp','DITT','yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const sftpname = process.env.SFTP_USERNAME;
    const ip=process.env.SFTP_IP
    let result = await system.exec(`id -u`);
    const uid = result.stdout.trim();
    await system.exec(`rm /run/user/${uid}/gvfs/sftp:host=${ip}/sftp/upload/1812923 -rf`);
    const {cleanSftpMounts}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent,system);
    const {clearEnvironment,closeFileManager}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    
  });
});
