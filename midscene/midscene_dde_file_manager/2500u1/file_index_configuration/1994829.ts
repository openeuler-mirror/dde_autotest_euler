/**
 * 用例 PMSID: 1994829
 * 用例标题: 【文件索引配置】连续切换开关20次
 * 生成时间: 2026-8-25 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1994829-【文件索引配置】连续切换开关20次', () => {
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
  
    test('1994829-【文件索引配置】连续切换开关20次', async ({ device, agent, uos, system }) => {
      // 步骤1：打开文件管理器设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      await agent.aiTap("默认目录");
      await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");      
      
      // 进入搜索设置页面
      await agent.aiTap("高级设置下方的'搜索'");
      
      // 确保文件索引处于开启状态作为初始状态
      await agent.aiAssert("右侧搜索下方第一个选项是'文件索引'，'文件索引'左侧复选框为勾选状态");
      
      // 步骤1：连续执行开启-关闭操作20次
      for (let i = 1; i <= 20; i++) {
        // 根据奇偶性显示不同的操作日志
        if (i % 2 === 1) {
          console.log(`第 ${i} 次操作：关闭文件索引`);
        } else {
          console.log(`第 ${i} 次操作：打开文件索引`);
        }
        
        // 点击文件索引复选框切换状态
        await agent.aiTap("文件索引左侧复选框的中心");        

        // 检查是否有确认按钮出现（关闭时需要确认）
        const hasConfirm = await agent.aiBoolean("是否有确认按钮弹出");
        if (hasConfirm) {
          await agent.aiTap("确认按钮");
          console.log(`第 ${i} 次操作：${i % 2 === 1 ? '关闭' : '打开'}文件索引`);
        } else {
          console.log(`第 ${i} 次操作：无确认对话框`);
        }
        await agent.aiAssert(`第 ${i} 次操作后，全文搜索复选框为勾选状态`);
        // 预期结果1：每次操作都正常完成
        await agent.aiAssert("界面无异常弹窗，无报错信息，按钮和复选框响应正常");
        // 预期结果2：每次开启或关闭均正常，界面无状态混乱
        await agent.aiAssert("设置界面显示正常，无错误提示");   
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      await agent.aiTap("文件索引上方的'搜索'");
      await agent.aiScroll("文件索引上方的'搜索'", { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");         
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
      
    }, { timeout: 1800000, tags: ["1994829",'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
      
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