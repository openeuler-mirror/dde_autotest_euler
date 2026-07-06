/**
 * 用例 PMSID: 1804823
 * 用例标题: 扩展名隐藏-取消勾选"显示文件扩展名"后，检查标记目录文件名是否隐藏
 * 生成时间: 2026-05-19 12:00:00
 * 用例编写人: UT000649（黄甜）
 */

describe('1804823-扩展名隐藏-标记目录文件名', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`mkdir -p ~/Desktop/1804823/`)
    await system.exec(`touch /home/$USER/Desktop/1804823/1804823.docx`)
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的桌面");
    await agent.aiRightClick("1804823");
    await agent.aiTap("标记信息下方的红色图标");
  });

  test('1804823-扩展名隐藏-标记目录文件名', async ({ device, agent, uos }) => {
    await agent.aiTap("文件管理器窗口的主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiAssert("默认勾选显示文件扩展名");

    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("取消勾选显示文件扩展名");
    await agent.aiTap("窗口右上角关闭按钮:X");

    await agent.aiTap("侧边栏的桌面");
    await agent.aiDoubleClick("1804823的文件夹");
    await agent.aiAssert("目录下存在1804823文件");

  }, { timeout: 600000, tags: ['1804823', 'level2', 'smoke', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口的主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("rm -rf /home/$USER/Desktop/1804823*");
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
