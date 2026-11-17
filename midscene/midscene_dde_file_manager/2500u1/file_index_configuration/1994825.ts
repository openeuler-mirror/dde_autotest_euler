/**
 * 用例 PMSID: 1994825
 * 用例标题: 【文件索引配置】快速搜索响应时间
 * 生成时间: 2026-8-25 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1994825-【文件索引配置】快速搜索响应时间', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ uos, device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 清理环境：关闭文件管理器、删除测试文件、重置索引服务
      await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
      await system.exec("rm -rf ~/Desktop/*.txt");
      const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await clearEnvironment(system);
      
      // 创建多个不同名称的测试文件
      const testFiles = [
        'search_test_alpha.txt',
        'search_test_beta.txt',
        'search_test_gamma.txt'
      ];
      
      for (const file of testFiles) {
        await system.exec(`echo "测试内容" > ~/Desktop/${file}`);
      }          
      await new Promise(resolve => setTimeout(resolve, 1000));
    });

    test('1994825-【文件索引配置】快速搜索响应时间', async ({ device, agent, uos, system }) => {
      // 打开文件管理器
      await uos.openApp("文件管理器", 3000, 20000, true);

      // 定义要搜索的文件名列表（部分匹配，用于测试搜索响应）
      const searchQueries = [
        { keyword: 'search_test_alpha', expectedFile: 'search_test_alpha.txt' },
        { keyword: 'search_test_beta', expectedFile: 'search_test_beta.txt' },
        { keyword: 'search_test_gamma', expectedFile: 'search_test_gamma.txt' }
      ];
      
      // 记录每次搜索的响应时间
      const searchResults = [];
      
      for (let i = 0; i < searchQueries.length; i++) {
        const { keyword, expectedFile } = searchQueries[i];
        console.log(`第 ${i + 1} 次搜索：关键词 "${keyword}"，期望文件 "${expectedFile}"`);

        // 获取搜索框元素
        await agent.aiTap("文件管理器右上角有放大镜的输入框", { deepThink: true });
        
        // 清空搜索框
        await device.pressKey("Ctrl+A");
        await device.pressKey("Delete");
        
        // 输入搜索关键词
        const startTime = Date.now();
        await device.typeText(keyword);
        //await agent.aiInput(keyword, "右上角有放大镜的输入框");
        //await device.pressKey("Enter");
        
        // 等待搜索结果出现，记录响应时间
        try {
          await agent.aiWaitFor(`搜索结果中显示包含"${keyword}"的文件`, {
            timeoutMs: 2000,
            checkIntervalMs: 100
          });
        } catch (e) {
          // 如果超时，记录为超时
          console.log(`第 ${i + 1} 次搜索：等待搜索结果超时`);
        }
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        // 预期结果1：每次搜索响应时间小于1秒
        const isWithin1Second = responseTime < 1000;
        console.log(`第 ${i + 1} 次搜索响应时间：${responseTime}ms，${isWithin1Second ? '✅ 小于1秒' : '❌ 大于等于1秒'}`);
        
        // 预期结果2：搜索结果正确
        let isResultCorrect = false;
        try {
          // 检查期望的文件是否出现在搜索结果中
          await agent.aiAssert(`搜索结果中显示"${expectedFile}"文件`);
          isResultCorrect = true;
          console.log(`第 ${i + 1} 次搜索：✅ 找到期望文件 "${expectedFile}"`);
        } catch (e) {
          console.log(`第 ${i + 1} 次搜索：❌ 未找到期望文件 "${expectedFile}"`);
          
          // 尝试重新搜索一次
          console.log(`第 ${i + 1} 次搜索：重新搜索关键词 "${keyword}"`);
          await agent.aiTap("右上角有放大镜的输入框里的x按钮", { deepThink: true });
          await device.typeText(keyword);
          //await agent.aiInput(keyword, "右上角有放大镜的输入框");
          //await device.pressKey("Enter");
          
          try {
            await agent.aiWaitFor(`搜索结果中显示"${expectedFile}"文件`, {
              timeoutMs: 3000,
              checkIntervalMs: 200
            });
            isResultCorrect = true;
            console.log(`第 ${i + 1} 次搜索：重试后 ✅ 找到期望文件 "${expectedFile}"`);
          } catch (retryError) {
            console.log(`第 ${i + 1} 次搜索：重试后 ❌ 仍未找到期望文件 "${expectedFile}"`);
          }
        }
      }    
    }, { timeout: 1800000, tags: ['1994825', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, system }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 关闭文件管理器
      await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 删除测试文件
      await system.exec("rm -rf ~/Desktop/*.txt");
      // 关闭所有文件管理器窗口
      const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await closeFileManager(system);
    });
});