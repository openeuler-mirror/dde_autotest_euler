/**
 * 用例 PMSID: 1832251
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母排序规则】同分类下的首字母为小写字母排列在大写字母的应用之上
 * 生成时间: 2026-07-17 00:00:00
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：
// 1. 本用例依赖 QQ(大写Q开头) 与 qGo(小写q开头) 成对出现在 Q 分类下，才能验证"小写排在大写之上"。
// 2. QQ 为非预装应用，前置条件中从软件源安装；qGo 在部分测试机软件源中不存在（如 aarch64 机器），
//    此时改用公共方法 createTestApp 创建同名测试应用（名称首字母小写 q），保证用例自包含。
// 3. 安装/创建后必须刷新启动器（update-desktop-database + 重启 dde-shell），
//    否则新应用不会出现在启动器"按名称"分类下（此前失败即因此）。
// 4. 前置逻辑写在测试步骤0中而非用例级 beforeAll——实测框架未执行用例级 beforeAll，
//    写在 beforeAll 中会导致 QQ 未安装、qGo 未创建。

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode, createTestApp } = require(helperPath);

describe('1832251-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】同分类下的首字母为小写字母排列在大写字母的应用之上', () => {
  test('1832251-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】同分类下的首字母为小写字母排列在大写字母的应用之上', async ({ device, agent, uos, system, env }) => {
    // ========== 步骤0：前置条件——确保 QQ(大写) 与 qGo(小写) 均已就绪并刷新启动器 ==========
    console.log('步骤0：前置条件——确保 QQ 与 qGo 均已就绪，并刷新启动器应用列表');

    // 0.1 QQ 为非预装应用，从软件源安装
    // 注意：不能用 `dpkg -l | grep 包名` 判断——包被卸载后 dpkg 仍残留 rc 状态配置行会被 grep 命中，
    //       导致误判"已安装"而跳过安装（此前 QQ 未安装却显示"已安装，跳过"即因此）。
    //       必须用 dpkg-query 的 Status 字段严格判断是否真正安装。
    const qqStatus = await system.exec("dpkg-query -W -f='${Status}' linux.qq.com 2>/dev/null | grep -c 'install ok installed'");
    if (qqStatus.stdout.trim() === '0') {
      console.log('  [前置] 安装 QQ(linux.qq.com)...');
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y linux.qq.com 2>&1`, 120000);
    } else {
      console.log('  [前置] QQ 已安装，跳过');
    }

    // 0.2 qGo 优先从软件源安装；源中无该包时用 createTestApp 创建同名测试应用
    const qgoStatus = await system.exec("dpkg-query -W -f='${Status}' uos.app.qgo 2>/dev/null | grep -c 'install ok installed'");
    const qgoInRepo = await system.exec('apt-cache show uos.app.qgo >/dev/null 2>&1 && echo yes || echo no');
    if (qgoStatus.stdout.trim() !== '0') {
      console.log('  [前置] qGo 已安装，跳过');
    } else if (qgoInRepo.stdout.trim() === 'yes') {
      console.log('  [前置] 从软件源安装 qGo(uos.app.qgo)...');
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y uos.app.qgo 2>&1`, 120000);
    } else {
      console.log('  [前置] 软件源中无 uos.app.qgo，改用 createTestApp 创建同名测试应用 qGo');
      await system.exec('rm -f /home/uos/.local/share/applications/qGo.desktop 2>/dev/null');
      await createTestApp(system, 'qGo', 'qGo', 'deepin-editor', 'deepin-editor', 'Utility;', false);
    }

    // 0.3 刷新启动器应用列表（新装/新建的应用必须刷新后才能出现在启动器中）
    console.log('  [前置] 刷新启动器应用列表（update-desktop-database + 重启 dde-shell）');
    await system.exec('update-desktop-database /usr/share/applications 2>/dev/null');
    await system.exec('update-desktop-database /home/uos/.local/share/applications 2>/dev/null');
    await system.exec('systemctl --user daemon-reload 2>/dev/null');
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 0.4 校验前置条件：两个应用的 desktop 文件均已就绪（用绝对路径，system.exec 中 ~ 不会被展开）
    const desktopCheck = await system.exec('ls /usr/share/applications/qq.desktop /home/uos/.local/share/applications/qGo.desktop 2>/dev/null');
    console.log('  [前置] 已就绪的 desktop 文件:', desktopCheck.stdout.trim().replace(/\n/g, ' | ') || '未找到');
    if (!desktopCheck.stdout.includes('qq.desktop')) {
      throw new Error('前置条件失败：QQ 的 desktop 文件不存在，Q 分类下无法验证大小写排序规则');
    }
    // 清理安装后可能自动弹出的应用窗口，避免遮挡启动器
    try {
      await system.exec('killall -9 qq linuxqq 2>/dev/null');
    } catch (err) {}
    await uos.showDesktop();

    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');
    await agent.aiAssert("启动器界面存在字母分类标题");

    // 步骤2：点击字母B进入字母选择界面，再点击Q跳转到Q分类
    console.log('步骤2：点击字母B进入字母选择界面');
    await agent.aiTap("启动器左侧字母导航栏中的字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('步骤2：在字母选择界面中点击Q');
    await agent.aiTap('Q', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：检查Q分类下的应用排列顺序，qGo排在QQ前面
    console.log('步骤3：检查Q分类下的应用排列顺序，小写字母qGo排在大写字母QQ前面');
    await agent.aiAssert("启动器Q分类中qGo排在QQ前面，小写字母开头的应用排列在大写字母开头的应用之上");
  }, { timeout: 600000, tags: ["1832251", "level1", "module:launcher"] });

  // 后置清理：删除本用例创建的测试应用 qGo.desktop（软件源安装的 qGo 不卸载，仅清理自建应用）
  afterAll(async ({ system }) => {
    console.log('后置清理：删除本用例创建的测试应用 qGo.desktop');
    await system.exec('rm -f /home/uos/.local/share/applications/qGo.desktop 2>/dev/null');
    await system.exec('update-desktop-database /home/uos/.local/share/applications 2>/dev/null');
    console.log('  测试应用 qGo.desktop 已清理');
  });
});
