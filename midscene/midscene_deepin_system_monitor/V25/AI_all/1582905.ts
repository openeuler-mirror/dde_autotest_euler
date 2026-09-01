// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1582905
 * 用例标题:  [014]刷新
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */
// 定义密码变量

describe('1582905-[014]刷新', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
    });
  
    test('1582905-[014]刷新', async ({ device, agent, uos}) => {
      // 步骤 1：打开系统服务
      await agent.aiTap("窗口左上区域的'系统服务'");
      // 步骤 2：点击进程名
      await agent.aiRightClick("alsa-restore");
      // 步骤 3：点击右键-刷新，查看软件显示
      await agent.aiTap("刷新")
      // 等待加载完成
      const isLoadingVisible = await agent.aiBoolean("出现加载图标");         
      if (isLoadingVisible) {
        console.log("出现加载图标")
         // 等待加载图标消失
        await agent.aiWaitFor("加载图标消失");
        }    
        //验证：立即刷新所有的服务列表     
      await agent.aiAssert("列表加载正常");
    }, { timeout: 600000, tags: ['1582905','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
