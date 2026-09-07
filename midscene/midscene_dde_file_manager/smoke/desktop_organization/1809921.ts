/**
 * 用例 PMSID: 1809921
 * 用例标题: 桌面文件来回右键点击，右键菜单选项显示正确
 * 生成时间: 2026-1-23 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809921-桌面文件来回右键点击，右键菜单选项显示正确', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809921-桌面文件来回右键点击，右键菜单选项显示正确', async ({ device, agent, uos , system}) => {
    // 步骤 1: 创建文件
    await system.exec(`touch /home/$USER/Desktop/1809921.txt`)
    await system.exec(`mkdir /home/$USER/Desktop/1809921`)

    // 步骤 2:不同文件显示右键菜单
    await agent.aiRightClick("计算机")
    await agent.aiAssert("右键菜单显示正常");
    await agent.aiTap("桌面空白处");

    await agent.aiRightClick("服务与支持")
    await agent.aiAssert("右键菜单显示正常");
    await agent.aiTap("桌面空白处");

    await agent.aiRightClick("主目录")
    await agent.aiAssert("右键菜单显示正常");
    await agent.aiTap("桌面空白处");

    await agent.aiRightClick("1809921.txt")
    await agent.aiAssert("右键菜单显示正常");
    await agent.aiTap("桌面空白处");

    await agent.aiRightClick("1809921")
    await agent.aiAssert("右键菜单显示正常");
    await agent.aiTap("桌面空白处");

    // 步骤 3: 清理环境
    await system.exec(`rm -rf /home/$USER/Desktop/1809921*`)

  }, { timeout: 600000, tags: ['1809921', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});