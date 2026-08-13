
/**
 * 用例 PMSID: 1506489
 * 用例标题: 【控制中心】【网络】【VPN】VPN界面检查
 * 生成时间: 2026-04-23 14：31：11
 * 用例编写人: UT002485(卢燕)
 */

describe('1506489-【控制中心】【网络】【VPN】VPN界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506489-【控制中心】【网络】【VPN】VPN界面检查', async ({ device, agent, uos }) => {
      // 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });

      // 检查导入/添加VPN按钮
      await agent.aiTap("网络");
      await agent.aiTap("VPN");
      await agent.aiAssert("界面存在按钮：导入VPN、添加VPN");

      // 检查添加VPN界面
      await agent.aiTap("添加VPN");
      await agent.aiAssert("界面显示功能项：VPN类型、通用、VPN、VPN PPP");
      // await agent.aiScroll('控制中心右侧添加VPN页面', { direction: 'down', distance: 100, scrollType: 'once' });
      // await agent.aiScroll('控制中心右侧添加VPN页面', { direction: 'down', distance: 100, scrollType: 'once' });
      // await agent.aiScroll('控制中心右侧添加VPN页面', { direction: 'down', distance: 100, scrollType: 'once' });
      await agent.aiScroll('滚动到添加VPN页面底部', { direction: 'down', distance: 500 });
      await agent.aiAssert("界面显示功能项：VPN IPsec、IPv4、DNS");
      await agent.aiAssert("界面存在按钮：取消、保存");

      // 检查导入VPN界面
      await agent.aiTap("取消按钮");
      await agent.aiTap("导入VPN");
      await agent.aiAssert("新增窗口左侧显示主目录");
      await agent.aiTap("窗口右上角关闭按钮:X"); 
    }, { timeout: 1200000, tags: ['1506489', 'level1', 'smoke'] });
  
    afterEach(async ({ device, agent }) => {
      console.log('4. afterEach: 每个测试后的清理');      
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
      await uos.showDesktop();
    });
  });
  