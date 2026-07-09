/**
 * 用例 PMSID: 1924293
 * 用例标题: 【新建office文档默认格式修改】新建office文档属性查看
 * 生成时间: 2026-05-29 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

// 安全检查：严格限制用户名只能包含字母、数字、下划线和连字符，防止命令注入
const userNameRegex = /^[a-zA-Z0-9_-]+$/;
if (!userName || !userNameRegex.test(userName)) {

  throw new Error(`安全校验失败: 无效的 TEST_USERNAME 环境变量`);
}

const picturesPath = `/home/${userName}/Pictures`; // 图片目录路径
const desktopPath = `/home/${userName}/Desktop`; // 桌面路径

//定义测试的文档类型
const docTypes = [
  { type: "办公文档", fileName: "新建Word文档.docx" },
  { type: "电子表格", fileName: "新建Excel文档.xlsx" },
  { type: "演示文档", fileName: "演示文档.pptx" }
];

describe("1924293-【新建office文档默认格式修改】新建office文档属性查看", () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
    await uos.showDesktop();

    // 前置条件:确保WPS已安装
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {      
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装，不需要再安装");
    }

    // 前置条件：在桌面、图片目录新建三种类型的office文档
    console.log("===== 前置操作：在桌面和图片目录新建测试文档 ======");
    for (const doc of docTypes) {
      // 桌面新建文档
      await system.exec(`touch ${desktopPath}/${doc.fileName}`);
      // 图片目录新建文档
      await system.exec(`touch ${picturesPath}/${doc.fileName}`);
      console.log(`已创建 ${desktopPath}/${doc.fileName} 和 ${picturesPath}/${doc.fileName}`);
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的环境清理");
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  test("1924293-桌面/图片目录office文档选中预览与属性验证", async ({ device, system, agent, uos }) => {
    // 公共函数：验证属性窗口中文件类型为文档
    async function verifyFileTypeInProperties() {
      console.log("===== 验证属性窗口中文件类型为文档 =====");
      await agent.aiAssert("属性窗口中类型显示为文档");
      // 关闭属性窗口
      await agent.aiTap("属性窗口右上角的x按钮");
    }

    // ==================== 步骤1：在桌面左键选中新建的三种类型的office文档并摁下空格 ====================
    console.log("========== 步骤1：桌面选中文档按空格验证预览 ==========");
    await uos.showDesktop();
    // 选中桌面所有测试文档
    await agent.aiTap("桌面空白处");
    for (const doc of docTypes) {
      await agent.aiTap(`${doc.fileName}文件的图标`);
      // 按下空格触发预览
      await device.pressKey("Space");
      await new Promise(resolve => setTimeout(resolve, 3000));
      // 预期结果1：文件类型为文档，关闭预览窗口
      await agent.aiAssert("预览窗口中类型为文档");
      await agent.aiTap("预览窗口中的x按钮");
    }

    // ==================== 步骤2：在桌面右键选中新建的三种类型的office文档并点击属性 ====================
    console.log("========== 步骤2：桌面右键文档查看属性 ==========");
    for (const doc of docTypes) {
      await agent.aiRightClick(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiTap("属性");
      // 预期结果2：文件类型为文档
      await verifyFileTypeInProperties();
    }

    // ==================== 步骤3：在本地目录（图片目录）左键选中新建的三种类型的office文档并摁下空格 ====================
    console.log("========== 步骤3：图片目录选中文档按空格验证预览 ==========");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的图片");
    await agent.aiTap("图片目录内空白处");
    for (const doc of docTypes) {
      await agent.aiTap(`${doc.fileName}文件的图标`);
      // 按下空格触发预览
      await device.pressKey("Space");
      await new Promise(resolve => setTimeout(resolve, 3000));
      // 预期结果3：文件类型为文档，关闭预览窗口
      await agent.aiAssert("预览窗口中类型为文档");
      await agent.aiTap("预览窗口中的x按钮");
    }

    // ==================== 步骤4：在本地目录（图片目录）右键选中新建的三种类型的office文档并点击属性 ====================
    console.log("========== 步骤4：图片目录右键文档查看属性 ==========");
    await agent.aiTap("图片目录内空白处");
    for (const doc of docTypes) {
      await agent.aiRightClick(`${doc.fileName}文件的图标`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiTap("属性");
      // 预期结果4：文件类型为文档
      await verifyFileTypeInProperties();
    }

  }, { timeout: 1800000, tags: ['1924293', 'level3', 'new_office_file', '2500u1', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log("5. afterAll: 清理测试文件");
    
    // 清理桌面测试文件
    for (const doc of docTypes) {
      await system.exec(`rm -rf ${desktopPath}/${doc.fileName}`);
      await system.exec(`rm -rf ${picturesPath}/${doc.fileName}`);
    }
    console.log("测试文件清理完成");

    // 清理文件管理器进程
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});