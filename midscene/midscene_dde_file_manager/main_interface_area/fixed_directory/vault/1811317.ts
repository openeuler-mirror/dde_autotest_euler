/**
 * 用例 PMSID: 1811317
 * 用例标题:  保险箱-复制粘贴多个文件/文件夹到保险箱中
 * 生成时间: 2026-2-12 13:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1811317- 保险箱-复制粘贴多个文件/文件夹到保险箱中', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
    await system.exec("rm -rf /home/${userName}/Desktop/*.txt");
  });
  
  test('1811317-保险箱-复制粘贴多个文件/文件夹到保险箱中', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    

    //前置条件：桌面创建2个文件和2个文件夹
    await device.pressKey("Super+D");
    await agent.aiRightClick("桌面右上角空白处");    
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("317");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("桌面右边框附近空白处");    
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("318");
    await agent.aiTap("桌面空白处");
    await agent.aiDoubleClick("318.txt");
    await device.typeText("今天天气很好，保存文本文件");
    await device.pressKey("Ctrl+S");
    await device.pressKey("Alt+F4");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("桌面右下角空白处");    
    await agent.aiTap("新建文件夹");
    await device.typeText("318a");
    await agent.aiTap("桌面空白处");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("距离318a文件夹下方80像素的桌面空白处"); 
    await agent.aiTap("新建文件夹");
    await device.typeText("320");
    await agent.aiTap("桌面空白处");

    //前置条件：创建透明加密保险箱，并进入保险箱
    const { createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createNoPasswordVault(uos, env, agent, device, system);
   
    //步骤1：复制多个/单个文件到保险箱
    await device.pressKey("Super+Left");
    await device.keyDown("ctrl");
    await agent.aiTap("桌面上的317.txt");
    await agent.aiTap("桌面上的318.txt");
    await device.keyUp("ctrl");
    await device.pressKey("Ctrl+C");
    await agent.aiTap("保险箱内空白处");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("保险箱内的317.txt和318.txt处于被选中状态");
    await device.pressKey("Delete");
    await agent.aiTap("删除按钮");
    await agent.aiAssert("保险箱内没有317.txt和318.txt");

    //步骤2：复制搜索结果页文件/文件夹到保险箱
    await device.pressKey("Super+Up");
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiTap("右上角有放大镜的输入框");
    await agent.aiInput("318","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    try {
      await agent.aiWaitFor("搜索结果有318.txt和318a文件夹",
        {
          timeoutMs: 60000,
          checkIntervalMs: 5000
        }
      );
    } catch (error) {
      console.log('第一次搜索超时，未找到318.txt和318a文件夹，重新执行搜索操作');
      await agent.aiTap("右上角有放大镜的输入框");
      await agent.aiInput("318","右上角有放大镜的输入框");
      await device.pressKey("Enter");
      await agent.aiWaitFor("搜索结果有318.txt和318a文件夹",
        {
          timeoutMs: 60000,
          checkIntervalMs: 5000
        }
      );
    }
    
    await device.keyDown("ctrl");
    await agent.aiTap("318.txt文件");
    await agent.aiTap("318a文件夹");
    await device.keyUp("ctrl");
    await device.pressKey("Ctrl+C");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("保险箱内空白处");
    await device.pressKey("Ctrl+V");
    await agent.aiAssert("保险箱内318a文件夹和318.txt名称都是蓝色底");

    //步骤3：复制同名文件/文件夹到保险箱内
    await device.pressKey("Super+Left");
    await agent.aiTap("桌面上的318.txt");
    await device.pressKey("Ctrl+C");
    await agent.aiTap("保险箱内空白处");
    await device.pressKey("Ctrl+V");
    await agent.aiTap("替换");
    await agent.aiAssert("保险箱内只有1个318.txt，且318.txt名称是蓝色底");   

  }, { timeout: 1200000, tags: ['1811317','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, env, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { UiRmNoPasswordVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      // 删除保险箱
      await UiRmNoPasswordVault(device, agent, uos, env, system);
      await system.exec("rm -rf ~/Desktop/3*");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("ps -ef | grep editor | grep -v grep | awk '{print $2}' | xargs kill -9");
    });
  });