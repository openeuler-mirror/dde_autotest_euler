/**
 * 用例 PMSID: 1924295
 * 用例标题: 【新建office文档默认格式修改】U盘右键新建文档格式验证
 * 生成时间: 2026-05-27 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';

describe("1924295-【新建office文档默认格式修改】U盘右键新建文档格式验证", () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的环境清理");
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test("1924295-【新建office文档默认格式修改】U盘右键新建文档格式验证", async ({ device, system, agent, uos }) => {

    // 安装WPS
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {      
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装，不需要再安装");
    }

    const desktopHasWPS = await agent.aiBoolean("桌面上是否有WPS文字图标");
    if (!desktopHasWPS) {
      console.log("桌面上没有WPS文字图标");
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiHover("影院");
    await agent.aiScroll("影院", { direction: 'down', distance: 2000 });
    await agent.aiRightClick("启动器里的WPS文字");
    await agent.aiTap("发送到桌面");
    } else {
      console.log("桌面上已有WPS文字图标");
      await agent.aiTap("任务栏空白处");
    }

    // 获取U盘挂载路径
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }

    // 进入U盘目录
    console.log("===== 进入U盘目录 =====");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap(`文件管理器左侧栏的${usbFlash}`);

    // 步骤1：在U盘中右键点击新建文档中的"办公文档","电子表格","演示文档"
    console.log("===== 步骤1：右键新建办公文档 =====");
    await agent.aiTap("U盘目录空白处");
    await agent.aiRightClick("U盘目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("办公文档");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 生成新建Word文档.docx
    await agent.aiAssert("U盘目录中存在文件:新建Word文档.docx");

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
    await agent.aiTap("U盘目录空白处");
    await agent.aiRightClick("U盘目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("电子表格");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));

    await agent.aiAssert("U盘目录中存在文件:新建Excel文档.xlsx");

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
    await agent.aiTap("U盘目录空白处");
    await agent.aiRightClick("U盘目录空白处");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("新建文档");
    await agent.aiTap("演示文档");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("U盘目录中存在文件：演示文档.pptx");

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

  }, { timeout: 1800000, tags: ['1924295', 'level2', 'smoke', '2500u1', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

  afterAll(async ({ device, system, agent }) => {
    console.log("5. afterAll: 清理U盘测试文件");
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -rf ${usbPath}/新建Word文档.docx ${usbPath}/新建Excel文档.xlsx ${usbPath}/演示文档.pptx`);
    }
  });
});