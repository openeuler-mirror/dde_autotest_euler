/**
 * 用例 PMSID: 1815981
 * 用例标题: 长文件名功能 - 剪切，粘贴
 * 生成时间: 2026-05-22
 * 用例编写人: UT000686(李双双)
 */

describe('1815981-长文件名功能-剪切粘贴', () => {
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
    const longFileName = "5981长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴18";


    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Downloads/${longFileName}`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/${longFileName}`, 500);

    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Desktop/${longFileName}`, 500);
    console.log('长文件名测试文件夹创建完成');
  });

  test('1815981-长文件名功能-剪切粘贴', async ({ device, agent, uos, system }) => {
    const longFileName = "5981长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴18";

    // 步骤 1: 打开文件管理器，进入文档目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiDoubleClick("文件管理器左侧栏的文档");
    await agent.aiWaitFor("文档目录页面加载完成");

    // 剪切长文件名文件夹到下载目录
    console.log("=== 剪切长文件名文件夹到下载目录 ===");
    await agent.aiRightClick('"5981长"以开头,"18"结尾的文件夹');
    await agent.aiTap("剪切");
    await agent.aiDoubleClick("文件管理器左侧栏的下载图标");
    await agent.aiWaitFor("下载目录页面加载完成");
    await agent.aiRightClick("下载目录空白处");
    await agent.aiTap("粘贴");
    await agent.aiWaitFor("粘贴操作完成");

    // 断言 1: 下载目录存在以"5981长"开头，"18结尾"的文件夹
    await agent.aiAssert('下载目录存在"5981长"以开头,"18"结尾的文件夹');
    console.log("长文件名文件夹已成功剪切到下载目录");

    // 步骤 2: 剪切桌面目录的长文件名文件夹
    console.log("=== 剪切桌面目录的长文件名文件夹 ===");
    await agent.aiDoubleClick("文件管理器左侧栏的桌面");
    await agent.aiWaitFor("桌面目录页面加载完成");
    await agent.aiRightClick('"5981长"以开头,"18"结尾的文件夹');
    await agent.aiTap("剪切");
    await agent.aiRightClick("桌面目录空白处");
    await agent.aiTap("粘贴");
    await agent.aiWaitFor("粘贴操作完成");
    // 断言 2: 桌面存在以"5981长"开头，"18结尾"的文件夹
    await agent.aiAssert('桌面目录存在"5981长"以开头,"18"结尾的文件夹');
    console.log("桌面目录长文件名文件夹操作完成");

    console.log("===1815981-长文件名功能-剪切粘贴,执行成功===");

  }, { timeout: 600000, tags: ["1815981", "level2",'remote','smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const longFileName = "5981长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴长文件名功能剪切粘贴18";



    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Downloads/${longFileName}`, 500);
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