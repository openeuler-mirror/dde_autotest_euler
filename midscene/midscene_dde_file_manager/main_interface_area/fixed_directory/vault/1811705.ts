/**
 * 用例 PMSID: 1811705
 * 用例标题: 加密保险箱进度条-进度检查
 * 生成时间: 2026-2-3 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811705-加密保险箱进度条-进度检查', () => {
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
  
  test('1811705-加密保险箱进度条-进度检查', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { rmVault, UiRmVault, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    //步骤1：进度未到100%前观察
    await system.exec('rm /home/$USER/recoveryKey.key');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Uos123!!","含有至少8位文字的输入框");
    await agent.aiTap("含有再次输入密码文字的输入框");
    await agent.aiInput("Uos123!!","含有再次输入密码文字的输入框");
    await agent.aiTap("下一步");
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("保存");
    await agent.aiTap("下一步");
    await agent.aiTap("有加密保险箱文字的蓝色按钮");
    await agent.aiTap("含有请输入密码文字的输入框");
    await device.typeText(process.env.TEST_PASSWORD);
    await agent.aiTap("确定");
    await agent.aiAssert("带有加密保险箱文字的按钮为蓝色，且无法点击");
    try {
      await agent.aiWaitFor("有加密已完成文字",
        {
          timeoutMs: 60000,
          checkIntervalMs: 5000
        }
      );
    } catch (error) {
      console.log("创建保险箱失败");
      throw error;
    }
    //步骤2：进度达到100%以后-点击弹窗右上角顶部X或按esc键
    await agent.aiTap("当前弹窗的x按钮");
    await agent.aiAssert("加密保险箱弹窗消失");
    //删除保险箱，重新创建
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await UiRmVault(device, agent, uos, env, system);
    await system.exec('rm /home/$USER/recoveryKey.key');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Uos123!!","含有至少8位文字的输入框");
    await agent.aiTap("含有再次输入密码文字的输入框");
    await agent.aiInput("Uos123!!","含有再次输入密码文字的输入框");
    await agent.aiTap("下一步");
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("保存");
    await agent.aiTap("下一步");
    await agent.aiTap("有加密保险箱文字的蓝色按钮");
    await agent.aiTap("含有请输入密码文字的输入框");
    await device.typeText(process.env.TEST_PASSWORD);
    await agent.aiTap("确定");
    //步骤3:在加密进度弹窗页面等待加密结束、检查进度是否正确
    try {
      await agent.aiWaitFor("有加密已完成文字",
        {
          timeoutMs: 60000,
          checkIntervalMs: 5000
        }
      );
    } catch (error) {
      console.log("创建保险箱失败");
      throw error;
    }
    //步骤4：点击弹窗页面确定
    await agent.aiTap("确定");
    await agent.aiAssert("进入保险箱");

  }, { timeout: 1200000, tags: ['1811705','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });
