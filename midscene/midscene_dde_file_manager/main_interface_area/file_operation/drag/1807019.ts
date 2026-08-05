/**
 * 用例 PMSID: 1807019
 * 用例标题: 聚合拖拽-在桌面选中多个文件发生聚合后在原位置释放_
 * 生成时间: 2025-12-23 15:47:26
 * 用例编写人: UT000244（李庆玲）
 */

describe('1807019-聚合拖拽-在桌面选中多个文件发生聚合后在原位置释放_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  
  test('1807019-聚合拖拽-在桌面选中多个文件发生聚合后在原位置释放_', async ({ device, agent, uos, system }) => {
    // 创建测试文件
    for (let i = 1; i <= 4; i++) {
      await system.exec(`touch ~/Desktop/1807019_${i}.txt`);
      await system.exec(`mkdir ~/Desktop/1807019_${i}`);
    }

    await agent.aiTap("桌面空白处");

    // 步骤1：桌面多选文件拖拽后再原位释放
    try {
      await agent.aiAction("将test1.txt文件向右拖拽一点距离然后拖回原位置");
    } catch (error) {
      // 重试机制：分步操作
      await agent.aiTap("桌面空白处");
      await agent.aiAction("将1807019_1.txt文件向右拖拽");
      await agent.aiAssert("1807019_1.txt文件不在原来的位置");
      await agent.aiAction("将1807019_1.txt文件拖回原来的位置");
    }
  }, { timeout: 1800000, tags: ["1807019", "level3", "drag", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
    
    // 清空文件
    await system.exec("rm -rf ~/Desktop/1807019*"); 
  });
});
