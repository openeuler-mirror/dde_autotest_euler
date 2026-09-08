/**
 * 用例 PMSID: 1815889
 * 用例标题: 长文件名被截断后发送到桌面
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1815889-长文件名被截断后发送到桌面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815889-长文件名被截断后发送到桌面', async ({ device, agent, uos , system}) => {
    // 步骤 1: 库目录创建文件
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的文档");
    await agent.aiWaitFor("文档目录页面加载完成");
    

    await agent.aiRightClick("文档目录空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文件夹");
    await device.typeText("新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试");
    await agent.aiTap("文档目录空白处");
    await agent.aiTap("文档目录文件夹图标");
    await agent.aiAssert("文件夹名称为新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新");
    
    // 步骤 2: 文件发送到桌面
    await agent.aiRightClick("新建测试文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("发送到",{deepinThink:true});
    await agent.aiTap("发送到桌面");
    await agent.aiWaitFor("报错弹窗加载完成");
    await agent.aiAssert("提示文件名过长");
    await agent.aiTap("提示弹窗右上角关闭按钮:X");
    // 步骤 3: 修改文件名后再发送到桌面
    await agent.aiRightClick("新建测试文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("重命名");
    await device.typeText("测试文件夹");    
    await agent.aiTap("文档目录空白处");

    await agent.aiRightClick("测试文件夹");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("发送到",{deepinThink:true});
    await agent.aiTap("发送到桌面");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
    await agent.aiAssert("桌面存在测试文件夹快捷方式");


  }, { timeout: 600000, tags: ['1815889', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/测试文件* /home/$USER/Documents/测试文件*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});