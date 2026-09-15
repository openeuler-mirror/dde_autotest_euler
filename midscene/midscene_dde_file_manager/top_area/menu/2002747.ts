/**
 * 用例 PMSID: 2002747
 * 用例标题: 扩展名隐藏-取消勾选"显示文件扩展名"后，检查FTP目录文件名是否隐藏
 * 生成时间: 2026-05-19 12:00:00
 * 用例编写人: UT000649（黄甜）
 */

describe('2002747-扩展名隐藏-FTP目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.FTP_IP;
    // 前置完全卸载ftp
    const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanFtpMounts(agent, system);
    // 用户名挂载ftp
    const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await FtpMount(agent, system, device, 1);
    await system.exec(`echo 1 > /run/user/1000/gvfs/ftp\:host\=${ip}/2002747.pptx`, 500);
    await agent.aiRightClick("文件管理器窗口空白处");
    await agent.aiTap("刷新");
  });

  test('2002747-扩展名隐藏-FTP目录', async ({ device, agent, uos }) => {
    await agent.aiTap("文件管理器窗口的主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiAssert("默认勾选显示文件扩展名");

    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("取消勾选显示文件扩展名");
    await agent.aiTap("窗口右上角关闭按钮:X");    
    
    await agent.aiAssert("目录下存在2002747文件");



  }, { timeout: 600000, tags: ['2002747', 'level2', 'smoke', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口的主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiTap("窗口右上角关闭按钮:X");
    const caseDir = process.env.TESTCASE_DIR;
    const ip = process.env.FTP_IP;
    //清除文件
    await system.exec(`rm -rf /run/user/1000/gvfs/ftp\:host\=${ip}/2002747*`, 500);
    // 卸载ftp
    const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanFtpMounts(agent, system, 1);
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});