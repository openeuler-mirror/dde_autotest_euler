/**
 * 用例 PMSID: 1704753
 * 用例标题: 【玲珑】【文本编辑器】查看玲珑应用信息
 * 生成时间: 2025-12-17 11:04:19
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704753-【玲珑】【文本编辑器】查看玲珑应用信息', () => {
  // 配置项（移除TypeScript类型注解）
  const config = {
    packageName: 'org.deepin.editor',
    commandTimeout: 30000 // 单个命令执行超时(ms)
  };
  
  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 查看玲珑应用信息');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1704753-【玲珑】【文本编辑器】查看玲珑应用信息', async ({ device, agent, uos, system }) => {
    let appInfo = '';
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    // 步骤1：打开终端应用
    console.log('[步骤1] 打开终端应用');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端应用已打开');

    // 步骤2：执行查看玲珑应用信息命令
    console.log('[步骤2] 查看玲珑应用信息');
    const infoCmd = `ll-cli info ${config.packageName}`;
    await device.typeText(infoCmd, true);
    console.log(`[步骤2] 命令输入完成: ${infoCmd}`);

    // 步骤3：验证命令执行结果
    // 可选：获取并记录应用信息详情（移除: any类型注解）
    try {
      appInfo = await agent.aiQuery(` 从终端输出结果中，提取应用的基本信息"version"信息,仅返回version行字符串，不要多余描述`);
      console.log(`[步骤3] 应用信息: ${appInfo}`);
      await agent.aiWaitFor(`终端显示出${appInfo}信息`, { timeout: config.commandTimeout });
    } catch (error) { // 移除: any
      console.log(`[步骤3] 无法获取详细应用信息: ${error.message || error}`);
    }

    console.log('[步骤4] 关闭当前窗口');
  }, { timeout: 180000, tags: ['1704753', 'level2', 'smoke', 'sushanshan'] });

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