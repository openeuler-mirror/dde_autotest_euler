/**
 * 用例 PMSID: 1994773
 * 用例标题: 【文件索引配置】系统升级后默认开启检查
 * 生成时间: 2026-8-20 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1994773-【文件索引配置】系统升级后默认开启检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ uos, device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 前置条件：关闭所有已打开的文件管理器窗口
      await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
    });
  
    test('1994773-【文件索引配置】系统升级后默认开启检查', async ({ device, agent, uos }) => {
      // 步骤1：打开文件管理器设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置");    
      await agent.aiTap("默认目录");
      await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");      
      // 步骤2：进入搜索设置页面
      await agent.aiTap("高级设置下方的'搜索'");
      
      // 预期结果2：文件索引默认处于开启状态
      await agent.aiAssert("右侧搜索下方第一个选项是'文件索引'，'文件索引'左侧复选框为勾选状态");
      
      // 步骤3：查看全文检索选项状态
      // 预期结果3：全文检索选项状态保留原有配置
      await agent.aiAssert("右侧搜索下方第二个选项是'全文搜索'，'全文搜索'左侧复选框为勾选状态");
      
      // 步骤4：取消勾选文件索引后点击恢复默认，检查文件索引是否勾选
      // 取消勾选文件索引
      await agent.aiTap("文件索引左侧复选框的中心");
      await agent.aiTap("确认按钮");
      await agent.aiAssert("文件索引左侧复选框为未勾选状态");
      
      // 滚动到恢复默认按钮位置
      await agent.aiTap("'文件索引'上方的'搜索'");
      await agent.aiScroll('文件索引上方的搜索', { direction: 'down', distance: 1000 });
      // 点击恢复默认按钮
      await agent.aiTap("恢复默认");     
      
      await agent.aiTap("高级设置下方的'搜索'");
      
      // 预期结果4：文件索引是勾选
      await agent.aiAssert("右侧搜索下方第一个选项是'文件索引'，'文件索引'左侧复选框为勾选状态");
      
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
      
    }, { timeout: 1800000, tags: ["1994773",'level4', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
      
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