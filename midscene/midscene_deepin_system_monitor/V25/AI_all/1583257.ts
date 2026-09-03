// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583257
 * 用例标题:系统监视器内通知开启
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583257-等保-系统监视器内通知开启', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      console.log('beforeEach done')
    });
  
    test('1583257-等保-系统监视器内通知开启', async ({ device, agent, uos}) => {
      // 步骤 1: 点击右上方主菜单按钮，检查主菜单选项
      await agent.aiTap("窗口标题栏的三条横线图标");
      // 步骤 2: 主菜单新增“设置选项”
      await agent.aiTap("设置");
      // 步骤3：点击消息通知模块中的设置
      await  agent.aiTap("点击窗口右下角消息通知模块中的设置");
      // 等待控制中心窗口打开
      const isLoadingVisible = await agent.aiBoolean("未出现控制中心窗口");         
      if (isLoadingVisible) {
        console.log("等待控制中心窗口打开")
         // 等待控制中心窗口打开
        await agent.aiWaitFor("控制中心窗口打开", { timeoutMs: 50000 });
        }    
      // 验证1：跳转到控制中心的通知模块中的系统监视器选项
      await agent.aiAssert("界面出现新窗口标题栏写着'系统/通知'");
      // 判断窗口左侧列表是否已经展开
      const status = await agent.aiBoolean("窗口左侧存在搜索输入框");
      // 根据判断结果执行下一步操作
      if (status) {
         console.log('窗口左侧已经展开');
      } else {
          console.log('窗口左侧未展开');
          await agent.aiTap("窗口标题栏从左往右数第二个图标");
          await agent.aiWaitFor("勿扰模式左边存在搜索框")
      }
      await agent.aiTap("勿扰模式左边的搜索");
      // 步骤4： 搜索系统监视器，检查通知开关
      await device.typeText("系统监视器",true);
      // 验证2：通知按钮为高亮状态，下方4个选项“通知时有声音提示”“锁屏时显示通知”“在通知中心显示”“显示消息预览”均为选择状态
      await agent.aiAssert("允许通知的按钮为蓝色打开状态");
      await agent.aiAssert("下方4个选项'桌面'、'通知中心'、'显示消息预览'、'通知时提示声音'均为选择状态");
    }, { timeout: 600000, tags: ['1583257','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("ALT","F4")
      await system.exec('killall deepin-system-monitor')
    });
  });
