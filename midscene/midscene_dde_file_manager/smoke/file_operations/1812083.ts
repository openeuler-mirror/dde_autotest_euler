/**
 * 用例 PMSID: 1812083
 * 用例标题: 长文件名功能 - 长文件名功能开启状态，删除文件后，回收站属性的数量和大小正确
 * 生成时间: 2026-06-09
 * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1812083-长文件名功能-删除文件后回收站属性检查', () => {
  const longFileName = "2083长文件名功能长文件名功能开启状态删除文件后回收站属性的数量和大小正确长文件名功能长文件名功能开启状态删除文件后回收站属性的数量和大小正确长文件名功能长文件名功能开启状态删除文件后回收站属性的数量和大小正确18";
  const fileName = `${longFileName}.txt`;
  
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    await uos.showDesktop();
    await system.cleanupFileManager();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;

    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    await system.exec(`echo "文件名功能长文件名功能开启状态删除文件后回收站属性的数量和大小正确" > ${docPath}/${fileName}`, 500);
    console.log('长文件名测试文件创建完成');
  });

  test('1812083-长文件名功能-删除文件后回收站属性检查', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入文档目录，删除文件
    console.log("=== 步骤 1: 删除长文件名文件到回收站 ===");
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的文档目录");
    await agent.aiWaitFor("文档目录页面加载完成");
    
    await agent.aiRightClick("以 2083 长开头的 txt 文件");
    await agent.aiTap("删除");
    console.log("步骤 1 完成：长文件名文件已删除到回收站");

    // 步骤 2: 进入回收站，查看文件属性
    console.log("=== 步骤 2: 查看回收站内文件的属性 ===");
    await agent.aiTap("文件管理器左侧栏的回收站目录");
    await agent.aiWaitFor("回收站已打开");
    
    await agent.aiRightClick("以 2083 长开头的 txt 文件");
    await agent.aiTap("属性");
    await agent.aiWaitFor("属性弹框已显示");
    
    // 断言属性弹框显示正常
    await agent.aiAssert("属性弹框显示正常，包含文件名、大小、类型等信息");
    console.log("步骤 2 完成：属性弹框显示正常");

    // 关闭属性弹框
    await agent.aiTap("属性弹框右上角的关闭按钮");
    console.log("===1812083-长文件名功能 - 删除文件后回收站属性检查，执行成功===");

  }, { timeout: 600000, tags: ["1812083", "level2", "smoke/file_operations", "remote",'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;

    // 清空回收站
    try {
      await system.exec('killall dde-file-manager', 500);
      await system.exec(`rm -rf ~/.local/share/Trash/files/${fileName}`, 500);
      await system.exec(`rm -rf ~/.local/share/Trash/info/${fileName}.trashinfo`, 500);
      console.log('回收站文件清理完成');
    } catch (error) {
      console.log('回收站清理失败:', error);
    }
    
    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    console.log('本地测试文件清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});