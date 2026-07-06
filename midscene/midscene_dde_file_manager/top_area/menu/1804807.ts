/**
 * 用例 PMSID: 1804807
 * 用例标题: [194]扩展名隐藏-取消勾选“显示文件扩展名”后，修改文件名称无后缀
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1804807-[194]扩展名隐藏-取消勾选“显示文件扩展名”后，修改文件名称无后缀', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`echo 1> /home/$USER/Desktop/1804807.txt`)
  });

  test('1804807-[194]扩展名隐藏-取消勾选“显示文件扩展名”后，修改文件名称无后缀', async ({ device, agent, uos , system}) => {

    // 步骤 1:设置取消勾选“显示文件扩展名”
    await uos.openApp("文件管理器");
    await agent.aiTap("文件管理器窗口主菜单");
    await agent.aiTap("设置");
    await agent.aiScroll('基础设置', { direction: 'down', distance: 10 });
    await agent.aiTap("文件粉碎");
    await agent.aiTap("恢复默认"); 

    await agent.aiScroll('侧边栏', { direction: 'up', distance: 10 });
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiAssert("显示文件扩展名取消勾选");
    await agent.aiTap("设置窗口右上角关闭按钮:X");
    await agent.aiTap("文件管理器菜单窗口右上角关闭按钮:X"); 

    // 步骤 2: 桌面修改文件名
    await agent.aiTap("1804807");
    await device.pressKey(`F2`);
    await agent.aiAssert("1804807被选中");

    // 步骤 3: 文管桌面目录修改文件名
    await uos.openApp("文件管理器");
    await agent.aiTap("侧边栏的桌面目录");
    await agent.aiTap("文件管理器窗口桌面目录内的1804807");
    await device.pressKey(`F2`);
    await agent.aiAssert("1804807被选中");
    await agent.aiTap("窗口右上角关闭按钮:X");
    

  }, { timeout: 600000, tags: ['1804807', 'level3', 'menu', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.openApp("文件管理器");
    await agent.aiTap("文件管理器窗口主菜单");
    await agent.aiTap("设置");
    await agent.aiTap("文件和目录");
    await agent.aiTap("显示文件扩展名");
    await agent.aiTap("设置窗口右上角关闭按钮:X"); 
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec(`rm -rf /home/$USER/Desktop/1804807*`)
  });
});

