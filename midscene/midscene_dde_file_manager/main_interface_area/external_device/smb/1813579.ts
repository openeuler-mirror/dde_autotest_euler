/**
 * 用例 PMSID: 1813579
 * 用例标题: 网络邻居-展示局域网内所有共享计算机
 * 生成时间: 2026-07-28
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");

describe('1813579-网络邻居-展示局域网内所有共享计算机', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813579-网络邻居-展示局域网内所有共享计算机', async ({ device, agent, uos, env }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    
    console.log('步骤1：点击左侧栏的网络邻居');
    await agent.aiWaitFor("左侧边栏的网络邻居元素已显示");
    await agent.aiTap("点击左侧边栏的网络邻居");
    
    console.log('步骤1：检查是否存在用户鉴权框');
    const hasAuth = await agent.aiBoolean(`页面出现需要认证文本`);
    if (hasAuth) {
      console.log('检测到用户鉴权弹框，输入当前账户密码');
      await agent.aiTap('含有请输入密码文字的输入框');
      await device.typeText(env.testPassword);
      await agent.aiTap('确定');
    } else {
      console.log('未检测到用户鉴权弹框');
    }
    
    console.log('断言：网络邻居页面显示正常');
    await agent.aiAssert("网络邻居页面显示正常");
    console.log('断言通过：网络邻居页面显示正常');
    
    console.log('断言：若有文件，显示的是文件夹');
    const hasItems = await agent.aiBoolean('网络邻居页面中存在共享计算机或文件夹图标');
    if (hasItems) {
      await agent.aiAssert('网络邻居页面显示的是文件夹');
      console.log('断言通过：网络邻居页面显示的是文件夹');
    } else {
      console.log('网络邻居页面无共享计算机或文件夹，跳过文件类型断言');
    }
    
  }, { timeout: 600000, tags: ['1813579', 'level3', 'smb', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
  });
});