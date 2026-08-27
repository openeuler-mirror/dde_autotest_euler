/**
 * 用例 PMSID: 1924291
 * 用例标题: 【新建office文档默认格式修改】右键新建office文档格式验证
 * 生成时间: 2026-05-27 14:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe("1924291-【新建office文档默认格式修改】右键新建office文档格式验证", () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();

    // 清理桌面测试文件
    await system.exec(`rm -rf /home/${userName}/Desktop/*.docx /home/${userName}/Desktop/*.xlsx /home/${userName}/Desktop/*.pptx`);  
    await system.exec(`pkill wpp;pkill et;pkill wps`);

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
    const { clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });

  test("1924291-桌面/文管目录/保险箱右键新建文档格式验证", async ({ device, system, agent, uos, env }) => {

    // 定义需要测试的文档类型
    const docTypes = [
      { type: "办公文档", fileName: "新建Word文档.docx", openAssert: "新建Word文档.docx打开成功" },
      { type: "电子表格", fileName: "新建Excel文档.xlsx", openAssert: "新建Excel文档.xlsx打开成功" },
      { type: "演示文档", fileName: "演示文档.pptx", openAssert: "演示文档.pptx打开成功" }
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

      await agent.aiAssert(openAssert);
      await device.pressKey("Alt+F4");
    }

    // ==================== 步骤1&2：桌面右键新建文档 ====================
    console.log("========== 步骤1&2：桌面右键新建文档 ==========");
    for (const doc of docTypes) {
      await createDocument("桌面", doc.type, doc.fileName);
      await openAndVerifyDocument("桌面", doc.fileName, doc.openAssert);
    }

    // ==================== 步骤3&4：本地目录右键新建文档 ====================
    console.log("========== 步骤3&4：本地目录右键新建文档 ==========");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的文档");
    
    for (const doc of docTypes) {
      await createDocument("文档目录", doc.type, doc.fileName);
      await openAndVerifyDocument("文档目录", doc.fileName, doc.openAssert);
    }

    // ==================== 步骤5&6：保险箱内右键新建文档 ====================
    console.log("========== 步骤5&6：保险箱内右键新建文档 ==========");
    
    // 前置：创建保险箱并解锁
    const { createPasswordVault, vaultPassword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    
    // 进入保险箱目录
    await agent.aiTap("文件管理器左侧栏的保险箱");

    for (const doc of docTypes) {
      await createDocument("保险箱", doc.type, doc.fileName);
      await openAndVerifyDocument("保险箱", doc.fileName, doc.openAssert);
    }

  }, { timeout: 1800000, tags: ['1924291', 'level2', 'smoke', '2500u1', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log("5. afterAll: 清理测试文件及保险箱");
    
    // 清理桌面测试文件
    await system.exec(`rm -rf /home/${userName}/Desktop/*.docx /home/${userName}/Desktop/*.xlsx /home/${userName}/Desktop/*.pptx`);    
    // 清理本地目录测试文件
    await system.exec(`rm -rf /home/${userName}/Documents/*.docx /home/${userName}/Documents/*.xlsx /home/${userName}/Documents/*.pptx`);    
    // 清理保险箱及保险箱内文件
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await rmVault(system);    
    // 清理文件管理器进程
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});