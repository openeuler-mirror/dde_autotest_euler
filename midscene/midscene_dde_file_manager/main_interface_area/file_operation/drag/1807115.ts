/**
 * 用例 PMSID: 1807115
 * 用例标题: 拖入优化-关闭窗口特效，拖拽文件/文件夹
 * 生成时间: 2025-12-16 11:42:27
 * 用例编写人：UT000244（李庆玲）
 */
describe('1807115-拖入优化-关闭窗口特效，拖拽文件/文件夹', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807115-拖入优化-关闭窗口特效，拖拽文件/文件夹', async ({ device, agent, uos, system }) => {
     // 前置条件1：打开控制中心，设置个性化-窗口效果为最佳性能
    await uos.showDesktop();
    await uos.openApp('控制中心');
    await agent.aiTap('个性化');
    await agent.aiTap('窗口效果');
    await agent.aiTap('最佳性能');
    await agent.aiTap('右上角关闭按钮');

    // 前置条件2：创建测试文件
    await system.exec('touch ~/Downloads/1807115_1.txt');
    await system.exec('touch ~/Downloads/1807115_2.txt');
    await system.exec('touch ~/Downloads/1807115_3.txt');

    // 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiTap('左侧导航栏下载');
    
    // 步骤一：拖拽单个文件
    await agent.aiAction('将1807115_1.txt拖拽到左侧导航栏文档中');
    await agent.aiAssert('下载目录不存在1807115_1.txt');

    // 步骤二：同时拖拽多个文件
    await device.pressKey('Ctrl','A');
    await agent.aiAction('将1807115_2.txt和1807115_3.txt拖拽到左侧导航栏文档中');
    await agent.aiAssert('下载目录不存在1807115_2.txt和1807115_3.txt');

  }, { timeout: 1800000, tags: ["1807115", "level3", "drag", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    await system.exec('rm -f ~/Documents/1807115*.txt');
    await system.exec('rm -f ~/Downloads/1807115*.txt');
    
    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
    
    // 环境恢复：开启控制中心-个性化-窗口效果为最佳视觉
    await uos.showDesktop();
    await uos.openApp('控制中心');
    await agent.aiTap('个性化');
    await agent.aiTap('窗口效果');
    await agent.aiTap('最佳视觉', 2000);
    await device.pressKey("alt","F4");
  });
});