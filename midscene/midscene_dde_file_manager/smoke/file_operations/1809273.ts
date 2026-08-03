/**
 * 用例 PMSID: 1809273
 * 用例标题: 属性-选中文件/文件夹右键-属性
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809273-属性-选中单个文件/文件夹右键-属性', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809273-属性-选中单个文件/文件夹右键-属性', async ({ device, agent, uos , system}) => {
    // 步骤 1: 打开文件夹管理器 // 创建文件/文件夹
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档页面加载完成");

    await agent.aiRightClick("文件管理器窗口空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文件夹");


    await agent.aiRightClick("文件管理器窗口空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("测试文件");

    // 步骤 2: 查看文件属性 
    await agent.aiRightClick("新建文件夹图标", { deepThink: true });
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("属性", { deepThink: true });
    await agent.aiWaitFor("属性窗口加载完成");
    await agent.aiAssert("属性窗口显示正常");
    await agent.aiTap("属性窗口右上角关闭按钮:X");

    await agent.aiRightClick("测试文件.txt图标", { deepThink: true });
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("属性", { deepThink: true });
    await agent.aiWaitFor("属性窗口加载完成");
    await agent.aiAssert("属性窗口显示正常");
    await agent.aiTap("属性窗口右上角关闭按钮:X");
    
    // 步骤 3: 清理环境
    await system.exec(`rm -rf /home/uos/Documents/*`)

  }, { timeout: 1200000, tags: ['1809273','level2', 'smoke', 'huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});