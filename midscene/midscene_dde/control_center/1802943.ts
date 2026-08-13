/**
 * 用例 PMSID: 1802943
 * 用例标题: 【控制中心】【系统】【辅助信息】隐私政策协议中的链接支持右键复制
 * 生成时间: 2026-01-27 20:08:27
 * 用例编写人:UT000511(肖海燕)
 */

describe('1802943-【控制中心】【系统】【辅助信息】隐私政策协议中的链接支持右键复制', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1802943-【控制中心】【系统】【辅助信息】隐私政策协议中的链接支持右键复制', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统-隐私政策
      await agent.aiTap("系统");
      await agent.aiTap("隐私政策");

      // 步骤 3: 点击右键点击协议正文中的'点击此处'文字链接"
      await agent.aiRightClick("右键点击协议正文中的'点击此处'文字链接");
      await agent.aiAssert("展示'复制链接地址(L)'菜单");

      await agent.aiTap("点击复制链接地址(L)菜单");
      await agent.aiTap("点击控制中心搜索框");
      await device.pressKey('Ctrl+V');
      await agent.aiAssert("控制中心搜索框输入成功");
      await agent.aiTap("点击输入框X按钮，清除输入内容");

      // 步骤 4: 右键点击协议正文中的链接地址
      await agent.aiRightClick("右键点击协议正文中的'通过访问'后面文字链接");
      await agent.aiAssert("展示'复制链接地址(L)'菜单");

      await agent.aiTap("点击复制链接地址(L)菜单");
      await agent.aiTap("点击控制中心搜索框");
      await device.pressKey('Ctrl+V');
      await agent.aiAssert("控制中心搜索框输入成功");
                    
    }, { timeout: 600000, tags: ["1802943","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("点击输入框X按钮，清除输入内容");
      await uos.closeCurrentWindow();
    });
  });
  