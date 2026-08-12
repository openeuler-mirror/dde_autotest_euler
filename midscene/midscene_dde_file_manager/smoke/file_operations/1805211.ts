/**
 * 用例 PMSID: 1805211
 * 用例标题: 排序 - 名称排序，数字+字母+汉字+其他
 * 生成时间: 2025-12-17 12:00:00
 * 用例编写人: UT002411(胡戬)
 */
const users = process.env.TEST_USERNAME || 'uos';
const test_file= '1805211te';
const test_dir= `/home/${users}/Desktop/${test_file}`;

describe('1805211-排序 - 名称排序，数字+字母+汉字+其他', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件
    console.log('3: 将测试文件复制到桌面');
    await system.exec(`rm -rf ${test_dir}`);
    await system.exec(`cd ~/Desktop && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1805211.zip && unzip 1805211.zip -d ${test_dir} && rm 1805211.zip`);
    console.log('4. 测试文件已复制到桌面');
  });

  test('1805211-排序 - 名称排序，数字+字母+汉字+其他', async ({ device, agent, uos, KeyCode }) => {
    // 步骤 1: 进入桌面测试文件夹，排序默认升序
    await agent.aiDoubleClick(`${test_file}文件夹`);
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("搜索框左侧插件的左数第二个图标，列表视图按钮", { deepThink: true });
    await agent.aiAssert("文件按照名称排序，从前往后依次为数字、字母、汉字、符号");
    console.log('5. 混合字符升序测试通过');
    // 步骤 2: 点击名称，切换排序为降序
    await agent.aiTap("名称");
    await agent.aiAssert("文件按照名称排序，从前往后依次为符号、汉字、字母、数字");
    console.log('6. 混合字符降序测试通过');

  }, { timeout: 600000,
       tags: ['1805211', 'level2', 'smoke', 'file_operations', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec(`rm -rf ${test_dir}`);
  });
});
