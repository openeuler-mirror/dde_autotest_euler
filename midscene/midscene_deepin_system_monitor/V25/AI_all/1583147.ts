// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583147
 * 用例标题:舒展模式单击左侧内存跳转详情页
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583147-舒展模式单击左侧内存跳转详情页', () => {
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
      const status = await agent.aiBoolean("勾选舒展菜单");
      // 根据判断结果执行下一步操作
      if (status) {
         console.log('视图为舒展模式');
         await device.pressKey("ESC");
         await device.pressKey("ESC");
      } else {
          console.log('切换为舒展模式');
          await agent.aiTap("舒展");
      }
      await agent.aiTap("窗口右上角关闭按钮:X");
      console.log('beforeEach done')
    });
  
    test('1583147-舒展模式单击左侧内存跳转详情页', async ({ device, agent, uos}) => {
      //步骤  1：打开系统监视器,显示程序进程页界面
      await uos.openApp("系统监视器", 2000, 40000,false);
      await agent.aiAssert("窗口右侧显示程序进程列表");
      //步骤 2: 单击左侧内存模块
      await agent.aiTap("窗口左侧'内存'");
      //步骤 3: 程序进程列表切换到内存详情界面
      await agent.aiAssert("窗口右侧显示内存详情界面");
      await agent.aiTap("窗口右上角关闭按钮:X");
    }, { timeout: 600000, tags: ['1583147','level2','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 环境恢复： 视图为紧凑模式
      await uos.openApp("系统监视器", 2000, 40000,false);
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
    });
  });
