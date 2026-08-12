/**
 * 用例 PMSID: 1806013
 * 用例标题: 设置-计算机属性显示变更-属性界面显示
 * 用例编写人: UT005045(许琪)
 * 生成时间：2025/12/22
 */

describe('1806013-设置-计算机属性显示变更-属性界面显示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1806013-计算机属性显示变更-属性界面显示', async ({ device, agent, uos }) => {
      await agent.aiRightClick("桌面上计算机图标");
      await agent.aiTap("点击属性");
      await agent.aiAssert("界面显示文本内容：计算机名，版本号，版本，构建号，类型，处理器，内存");
      await agent.aiAssert("版本显示内容：专业版(2500)");
      await uos.closeCurrentWindow();
    }, { 
        timeout: 120000,  // 超时时间
        tags: ["1806013",'level1', 'smoke'] 
    });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });