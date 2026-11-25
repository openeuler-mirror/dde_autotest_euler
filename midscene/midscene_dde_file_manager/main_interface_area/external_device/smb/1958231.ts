/**
 * 用例 PMSID: 1958231
 * 用例标题: 【SMB】共享挂载点
 * 生成时间: 2026-07-16
 * 用例编写人：UT000686(李双双)
 *  */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

const usbFlash = process.env.USB_FLASH || 'UOS';
const testUsername = process.env.TEST_USERNAME;

describe('1958231-【SMB】共享挂载点', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    
    // 清理已挂载的SMB（按项目规范）
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    
    // 检测U盘是否已挂载，若未挂载则尝试挂载
    let usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    let usbPath = usbPathResult.stdout.trim();
    
    if (!usbPath) {
      console.log(`U盘未挂载，尝试检测并挂载U盘...`);
      // 通过 lsblk 检测U盘设备
      const lsblkResult = await system.exec(`lsblk -o NAME,TYPE,MOUNTPOINT,SIZE -n | grep -E "disk" | grep -v "^nvme\\|^mmc" | head -1`);
      const usbDevice = lsblkResult.stdout.trim().split(/\s+/)[0];
      
      if (usbDevice) {
        const devPath = `/dev/${usbDevice}`;
        console.log(`检测到U盘设备: ${devPath}，开始挂载`);
        const mountPoint = `/media/${testUsername}/${usbFlash}`;
        await system.exec(`sudo mkdir -p "${mountPoint}"`, 500);
        await system.exec(`sudo mount ${devPath} "${mountPoint}"`, 5000);
        
        // 重新检测挂载路径
        usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
        usbPath = usbPathResult.stdout.trim();
      }
      
      if (!usbPath) {
        throw new Error(`U盘挂载失败，USB_FLASH: ${usbFlash}`);
      }
    }
    console.log(`U盘挂载路径: ${usbPath}`);
    
    console.log(`清理U盘内的231smb文件夹: ${usbPath}/231smb`);
    await system.exec(`rm -rf "${usbPath}/231smb"`, 500);
    
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1958231-【SMB】共享挂载点', async ({ device, agent, uos, system, env }) => {
    console.log('前置操作：关闭桌面上存在的弹框');
    for (let i = 0; i < 3; i++) {
      const hasDesktopDialog = await agent.aiBoolean('桌面存在弹框');
      if (hasDesktopDialog) {
        await agent.aiTap('桌面弹框关闭', { deepThink: true });
        await system.exec('sleep 1');
      } else {
        break;
      }
    }
    
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    console.log(`获取到本机IP为：${ip}`);

    console.log('步骤1：打开文件管理器，点击左侧栏的U盘');
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    await uos.maximizeWindow();
    await agent.aiTap(`左侧栏的${usbFlash}`);

    console.log('步骤1：若不存在231smb文件夹则创建');
    const has231smb = await agent.aiBoolean('存在231smb文件夹');
    if (!has231smb) {
      await device.pressKey('shift', 'ctrl', 'N');
      await system.exec('sleep 1');
      await device.typeText('231smb', true);
      await agent.aiAssert('文件夹231smb创建成功');
      console.log('断言通过：文件夹创建成功');
    } else {
      console.log('231smb文件夹已存在，跳过创建');
    }

    console.log('步骤2：右键231smb点击共享文件夹');
    await agent.aiRightClick('231smb');
    await agent.aiTap('共享文件夹');
    
    console.log('步骤2：点击共享此文件夹');
    await agent.aiTap('共享此文件夹前面的勾选框', { deepThink: true });
    
    const hasAuthDialog = await agent.aiBoolean('存在鉴权弹框');
    if (hasAuthDialog) {
      console.log('存在鉴权框，输入当前用户密码');
      await agent.aiTap('密码输入框');
      await device.typeText(env.testPassword, true);
      await device.pressKey('Enter');
    }
    await device.pressKey('Esc');

    console.log('步骤3：点击右上角的设置按钮');
    await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
    
    console.log('步骤3：点击设置共享密码');
    await agent.aiTap('设置共享密码', { deepThink: true });
    
    console.log('步骤3：输入共享密码123');
    await agent.aiTap('密码输入框');
      const hasConfirmPassword = await agent.aiBoolean('存在确认密码输入框');
    if (hasConfirmPassword) {
      await agent.aiTap('确认密码输入框');
      await device.typeText('123', true);
    }
    await device.typeText('123', true);

    // 点击确定完成密码设置
    await device.pressKey('Enter');
    
    const hasAuthDialog2 = await agent.aiBoolean('存在鉴权弹框');
    if (hasAuthDialog2) {
      console.log('存在鉴权框，输入当前用户密码');
      await agent.aiTap('密码输入框');
      await device.typeText(env.testPassword, true);
      await device.pressKey('Enter');
    }

    console.log('步骤4：通过地址栏挂载SMB（Ctrl+l方式，按项目规范）');
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${ip}/231smb`, true);
    
    console.log('步骤4：处理SMB连接授权弹框');
    await agent.aiWaitFor("出现需要授权来访问文本");
    await agent.aiTap('密码输入框');
    await device.typeText('123', true);
    // await agent.aiTap('记住密码');
    await device.pressKey('Enter');
    
    await system.exec('sleep 2');
    const hasSystemAuth = await agent.aiBoolean('出现卸载文件系统需要认证文本');
    if (hasSystemAuth) {
      console.log('触发系统弹窗认证，输入密码');
      await device.typeText(env.testPassword, true);
    }
    
    await system.exec('sleep 2');
    await agent.aiAssert('可正常访问smb文件');
    console.log('断言通过：可正常访问smb文件');

    console.log('步骤5：右键创建一个文件夹');
    await agent.aiRightClick('smb目录空白区域');
    await agent.aiTap('新建文件夹');
    await device.pressKey('Enter');
    
    await agent.aiAssert('文件夹创建成功');
    console.log('断言通过：文件夹创建成功');

    console.log('测试完成');

  }, { timeout: 600000, tags: ['1958231', 'level3', 'smb', 'DITT','lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 清理已挂载的SMB（按项目规范，mode=1）
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSmbMounts, closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    
    if (usbPath) {
      console.log(`清理U盘内的231smb文件夹: ${usbPath}/231smb`);
      await system.exec(`rm -rf "${usbPath}/231smb"`, 500);
    }
    
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
