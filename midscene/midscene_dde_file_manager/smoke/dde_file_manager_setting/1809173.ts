/**
 * 用例 PMSID: 1809173
 * 用例标题: 设置-“隐藏文件”
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */


describe('1809173-设置-“隐藏文件”', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809173-设置-“隐藏文件', async ({ device, agent, uos, system }) => {
    const execCmd = 'touch /home/$USER/Downloads/.test.txt';
    await system.exec(execCmd);
    await agent.aiDoubleClick("桌面上计算机图标");
    await uos.maximizeWindow();
    await agent.aiTap("点击文件管理器侧边栏中的下载");
    await device.pressKey('Ctrl + H');
    await agent.aiWaitFor('.test.txt');
    await agent.aiAssert("文件夹内有.test.txt文件");
    await uos.closeCurrentWindow();

  }, { timeout: 1200000, tags: ["1809173", 'level1', 'smoke'] });


  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const clrCmd = 'rm /home/$USER/Downloads/.test.txt';
    await system.exec(clrCmd);
    await device.pressKey('Ctrl + H');
  });
});