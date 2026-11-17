/**
 * 用例 PMSID: 1994807
 * 用例标题: 【文件索引配置】更新过程中注销后登录
 * 生成时间: 2026-9-14 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;

describe('1994807-【文件索引配置】更新过程中注销后登录', () => {
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
  
    test('1994807-【文件索引配置】更新过程中注销后登录', async ({ device, agent, uos, system }) => {
      // 前置条件1：恢复文件管理器默认设置，确保文件索引已开启
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap("启动新窗口时显示", { deepThink: true });
      await agent.aiScroll('启动新窗口时显示', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认按钮", { deepThink: true });
  
      // 前置条件2：准备大量文件触发索引更新
      console.log('前置条件2：创建 5000 txt 文件');
      await system.exec(`mkdir -p /home/${userName}/Desktop/1994807/index_test_5k`);
      await system.exec(`cd /home/${userName}/Desktop/1994807/index_test_5k && for i in $(seq 1 5000); do touch file_$i.txt; done`);

      await agent.aiTap("高级设置下方的'搜索'");

      // 步骤1：触发索引更新（如点击立即更新）
      console.log('步骤1：触发索引更新');
      const hasUpdateNow = await agent.aiBoolean("文件索引下方有'正在更新索引'");
      if (!hasUpdateNow) {
        await agent.aiTap("文件索引下方的'立即更新索引'按钮");
      } else {
        console.log("步骤1：索引正在更新中，无'立即更新索引'按钮");
      }
      await agent.aiAssert("文件索引下方有'正在更新索引'，或者文件索引下方有'立即更新索引'按钮");
  
      // 步骤2：更新过程中注销用户
      console.log('步骤2：在更新过程中锁屏');
      await device.pressKey("Control", "Alt", "Delete");
      await agent.aiWaitFor('电源管理界面已显示');
      await agent.aiTap('注销按钮',{ deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      await agent.aiWaitFor('登录界面已显示');
  
      // 步骤3：重新登录查看索引状态
      await device.typeAscii(`${process.env.TEST_PASSWORD}`)
      await agent.aiTap('登录按钮');  

      // 预期结果3：重新登录后继续更新索引且更新索引成功
      // 等待索引更新完成（最多 5 分钟）
      console.log('等待索引更新完成');
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
      await agent.aiTap("设置", { deepThink: true });
      await agent.aiTap("高级设置");
      const maxRetries = 100;   // 5 分钟 / 3 秒 = 100 次
      let indexSuccess = false;
      for (let i = 1; i <= maxRetries; i++) {
        const isUpdating = await agent.aiBoolean("文件索引下方有'正在更新索引'");
        if (!isUpdating) {
          indexSuccess = true;
          console.log(`第 ${i} 次判断：索引更新已完成`);
          await agent.aiAssert("文件索引下方显示'立即更新索引'按钮，无'正在更新索引'");
          break;
        } else {
          console.log(`第 ${i} 次判断：索引仍在更新中，等待 3s 后重试`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
  
      if (!indexSuccess) {
        throw new Error("等待 5 分钟索引仍未更新完成");
      }
  
      // 进一步验证：搜索新建文件确认索引成功
      console.log('验证索引更新成功：搜索新创建文件');
      await system.exec(`touch /home/${userName}/Desktop/1994807/log-out.txt`);
      await device.pressKey('Alt+F4');
      await agent.aiTap("文件管理器窗口右上角的搜索框");
      await device.typeText("log-out.txt");
      let searchSuccess = false;
      for (let i = 1; i <= maxRetries; i++) {
        const hasResult = await agent.aiBoolean("搜索结果中出现 log-out.txt文件");
        if (hasResult) {
          searchSuccess = true;
          console.log(`第 ${i} 次判断：搜索结果已出现 log-out.txt`);
          await agent.aiAssert("搜索结果中出现 log-out.txt文件");
          break;
        } else {
          console.log(`第 ${i} 次判断：暂未搜索到 log-out.txt，等待 3s 后重试`);
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
      if (!searchSuccess) {
        throw new Error("等待 5 分钟仍未搜索到 log-out.txt");
      }
  
    }, { timeout: 1800000, tags: ["1994807", 'level3', 'remote','2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 关闭所有文件管理器窗口
      const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await closeFileManager(system);
      // 清理测试文件
      await system.exec(`rm -rf /home/${userName}/Desktop/1994807/`);
    });
  });