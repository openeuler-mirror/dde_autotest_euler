
/**
 * 用例 PMSID: 1806405
 * 用例标题: 文管选择窗-归档管理器调用
 * 生成时间: 2026-08-05 19:53:07
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-compressor || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec('rm -f ~/Documents/compress-test.zip', 500);
    await system.exec('rm -f ~/Documents/compress-test.txt', 500);
    await system.exec('rm -rf ~/Documents/compress-test', 500);
    console.log('归档管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806405-文管选择窗-归档管理器调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：在文档目录下创建一个compress-test.zip，里面包含一个文件compress-test.txt
    await system.exec(`cd ~/Documents && touch compress-test.txt && zip compress-test.zip compress-test.txt`, 10000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806405-文管选择窗-归档管理器调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开归档管理器，点击主界面的选择文件
    console.log('步骤1：打开归档管理器，点击主界面的选择文件');
    await uos.openApp("归档管理器");
    await agent.aiTap("归档管理器主界面的选择文件按钮");
    // 断言1：打开文件选择窗口
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');

    // 步骤2：文件选择窗口中，点击侧边栏的文档，点击compress-test.zip，点击打开
    console.log('步骤2：文件选择窗口中，点击侧边栏的文档，点击compress-test.zip，点击打开');
    await agent.aiTap("文件选择窗口左侧边栏的文档");
    await agent.aiTap("文件选择窗口中的compress-test.zip");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：归档管理器中打开了compress-test.zip
    await agent.aiAssert("归档管理器中打开了compress-test.zip，显示压缩包内容");
    console.log('断言2：归档管理器中打开了compress-test.zip');

    // 步骤3：点击解压到
    console.log('步骤3：点击解压');
    await agent.aiTap("归档管理器主界面的解压按钮");
    // 断言4：界面提示解压成功
    await agent.aiWaitFor("归档管理器界面提示解压成功", { timeoutMs: 60000, checkIntervalMs: 3000 });
    await agent.aiAssert("归档管理器界面提示解压成功");
    console.log('断言4：界面提示解压成功');

  }, { timeout: 600000, tags: ['1806405', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-compressor & killall dde-file-dialog），删除创建的测试文件
    await clearEnv(system);
    await uos.showDesktop();
  });
});
