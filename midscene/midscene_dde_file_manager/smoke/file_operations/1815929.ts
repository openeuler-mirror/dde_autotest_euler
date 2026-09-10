/**
 * 用例 PMSID: 1815929
 * 用例标题: 长文件名功能(关闭) - 新建文件夹
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1815929-长文件名功能(关闭) - 新建文件夹', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815929-长文件名功能(关闭) - 新建文件夹', async ({ device, agent, uos , system}) => {
    // 步骤 1: 库目录创建文件
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的文档");
    await agent.aiWaitFor("文档目录页面加载完成");
    

    await agent.aiRightClick("文档目录空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文件夹");
    await device.typeText("新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试");
    await agent.aiTap("桌面目录空白处");
    await agent.aiAssert("文档目录存在新建测试文件");
    
    // 步骤 2: 深目录创建文件
    await system.exec(`mkdir -p /home/$USER/Documents/1/2/3/4/5/6/7/8/9/10`)
    await device.pressKey(`ctrl+L`)
    await device.pressKey(`ctrl+A`)
    await device.typeText("/home/uos/Documents/1/2/3/4/5/6/7/8/9/10");
    await device.pressKey(`enter`)
    await agent.aiAssert("进入/home/uos/Documents/1/2/3/4/5/6/7/8/9/10");

    await agent.aiRightClick("文件管理器空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文件夹");
    await device.typeText("新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试");
    await agent.aiTap("文件管理器窗口空白处");
    await agent.aiAssert("文管目录存在新建测试文件");

    // 步骤 3: 桌面创建文件
    await agent.aiTap("侧边栏的桌面");
    await agent.aiWaitFor("桌面目录页面加载完成");
    await agent.aiRightClick("桌面目录空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文件夹");
    await device.typeText("新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试");
    await agent.aiTap("文件管理器窗口空白处");
    await agent.aiAssert("文管目录存在新建测试文件");


  }, { timeout: 600000, tags: ['1815929', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/新建测试文件* /home/$USER/Documents/新建测试文件* /home/$USER/Documents/1`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});