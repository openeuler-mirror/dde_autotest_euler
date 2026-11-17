/**
 * 用例 PMSID: 1994821
 * 用例标题: 【文件索引配置】anything服务崩溃恢复后自动继续更新索引
 * 生成时间: 2026-9-11 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

describe('1994821-【文件索引配置】anything服务崩溃恢复后自动继续更新索引', () => {
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
  
    test('1994821-【文件索引配置】anything服务崩溃恢复后自动继续更新索引', async ({ device, agent, uos, system }) => {  
      // 恢复文件管理器默认设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap("默认目录");
      await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");

      // 步骤1：创建100w文件并手动触发文件索引更新，在更新过程中，通过kill命令杀死deepin-anything-server
      console.log('前置条件：创建 1 万 txt 文件');
      await system.exec(`mkdir -p /home/${userName}/Desktop/1994821/index_test_100w`);
      await system.exec(`cd /home/${userName}/Desktop/1994821/index_test_100w && for i in $(seq 1 10000); do touch file_$i.txt; done`);

      await agent.aiTap("高级设置下方的'搜索'");  
 
      // 观察文件索引是否在更新
      //await agent.aiAssert("文件索引处于更新中状态");
  
      // 步骤1（续）：在更新过程中，通过 kill 命令杀死 deepin-anything-server
      console.log('步骤1：在索引更新过程中杀死 deepin-anything-server');
      await system.exec(`echo '${userPwd}' | sudo -S -p '' kill -9 $(pgrep -f deepin-anything-server)`);

      // 步骤2：杀死后观察deepin-anything-server是否自恢复
      console.log('步骤2：等待 1分钟，观察 deepin-anything-server 是否自恢复');
      await new Promise(resolve => setTimeout(resolve, 70000));

      // 判断 deepin-anything-server 服务是否已自恢复
      const serviceStatus = await system.exec(
        "ps -ef | grep deepin-anything-server | grep -v grep | wc -l"
      );
      if (parseInt(serviceStatus.stdout.trim(), 10) === 0) {
        console.log("deepin-anything-server 未自恢复");      
      } else {
        console.log("deepin-anything-server 已自恢复");
      }
  
      // 步骤3：服务自恢复后，观察文件索引是否自动继续更新
      console.log('步骤3：等deepin-anything-server服务自恢复后观察文件索引是否自动继续更新');
      await agent.aiAssert("文件索引下方有'正在更新索引'，或文件索引下方有'立即更新'");
  
      // 步骤4：文件索引更新成功后，搜索任意文件
      console.log('步骤4：文件索引更新成功后，搜索任意文件');
  
      // 关闭设置窗口
      await device.pressKey("Alt+F4");
  
      // 打开文件管理器搜索窗口，搜索任意文件
      await agent.aiTap("文件管理器窗口右上角的搜索框");
      await device.typeText("file_1.txt");
      // 循环判断搜索结果：每 3s 判断一次，最多 100 次（5 分钟），成功则提前退出
      const maxRetries = 100;   // 5 分钟 / 3 秒 = 100 次
      let searchSuccess = false;

      for (let i = 1; i <= maxRetries; i++) {
        const hasResult = await agent.aiBoolean("搜索结果中出现 file_1.txt文件");
        if (hasResult) {
          searchSuccess = true;
          console.log(`第 ${i} 次判断：搜索结果已出现 file_1.txt，提前退出循环`);
          await agent.aiAssert("搜索结果中出现 file_1.txt文件");
          break;
        } else {
          console.log(`第 ${i} 次判断：暂未搜索到 file_1.txt，等待 3s 后重试`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }

      // 超时仍未搜索到，抛出失败
      if (!searchSuccess) {
        throw new Error("等待 5 分钟仍未搜索到 file_1.txt");
      }
  
    }, { timeout: 1800000, tags: ["1994821", 'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 关闭所有文件管理器窗口
      const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await closeFileManager(system);
      // 清理测试文件
      await system.exec(`rm -rf /home/${userName}/Desktop/1994821/`);
    });
  });