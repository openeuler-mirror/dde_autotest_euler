/**
 * 用例 PMSID: 1804813
 * 用例标题: 扩展名隐藏-取消勾选"显示文件扩展名"后，复制文件路径，检查路径是否完整
 * 生成时间: 2026-05-19 12:00:00
 * 用例编写人: UT000649（黄甜）
 */

describe('1804813-扩展名隐藏-复制文件路径', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`echo 1> /home/$USER/Desktop/1804813.txt`)
  });

  test('1804813-扩展名隐藏-复制文件路径', async ({ device, agent, uos, system }) => {
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");

    await agent.aiTap("主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("显示文件扩展名选项已取消勾选");

    await agent.aiTap("窗口右上角关闭按钮:X");

    await agent.aiTap("侧边栏的桌面");
    await agent.aiWaitFor("桌面目录页面加载完成");

    await agent.aiRightClick("1804813");
    await agent.aiTap("复制");
    await agent.aiAssert("右键菜单消失");

    await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file %F -- -- deepin-editor %%F`)
    await agent.aiWaitFor("文本编辑器界面已显示");

    await agent.aiRightClick("文本编辑器编辑区域");
    await agent.aiTap("粘贴");
    await agent.aiAssert("粘贴文件完整路径，有扩展名");

  }, { timeout: 600000, tags: ['1804813', 'level2', 'smoke', 'DITT', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("未命名文档1旁边的关闭按钮:X");
    await agent.aiTap("不保存");
    await agent.aiTap("文件管理器窗口的主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("rm -rf /home/$USER/Desktop/1804813.txt");
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
