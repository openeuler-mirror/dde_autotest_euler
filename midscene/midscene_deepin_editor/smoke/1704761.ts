
/**
 * 用例 PMSID: 1704761
 * 用例标题: 【玲珑】【文本编辑器】运行玲珑应用
 * 生成时间: 2025-12-16 15:28:51
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704761-【玲珑】【文本编辑器】运行玲珑应用', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 运行玲珑应用');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1704761-【玲珑】【文本编辑器】运行玲珑应用', async ({ device, agent, uos, system }) => {
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);

    console.log('[步骤1] 打开终端应用');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端应用已打开');
    
    console.log('[步骤2] 执行玲珑命令运行文本编辑器');
    await device.typeText('ll-cli run org.deepin.editor', true);
    console.log('[步骤2] 命令输入完成');
    
    console.log('[步骤3] 等待文本编辑器应用启动');
    await agent.aiWaitFor("文本编辑器应用界面已显示");
    console.log('[步骤3] 文本编辑器应用界面已显示');

    await uos.closeCurrentWindow();
    console.log('关闭当前窗口');


  }, { timeout: 180000, tags: ['1704761', 'level2','smoke', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    // 清理：关闭终端窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});
