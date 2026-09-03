// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583261
 * 用例标题:等保-开启自动报警后重启应用
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583261-等保-开启自动报警后重启应用', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      //环境准备：确保开关处于关闭状态
      await system.exec('deepin-system-monitor')
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("设置");
      const status = await agent.aiBoolean("'自动报警'后面的按钮为蓝色");
      // 根据判断结果执行下一步操作
      if (status) {
         console.log('自动报警开关已经是打开状态');
         await agent.aiTap("'自动报警'后面的按钮");
      } else {
          console.log('自动报警开关是关闭状态');
      }
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      console.log('beforeEach done')
    });
  
    test('1583261-等保-开启自动报警后重启应用', async ({ device, agent, uos}) => {
      // 步骤 1: 点击右上方主菜单按钮，点击设置，进入设置页面
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("设置");
      // 步骤 2: 打开自动报警开关
      await agent.aiTap("点击'自动报警'后面的按钮");
      // 验证：自动报警开关亮化
      await agent.aiAssert("'自动报警'后面的按钮为蓝色");
      // 步骤3：重启应用后检查设置页自动报警开关状态
      await device.pressKey("ESC");
      await agent.aiTap("窗口右上角关闭按钮:X");
      await uos.openApp("系统监视器", 2000, 40000,false);
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("设置");
      // 验证：自动报警开关亮化
      await agent.aiAssert("'自动报警'后面的按钮为蓝色");

    }, { timeout: 600000, tags: ['1583261','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //配置恢复
      await agent.aiTap("点击'自动报警'后面的按钮");
      await device.pressKey("ESC");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
