/**
 * 用例 PMSID: 1804815
 * 用例标题: [180]扩展名隐藏-取消勾选"显示文件扩展名"后，检查文件选择对话框文件名是否隐藏
 * 生成时间: 2026-05-19 12:00:00
 * 用例编写人: UT000649（黄甜）
 */

describe('1804815-[180]扩展名隐藏-文件选择对话框', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/1804815.pdf`)
  });

  test('1804815-[180]扩展名隐藏-文件选择对话框', async ({ device, agent, uos }) => {
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");

    await agent.aiTap("主菜单");
    await agent.aiTap("设置");
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认");
    
    await agent.aiScroll('高级设置', { direction: 'up', distance: 10 });
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("显示文件扩展名选项已取消勾选");
    await agent.aiTap("窗口右上角关闭按钮:X");

    await agent.aiTap("侧边栏的桌面");
    await agent.aiAssert("桌面目录存在1804815");
    await agent.aiTap("窗口右上角关闭按钮:X");

    await uos.openApp("文本编辑器");
    await device.typeText("1804815测试内容");
    await agent.aiTap("主菜单");
    await agent.aiTap("另存为");
    await agent.aiTap("桌面目录");
    await agent.aiTap("文件名旁边的输入框");
    await device.pressKey(`ctrl+a`);
    await device.typeText("1804815测试内容.txt");
    await agent.aiTap("保存");
    await agent.aiTap("1804815测试内容旁边的关闭按钮:X");
    await device.pressKey(`super+e`);
    await agent.aiTap("侧边栏的桌面");
    await agent.aiAssert("桌面存在名为1804815测试内容的文件");


  }, { timeout: 600000, tags: ['1804815', 'level2', 'smoke', 'DITT', 'huangtian'] });

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
    await system.exec("rm -rf /home/$USER/Desktop/1804815*");
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
