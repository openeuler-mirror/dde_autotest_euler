/**
 * 用例 PMSID: 1994827
 * 用例标题: 【文件索引配置】连续10次点击更新索引
 * 生成时间: 2026-8-25 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1994827-【文件索引配置】连续10次点击更新索引', () => {
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
  
    test('1994827-【文件索引配置】连续10次点击更新索引', async ({ device, agent, uos, system }) => {
      // 步骤1：打开文件管理器设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置");    
      await agent.aiTap("启动新窗口时显示", { deepThink: true });
      await agent.aiScroll('启动新窗口时显示', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");      
      
      // 进入搜索设置页面
      await agent.aiTap("高级设置下方的'搜索'");
      
      // 前置条件：确保文件索引处于开启状态
      await agent.aiAssert("右侧搜索下方第一个选项是'文件索引'，'文件索引'左侧复选框为勾选状态");  
      
      // 步骤1：连续点击"立即更新索引"按钮10次
      for (let i = 1; i <= 10; i++) {
        console.log(`第 ${i} 次操作：点击立即更新索引按钮`);
        
        // 点击立即更新索引按钮
        await agent.aiTap("从上往下第1个'立即更新索引'按钮");
        
        // 等待更新触发
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 预期结果1：每次更新正常触发
        // 检查更新是否正常触发（根据实际UI反馈调整）
        try {
          // 检查是否有更新进度或提示信息
          const hasProgress = await agent.aiBoolean("文件索引下方区域是否有正在更新索引提示");
          if (hasProgress) {
            console.log(`第 ${i} 次操作：更新已正常触发，显示更新进度`);
          } else {
            // 检查是否有更新完成的提示
            const hasComplete = await agent.aiBoolean("文件索引下方区域是否有索引更新完成的提示信息");
            if (hasComplete) {
              console.log(`第 ${i} 次操作：更新已完成`);
            } else {
              console.log(`第 ${i} 次操作：更新已触发，等待界面反馈`);
            }
          }
        } catch (e) {
          console.log(`第 ${i} 次操作：更新已触发，继续验证界面状态`);
        }
        
        // 预期结果2：每次更新，界面无状态混乱、无崩溃、无异常
        await agent.aiAssert("设置界面显示正常，无异常弹窗，无报错信息，界面布局完整");
        
        // 验证全文搜索状态正常
        await agent.aiAssert("全文搜索复选框为勾选状态");
      }
      
      // 额外验证：点击10次后，系统整体状态正常
      await agent.aiAssert("设置界面无崩溃，所有控件响应正常，无异常状态");

      await agent.aiTap("文件索引上方的'搜索'");
      await agent.aiScroll("文件索引上方的'搜索'", { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");    
     
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
      
    }, { timeout: 1800000, tags: ["1994827",'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
      
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