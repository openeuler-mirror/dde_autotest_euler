
/**
 * 用例 PMSID: 1704775
 * 用例标题: 【玲珑】【文本编辑器】杀掉玲珑应用运行进程
 * 生成时间: 2025-12-16 15:00:28
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704775-【玲珑】【文本编辑器】杀掉玲珑应用运行进程', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 杀掉玲珑应用运行进程');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('[测试步骤] 开始新的测试用例');
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });

  test('1704775-【玲珑】【文本编辑器】杀掉玲珑应用运行进程', async ({ device, agent, uos, system }) => {

    console.log('[前置] 打开文本编辑器');
    await uos.openApp('文本编辑器', 3000, 30000, true);
    console.log('[前置] 文本编辑器应用已打开');

    console.log('[步骤1] 打开终端应用');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端应用已打开');
    
    console.log('[步骤2] 执行玲珑命令杀掉文本编辑器进程');
    await device.typeText('ll-cli kill org.deepin.editor', true);
    console.log('[步骤2] 命令输入完成');
    
    console.log('[步骤3] 验证命令执行结果');
    await agent.aiAssert("终端窗口显示'/libs/linglong/src/linglong/cli/cli.cpp'信息");
    console.log('[步骤3] 验证通过 - 成功杀掉玲珑应用进程');
    
    console.log('[步骤4] 执行ll-cli ps命令查看进程状态');
    await device.typeText('ll-cli ps', true);
    console.log('[步骤4] 命令输入完成');
    
    console.log('[步骤5] 验证进程列表中无文本编辑器');
    await agent.aiAssert("终端窗口不显示org.deepin.editor进程信息");
    console.log('[步骤5] 验证通过 - 确认文本编辑器进程已被杀掉');

  }, { timeout: 180000, tags: ['1704775', 'level3','smoke', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    await uos.closeCurrentWindow();
    console.log('关闭当前窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});
