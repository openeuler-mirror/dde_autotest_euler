/**
 * 用例 PMSID: 1814427
 * 用例标题: 【本地磁盘】第三方应用交互-打开磁盘管理器后操作文管
 * 生成时间: 2026-07-08 10:00:00
 * 用例编写人： UT000649（黄甜）
 */

describe('1814427-本地磁盘-第三方应用交互-打开磁盘管理器后操作文管', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Super+E');
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    const caseDir = process.env.TESTCASE_DIR;
    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    
    const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanFtpMounts(agent, system, device);

    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
        
    const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await FtpMount(agent, system, device, 1);

    await agent.aiTap('文件管理器窗口右上角的关闭按钮:x');
  });
    
  test('1814427-本地磁盘-第三方应用交互-打开磁盘管理器后操作文管', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1814427 ===');

    const smbIp = process.env.SMB_IP;
    const ftpIp = process.env.FTP_IP;
    const TEST_PASSWORD = process.env.TEST_PASSWORD;

    console.log('步骤1：已打开磁盘管理器检查计算机页面盘符显示');
    await uos.openApp('磁盘管理器');
    await agent.aiWaitFor('读取磁盘信息需要认证弹窗');
    await agent.aiInput( `${TEST_PASSWORD}`,'密码输入框');
    await agent.aiTap('读取磁盘信息需要认证弹窗里的确定');
    await agent.aiWaitFor('桌面无读取磁盘信息需要认证弹窗');

    await uos.openApp('文件管理器');
    await agent.aiAssert('计算机页面不展示系统盘符');
    console.log('计算机页面不展示系统盘符');

    console.log('步骤2：挂载U盘，检查盘符显示');
    const usbFlash = process.env.USB_FLASH;
    await agent.aiAssert(`不展示名称为${usbFlash}的盘符（名称大写）,忽略名称包含无其他字符的盘符`);
    console.log('不展示U盘盘符');

    console.log('步骤3：打开文管，检查已挂载smb、ftp分区是否正常显示');
    await agent.aiAssert(`已挂载的smb目录${smbIp}正常显示`);
    await agent.aiAssert(`已挂载的ftp目录${ftpIp}正常显示`);
    console.log('smb、ftp分区可正常显示');

    await uos.closeCurrentWindow();
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-diskmanager', 500);

    console.log('✅ 1814427用例测试完成');
  }, { timeout: 1200000, tags: ['1814427', 'level3', 'LocalDisk', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    
    const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanFtpMounts(agent, system, device);
    
    await system.exec('killall deepin-diskmanager', 500);
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});