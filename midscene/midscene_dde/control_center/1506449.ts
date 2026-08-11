/**
 * 用例 PMSID: 1506449
 * 用例标题: 【控制中心】【系统】【辅助信息】“关于本机”界面检查 
 * 生成时间: 2026-2-4 9:42:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506449-【控制中心】【系统】【辅助信息】“关于本机”界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506449-【控制中心】【系统】【辅助信息】“关于本机”界面检查', async ({ device, agent, uos, system}) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp("控制中心", {maximizeWindow: true});
      
      // 步骤 2: 点击系统-关于本机
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      await agent.aiWaitFor("系统/关于本机");

      // 获取本机名称
      const result= await system.exec('hostname');
      console.log('获取到的主机名为：',result.stdout);

      // 检查：页面展示的 公司图标、授权时间、公司名称、计算机名、产品名称、版本号、版本、类型、版本授权、内核版本、处理器、内存信息正常
      await agent.aiAssert('页面从上到下展示的 公司图标、授权时间、公司名称、计算机名、产品名称、版本号、版本、类型、版本授权、内核版本、处理器、内存信息正常');
      await agent.aiAssert(`界面显示的计算机名和${result.stdout}一致`); 

    }, { timeout: 600000, tags: ["1506449","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
      await uos.closeCurrentWindow();
    });
  });
  