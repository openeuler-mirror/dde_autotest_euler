// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1582913
 * 用例标题: [011]启动
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1582913-[011]启动', () => {
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
  
    test('1582913-[011]启动', async ({ device, agent, uos}) => {
      // 步骤 1：打开系统服务
      await agent.aiTap("窗口左上区域的'系统服务'");
      // 步骤 2：点击进程名
      await agent.aiRightClick("acpid");
      // 步骤 3：点击右键-启动，查看软件显示
      await agent.aiTap("启动")
      // 步骤4： 输入uos密码
      const passwd = process.env.TEST_PASSWORD
      await device.typeText(passwd);
      await device.pressKey('Enter')
      // 验证：启动选中服务，活动列更新为“已启动”
      await agent.aiAssert("acpid的启动状态为'已启动'");
    }, { timeout: 600000, tags: ['1582913','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await agent.aiRightClick("acpid");
      await agent.aiTap("停止")
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
