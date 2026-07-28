/**
 * 用例 PMSID: 1704781
 * 用例标题: 【玲珑】【文本编辑器】卸载指定版本的玲珑应用
 * 生成时间: 2025-12-18 13:36:57
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704781-【玲珑】【文本编辑器】卸载指定版本的玲珑应用', () => {
  // 配置项 - 集中管理可配置参数
  const config = {
    packageName: 'org.deepin.editor',
    commandTimeout: 30000, // 单个命令执行超时(ms)
    uninstallTimeout: 60000, // 卸载操作超时(ms)
    terminalActivateTimeout: 5000, // 终端窗口激活超时(ms)
    aiQueryTimeout: 15000, // AI查询超时(ms)
  };

  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 卸载玲珑应用指定版本');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('[测试步骤] 开始新的测试用例');
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
  });

  test('1704781-【玲珑】【文本编辑器】卸载指定版本的玲珑应用', async ({ device, agent, uos, system }) => {

    let versionInfo = ''; // 目标卸载版本号
    // 步骤1：打开终端应用并确保激活
    console.log('[步骤1] 打开终端应用');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端应用已打开');

    // 步骤2：搜索文本编辑器可用版本
    console.log('[步骤3] 搜索文本编辑器可用版本');
    await device.typeText(`ll-cli list | grep ${config.packageName}`, true);
    console.log('[步骤3] 搜索命令输入完成');
    // 等待搜索结果返回
    await agent.aiWaitFor("终端显示带org.deepin.editor的搜索结果", { timeout: config.commandTimeout });
    // 精准获取版本号（优化AI查询指令）
    versionInfo = await agent.aiQuery(`
        从ll-cli list | grep ${config.packageName}的输出结果中，
        提取${config.packageName}对应的版本号（第三列内容），
        仅返回版本号字符串，不要多余描述
      `);
    // 版本号校验（避免AI返回无效值）
    if (!versionInfo || versionInfo.includes(' ')) {
      throw new Error(`获取的版本号无效: ${versionInfo}`);
    }
    console.log(`[步骤4] 获取到的版本号: ${versionInfo}`);

    // 步骤3：执行卸载命令（处理sudo权限+密码弹窗）
    console.log(`[步骤3] 卸载${config.packageName}/${versionInfo}版本`);
    // 从环境变量读取sudo密码
    const sudoPwd = process.env.TEST_PASSWORD;
    if (!sudoPwd) {
      throw new Error('环境变量TEST_PASSWORD未设置，无法执行sudo命令');
    }
    console.log('[步骤3] 检测到密码环境变量已配置');

    // 拼接安全的卸载命令（避免注入风险）
    const uninstallCmd = `echo '${sudoPwd}' | sudo -S ll-cli uninstall '${config.packageName}/${versionInfo}'`;
    await device.typeText(uninstallCmd, true);
    console.log(`[步骤3] 卸载命令已执行: ll-cli uninstall ${config.packageName}/${versionInfo}`);

    // 等待卸载完成并验证结果
    await agent.aiWaitFor("终端显示带'success'的结果", { timeout: config.commandTimeout });
    console.log('[步骤3] 卸载命令执行成功');

    // 执行查询命令
    console.log(`[步骤4] 查询命令已执行: ll-cli info ${config.packageName}`);
    await device.typeText(`ll-cli info ${config.packageName}`, true);

    // 等待查询结果
    await agent.aiWaitFor(`终端显示Can not find such application`, { timeout: config.commandTimeout });

    await device.typeText(`echo '${sudoPwd}' | sudo -S ll-cli install '${config.packageName}/${versionInfo}'`, true);
    await agent.aiWaitFor("终端显示带'success'的结果", { timeout: config.commandTimeout });
    console.log('[步骤3] 重新安装成功');

  }, {
    timeout: 120000, // 调整合理的超时时间
    tags: ['1704781', 'level3', 'smoke', 'sushanshan']
  });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    // 步骤5：清理 - 关闭终端窗口
    console.log('[步骤5] 清理测试环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});