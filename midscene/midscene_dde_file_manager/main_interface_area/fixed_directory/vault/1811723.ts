/**
 * 用例 PMSID: 1811723
 * 用例标题: 右键菜单-自动上锁-设置10分钟
 * 生成时间: 2026-2-3 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
//上锁时间，单位：分钟
const lockTime = 10 

describe('1811723-右键菜单-自动上锁-设置10分钟', () => {
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
  
  test('1811723-右键菜单-自动上锁-设置10分钟', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { rmVault, UiRmVault, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    //步骤1：侧边栏保险箱右键-滑动鼠标到自动上锁-点击10分钟-不操作保险箱-等待10分钟后查看
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("自动上锁");
    await agent.aiTap(`${lockTime}分钟`);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await system.exec(`sleep ${lockTime * 60}`);
    await agent.aiWaitFor("保险箱关闭，左侧栏计算机文字变为蓝色底",
      {
        timeoutMs: 3000000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("含有密码的输入框");
    await agent.aiInput("Uos123!!","含有密码的输入框");
    await agent.aiTap("含有解锁文字的蓝色按钮");
    await agent.aiWaitFor("成功打开保险箱",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    //步骤2：再次点击侧边栏保险箱右键-滑动鼠标到自动上锁-观察默认勾选
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("自动上锁");
    await agent.aiAssert(`${lockTime}分钟文字左侧有√符号`);
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await UiRmVault(device, agent, uos, env, system);

  }, { timeout: 1600000, tags: ['1811723','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

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
