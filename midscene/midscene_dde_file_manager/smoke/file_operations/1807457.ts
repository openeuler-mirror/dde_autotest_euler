/**
 * 用例 PMSID: 1807457
 * 用例标题: [37][somke]重命名支持殊符号-新增支持持殊符号
 * 生成时间: 2025-12-16 15:13:20
 * 用例编写人: UT002411
 */

describe('1807457-[37][somke]重命名支持殊符号-新增支持持殊符号', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807457-[37][somke]重命名支持殊符号-新增支持持殊符号', async ({ device, agent, uos, system}) => {
    // 前置步骤：清空桌面其他txt文件
    await system.exec("rm ~/Desktop/*.txt");
    // 步骤1：打开文件管理器，进入桌面目录
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的桌面目录");
    // 步骤2：新建一个测试文本文件
    await agent.aiRightClick("桌面目录的空白区域");
    await agent.aiTap("右键菜单中的新建文档");
    await agent.aiTap("右边二级菜单的文本文档");
    await agent.aiTap("桌面目录的空白区域");
    // 步骤3：重命名测试文本文件[ ] + = ,
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText('[ ] + = ,');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为[ ] + = ,的txt文件");
    // 步骤4：重命名测试文本文件[,
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText('[');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为[的txt文件");
    // 步骤5：重命名测试文本文件]
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText(']');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为]的txt文件");
    // 步骤6：重命名测试文本文件+
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText('+');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为+的txt文件");
    // 步骤7：重命名测试文本文件=
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText('=');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为=的txt文件");
    // 步骤8：重命名测试文本文件,
    await agent.aiRightClick("桌面目录的新建文本文件");
    await agent.aiTap("右键菜单中的重命名");
    await device.typeText(',');
    await agent.aiTap("桌面目录的空白区域");
    await agent.aiAssert("桌面有文件名为,的txt文件");

  }, { timeout: 1800000,
       tags: ['1807457', 'level2', 'smoke', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec(`rm ~/Desktop/*.txt`);
  });
});
