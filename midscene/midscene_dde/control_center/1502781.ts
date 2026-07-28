/**
 * 用例 PMSID: 1502781
 * 用例标题: 【控制中心】【电源管理】【通用】定时关机配置为隐藏时，控制中心无法搜索到定时关机相关内容
 * 生成时间: 2026-2-10 16:30:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502781-【控制中心】【电源管理】【通用】定时关机配置为隐藏时，控制中心无法搜索到定时关机相关内容', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      //定时关机配置为隐藏
      await system.exec("dde-dconfig set org.deepin.dde.control-center -r org.deepin.dde.control-center.power enableScheduledShutdown -v 'Hidden'");
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502781-【控制中心】【电源管理】【通用】定时关机配置为隐藏时，控制中心无法搜索到定时关机相关内容', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 点击搜索框，搜索框中输入定时关机
      await agent.aiTap("点击搜索框");
      await device.typeText("定时关机");

      //检查控制中心无法搜索到定时关机相关内容
      await agent.aiAssert("无法搜索到定时关机相关内容");

      //步骤 3: 打开快捷键shift+space
      await device.pressKey("shift+space");
      await device.typeText("定时关机");

      //检查无法搜索到定时关机相关内容
      await agent.aiAssert("搜索结果中没有'设置'为标题的搜索结果");

    }, { timeout: 600000, tags: ["1502781","level4"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //定时关机配置为显示，关闭控制中心
      await system.exec("dde-dconfig set org.deepin.dde.control-center -r org.deepin.dde.control-center.power enableScheduledShutdown -v 'Enabled'");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });


  