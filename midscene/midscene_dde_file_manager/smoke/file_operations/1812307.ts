/**
 * 用例 PMSID: 1812307
 * 用例标题: 【文件选择对话框】长文件名功能 - 文件选择对话框(打开)，打开
 * 生成时间: 2026-06-09
* 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1812307-文件选择对话框-长文件名功能-打开', () => {
  const longFileName = "2307长文件名功能文件选择对话框打开长文件名功能文件选择对话框打开长文件名功能文件选择对话框打开长文件名功能文件选择对话框打开长文件名功能文件选择对话框打开长文件名功能文件选择对话框打开81";
  const fileName = `${longFileName}.txt`;
  
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
      const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;

    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    await system.exec(`echo "长文件名功能文件选择对话框" > ${docPath}/${fileName}`, 500);
    console.log('长文件名测试文件创建完成');
  });

  test('1812307-文件选择对话框-长文件名功能-打开', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文本编辑器
    console.log("=== 步骤1: 打开文本编辑器并打开长文件名文件 ===");
    await uos.openApp("文本编辑器", { maximizeWindow: true });
    await agent.aiWaitFor("文本编辑器已打开");

    // 点击右上角的"主菜单"
    await agent.aiTap("文本编辑器右上角的主菜单按钮");
    await agent.aiWaitFor("主菜单已展开");

    // 点击"打开文件"
    await agent.aiTap("打开文件选项");
    await agent.aiWaitFor("文管选择窗口已打开");

    // 点击弹框中的"文档"
    await agent.aiWaitFor("文档目录已加载");

    // 选中"2307长文"开头的文件
    await agent.aiTap("以2307长文开头的文件");
    await agent.aiTap("打开");
    await agent.aiWaitFor("文件已打开");

    // 断言文档可以正常打开，存在"长文件名功能文件选择对话框"内容
    await agent.aiAssert("文本编辑器窗口显示长文件名功能文件选择对话框内容");
    console.log("步骤1完成：长文件名文件已成功打开");

    console.log("===1812307-文件选择对话框-长文件名功能-打开,执行成功===");

  }, { timeout: 600000, tags: ["1812307", "level2", "smoke/file_operations", "remote",'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;

    await system.exec(`rm -f ${docPath}/${fileName}`, 500);
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    console.log('测试文件清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});