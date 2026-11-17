/**
 * 用例 PMSID: 1994771
 * 用例标题: 【文件索引配置】配置项位置检查
 * 生成时间: 2026-8-20 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1994771-【文件索引配置】配置项位置检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ uos, device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 前置条件：关闭所有已打开的文件管理器窗口
      await system.exec("kill -TERM $(pidof dde-file-manager)");
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);

    });
  
    test('1994771-【文件索引配置】配置项位置检查', async ({ device, agent, uos }) => {
      // 步骤1：打开文件管理器
      await uos.openApp("文件管理器", 3000, 20000, true);
      
      // 步骤2：点击右上角菜单按钮，选择"设置"
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 步骤3：点击高级设置下方的"搜索"
      await agent.aiTap("高级设置");
      
      // 预期3结果：点击"搜索"后右侧显示文件索引配置项
      await agent.aiAssert("右侧搜索下方第一个选项是'文件索引'，'文件索引'左侧复选框为勾选状态");
      
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
      
    }, { timeout: 1800000, tags: ["1994771",'level4', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
      
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 关闭所有文件管理器窗口
      const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await closeFileManager(system);
    });
  });