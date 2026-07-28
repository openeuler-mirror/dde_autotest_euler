/**
 * 用例 PMSID: 1704777
 * 用例标题: 【玲珑】【文本编辑器】查看玲珑应用包含的文件
 * 生成时间: 2025-12-16 14:36:22
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704777-【玲珑】【文本编辑器】查看玲珑应用包含的文件', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 查看玲珑应用包含的文件');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1704777-【玲珑】【文本编辑器】查看玲珑应用包含的文件', async ({ device, agent, uos, system }) => {
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);

    console.log('[步骤1] 打开终端应用');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端应用已打开');
    
    console.log('[步骤2] 执行玲珑命令查看文本编辑器内容');
    await device.typeText('ll-cli content org.deepin.editor', true);
    console.log('[步骤2] 命令输入完成');
    
    console.log('[步骤3] 验证命令输出结果');
    await agent.aiAssert("终端窗口显示 '/var/lib/linglong/entries/' 路径下的文件列表信息，包含玲珑应用的相关文件和目录");
    console.log('[步骤3] 验证通过 - 成功显示玲珑应用文件列表');

  }, { timeout: 180000, tags: ['1704777', 'level3', 'smoke', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    await uos.closeCurrentWindow();
    console.log('关闭当前窗口');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});
