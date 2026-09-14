/**
 * 用例 PMSID: 1976581
 * 用例标题:  右键菜单点击优化
 * 生成时间: 2026-5-25 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPassword = process.env.TEST_PASSWORD;

describe('1976581-右键菜单点击优化', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件，创建测试文件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
    });
  
    test('1976581-右键菜单点击优化', async ({ device, agent, uos, system }) => {
      await agent.aiWaitFor("桌面已显示");

      //步骤1：进入桌面，在空白处点击右键
      await agent.aiRightClick("桌面空白处"); 
      //步骤1预期：即刻呼出右键菜单 
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert("看到右键菜单"); 

      //步骤2：在桌面的其他空白处再次点击右键
      await agent.aiRightClick("桌面右下角空白处"); 
      //步骤2预期：即刻呼出右键菜单 
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert("看到右键菜单"); 
      await uos.openApp("文件管理器", 3000, 20000, true);

      //步骤3：打开文管进入主目录，在空白处点击右键
      await agent.aiTap("文件管理器左侧栏的主目录");  
      await agent.aiRightClick("主目录内空白处"); 
      //步骤3预期：即刻呼出右键菜单
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiAssert("看到右键菜单");

      //步骤4：在主目录的其他空白处再次点击右键
      await agent.aiTap("文件管理器左侧栏的主目录");  
      await agent.aiRightClick("主目录内右下角空白处"); 
      //步骤4预期：即刻呼出右键菜单
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert("看到右键菜单");

      await device.pressKey("Alt+F4");

    }, { timeout: 1200000, tags: ['1976581', 'level3', 'main_interface_area', 'file_operation', 'DITT', 'lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件，恢复设置并删除测试文件');      
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");

    });
  });