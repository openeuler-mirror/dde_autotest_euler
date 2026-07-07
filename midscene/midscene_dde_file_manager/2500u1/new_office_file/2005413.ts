/**
 * 用例 PMSID: 2005413
 * 用例标题: 【新建office文档默认格式修改】ftp上右键新建文档格式验证
 * 生成时间: 2026-05-27 17:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const ftpIp = process.env.FTP_IP;
const ftpUsername = process.env.FTP_USERNAME;
const ftpPassword = process.env.FTP_PASSWORD;
const ftpMountPath = `/run/user/1000/gvfs/ftp:host=${ftpIp}`;

describe("2005413-【新建office文档默认格式修改】ftp上右键新建文档格式验证", () => {
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
    
    //卸载已有的ftp
    console.log(`===== 前置操作：检查FTP挂载状态: ftp://${ftpIp} =====`);
    await uos.openApp("文件管理器", 3000, 20000, true);
    const hasFtpMount = await agent.aiBoolean(`文件管理器左侧边栏存在${ftpIp}且${ftpIp}水平右侧有1个三角形和一条横岗图标`);
    if (hasFtpMount) {
      console.log('发现FTP挂载，开始卸载');
      try {
        await system.exec(`gio mount -u "ftp://${ftpIp}"`);
        console.log('FTP卸载成功');
      } catch (e) {
        console.warn(`FTP卸载处理完成（无挂载或已清理）: ${e.message}`);
      }
    } else {
      console.log('FTP未挂载，跳过卸载');
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Alt+F4");
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的环境清理");
    const { clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });

  test("2005413-桌面/文管目录/保险箱右键新建文档格式验证", async ({ device, system, agent, uos, env }) => {

    // 定义需要测试的文档类型
    const docTypes = [
      { type: "办公文档", fileName: "新建Word文档.docx", openAssert: "看到新建按钮" },
      { type: "电子表格", fileName: "新建Excel文档.xlsx", openAssert: "看到新建按钮" },
      { type: "演示文档", fileName: "演示文档.pptx", openAssert: "看到新建幻灯片按钮或新建按钮" }
    ];

    // 公共函数：右键新建文档并验证生成
    async function createDocument(location, docType, fileName) {
      console.log(`===== 在${location}右键新建${docType} =====`);
      await agent.aiTap(`${location}空白处`);
      await agent.aiRightClick(`${location}空白处`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiTap("新建文档");
      await agent.aiTap(docType);
      await device.pressKey("Enter");
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiAssert(`${location}中存在文件:${fileName}`);
    }

    // 公共函数：双击打开文档并验证
    async function openAndVerifyDocument(location, fileName, openAssert) {
      console.log(`===== 双击打开${location}中的${fileName} =====`);
      await agent.aiDoubleClick(`${fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 5000));

      const isOpen = await agent.aiBoolean("是否看到打开方式窗口");
      if (isOpen) {
        console.log("设置wps默认打开方式");
        await agent.aiTap("确定按钮");
      } else {
        console.log("不需要设置wps默认打开方式");
      }

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

      const isConform = await agent.aiBoolean("是否看到WPS告警窗口");
      if (isConform) {        
        await agent.aiTap("确定按钮");
      } else {
        console.log("wps兼容，不需要额外设置");
      }

      await agent.aiAssert(openAssert);      
    }

    // ==================== 步骤1&2：在ftp内右键点击新建文档中的办公文档,电子表格,演示文档，并双击打开 ====================  
    // 挂载FTP目录并进入
    console.log('===== 挂载FTP目录并进入目标路径 =====');
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await FtpMount(agent, system, device, 1);
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    console.log("========== 步骤1&2：在ftp内右键点击新建文档中的办公文档,电子表格,演示文档，并双击打开 ==========");
    for (const doc of docTypes) {
      await createDocument("ftp共享目录", doc.type, doc.fileName);
      await openAndVerifyDocument("ftp共享目录", doc.fileName, doc.openAssert);
      await device.pressKey("Alt+F4");
    }

  }, { timeout: 1800000, tags: ['2005413', 'level3', 'new_office_file', '2500u1', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log("5. afterAll: 清理测试文件及保险箱");
    
    // 清理桌面测试文件
    await system.exec(`rm -rf ${ftpMountPath}/*.docx ${ftpMountPath}/*.xlsx ${ftpMountPath}/*.pptx`);
    // 卸载FTP
    console.log('===== 卸载FTP =====');
    try {
      await system.exec(`gio mount -u "ftp://${ftpIp}"`);
      console.log('FTP卸载完成');
    } catch (unmountErr) {
      console.warn('FTP卸载失败:', unmountErr.message);
    }  
    // 清理文件管理器进程
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});