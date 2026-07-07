/**
 * 用例 PMSID: 1593177
 * 用例标题: 软件卸载
 * 生成时间: 2025-12-17 13:37:54
 * 用例编写人: UT000195(苏姗姗)
 * 优化说明: 代码规范、逻辑修复、健壮性增强、可读性提升
 */

// 从环境变量读取 sudo 密码
const sudoPwd = process.env.TEST_PASSWORD;
if (!sudoPwd) {
  throw new Error('❌ 环境变量 TEST_PASSWORD 未配置，无法执行测试');
}

describe('1593177-软件卸载', () => {
  // ==================== 配置项（集中管理，便于维护） ====================
  const TEST_CONFIG = {
    commandTimeout: 30000,     // 命令执行超时时间(ms)
    appName: '文本编辑器',      // 应用显示名称
    packageName: 'org.deepin.editor', // 应用包名
    waitTime: {
      short: 1000,
      normal: 2000,
      long: 3000,
    },
    uninstall: {
      confirmText: "您确定要卸载",
      successKeyword: "success",
      notFoundMsg: "Can not find such application"
    }
  };

  // ==================== 工具函数（复用逻辑，简化代码） ====================
  /**
   * 等待指定毫秒数
   */
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  /**
   * 检查应用是否已安装（如未安装则自动安装）
   * @returns 返回安装后的最终状态（始终为 true，因为未安装时会自动安装）
   */
  const checkAndAutoInstall = async (device, agent, packageName) => {
    const checkCmd = `ll-cli info ${packageName}`;
    await device.typeText(checkCmd, true);
    await agent.aiWaitFor('终端命令执行完成', { timeout: 5000, deepThink: true });

    const isInstalled = await agent.aiBoolean(
      `根据终端输出判断 ${packageName} 是否安装，显示应用信息为true，显示"${TEST_CONFIG.uninstall.notFoundMsg}"为false`,
      { deepThink: true }
    );

    // 如果未安装，则自动执行安装操作
    if (!isInstalled) {
      console.log(`[检查] ${packageName} 未安装，正在自动执行安装...`);
      const installCmd = `echo '${sudoPwd}' | sudo -S ll-cli install ${packageName}`;
      await device.typeText(installCmd, true);
      await agent.aiWaitFor(`终端显示包含"${TEST_CONFIG.uninstall.successKeyword}"的信息`, {
        timeout: TEST_CONFIG.commandTimeout,
        deepThink: true
      });
      console.log('[检查] 应用自动安装完成 ✅');
      return true;
    }

    return isInstalled;
  };

  /**
   * 检查应用是否已安装（仅检查，不自动安装）
   */
  const checkAppInstalled = async (device, agent, packageName) => {
    const checkCmd = `ll-cli info ${packageName}`;
    await device.typeText(checkCmd, true);
    await agent.aiWaitFor('终端命令执行完成', { timeout: 5000, deepThink: true });

    return await agent.aiBoolean(
      `根据终端输出判断 ${packageName} 是否安装，显示应用信息为true，显示"${TEST_CONFIG.uninstall.notFoundMsg}"为false`,
      { deepThink: true }
    );
  };

  /**
   * 获取应用版本号
   */
  const getAppVersion = async (device, agent, packageName) => {
    await device.typeText(`ll-cli list | grep ${packageName}`, true);
    await agent.aiWaitFor(`终端显示带${packageName}的搜索结果`, {
      timeout: TEST_CONFIG.commandTimeout,
      deepThink: true
    });

    const version = await agent.aiQuery(`
      从 ll-cli list | grep ${packageName} 输出中，提取第三列的版本号，仅返回版本号字符串
    `);

    const isValid = await agent.aiBoolean("版本号是否有效：不为空且不包含空格", { timeout: 5000, deepThink: true });
    return isValid ? version : "";
  };

  /**
   * 卸载应用（UI方式）
   */
  const uninstallAppUI = async (device, agent, uos, appName) => {
    console.log('[UI卸载] 打开启动器');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器已打开', { timeout: 10000, deepThink: true });

    console.log(`[UI卸载] 在启动器中搜索：${appName}`);
    await uos.searchInLauncher(appName);
    await agent.aiWaitFor(`启动器中显示${appName}搜索结果`, { timeout: 10000, deepThink: true });

    console.log('[UI卸载] 右键点击应用图标');
    await agent.aiRightClick(`启动器中的${appName}图标`, { deepThink: true });
    await agent.aiWaitFor('弹出右键菜单', { timeout: 5000, deepThink: true });

    console.log('[UI卸载] 选择【卸载】选项');
    await agent.aiTap("卸载", { deepThink: true });

    console.log('[UI卸载] 等待卸载确认对话框');
    await agent.aiWaitFor(`弹出"${TEST_CONFIG.uninstall.confirmText}"的提示框`, { timeout: 10000, deepThink: true });

    console.log('[UI卸载] 点击【确定】执行卸载');
    await agent.aiTap("确定", { deepThink: true });
    
    console.log('[UI卸载] 等待卸载确认对话框消失');
    await agent.aiWaitFor(`"${TEST_CONFIG.uninstall.confirmText}"的提示框已消失`, { timeout: 10000, deepThink: true });
    console.log('[UI卸载] UI卸载流程执行完成 ✅');
  };

  /**
   * 卸载应用（终端命令方式）
   */
  const uninstallAppCommand = async (device, agent, packageName) => {
    const uninstallCmd = `echo '${sudoPwd}' | sudo -S ll-cli uninstall ${packageName}`;
    await device.typeText(uninstallCmd, true);
    await agent.aiWaitFor(`终端显示包含"${TEST_CONFIG.uninstall.successKeyword}"的信息`, {
      timeout: TEST_CONFIG.commandTimeout,
      deepThink: true
    });

    console.log('[终端卸载] 终端命令卸载执行完成 ✅');
  };

  // ==================== 测试生命周期钩子 ====================
  beforeAll(async ({ device, uos, agent }) => {
    console.log('=====================================');
    console.log('[测试套件] 开始执行 - 软件卸载测试');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
    console.log('[初始化] 测试环境准备完成 ✅');
    console.log('=====================================');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('\n--- [测试步骤] 开始新的测试用例 ---');
    // 清理残留进程，无进程时不报错
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
  });

  // ==================== 核心测试用例 ====================
  test('1593177-软件卸载', async ({ device, agent, uos, system }) => {
    console.log('[步骤1] 打开终端并检查应用安装状态');
    await uos.openApp('终端', 3000, 30000, true);
    console.log('[步骤1] 终端已打开 ✅');

    // 检查并确保应用已安装（如未安装则自动安装）
    await checkAndAutoInstall(device, agent, TEST_CONFIG.packageName);
    console.log('[步骤1] 应用已就绪 ✅');

    // 提前获取应用版本信息
    const versionInfo = await getAppVersion(device, agent, TEST_CONFIG.packageName);
    console.log(`[步骤1] 获取到应用版本号：${versionInfo || '默认版本'}`);

    // ==================== 用例步骤1：UI卸载 ====================
    // 步骤：软件安装成功后，在启动器中选中图标，点击右键--卸载，查看软件显示
    // 预期：软件卸载成功
    console.log('\n===== 用例步骤1: 启动器右键卸载 =====');

    // 关闭终端，准备UI操作
    await uos.closeCurrentWindow();
    console.log('[步骤1.1] 已关闭终端窗口');

    // 执行UI卸载
    console.log('[步骤1.2] 执行UI卸载流程');
    await uninstallAppUI(device, agent, uos, TEST_CONFIG.appName);

    // ==================== 用例步骤2：终端命令卸载 ====================
    // 步骤：软件安装成功后，在终端中用命令将其卸载，查看软件显示
    // 预期：软件卸载成功
    console.log('\n===== 用例步骤2: 终端命令卸载 =====');
    await uos.openApp('终端', 3000, 30000, true);
    await agent.aiWaitFor('终端窗口已打开', { timeout: 10000, deepThink: true });
    
    // 检查并确保应用已安装（如未安装则自动安装）
    await checkAndAutoInstall(device, agent, TEST_CONFIG.packageName);

    // 执行终端命令卸载
    console.log('[步骤2.2] 执行终端命令卸载');
    await uninstallAppCommand(device, agent, TEST_CONFIG.packageName);

    // 关闭终端
    await uos.closeCurrentWindow();

  }, {
    timeout: 600000,    // 单条用例超时时间
    retries: 0,         // 禁用重试，保证环境干净
    tags: ['1593177', 'level1', 'smoke', 'sushanshan']
  });

  // ==================== 清理环境 ====================
  afterEach(async ({ device, uos, agent, system }) => {
    console.log('\n--- [测试步骤] 当前用例执行完成，开始环境清理 ---');

    // 确保应用已安装，不影响后续测试
    console.log('[清理] 检查应用安装状态');
    await uos.openApp('终端', 2000, 20000, true);
    await agent.aiWaitFor('终端窗口已打开', { timeout: 10000, deepThink: true });
    
    // 检查并确保应用已安装（如未安装则自动安装）
    await checkAndAutoInstall(device, agent, TEST_CONFIG.packageName);

    // 关闭终端
    await uos.closeCurrentWindow();
    console.log('[清理] 终端已关闭，环境清理完成 ✅');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('\n=====================================');
    console.log('[测试套件] 所有测试执行完毕');
    // 最终清理残留进程
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境完全清理完成 ✅');
    console.log('=====================================');
  });
});