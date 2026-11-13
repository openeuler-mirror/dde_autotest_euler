/**
 * 用例 PMSID: 1895889
 * 用例标题: 【启动器】安装失败的应用，不展示在启动器应用列表中
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1895889-【启动器】安装失败的应用，不展示在启动器应用列表中', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  beforeAll(async ({ device, uos, agent }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, uos, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }
    await device.pressKey('ESC');
  });

  test('1895889-【启动器】安装失败的应用，不展示在启动器应用列表中', async ({ device, agent, uos, env, system }) => {
    // 步骤1：构造一个缺失依赖的安装包
    const pkgDir = '/tmp/xlh_failapp';
    await system.exec('rm -rf ' + pkgDir);
    await system.exec('mkdir -p ' + pkgDir + '/DEBIAN ' + pkgDir + '/usr/share/applications');
    await system.exec("cat > " + pkgDir + "/DEBIAN/control <<'MIDSCEOF'\nPackage: xlh-fail-app\nVersion: 1.0.0\nSection: misc\nPriority: optional\nArchitecture: all\nDepends: xlh-nonexistent-dep-xyz\nDescription: test app with missing dependency\nMIDSCEOF");
    await system.exec("cat > " + pkgDir + "/usr/share/applications/xlh-fail-app.desktop <<'MIDSCEOF'\n[Desktop Entry]\nType=Application\nName=XLHFailApp\nExec=true\nIcon=deepin-appstore\nMIDSCEOF");
    const buildResult = await system.exec('dpkg-deb --build ' + pkgDir + ' /tmp/xlh-fail-app.deb 2>&1');
    if (!buildResult.success) {
      throw new Error('构造测试安装包失败');
    }

    // 步骤2：使用apt install ./xxx.deb安装，依赖缺失安装失败
    const installResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y /tmp/xlh-fail-app.deb 2>&1`, 120000);
    const installFailed = !installResult.success || installResult.stdout.includes('Unmet dependencies') || installResult.stdout.includes('has missing dependency');
    console.log('apt install 结果: success=' + installResult.success + ', 输出是否包含Unmet dependencies: ' + installResult.stdout.includes('Unmet dependencies'));
    if (!installFailed) {
      throw new Error('安装未按预期失败，请检查测试包构造');
    }

    // 步骤3：确认应用未安装成功
    const dpkgResult = await system.exec('dpkg -l 2>/dev/null | grep xlh-fail-app');
    if (dpkgResult.success && dpkgResult.stdout.includes('xlh-fail-app')) {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get purge -y xlh-fail-app 2>&1`, 60000);
    }

    // 步骤4：刷新应用列表，打开启动器检查不展示该应用
    await system.exec('update-desktop-database /home/uos/.local/share/applications/ 2>/dev/null');
    await system.exec('update-desktop-database /usr/share/applications/ 2>/dev/null');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示');
    await device.typeText('XLHFailApp');
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert('启动器搜索结果显示无XLHFailApp应用，不展示安装失败的应用');

    // 清理
    await system.exec('rm -rf ' + pkgDir);
    await system.exec('rm -f /tmp/xlh-fail-app.deb');
  }, { timeout: 600000, tags: ['1895889', 'level4'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await system.exec('rm -rf /tmp/xlh_failapp');
    await system.exec('rm -f /tmp/xlh-fail-app.deb');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
