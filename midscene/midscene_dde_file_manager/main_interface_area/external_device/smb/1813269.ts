/**
 * 用例 PMSID: 1813269
 * 用例标题: [053]我的共享-空白处右键菜单
 * 生成时间: 2026-08-05
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813269-[053]我的共享-空白处右键菜单', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    console.log('前置条件：在文档目录创建3269smb文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/3269smb`);

    await system.cleanupFileManager();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813269-[053]我的共享-空白处右键菜单', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000, true);

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：右键3269smb文件夹');
    await agent.aiRightClick('3269smb');

    console.log('步骤1：点击共享文件夹');
    await agent.aiTap('共享文件夹');

    console.log('步骤1：勾选共享此文件夹前面的勾选框');
    await agent.aiTap('共享此文件夹前面的勾选框');

    console.log('步骤1：检查是否存在用户鉴权框');
    const hasAuth1 = await agent.aiBoolean('页面出现需要认证文本');
    if (hasAuth1) {
      console.log('检测到用户鉴权弹框，输入密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    }

    console.log('步骤1：关闭共享设置窗口');
    await device.pressKey('Esc');

    console.log('步骤2：点击左侧栏的我的共享');
    await agent.aiTap('左侧栏的我的共享');
    await agent.aiWaitFor('我的共享目录已打开');

    console.log('步骤2：空白处右键点击显示方式，选择列表视图');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('显示方式');
    await agent.aiTap('列表视图');

    console.log('断言：文件显示为列表形式');
    await agent.aiAssert('文件以列表形式显示');
    console.log('断言通过：文件显示为列表形式');

    console.log('步骤3：空白处右键点击显示方式，选择图标视图');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('显示方式');
    await agent.aiTap('图标视图');

    console.log('断言：文件显示为图标形式');
    await agent.aiAssert('文件以图标形式显示');
    console.log('断言通过：文件显示为图标形式');

    console.log('步骤4：空白处右键点击排序方式，选择名称');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');

    console.log('断言：文件显示正常（按名称排序）');
    await agent.aiAssert('文件按排序显示正常');
    console.log('断言通过：文件按名称排序显示');

    console.log('步骤5：空白处右键点击排序方式，选择名称');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');

    console.log('断言：文件显示正常（按名称排序）');
    await agent.aiAssert('文件按排序显示正常');
    console.log('断言通过：文件按名称排序显示');

    console.log('步骤6：空白处右键点击排序方式，选择修改时间');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('修改时间');

    console.log('断言：文件显示正常（按修改时间排序）');
    await agent.aiAssert('文件按排序显示正常');
    console.log('断言通过：文件按修改时间排序显示');

    console.log('步骤7：空白处右键点击排序方式，选择大小');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('大小');

    console.log('断言：文件显示正常（按大小排序）');
    await agent.aiAssert('文件按排序显示正常');
    console.log('断言通过：文件按大小排序显示');

    console.log('步骤8：空白处右键点击排序方式，选择类型');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('类型');

    console.log('断言：文件显示正常（按类型排序）');
    await agent.aiAssert('文件按排序显示正常');
    console.log('断言通过：文件按类型排序显示');

  }, { timeout: 600000, tags: ['1813269', 'level2', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log('清理步骤：删除测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/3269smb`);

    console.log('清理步骤：关闭文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});