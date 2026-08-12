/**
 * 用例 PMSID: 1806761
 * 用例标题:  ELF文件的权限为644时，双击弹出可执行权限确认框
 * 生成时间: 2025-12-11
 * 用例编写人: UT000054（叶飞）
 */

describe('1806761-ELF文件的权限为644时，双击弹出可执行权限确认框', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806761-ELF文件的权限为644时，双击弹出可执行权限确认框', async ({ device, agent, uos, system }) => {
    console.log('复制测试文件到家目录');

    // 用例第一步：将midscene_dde_file_manager/resources/1806759_hello文件复制到主目录
    console.log('步骤1: 将ELF文件复制到主目录');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1806759_hello`;
    // 使用系统命令复制文件
    await system.exec(`cp "${sourcePath}" ~`);
    console.log(`文件已复制到: ~`);

    //打开文件，右键检查文件的权限
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("主目录");
    //设置文件权限为644
    console.log('步骤2: 设置文件权限为644');
    await system.exec('chmod 644 ~/1806759_hello');
    await agent.aiRightClick("1806759_hello");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("属性");
    await agent.aiWaitFor("属性弹窗显示");
    await agent.aiTap("权限管理");
    await agent.aiAssert("所有者：读写 ； 群组：只读，其他：只读");
    //关闭属性对话框
    await agent.aiTap("属性对话框右上角的关闭按钮");


    // 用例第二步：双击执行文件，验证弹出权限确认框
    console.log('步骤3: 双击执行文件，验证权限确认框');

    // 双击执行
    await agent.aiTap("空白处");
    await agent.aiDoubleClick("1806759_hello");
    console.log('已双击执行文件');
    // 等待系统响应
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 用例第四步：验证权限确认框是否弹出
    console.log('步骤4: 验证权限确认框');
    await agent.aiAssert("弹出提示框：此文件没有可执行权限，是否添加权限并运行？");

    // 关闭窗口
    await agent.aiTap("取消按钮");

  }, { timeout: 600000, tags: ["1806761", "level3", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1806759_hello");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
