/**
 * 用例 PMSID: 1807773
 * 用例标题:  文件右键-分别打开多个对象的属性窗口
 * 生成时间: 2026-02-26 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1807773-文件右键-分别打开多个对象的属性窗口', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
      });

  test('1807773-文件右键-分别打开多个对象的属性窗口', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');

    //步骤 2：鼠标右键点击系统盘，查看属性
    console.log('步骤 2：鼠标右键点击系统盘，查看属性');
    await agent.aiRightClick('系统盘')
    await agent.aiTap('属性')
    await agent.aiAssert('显示系统盘的属性信息')

    // 步骤 3：鼠标右键数据盘，查看属性
    console.log('步骤 3：鼠标右键数据盘，查看属性');
    await agent.aiTap('文件管理器空白处')
    await agent.aiRightClick('数据')
    await agent.aiTap('属性')
    await agent.aiAssert('显示数据盘的属性信息')

  }, { timeout: 600000, tags: ["1807773", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});