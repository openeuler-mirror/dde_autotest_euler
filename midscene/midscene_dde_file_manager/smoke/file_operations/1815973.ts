/**
 * 用例 PMSID: 1815973
 * 用例标题: 长文件名功能 - 重命名
 * 生成时间: 2026-05-26
 * * 用例编写人: UT000686（李双双）
 */

describe('1815973-长文件名功能-重命名', () => {
    let isLaptop = false; // 用于保存设备类型检测结果
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
     const caseDir = process.env.TESTCASE_DIR;
    // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    const longFileName = "5973长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名18";

    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/新建文件夹*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/新建文件夹*`, 500);
    console.log('测试环境清理完成');
  });

  test('1815973-长文件名功能-重命名', async ({ device, agent, uos, system }) => {
    const longFileName = "5973长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名18";

    // 步骤 1: 打开文件管理器，进入文档目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiDoubleClick("文件管理器左侧栏的文档图标");
    await agent.aiWaitFor("文档目录页面加载完成");

    // 步骤 1-1: 创建新文件夹，右键重命名
    console.log("=== 步骤1: 右键菜单重命名长文件名 ===");
    await agent.aiRightClick("文档目录空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText(longFileName, true);
    // await device.pressKey('Enter');
    await agent.aiWaitFor("文件夹创建完成");
    
    // 断言 1: 文档目录存在以"5973长"开头，"18结尾"的文件夹
    await agent.aiAssert('文档目录存在"5973长"开头,"18"结尾的文件夹');
    console.log("步骤1完成：右键菜单重命名成功");


    // 步骤 2: 创建新文件夹，快捷键fn+F2重命名
    console.log("=== 步骤2: 快捷键fn+F2重命名长文件名 ===");
    await agent.aiDoubleClick("文件管理器左侧栏的桌面图标");
    await agent.aiWaitFor("桌面目录页面加载完成");
    await agent.aiRightClick("桌面目录空白处");
    await agent.aiTap("新建文件夹");
    //步骤1：在桌面按F2 ,检查是否响应重命名输入框，如果是笔记本则执行 Fn+F2 ,否则执行F2
    if (isLaptop) {
      console.log('检测到笔记本，执行 Fn+F2');
     // await system.exec(`xdotool key Fn+F5`);
      await device.pressKey('Fn+F2');
    } else {
      console.log('检测到台式机，执行 F2');
      //await system.exec(`xdotool key F5`);
      await device.pressKey('F2');
    }
    await agent.aiWaitFor("重命名输入框已激活");
    await device.typeText(longFileName, true);
    // await device.pressKey('Enter');
    await agent.aiWaitFor("文件夹创建完成");
    
    // 断言 2: 文档目录存在以"5973长"开头，"18结尾"的文件夹
    await agent.aiAssert('桌面目录存在"5973长"开头,"18"结尾的文件夹');
    console.log("步骤2完成：快捷键重命名成功");

    console.log("===1815973-长文件名功能-重命名,执行成功===");

  }, { timeout: 600000, tags: ["1815973", "level2", 'remote', 'smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const longFileName = "5973长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名长文件名功能重命名18";
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/新建文件夹*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/新建文件夹*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/${longFileName}`, 500);
    console.log('测试文件夹清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});