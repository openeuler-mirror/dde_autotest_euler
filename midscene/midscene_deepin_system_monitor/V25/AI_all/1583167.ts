// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583167
 * 用例标题:紧凑模式左侧CPU
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583167-紧凑模式左侧CPU', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      // 环境准备： 视图为紧凑模式
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("点击视图");
      const status = await agent.aiBoolean("勾选紧凑菜单");
      // 根据判断结果执行下一步操作
      if (status) {
         console.log('视图为紧凑模式');
         await device.pressKey("ESC");
         await device.pressKey("ESC");
      } else {
          console.log('切换为紧凑模式');
          await agent.aiTap("紧凑");
      }
      await agent.aiTap("窗口右上角关闭按钮:X");
      console.log('beforeEach done')
    });
  
    test('1583167-紧凑模式左侧CPU', async ({ device, agent, uos}) => {
      //步骤  1：打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      // 步骤 2: 查看系统监视器左侧网格图标显示，仅展示一条曲线，为CPU总体利用率的占用趋势，2s会刷新一次数据，曲线会根据占用率自动调整波峰波谷曲线，但不会超出网格区域
      await agent.aiAssert("窗口左侧处理器部分是网格图标显示,仅展示一条曲线,为CPU总体利用率的占用趋势");
      await agent.aiAssert("窗口左侧处理器部分网格图标2s会刷新一次数据,曲线会根据占用率自动调整波峰波谷曲线,但不会超出网格区域");
    }, { timeout: 600000, tags: ['1583167','level2','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
