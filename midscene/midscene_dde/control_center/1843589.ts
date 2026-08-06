/**
 * 用例 PMSID: 1843589
 * 用例标题: 【控制中心】【系统】【声音】声音界面，输出设置项检查
 * 生成时间: 2025-12-24
 * 用例编写人:UT005571(王艺桥)
 */

describe('1843589-【控制中心】【系统】【声音】声音界面，输出设置项检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1843589-【控制中心】【系统】【声音】声音界面，输出设置项检查', async ({ device,env, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心",{maximizeWindow: true});
     
      // 步骤 2: 声音
      await agent.aiTap("声音");

      // 检查: 声音界面显示
      await agent.aiAssert("从上到下依次显示：输出，输入，设置")
      await agent.aiAssert("设置\
        菜单项：系统音效\
        概述文案：开启/关闭系统音效\
        菜单项：设备管理\
        概述文案：启用/禁用音频设备")
      // 检查: 输出设置显示
      await agent.aiAssert("输出设置项从上到下依次显示\
        输出音量(默认50%)\
        音量增强(默认关闭)\
        说明文案：音量大于100%时可能会导致音效失真，同时损害您的音频输出设备\
        单声道音频(默认关闭)\
        说明文案：将左声道和右声道合并成一个声道\
        左右平衡(默认中间刻度)\
        插拔管理(默认开启)\
        说明文案：外设插拔时音频输出是否自动暂停\
        输出设备：显示当前优先级最高的输出设备名称")

    }, { timeout: 300000, tags: ["1843589","level1","smoke","laptop"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
    });
});