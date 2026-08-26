// @ts-nocheck
require("dotenv/config");

/**
 * 用例 PMSID: 1809169
 * 用例标题: 我的共享-展示本机所有的共享目录
 * 生成时间：2026-02-28 17:22:00
 * 用例编写人：UT000686(李双双)
 */

describe('1809169-我的共享-展示本机所有的共享目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    await system.exec('rm -rf ~/Documents/1809169');
    // 前置条件：创建测试文件夹
    await system.exec('mkdir -p ~/Documents/1809169');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809169-我的共享-展示本机所有的共享目录', async ({ device, agent, uos, system }) => {
    
// 前置条件：设置共享密码
    console.log('Step 1: 启动文件管理器，点击左侧栏的文档');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器右上角主菜单")
    await agent.aiTap("设置共享密码", { deepThink: true })
    console.log('Step 3.1: 输入共享密码');
        // await agent.aiTap("共享密码输入框");
    await device.typeText("123");
    await device.pressKey("Enter");
    await system.exec("sleep 1");
  
    console.log('Step 3.2: 输入账户密码');
    await agent.aiTap("账户确认输入框");
    await device.typeText(`${process.env.TEST_PASSWORD}`);
    await device.pressKey("Enter");
    await system.exec("sleep 1");

    // 步骤1：点击左侧栏的“文档”
    await agent.aiTap("文件管理器左侧栏的文档");
    await agent.aiWaitFor("文档目录已打开");

    // 步骤2：勾选1809169文件夹，右键点击“共享文件夹”
    console.log('Step 2: 勾选1809169文件夹，右键点击共享文件夹');
    await agent.aiRightClick("1809169", { deepThink: true });
    await agent.aiWaitFor("右键加载完成")
    await agent.aiTap("共享文件夹");
    await agent.aiWaitFor("共享文件夹弹框加载完成");

    // 步骤3：在共享文件夹的弹框中，点击“共享此文件夹”前面的勾选框
    console.log('Step 3: 在共享文件夹弹框中，点击共享此文件夹勾选框');
    await agent.aiTap("共享此文件夹前面的勾选框", { deepThink: true });
    await system.exec("sleep 2");

    // 步骤4：点击侧边栏的“我的共享”，有1809169文件夹
    console.log('Step 4: 点击侧边栏的我的共享，检查是否有1809169文件夹');
    await device.pressKey('esc')
    await agent.aiTap("文件管理器左侧栏的我的共享");
    await agent.aiWaitFor("我的共享目录已打开");
    await agent.aiAssert("我的共享目录中存在1809169文件夹");

    console.log('【调试】测试用例执行完成');
  }, { timeout: 600000, tags: ['1809169', 'level3', 'main_interface_area', 'fixed_directory', 'normal_directory', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试文件夹
    await system.exec('rm -rf ~/Documents/1809169');
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
  });
});