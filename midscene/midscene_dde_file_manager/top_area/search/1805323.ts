
/**
 * 用例 PMSID: 1805323
 * 用例标题: 【搜索】搜索地址前缀补全-IP地址补全
 * 生成时间: 2026-02-27 16:24:56
 * 用例编写人: UT000193（郑豪）
 */

describe('1805323-【搜索】搜索地址前缀补全-IP地址补全', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805323-【搜索】搜索地址前缀补全-IP地址补全', async ({ device, agent, uos }) => {
    // 步骤1：通过键盘上下键切换下拉选项
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await device.pressKey("Ctrl+L");
    await device.pressKey("Ctrl+A");
    await device.typeText("10.20.63.143");
    await agent.aiWaitFor("地址栏下拉列表显示IP地址补全选项，如192.168.1.1等");
    await device.pressKey("Down");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言1：选中项呈蓝色选中状态、输入框显示拼接的完整路径
    await agent.aiAssert("下拉列表中有一项呈蓝色选中状态");

    // 步骤2：通过鼠标单击下拉框选项
    await agent.aiTap("sftp://10.20.63.143");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2：下拉框消失、输入框显示拼接的完整路径
    await agent.aiAssert("下拉框已消失");
    await agent.aiAssert("输入框显示拼接的完整路径sftp://10.20.63.143");

    // 步骤3：按enter键即进行搜索
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        // 如果是首次登录，会弹出标识验证失败弹框
        await agent.aiWaitFor('标识验证失败弹框');
        console.log('检测到首次登录，点击仍然登录');
        await agent.aiTap('仍然登录');
    } catch (error) {
        // 如果前面已经登录过，直接进入身份认证弹窗
        console.log('已登录过，直接进入身份认证弹窗');
    }

    // 断言3：搜索输入框进行正确挂载响应操作
    await agent.aiAssert("弹出访问10.20.63.143的身份认证弹窗，要求输入用户名和密码...的弹窗");

  }, { timeout: 600000, tags: ['1805323', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
