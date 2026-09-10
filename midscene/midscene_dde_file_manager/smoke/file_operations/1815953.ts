/**
 * 用例 PMSID: 1815953
 * 用例标题: 长文件名功能 - 发送到U盘
 * 生成时间: 2026-06-09
 * * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1815953-长文件名功能-发送到U盘', () => {
  const longFileName = "5953长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘长文件名功能发送到U盘81";
  const fileName = `${longFileName}.txt`;
  
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
     // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;
    const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;
    // 清理U盘内的测试文件和文件夹
    await system.exec(`rm -f /media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}/${fileName}`, 500);
    await system.exec(`rm -rf /media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}/${longFileName}`, 500);
    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    await system.exec(`rm -rf ${desktopPath}/${longFileName}`, 500);

    await system.exec(`touch ${docPath}/${fileName}`, 500);
    await system.exec(`mkdir -p ${desktopPath}/${longFileName}`, 500);
    console.log('长文件名测试文件和文件夹创建完成');
  });

  test('1815953-长文件名功能-发送到U盘', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入文档目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");

    // 步骤 1: 发送文档目录的txt文件到U盘
    console.log("=== 步骤1: 发送文档目录的txt文件到U盘 ===");
    await agent.aiDoubleClick("文件管理器左侧栏的文档图标");
    await agent.aiWaitFor("文档目录页面加载完成");
    await agent.aiRightClick('选中“5953长”开头，“81结尾”的txt文件');
    await agent.aiHover("发送到");
    await agent.aiTap(process.env.USB_FLASH);

    await agent.aiDoubleClick(`文件管理器左侧栏的${process.env.USB_FLASH}图标`);
    await agent.aiWaitFor("U盘目录页面加载完成");
    await agent.aiAssert("U盘目录存在“5953长”开头，“81结尾”的txt文件");
    console.log("步骤1完成：txt文件已成功发送到U盘");

    // 步骤 2: 发送桌面目录的文件夹到U盘
    console.log("=== 步骤2: 发送桌面目录的文件夹到U盘 ===");
    await agent.aiDoubleClick("文件管理器左侧栏的桌面图标");
    await agent.aiWaitFor("桌面目录页面加载完成");
    await agent.aiRightClick('“5953长”开头，“81结尾”的文件夹');
    await agent.aiHover("发送到");
    await agent.aiTap(process.env.USB_FLASH);

    await agent.aiDoubleClick(`文件管理器左侧栏的${process.env.USB_FLASH}图标`);
    await agent.aiWaitFor("U盘目录页面加载完成");
    await agent.aiAssert("U盘目录存在“5953长”开头，“81结尾”的文件夹");
    console.log("步骤2完成：文件夹已成功发送到U盘");

    console.log("===1815953-长文件名功能-发送到U盘,执行成功===");

  }, { timeout: 600000, tags: ["1815953", "level2", "smoke/file_operations", 'remote',"DITT","lishuangshuang"] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;
    const desktopPath = `/home/${process.env.TEST_USERNAME}/Desktop`;

    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    await system.exec(`rm -rf ${desktopPath}/${longFileName}`, 500);
    console.log('本地测试文件清理完成');
    // 清理U盘内的测试文件和文件夹
    await system.exec(`rm -f /media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}/${fileName}`, 500);
    await system.exec(`rm -rf /media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}/${longFileName}`, 500);
    console.log('U盘测试文件清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});