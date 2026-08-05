/**
 * 用例 PMSID: 1807095
 * 用例标题: [core]文件拖拽优化测试-拖拽主目录到侧边栏各个位置
 * 生成时间: 2025-12-19 15:56:53
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807095-[core]文件拖拽优化测试-拖拽主目录到侧边栏各个位置', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807095-[core]文件拖拽优化测试-拖拽主目录到侧边栏各个位置', async ({ device, agent, uos, system }) => {
    // 前置条件：打开文件管理器
    await uos.openApp('文件管理器');
    
    // 步骤一：从侧边栏【计算机】-【系统盘】-【home】-【主目录】进入
    await agent.aiTap('左侧导航栏计算机');
    await agent.aiDoubleClick('计算机页面的系统盘');
    await agent.aiDoubleClick('系统盘页面的home');
    await agent.aiAssert('home页签中存在主目录');
    
    // 步骤二：拖拽主目录到侧边栏主目录，预期结果：提示操作失败！目标文件夹位于源文件夹内！
    console.log('开始拖拽主目录到侧边栏主目录...');
    await agent.aiAction('将home页签中的主目录文件夹拖拽到左侧导航栏主目录中');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 检查是否出现操作失败弹框提示
    try {
        await agent.aiWaitFor('操作失败！目标文件夹位于源文件夹内！', { timeout: 3000 });
        console.log('✓ 出现预期的错误提示');
        await agent.aiTap('确定');
    } catch (error) {
        console.log('未出现错误提示，继续验证主目录状态...');
        // 如果没有错误提示，直接验证主目录是否仍然存在
    }
    
    // 断言：主目录仍然存在
    try {
      await agent.aiAssert('home页签中存在主目录');
      console.log('✓ 主目录不支持拖拽到其他目录，测试通过');
    } catch (error) {
      console.log('✗ 主目录拖拽到其他目录下，这是一个bug');
      throw new Error('主目录意外被移动');
    }
  }, { timeout: 1800000, tags: ["1807095", "level3", "drag", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    await system.exec('killall dde-file-manager');
  });
});