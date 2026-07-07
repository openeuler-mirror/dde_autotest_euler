/**
 * 用例 PMSID: 1804809
 * 用例标题: [195]扩展名隐藏-取消勾选“显示文件扩展名”后，手动设置了隐藏的文件无后缀
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1804809-[195]扩展名隐藏-取消勾选“显示文件扩展名”后，手动设置了隐藏的文件无后缀', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`echo 1> /home/$USER/Desktop/1804809.txt`);
  });

  test('1804809-[195]扩展名隐藏-取消勾选“显示文件扩展名”后，手动设置了隐藏的文件无后缀', async ({ device, agent, uos , system}) => {

    // 步骤 1: 桌面创建文件，并设置为隐藏
    await agent.aiRightClick("1804809.txt");
    await agent.aiTap("属性");
    await agent.aiTap("隐藏此文件");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

    // 步骤 2: 设置取消勾选“显示文件扩展名”
    await uos.openApp("文件管理器");
    await agent.aiTap("文件管理器窗口主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("显示文件扩展名取消勾选");
    await agent.aiTap("设置窗口右上角关闭按钮:X");
    await agent.aiTap("文件管理器菜单窗口右上角关闭按钮:X"); 

    // 步骤 3: 显示隐藏文件
    await agent.aiTap("桌面空白处");
    await device.pressKey(`Ctrl+H`)
    await agent.aiAssert("桌面存在1804809");

  }, { timeout: 600000, tags: ['1804809', 'level3', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiRightClick("1804809");
    await agent.aiTap("属性");
    await agent.aiTap("隐藏此文件");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

    await uos.openApp("文件管理器");
    await agent.aiTap("文件管理器窗口主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiTap("显示隐藏文件");
    await agent.aiTap("设置窗口右上角关闭按钮:X");    
    await agent.aiTap("文件管理器菜单窗口右上角关闭按钮:X");
    await system.exec(`rm -rf /home/$USER/Desktop/1804809.txt`);
  });
});
