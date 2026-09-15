/**
 * 用例 PMSID: 1816657
 * 用例标题: 侧边栏-多次折叠
 * 生成时间: 2026-2-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816657-侧边栏-多次折叠', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器窗口
      await uos.openApp('文件管理器');
    });
  
    test('1816657-侧边栏-多次折叠', async ({ device, agent, uos, system, env }) => {  
      // 循环20次执行侧边栏折叠展开测试
      for (let i = 0; i < 10; i++) {
        console.log(`第${i + 1}次循环：侧边栏折叠展开测试`);
        
        // 步骤1：单击侧边栏"折叠"按钮--结果：侧边栏向左收起隐藏，折叠后，文件管理器窗口总宽度保持不变
        await agent.aiTap('文件管理器左侧顶部的收起展开侧边栏按钮');
        await agent.aiAssert('文件管理器的左侧边栏向左收起隐藏');
        await agent.aiAssert('文件管理器此刻窗口大小对比左侧栏收起时没变');

        // 步骤2：	再次单击"折叠"按钮--结果：侧边栏向右展开，恢复折叠前的宽度
        await agent.aiTap('文件管理器左侧顶部第一行第二个按钮');
        await agent.aiAssert('文件管理器的左侧边栏展开');
        await agent.aiAssert('文件管理器的左侧边栏于步骤1展开状态下宽度一致');
      }

    }, { timeout: 1800000, tags: ["1816657", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
