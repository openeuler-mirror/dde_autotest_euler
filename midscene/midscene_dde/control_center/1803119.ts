/**
 * 用例 PMSID: 1803119
 * 用例标题: 【控制中心】【系统】【语言和区域】区域显示检查
 * 生成时间: 2025-12-24
 * 用例编写人: UT005571(王艺桥)
 */

describe('1803119-【控制中心】【系统】【语言和区域】区域显示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1803119-【控制中心】【系统】【语言和区域】区域显示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心",{maximizeWindow: true});
     
      // 步骤 2: 点击语言和区域
      await agent.aiTap("语言和区域");

      // 检查： 区域显示
      await agent.aiAssert("区域从上至下显示\
        标题：区域\
        地区  右侧显示在安装镜像时所选择的地区\
        提示文案：操作系统和应用可能会根据你所在的国家和地区向你提供本地内容\
        区域格式  右侧显示安装镜像时所选择的区域\
        提示文案：操作系统和某些应用会根据区域格式设置日期和时间格式\
        显示所选择区域的格式分为三类：时间格式、货币格式、数字格式\
        星期/周\
        一周首日\
        短日期\
        长日期\
        短时间\
        长时间\
        货币符号\
        货币正数\
        货币负数");
      await agent.aiAssert("小数点\
        分隔符\
        数字分组\
        纸张\
        示例");
  
    }, { timeout: 300000, tags: ["1803119","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });