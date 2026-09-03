/**
 * 用例 PMSID: 1807365
 * 用例标题: [046]属性基本信息-隐藏
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1807365-[046]属性基本信息-隐藏', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807365-[046]属性基本信息-隐藏', async ({ device, agent, uos , system}) => {
    // 步骤 1: 桌面创建文件夹
    await system.exec(`mkdir /home/$USER/Desktop/1807365`)

   // 步骤 2: 修改文件属性为隐藏 
    await agent.aiRightClick("1807365");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("属性");
    await agent.aiWaitFor("属性窗口加载完成");
    await agent.aiTap("隐藏此文件");
    await agent.aiTap("属性窗口右上角关闭按钮:X");
    await agent.aiAssert("桌面无1807365");

    // 步骤 3: 快捷键取消隐藏 
    await device.pressKey(`ctrl+h`)
    await agent.aiAssert("桌面存在1807365");

    // 步骤 4: 修改文件属性为不隐藏 
    await agent.aiRightClick("1807365");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("属性");
    await agent.aiWaitFor("属性窗口加载完成");
    await agent.aiTap("隐藏此文件");
    await agent.aiTap("属性窗口右上角关闭按钮:X");
    await agent.aiAssert("桌面存在1807365");
    
    // 步骤 5: 清理环境
    await device.pressKey(`ctrl+h`)
    await system.exec(`rm -rf /home/$USER/Desktop/1807365*`)

  }, { timeout: 1200000, tags: ['1807365','level2', 'smoke', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});