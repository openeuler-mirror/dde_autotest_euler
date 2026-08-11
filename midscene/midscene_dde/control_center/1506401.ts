/**
 * 用例 PMSID: 1506401
 * 用例标题:  【控制中心】【系统】【声音】【系统音效】系统音效默认状态检查 
 * 生成时间: 2025-12-17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1506401-【控制中心】【系统】【声音】【系统音效】系统音效默认状态检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    }); 
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506401-【控制中心】【系统】【声音】【系统音效】系统音效默认状态检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3: 点击声音
      await agent.aiTap("声音");

      // 步骤 4：鼠标向下滚动 
      await agent.aiScroll('系统/声音下方区域',{direction:'down',distance:10});

      // 步骤 5: 点击系统音效
      await agent.aiTap("系统音效");

      // 检查: 系统音效按钮默认开启，开机关机默认不勾选，其他默认勾选
      await agent.aiAssert("系统音效按钮默认开启");
      await agent.aiAssert("开机，关机默认不勾选");
      await agent.aiAssert("注销，唤醒，音量调节，通知，电量不足，从启动器发送图标到桌面，\
      清空回收站，电源接入，电源拔出，移动设备接入，移动设备拔出默认勾选");
  
      // 步骤 6: 鼠标向下滚动
      await agent.aiScroll('系统/声音下方区域',{direction:'down',distance:5});

       // 检查: 检查错误提示默认勾选
      await agent.aiAssert("错误提示默认勾选");
  
    }, { timeout: 1200000,
         tags: ['1506401','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  
