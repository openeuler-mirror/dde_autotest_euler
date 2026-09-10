/**
 * 用例 PMSID: 1815923
 * 用例标题: 复制含有特殊字符的文件夹，选择替换方式
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1815923-复制含有特殊字符的文件夹，选择替换方式', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent ,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`mkdir /home/$USER/Desktop/$ /home/$USER/Desktop/% /home/$USER/Desktop/a`)
    await system.exec(`mkdir /home/$USER/Desktop/a/$ /home/$USER/Desktop/a/%`)
  });

  test('1815923-复制含有特殊字符的文件夹，选择替换方式', async ({ device, agent, uos , system}) => {

    // 步骤 1:复制文件，并存
    await agent.aiDoubleClick("文件夹a");
    await agent.aiWaitFor("文件夹打开窗口加载完成");
    await device.pressKey(`ctrl+a`);
    await device.pressKey(`ctrl+c`);
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
    await agent.aiTap("桌面壁纸空白处");
    await device.pressKey(`ctrl+V`);
    await agent.aiWaitFor("文件粘贴冲突对话框加载完成");
    await agent.aiAssert("文件粘贴冲突对话框提示语:目标文件夹中已存在名为$的文件", {deepThink: true});
    await agent.aiTap("合并");
    await agent.aiTap("合并");
    await agent.aiAssert("文件粘贴任务对话框被关闭");


  }, { timeout: 600000, tags: ['1815923', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/% /home/$USER/Desktop/$ /home/$USER/Desktop/a`);
    await agent.aiTap("窗口右上角关闭按钮:X");    
  });
});