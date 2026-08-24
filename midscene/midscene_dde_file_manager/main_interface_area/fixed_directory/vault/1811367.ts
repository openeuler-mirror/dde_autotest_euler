/**
 * 用例 PMSID: 1811367
 * 用例标题: 保险箱-添加带标记信息的文件夹
 * 生成时间: 2026-2-11 14:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811367-保险箱-添加带标记信息的文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
    //删除红色标记，清理环境
    await uos.openApp("文件管理器", 3000, 20000, true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick("文件管理器左侧栏的红色文字");
    await agent.aiTap("移除");
    await agent.aiTap("删除按钮");
    await device.pressKey("Alt+F4");
  });
  
  test('1811367-保险箱-添加带标记信息的文件夹', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    

    //前置条件：已进入保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
  
    //步骤1：桌面新建文件/文件夹A-右键添加标记属性
    await device.pressKey("Super+D");
    await agent.aiRightClick("桌面右上角空白处");    
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("18");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("桌面右边框附近空白处");    
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("19");
    await agent.aiTap("桌面空白处");
    await agent.aiDoubleClick("19.txt");
    await device.typeText("今天天气很好，保存文本文件");
    await device.pressKey("Ctrl+S");
    await device.pressKey("Alt+F4");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("桌面右下角空白处");    
    await agent.aiTap("新建文件夹");
    await device.typeText("19");
    await agent.aiTap("桌面空白处");
    await system.exec(`cp ~/Desktop/19.txt ~/Desktop/19`);

    await agent.aiRightClick("桌面上的18.txt文本文档");
    await agent.aiTap("标记信息下方的第二个圆点，也就是红色圆点");
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("18.txt名称中的1左侧有圆圈");  

    await agent.aiRightClick("桌面上的19.txt文本文档");
    await agent.aiTap("标记信息下方的第二个圆点内，也就是红色圆点");
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("19.txt名称中的1左侧有圆圈");
    await agent.aiRightClick("桌面上的19文件夹");
    await agent.aiTap("标记信息下方的第二个圆点内，也就是红色圆点");
    await agent.aiTap("桌面空白处");
    await agent.aiAssert("19文件夹名称中的1左侧有圆圈");

    //步骤2：选中文件/文件夹A--复制粘贴/剪切粘贴/拖拽到保险箱内
    //复制文本文档
    await agent.aiTap("桌面上的19.txt文本文档");
    await device.pressKey("Ctrl+C");
    await agent.aiTap("任务栏上的文件管理器图标");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("成功打开保险箱");
    await agent.aiTap("保险箱内空白处");
    await device.pressKey("Ctrl+V");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("保险箱里的19.txt名称中的1左侧没有红色圆圈");
    await device.pressKey("Super+D");
    //剪切文件夹
    await agent.aiTap("桌面上的19文件夹");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("任务栏上的文件管理器图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("成功打开保险箱");
    await agent.aiTap("保险箱内空白处");
    await device.pressKey("Ctrl+V");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("保险箱里的19文件夹名称中的1左侧没有红色圆圈");
    //拖拽文件
    await device.pressKey("Super+Left");
    await agent.aiTap("桌面上名称为18.txt");
    await agent.aiDrag("桌面上名称为18.txt","保险箱内");
    await agent.aiAssert("保险箱里的18.txt名称左侧没有红色圆圈");

    //步骤3：剪切后按ctrl+Z回撤
    await device.pressKey("Ctrl+Z");
    await agent.aiTap("带有红色删除文字的按钮");
    await device.pressKey("Super+D");
    await agent.aiAssert("桌面上的19.txt名称中的1左侧有圆圈");

    //步骤4：步骤2后再从保险箱内复制粘贴/剪切粘贴/拖拽到桌面
    await agent.aiTap("任务栏上的文件管理器图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("成功打开保险箱");
    await agent.aiTap("保险箱里的19.txt");
    await device.pressKey("Ctrl+X");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Super+D");
    await device.pressKey("Ctrl+V");
    await agent.aiTap("共存按钮");
    await agent.aiAssert("桌面上19（副本）.txt名称中的1左侧有圆圈");
    //删除红色标记，还原环境
    await agent.aiTap("任务栏上的文件管理器图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick("文件管理器左侧栏的红色");
    await agent.aiTap("移除");
    await agent.aiTap("删除按钮");
   
  }, { timeout: 1200000, tags: ['1811367','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("rm -rf ~/Desktop/*.txt");
      await system.exec("rm -rf ~/Desktop/19*");

    });
  });