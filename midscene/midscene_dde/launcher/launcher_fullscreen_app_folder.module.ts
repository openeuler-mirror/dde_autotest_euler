/**
 * 模块名称: launcher_fullscreen_app_folder
 * 模块说明: 【启动器】【全屏模式】【应用文件夹】模块化测试入口
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 * 模块职责：
 *   - beforeAll（前置条件）：用 launcher 目录下已下载的初始配置文件恢复默认环境，清理残留测试配置
 *   - beforeEach（每例前置）：写入 2 页应用文件夹配置、重启 dde-shell 使配置生效、确保启动器为全屏模式
 *   - afterEach（每例清理）：关闭当前窗口
 *   - afterAll（恢复环境）：删除测试配置、重新用初始配置文件恢复默认环境、重启 dde-shell、切换到窗口模式、显示桌面
 *   各用例的测试步骤与预期结果写在对应的单独用例脚本中（1832123.ts ~ 1832145.ts）
 */

// 注意：module 函数会在执行时通过上下文注入，无需 import

// 启动器初始配置文件路径（已从 http://10.7.62.32/midscene-uos/midscene_dde/resources/item-arrangement.ini 下载，存放在 launcher 目录作为备份，用于恢复启动器初始状态）
const INIT_INI_PATH = 'midscene_dde/launcher/item-arrangement.ini';

module('launcher_fullscreen_app_folder', {
  // 模块级 beforeAll：前置条件 - 所有测试执行前恢复默认环境
  beforeAll: async ({ device, uos, agent, system, env }) => {
    console.log('[模块] beforeAll: 恢复默认环境 - 用初始配置文件还原 item-arrangement.ini');
    await uos.showDesktop();

    // 前置步骤：用初始配置文件恢复默认环境，清理上次可能残留的测试配置
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const restoreCmd = `cp -f ${INIT_INI_PATH} ${iniPath}`;
    const restoreResult = await system.exec(restoreCmd);
    // 校验初始状态恢复是否成功（模块钩子中 assertTrue 全局不可用，改用手动抛错）
    if (!restoreResult.success) {
      throw new Error('恢复默认环境失败：复制初始配置文件到 item-arrangement.ini 失败');
    }
    console.log('[模块] beforeAll: 已使用初始配置文件恢复 item-arrangement.ini 默认环境');
    // 清理上次可能残留的 .22bak 测试配置文件
    await system.exec('rm -f ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak');
    console.log('[模块] beforeAll: 已清理残留的 .22bak 文件');
  },

  // 模块级 beforeEach：每个测试前的准备 - 写入 2 页应用文件夹配置并确保全屏模式
  beforeEach: async ({ device, agent, uos, system, env }) => {
    console.log('[模块] beforeEach: 写入应用文件夹配置并确保全屏模式');

    // 预置步骤1：写入 2 页应用文件夹配置到 item-arrangement.ini，用于翻页规则验证
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const writeCmd = `cat > ${iniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanagement.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop
toplevel\\pageItems\\1=dde-computer.desktop, dde-trash.desktop, dde-printer.desktop
MIDSCEOF`;
    const writeResult = await system.exec(writeCmd);
    if (!writeResult.success) {
      throw new Error('写入 2 页应用文件夹配置失败');
    }
    console.log('[模块] beforeEach: item-arrangement.ini 已写入 2 页应用文件夹配置');

    // 修改配置文件后，重启 dde-shell 服务，使新配置生效
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 10');
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    if (!(statusResult.success && statusResult.stdout.trim() === 'active')) {
      throw new Error('dde-shell服务未正常启动');
    }
    console.log('[模块] beforeEach: dde-shell服务重启成功，item-arrangement.ini 已生效');

    // 预置步骤2：读取配置文件，确保启动器为全屏模式
    const result = await system.exec(`cat /home/${env.testUsername}/.config/deepin/org.deepin.dde-shell/settings.ini`);
    console.log('[模块] beforeEach: 配置文件内容：', result.success, result.stdout, result.stderr);
    if (!result.success) {
      throw new Error('读取 dde-shell settings.ini 失败');
    }
    const content = result.stdout.toString();
    const isWindowed = content.includes('current_frame=WindowedFrame');
    if (isWindowed) {
      console.log('[模块] beforeEach: 检测到窗口模式，切换到全屏模式...');
      await uos.openLauncher();
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
        images: [{
          name: '全屏模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
        }],
        deepThink: true,
      });
    } else {
      console.log('[模块] beforeEach: 检测到全屏模式，无需切换');
    }
    await device.pressKey('ESC');
  },

  // 模块级 afterEach：每个测试后的清理
  afterEach: async ({ device, uos }) => {
    console.log('[模块] afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  },

  // 模块级 afterAll：测试完成后恢复初始环境
  afterAll: async ({ uos, agent, device, system, env }) => {
    console.log('[模块] afterAll: 恢复初始环境');

    // 恢复步骤1：重新下载初始配置文件到对应目录，恢复初始状态
    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const restoreCmd = `cp -f ${INIT_INI_PATH} ${iniPath}`;
    const restoreResult = await system.exec(restoreCmd);
    if (!restoreResult.success) {
      throw new Error('恢复初始环境失败：复制初始配置文件到 item-arrangement.ini 失败');
    }
    console.log('[模块] afterAll: 已重新下载初始配置文件到 ~/.config/deepin/dde-launchpad/ 目录');

    // 恢复步骤2：重启 dde-shell 服务，使初始配置生效
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 10');
    await system.exec('systemctl --user daemon-reload');
    console.log('[模块] afterAll: dde-shell 服务已重启，初始配置已生效');

    // 恢复步骤3：切换启动器为窗口模式
    console.log('[模块] afterAll: 切换启动器为窗口模式...');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式界面已显示');
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器全屏模式左下角的窗口模式图标',
      images: [{
        name: '窗口模式小图标',
        url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
      }],
      deepThink: true,
    });
    console.log('[模块] afterAll: 已切换为窗口模式');
    await device.pressKey('ESC');

    // 恢复桌面状态
    await uos.showDesktop();
    console.log('[模块] afterAll: 环境恢复完成');

    // 恢复步骤4：最后删除配置文件，不保留配置文件
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    await system.exec('rm -f ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak');
    console.log('[模块] afterAll: 配置文件已删除，不保留配置文件');

    // 恢复步骤5：删除 launcher 目录下的初始配置备份文件
    await system.exec(`rm -f ${INIT_INI_PATH}`);
    console.log('[模块] afterAll: launcher 目录下的 item-arrangement.ini 备份文件已删除');
  },

  // 测试文件列表（按顺序执行）
  files: [
    './1832123.ts',
    './1832125.ts',
    './1832127.ts',
    './1832129.ts',
    './1832131.ts',
    './1832133.ts',
    './1832135.ts',
    './1832137.ts',
    './1832139.ts',
    './1832141.ts',
  ]
});
