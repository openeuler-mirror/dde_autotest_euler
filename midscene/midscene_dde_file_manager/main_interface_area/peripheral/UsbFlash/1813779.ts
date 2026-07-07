
/**
 * 用例 PMSID: 1813779
 * 用例标题: 【U盘】[091]添加数据-从smb右键发送到移动设备目录下
 * 生成时间: 2026-02-09 13:24:43
 * 用例编写人：UT006252(杨通)
 */

describe('1813779-【U盘】[091]添加数据-从smb右键发送到移动设备目录下', () => {
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

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const caseDir = process.env.TESTCASE_DIR;
    const username = process.env.TEST_USERNAME;
    const dir=process.env.SMB_DIR;
    const ip=process.env.SMB_IP;
    //匿名挂载smb
    const {SmbMount}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent,system,device);
    await system.exec(`touch /media/${username}/smbmounts/smb-share:server=${ip},share=${dir}/1813779.txt`); 
  });

  test('1813779-【U盘】[091]添加数据-从smb右键发送到移动设备目录下', async ({ device, agent, uos,system}) => {
    const usb = process.env.USB_FLASH;
    const username = process.env.TEST_USERNAME;
    //右键图标发送文件到U盘
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor("出现1813779文本");
    await agent.aiRightClick("1813779上面的图标");
    await agent.aiTap("发送到文本");
    await agent.aiTap(`${usb}文本`);
    //切换到U盘目录
    await device.pressKey('Ctrl','l');
    await device.pressKey('Ctrl','a');
    await device.typeText(`/media/${username}/${usb}`, true);
    await system.exec(`sleep 3`);
    await agent.aiAssert("出现1813779文本");
  }, { timeout: 1200000, tags: ['1813779', 'level2','UsbFlash','DITT','yangtong'] });

  afterEach(async ({ device,system,agent}) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    const usb = process.env.USB_FLASH;
    const username = process.env.TEST_USERNAME;
    const dir=process.env.SMB_DIR;
    const ip=process.env.SMB_IP;
    //清除文件
    await system.exec(`rm /media/${username}/smbmounts/smb-share:server=${ip},share=${dir}/1813779.txt`);
    await system.exec(`rm /media/${username}/${usb}/1813779.txt`);
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
