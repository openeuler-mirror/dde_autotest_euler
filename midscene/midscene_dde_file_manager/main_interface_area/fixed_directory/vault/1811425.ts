/**
 * 用例 PMSID: 1811425
 * 用例标题: 暴力输入-连续输入错误密码解锁保险箱
 * 生成时间: 2026-2-9 14:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811425-暴力输入-连续输入错误密码解锁保险箱', () => {
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
  
  test('1811425-暴力输入-连续输入错误密码解锁保险箱', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    //前置条件：调用公共方法创建保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);

    //前置条件：给保险箱上锁
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");
    //步骤1：双击计算机页面保险箱/文件选择对话框保险箱
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("含有密码文字的输入框");
    await agent.aiInput("ABc123!!","含有密码文字的输入框");
    
    //步骤2~7：第一次~第六次输入错误密码解锁保险箱   
    for (let i = 6; i >= 1; i--) {
      await agent.aiTap("有解锁文字的按钮");
      if (i !== 1) {
        await agent.aiWaitFor(`有错误提示:密码错误，您还可再输入${i-1}次或者输入框变为粉色`,
          {
            timeoutMs: 60000,
            checkIntervalMs: 5000
          }
        );
      } else {        
        await agent.aiWaitFor("有错误提示:请10分钟后再试或者输入框变为粉色",
          {
            timeoutMs: 60000,
            checkIntervalMs: 5000
          }
        );
      }
    }

  }, { timeout: 1200000, tags: ['1811425','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

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