/**
 * 用例 PMSID: 2005411
 * 用例标题: 【新建office文档默认格式修改】smb上右键新建文档格式验证
 * 生成时间: 2026-05-27 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR; 
const smbName = process.env.SMB_USERNAME;
const smbPwd = process.env.SMB_PASSWORD;
const userPwd = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;
let smb_mount = false;

describe("2005411-【新建office文档默认格式修改】smb上右键新建文档格式验证", () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();

    // 前置条件：确保WPS已安装
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);  
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装，不需要再安装");
    }

    // 确保桌面有WPS文字图标（用于后续验证）
    const desktopHasWPS = await agent.aiBoolean("桌面上是否有WPS文字图标");
    if (!desktopHasWPS) {
      console.log("桌面上没有WPS文字图标，尝试添加");
      await agent.aiTap("任务栏上的第一个图标，也就是启动器");
      await agent.aiHover("影院");
      await agent.aiScroll("影院", { direction: 'down', distance: 2000 });
      await agent.aiRightClick("启动器里的WPS文字");
      await agent.aiTap("发送到桌面");
    } else {
      console.log("桌面上已有WPS文字图标");
      await agent.aiTap("任务栏空白处");
    }
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的环境清理");
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test("2005411-【新建office文档默认格式修改】smb上右键新建文档格式验证", async ({ device, system, agent, uos }) => {

    // 前置条件1：已挂载smb
    const { cleanSmbMounts, SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    
    try {
      // 完全卸载已有SMB挂载
      console.log('===== 卸载已有SMB挂载 =====');
      await uos.openApp("文件管理器", 3000, 20000, true);
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');
      // 挂载smb-勾选记住密码
      console.log('===== 挂载smb-勾选记住密码 =====');
      await device.pressKey('Ctrl','l');
      await device.pressKey('Ctrl','a');
      await device.typeText(`smb://${smbIp}/${smbDir}`, true);
      await agent.aiWaitFor("出现需要授权来访问文本");
      await device.typeText(`${smbName}`);
      await agent.aiInput( `${smbPwd}`,'密码输入框');
      await agent.aiTap("记住密码文本");
      await agent.aiTap("连接选项");
      await system.exec("sleep 2");
      const boolA = await agent.aiBoolean(`页面挂载文件系统需要认证文本`);
      if (boolA) {
          console.log('触发弹窗认证，输入密码');
          await device.typeText(`${TEST_PASSWORD}`, true);
      } else {
          console.log('未触发弹窗认证');
      }
    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }

    // 进入smb目录
    console.log("===== 进入smb目录 =====");
    await agent.aiTap(`文件管理器窗口左侧栏的${smbIp}地址`);
    await agent.aiDoubleClick(`SMB目录下的${smbDir}文件夹`);

    // 步骤1：在smb中右键点击新建文档中的"办公文档","电子表格","演示文档"
    console.log("===== 步骤1：右键新建办公文档 =====");
    await agent.aiTap("smb目录空白处");
    await agent.aiRightClick("smb目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("办公文档");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 生成新建Word文档.docx
    await agent.aiAssert("smb目录中存在文件:新建Word文档.docx");

    // 双击打开&步骤2：双击新建的文件
    console.log("===== 双击新建Word文档 =====");
    await agent.aiDoubleClick("新建Word文档.docx文件的图标");
    //await new Promise(resolve => setTimeout(resolve, 5000));

    // 处理WPS启动弹窗   
    const isAgreement = await agent.aiBoolean("是否看到许可协议窗口");
    if (isAgreement) {
        console.log("走同意协议流程打开wps");
        await agent.aiTap("许可协议窗口中已阅读的复选框");
        await agent.aiTap("许可协议窗口的确定按钮");
    } else {
        console.log("打开wps不需要走同意协议流程");
    }

    const isAuthorize = await agent.aiBoolean("是否看到授权已到期弹窗");
    if (isAuthorize) {
        console.log("需要关闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
    } else {
        console.log("不需要关闭授权已到期弹窗");
    }

    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("新建Word文档.docx打开成功");
    await device.pressKey("Alt+F4");

    // 右键新建电子表格&步骤2：双击新建的文件
    console.log("===== 右键新建电子表格 =====");
    await agent.aiTap("smb目录空白处");
    await agent.aiRightClick("smb目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("电子表格");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));

    await agent.aiAssert("smb目录中存在文件:新建Excel文档.xlsx");

    console.log("===== 双击新建Excel文档 =====");
    await agent.aiDoubleClick("新建Excel文档.xlsx文件的图标");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const isXlsAgreement = await agent.aiBoolean("是否看到许可协议窗口");
    if (isXlsAgreement) {
        console.log("走同意协议流程打开wps");
        await agent.aiTap("许可协议窗口中已阅读的复选框");
        await agent.aiTap("许可协议窗口的确定按钮");
    } else {
        console.log("打开wps不需要走同意协议流程");
    }

    const isXlsAuthorize = await agent.aiBoolean("是否看到授权已到期弹窗");
    if (isXlsAuthorize) {
        console.log("需要关闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
    } else {
        console.log("不需要关闭授权已到期弹窗");
    }
    await agent.aiWaitFor("新建Excel文档.xlsx打开成功", { timeoutMs: 3000 });
    await device.pressKey("Alt+F4");

    // 右键新建演示文档&步骤2：双击新建的文件
    console.log("===== 右键新建演示文档 =====");
    await agent.aiTap("smb目录空白处");
    await agent.aiRightClick("smb目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("演示文档");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("smb目录中存在文件：演示文档.pptx");

    console.log("===== 双击新建演示文档 =====");
    await agent.aiDoubleClick("演示文档.pptx文件的图标");
    await new Promise(resolve => setTimeout(resolve, 5000));

    const isPptAgreement = await agent.aiBoolean("是否看到许可协议窗口");
    if (isPptAgreement) {
        console.log("走同意协议流程打开wps");
        await agent.aiTap("许可协议窗口中已阅读的复选框");
        await agent.aiTap("许可协议窗口的确定按钮");
    } else {
        console.log("打开wps不需要走同意协议流程");
    }

    const isPptAuthorize = await agent.aiBoolean("是否看到授权已到期弹窗");
    if (isPptAuthorize) {
        console.log("需要关闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
    } else {
        console.log("不需要关闭授权已到期弹窗");
    }
    await agent.aiWaitFor("演示文档.pptx打开成功", { timeoutMs: 3000 });
    await device.pressKey("Alt+F4");

  }, { timeout: 1800000, tags: ['2005411', 'level3', '2500u1', 'new_office_file', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

  afterAll(async ({ device, system, agent }) => {
    console.log("5. afterAll: 清理smb测试文件");
    const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
    const tmpDir = result.stdout.trim();
    await system.exec(`rm -rf ${tmpDir}/*.docx ${tmpDir}/*.xlsx ${tmpDir}/*.pptx`);
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    // 关闭所有文件管理器窗口
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});