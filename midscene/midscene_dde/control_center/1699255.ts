/**
 * 用例 PMSID: 1699255
 * 用例标题: 【控制中心】【设备】【鼠标与触控板】鼠标四级设置项界面展示
 * 生成时间: 2026-05-07 18:00:00
 * 用例编写人:UT001707(陈慧)
 */

describe('1699255-【控制中心】【设备】【鼠标与触控板】鼠标四级设置项界面展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699255-【控制中心】【设备】【鼠标与触控板】鼠标四级设置项界面展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心-设备-鼠标与触控板-鼠标界面
      await uos.openApp("控制中心",{maximizeWindow: true});
      await agent.aiTap("蓝牙和其他设备");
      await agent.aiTap("鼠标与触控板");

      // 检查1: 打开到鼠标四级设置项界面展示正常
      await agent.aiAssert("鼠标四级设置项界面展示正常");

      // 检查2: 鼠标四级设置项界面展示
      await agent.aiAssert("左侧列表焦点在一级菜单设备项");
      await agent.aiAssert("页面左上角层级路径显示：< 蓝牙和其他设备 / 鼠标与触控板");
      await agent.aiAssert("右上角展示按钮：汉堡菜单，最小化，最大化/还原，关闭");

      // 检查3: 设置项标题
      await agent.aiAssert("设置项区标题：鼠标，左对齐");
      await agent.aiAssert("设置项区标题：触控板，左对齐");


      // 检查4: 滚动速度
      await agent.aiAssert("显示滚动速度调节区，左对齐");
      await agent.aiAssert("滚动速度默认显示在第一刻度上");

      // 检查5: 双击速度
      await agent.aiAssert("显示双击速度调节区，文字左对齐");
      await agent.aiAssert("双击速度滑块在中间位置");

      // 检查6: 左手模式
      await agent.aiAssert("显示左手模式，文字左对齐，开关默认关闭");


  
    }, { timeout: 300000,
         tags: ['1699255','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });