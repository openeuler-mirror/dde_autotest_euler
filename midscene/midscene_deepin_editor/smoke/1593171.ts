
/**
 * 用例 PMSID: 1593171
 * 用例标题: 最小化后从启动器打开应用
 * 生成时间: 2025-12-17 13:39:03
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593171-最小化后从启动器打开应用', () => {
  // 配置项（移除TypeScript类型注解）
  const config = {
    appName: '文本编辑器',
    commandTimeout: 30000 // 单个命令执行超时(ms)
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 最小化后从启动器打开应用');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593171-最小化后从启动器打开应用', async ({ device, agent, uos, system }) => {
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);

    // 步骤1：打开目标应用
    console.log('[步骤1] 打开目标应用');
    await uos.openApp(config.appName, 3000, config.commandTimeout, true);
    console.log(`[步骤1] ${config.appName}应用已打开`);

    // 步骤2：等待应用界面显示
    console.log('[步骤2] 等待应用界面显示');
    await agent.aiWaitFor(`${config.appName}界面已显示`, { timeout: config.commandTimeout });
    console.log('[步骤2] 应用界面已显示');

    // 步骤3：最小化应用窗口
    console.log('[步骤3] 最小化应用窗口');
    await uos.minimizeWindow();
    console.log('[步骤3] 窗口已最小化');

    // 步骤5：从启动器重新打开应用
    console.log('[步骤5] 从启动器重新打开应用');
    await uos.openApp(config.appName, 3000, config.commandTimeout, true);

    // 步骤6：验证应用窗口重新显示
    console.log('[步骤6] 验证应用窗口重新显示');
    await agent.aiWaitFor(`${config.appName}窗口已显示`, { timeout: config.commandTimeout });
    console.log('[步骤6] 应用窗口已重新显示');

    // 步骤7：验证新开窗口
    console.log('[步骤7] 验证新开窗口');
    await agent.aiAssert(`新打开一个"未命名文档1"窗口`, { timeout: config.commandTimeout });
    console.log('[步骤7] 已验证新开窗口');

  }, { timeout: 120000, tags: ['1593171', 'level2', 'smoke', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    //关闭当前窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});
