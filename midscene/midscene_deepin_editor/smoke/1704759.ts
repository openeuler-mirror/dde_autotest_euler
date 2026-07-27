/**
 * 用例 PMSID: 1704759
 * 用例标题: 【玲珑】【文本编辑器】安装玲珑应用指定版本
 * 生成时间: 2025-12-16 15:52:33
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1704759-【玲珑】【文本编辑器】安装玲珑应用指定版本', () => {
  // 配置项
  const config = {
    packageName: 'org.deepin.editor',
    passwordPromptTimeout: 8000, // 等待密码弹窗超时(ms)
    commandTimeout: 30000, // 单个命令执行超时(ms)
  };

  /**
   * 处理sudo密码认证弹窗
   * @param {Object} device - 设备操作实例
   */

  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 运行玲珑应用');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    // 等待桌面稳定
    await device.pause(2000);
    console.log('[初始化] 测试环境准备完成');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('[测试步骤] 开始新的测试用例');
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
  });

  test('1704759-【玲珑】【文本编辑器】安装玲珑应用指定版本', async ({ device, agent, uos, system }) => {
    
    let versionInfo = '';
    // 步骤1：打开终端应用
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

    // 步骤3：卸载文本编辑器版本（处理sudo权限+密码弹窗）
    console.log('[步骤2] 卸载文本编辑器版本');
    // 拼接sudo卸载命令（触发密码认证）
    const sudoPwd = process.env.TEST_PASSWORD; // 从环境变量读取
    console.log(sudoPwd);

    const killapp = `echo '${sudoPwd}' | sudo -S pkill -9 -f deepin-editor`;
    await device.typeText(killapp, true);

    const uninstallCmd = `sudo -S ll-cli uninstall '${config.packageName}'`;
    await device.typeText(uninstallCmd, true);

    // 校验卸载结果
    await agent.aiWaitFor("终端显示带'success'的结果", { timeout: config.commandTimeout });

    // 步骤4：安装指定版本（处理sudo权限+密码弹窗）
    console.log('[步骤5] 使用获取的版本号安装文本编辑器');
    const installCmd = `sudo ll-cli install ${config.packageName}/${versionInfo}`;
    await device.typeText(installCmd, true);

    // 步骤5：验证应用安装和启动结果
    await agent.aiWaitFor("终端显示带'success'的结果", { timeout: config.commandTimeout });

  }, {  timeout: 180000, tags: ['1704759', 'level3','smoke', 'sushanshan']  });

  afterEach(async ({ device, uos, agent}) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    try {
      console.log('[步骤6] 关闭文本编辑器窗口');
      await uos.closeCurrentWindow();
    } catch (e) {
      console.log('[步骤6] 文本编辑器已关闭，无需重复关闭');
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});