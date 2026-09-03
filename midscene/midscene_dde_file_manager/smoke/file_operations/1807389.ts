// @ts-nocheck
/**
 * 用例 PMSID: 1807389
 * 用例标题: [047]允许以程序执行
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */

describe('1807389-[047]允许以程序执行', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const TEST_USERNAME = process.env.TEST_USERNAME;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 步骤1: 将1807389.sh文件复制到文档
    console.log('步骤1: 将11807389.sh文件复制到文档');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807389.sh`;
    await system.exec(`cp -r "${sourcePath}" ~/Documents/`);
    console.log('文件已复制到文档目录');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    await system.exec(`rm -rf ~/Desktop/1807389`);
  });

  test('1807389-[047]允许以程序执行', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器，点击文档，选中1807389.sh文件右键，点击属性，点击权限管理右侧的向下箭头，断言允许以程序执行未勾选
    console.log('步骤1: 检查允许以程序执行未勾选');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');

    // 右键1807389.sh文件，点击属性
    await agent.aiRightClick('1807389.sh文件');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件管理器中间页面属性弹窗已显示');

    // 点击权限管理
    await agent.aiTap('权限管理');
    await agent.aiWaitFor('权限管理页面已显示');

    // 断言允许以程序执行未勾选
    await agent.aiAssert('允许以程序执行复选框未勾选');
    console.log('✅ 步骤1验证通过：允许以程序执行未勾选');

    // 步骤2：勾选允许以程序执行复选框，点击"esc"，双击1807389.sh，有运行弹框
    console.log('步骤2: 勾选允许以程序执行，双击文件出现运行弹框');

    // 勾选允许以程序执行
    await agent.aiTap('允许以程序执行复选框');
    await agent.aiAssert('允许以程序执行复选框已勾选');

    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('文件管理器中间页面属性弹窗已关闭');

    // 双击1807389.sh
    await agent.aiDoubleClick('1807389.sh的图标');
    await agent.aiWaitFor('运行弹框已显示');
    await agent.aiAssert('运行弹框中存在在终端运行和取消按钮');
    console.log('✅ 步骤2验证通过：双击文件出现运行弹框');

    // 步骤3：在运行弹框中，点击"在终端运行"，断言终端有"Hello world"打印，点击"enter"
    console.log('步骤3: 在终端运行，验证Hello world打印');

    // 点击在终端运行
    await agent.aiTap('在终端运行');
    await agent.aiWaitFor('终端窗口已打开', { timeoutMs: 10000 });

    // 断言终端有Hello world打印
    await agent.aiAssert('终端中显示Hello world文本');
    await system.exec(`rm -rf ~/Desktop/1807389`);
    // 点击enter关闭终端
    await device.pressKey('Enter');
    await agent.aiWaitFor('终端窗口已关闭');
    console.log('✅ 步骤3验证通过：终端显示Hello world');

    // 步骤4：双击1807389.sh，在运行弹框中，点击"在终端运行"，桌面新增一个1807389文件夹
    console.log('步骤4: 再次运行脚本，验证桌面新增1807389文件夹');

    // 双击1807389.sh
    await agent.aiDoubleClick('1807389.sh的图标');
    await agent.aiWaitFor('运行弹框已显示');

    // 点击运行
    await agent.aiTap('运行');

    // 等待脚本执行完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("桌面")

    // 断言桌面新增1807389文件夹
    await agent.aiAssert('桌面存在1807389文件夹');
    console.log('✅ 步骤4验证通过：桌面新增1807389文件夹');

    // 步骤5：选中1807389.sh文件右键，点击属性，点击权限管理右侧的向下箭头，点击"勾选允许以程序执行"前面的小方框，点击esc，双击1807389.sh，1807389.sh文件利用文本编辑器打开
    console.log('步骤5: 取消允许以程序执行，双击文件用文本编辑器打开');
    await agent.aiTap("文档")

    // 右键1807389.sh文件，点击属性
    await agent.aiRightClick('1807389.sh文件');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件管理器中间页面属性弹窗已显示');

    // 点击权限管理
    await agent.aiTap('权限管理');
    await agent.aiWaitFor('权限管理页面已显示');

    // 取消勾选允许以程序执行
    await agent.aiTap('允许以程序执行复选框');
    await agent.aiAssert('允许以程序执行复选框未勾选');

    // 关闭属性弹窗
    await device.pressKey('Escape');
    await agent.aiWaitFor('文件管理器中间页面属性弹窗已关闭');

    // 双击1807389.sh
    await agent.aiDoubleClick('1807389.sh的图标');
    await agent.aiWaitFor('文本编辑器已打开', { timeoutMs: 10000 });

    // 断言1807389.sh文件利用文本编辑器打开
    await agent.aiAssert('1807389.sh文件在文本编辑器中打开');
    console.log('✅ 步骤5验证通过：文件用文本编辑器打开');

  }, { timeout: 1200000, tags: ['1807389', 'level2', 'smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
    // 关闭可能打开的终端和文本编辑器
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理测试文件
    await system.exec('rm -f ~/Documents/1807389.sh');
    await system.exec('rm -rf ~/Desktop/1807389');
    console.log('测试文件已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
