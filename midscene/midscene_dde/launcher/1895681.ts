/**
 * 用例 PMSID: 1895681
 * 用例标题: 【启动器】【窗口模式】【搜索框】中文环境下，英文应用名支持首字母缩写匹配
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 * 注：
 *   - 英文应用名首字母缩写匹配验证：Visual Studio Code(VSC/vsc)
 *   - 通过 createTestApp（参考 1832477）仅模拟安装 Visual Studio Code，不动启动器已有应用/排列
 */

const { createTestApp, cleanupTestApps } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');

describe('1895681-【启动器】【窗口模式】【搜索框】中文环境下，英文应用名支持首字母缩写匹配', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const storageJson = '/home/uos/.local/share/deepin/ApplicationManager/storage.json';
  // 模拟安装的测试应用：Visual Studio Code（首字母 VSC）
  const vscApp = { name: 'Visual Studio Code', file: 'vscode-test' };
  const vscDesktop = `/home/uos/.local/share/applications/${vscApp.file}.desktop`;

  // 刷新启动器应用列表：仅重启 dde-shell。
  // 不能在这里 pkill dde-application-manager：启动器应用列表由 dde-shell 的 dde-apps 组件读取
  // dde-application-manager 提供，若在重启 dde-shell 的同时杀掉它，dde-shell 启动时会读到尚未
  // 完成索引（缺少 vscode-test）的列表，造成“应用时有时无”的偶现失败；且 pkill -f 会误杀自身 shell。
  const refreshLauncherApps = async (system) => {
    await system.exec('update-desktop-database /home/uos/.local/share/applications 2>/dev/null');
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
    await new Promise(resolve => setTimeout(resolve, 8000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 确保 Visual Studio Code 为模拟安装状态 ==========');
    // 若已存在该测试应用（残留），先卸载，再重新模拟安装，保证环境干净
    const existCheck = await system.exec(
      `test -f ${vscDesktop} && echo EXISTS || echo MISSING`
    );
    if (existCheck.success && existCheck.stdout.indexOf('EXISTS') !== -1) {
      console.log('  - 检测到已存在 Visual Studio Code，先卸载残留');
      await system.exec(`rm -f ${vscDesktop} 2>/dev/null`);
      await cleanupTestApps(system, [vscApp.name]);
      await system.exec(
        `python3 -c 'import json; p="${storageJson}"; d=json.load(open(p)); d.pop("${vscApp.file}", None); json.dump(d, open(p, "w"))'`
      );
      await refreshLauncherApps(system);
    } else {
      console.log('  - 未检测到 Visual Studio Code，无需卸载');
    }
    await createTestApp(system, vscApp.name, vscApp.file, 'deepin-editor', 'deepin-editor', 'Development;', false);
    await refreshLauncherApps(system);
    console.log('  - 已创建 Visual Studio Code 测试应用并刷新应用列表');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null; true');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }
    await device.pressKey('ESC');
  });

  test('1895681-【启动器】【窗口模式】【搜索框】中文环境下，英文应用名支持首字母缩写匹配', async ({ device, agent, uos }) => {
    console.log('========== 用例执行开始 ==========');

    const searchAndCheck = async (text, expectDesc) => {
      await uos.openLauncher();
      await new Promise(resolve => setTimeout(resolve, 1200));
      await agent.aiTap('启动器搜索框');
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.typeText(text);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert(expectDesc);
      await device.pressKey('esc');
      await new Promise(resolve => setTimeout(resolve, 300));
    };

    // 步骤1：输入"VSC"，可搜索到 Visual Studio Code（首字母缩写匹配）
    console.log('[步骤 1/2] 输入 VSC 搜索 Visual Studio Code');
    await searchAndCheck('VSC', '启动器搜索结果中显示了Visual Studio Code应用');
    console.log('  - 验证通过：VSC 可匹配到 Visual Studio Code');

    // 步骤2：输入小写 "vsc"，同样可搜索到 Visual Studio Code
    console.log('[步骤 2/2] 输入 vsc 搜索 Visual Studio Code');
    await searchAndCheck('vsc', '启动器搜索结果中显示了Visual Studio Code应用');
    console.log('  - 验证通过：vsc 可匹配到 Visual Studio Code');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1895681', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 卸载模拟安装的测试应用 ==========');
    // 仅删除 Visual Studio Code 测试应用并刷新，不动其他已有应用
    await system.exec(`rm -f /home/uos/.local/share/applications/${vscApp.file}.desktop 2>/dev/null`);
    await cleanupTestApps(system, [vscApp.name]);
    // 清理 dde-application-manager 缓存中该应用的记录，避免已删除应用被写回（否则启动器仍显示该应用）
    await system.exec(
      `python3 -c 'import json; p="/home/uos/.local/share/deepin/ApplicationManager/storage.json"; d=json.load(open(p)); d.pop("${vscApp.file}", None); json.dump(d, open(p, "w"))'`
    );
    await system.exec('update-desktop-database /home/uos/.local/share/applications/ 2>/dev/null');
    // 卸载需清理 dde-application-manager 缓存，避免已删除应用被写回；先杀管理器再重启 dde-shell（用锚定匹配避免误杀自身 shell）
    await system.exec("pkill -f '^/usr/bin/dde-application-manager' 2>/dev/null; sleep 1; systemctl --user restart dde-shell@DDE 2>/dev/null; true");
    await new Promise(resolve => setTimeout(resolve, 6000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});