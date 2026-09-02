/**
 * 用例 PMSID: 1806813
 * 用例标题: 【书签】快捷访问-右键移除
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1806813-【书签】快捷访问-右键移除', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806813-【书签】快捷访问-右键移除', async ({ device, agent, uos , system}) => {
    // 步骤 1: 打开文件夹管理器 // 进入图片目录
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的图片");
    await agent.aiWaitFor("图片目录页面加载完成");

    // 步骤 2: Wallpapers添加快捷访问
    await agent.aiRightClick("Wallpapers的文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("添加到快捷访问");
    await agent.aiAssert("侧边栏目录显示Wallpapers");
    
    // 步骤 3: 删除快捷访问
    await agent.aiRightClick("Wallpapers的文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("从快捷访问移除");
    await agent.aiAssert("侧边栏目录不显示Wallpapers");

  }, { timeout: 1200000, tags: ['1806813', 'level2','smoke','huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});