/**
 * 用例 PMSID: 1811341
 * 用例标题: 拖拽到保险箱内-保险箱未解锁时不支持拖拽添加
 * 生成时间: 2026-2-10 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811341-拖拽到保险箱内-保险箱未解锁时不支持拖拽添加', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });
  
  test('1811341-拖拽到保险箱内-保险箱未解锁时不支持拖拽添加', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");

    //创建1811341.txt
    await agent.aiRightClick("桌面右上角空白处")
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("1811341");
    await agent.aiTap("桌面空白处");
    await system.exec(`echo "this is a test file" > /home/$USER/Desktop/1811341.txt`);

    //创建1811341文件夹
    await agent.aiRightClick("桌面右下角空白处")
    await agent.aiTap("新建文件夹");
    await device.typeText("1811341");
    await agent.aiTap("桌面空白处");

    //前置条件：保险箱已开启但未解锁
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);

    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");

    //步骤1：打开文管窗口-从桌面拖拽文件/文件夹到侧边栏保险箱目录上-观察现象
    await device.pressKey("Super+Left");
    await agent.aiTap("桌面上的1811341.txt文本文档");
    await agent.aiDrag("桌面上的1811341.txt文本文档","文件管理器左侧栏保险箱上");
    await agent.aiTap("桌面上的1811341文件夹");
    await agent.aiDrag("桌面上的1811341文件夹","文件管理器左侧栏保险箱文字上");


    //步骤2：双击侧边栏保险箱-输入密码解锁保险箱-查看
    //最大化文管
    await device.pressKey("Super+Up");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("含有密码文字的输入框");
    await agent.aiInput(`${vaultPassword}`,"含有密码文字的输入框");
    await agent.aiTap("有解锁文字的按钮");
    await agent.aiWaitFor("成功打开保险箱",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    //保险箱内无刚拖拽的文件/文件夹
    await agent.aiAssert("保险箱内没有1811341.txt文本文档和1811341文件夹");

  }, { timeout: 1200000, tags: ['1811341','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("rm -rf /home/$USER/Desktop/1811341.txt");
      await system.exec("rm -rf /home/$USER/Desktop/1811341");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });