/**
 * 用例 PMSID: 2007237
 * 用例标题: 【新建office文档默认格式修改】U盘里新建office文档属性查看
 * 生成时间: 2026-06-01 17:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';

describe('2007237-【新建office文档默认格式修改】U盘里新建office文档属性查看', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，确认U盘挂载并创建测试文档');
    await uos.showDesktop();

    // 前置条件1：确认U盘已挂载
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }
    console.log(`确认U盘挂载路径: ${usbPath}`);

    // 前置条件2：在U盘目录新建三种类型的office文档
    console.log('===== 在U盘目录创建测试用office文档 =====');
    const docTypes = [
      { fileName: "测试文档.docx", type: "Word文档" },
      { fileName: "测试表格.xlsx", type: "Excel文档" },
      { fileName: "测试演示.pptx", type: "PPT文档" }
    ];
    for (const doc of docTypes) {
      // 创建空的office文档（touch命令创建空文件模拟）
      await system.exec(`touch "${usbPath}/${doc.fileName}"`);
      console.log(`创建${doc.type}: ${usbPath}/${doc.fileName}`);
    }
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 打开文件管理器并进入U盘目录
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap(`文件管理器左侧栏的${usbFlash}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 验证进入U盘目录
    await agent.aiAssert(`成功进入名称为${usbFlash}的u盘目录`);
  });

  test('2007237-【新建office文档默认格式修改】U盘里新建office文档属性查看', async ({ device, system, agent, uos }) => {
    // 获取U盘挂载路径
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }

    // 定义测试的office文档列表
    const testDocs = ["测试文档.docx", "测试表格.xlsx", "测试演示.pptx"];

    // 步骤1：在U盘目录左键选中新建的三种类型的office文档并摁下空格
    console.log('===== 步骤1：选中office文档并按空格预览 =====');
    // 依次选中每个文档并按空格预览
    for (const doc of testDocs) {
      await agent.aiTap(`${doc}文件图标`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 按下空格触发预览
      await device.pressKey('Space');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 预期结果1：文件类型为文档，点击预览窗口中的x按钮关闭预览窗口
      await agent.aiAssert(`预览窗口中显示${doc}的文件类型为文档`);
      await agent.aiTap("预览窗口右上角的x关闭按钮");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 步骤2：在U盘目录右键选中新建的三种类型的office文档并点击属性
    console.log('===== 步骤2：右键选中office文档并查看属性 =====');
    for (const doc of testDocs) {
      await agent.aiRightClick(`${doc}文件图标`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("属性选项");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 预期结果2：文件类型为文档
      await agent.aiAssert(`属性窗口中显示${doc}的文件类型为文档`);
      // 关闭属性窗口
      await agent.aiTap("属性窗口右上角的x关闭按钮");
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }, { timeout: 1800000, tags: ['2007237','level3','new_office_file','2500u1','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    // 关闭文件管理器进程
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理U盘测试文件');
    // 获取U盘路径并删除测试文档
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -rf "${usbPath}"/测试文档.docx "${usbPath}"/测试表格.xlsx "${usbPath}"/测试演示.pptx 2>/dev/null`);
      console.log('U盘内测试office文档已清理');
    }
  });
});