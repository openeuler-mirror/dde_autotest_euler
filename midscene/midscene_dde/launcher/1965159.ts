/**
 * 用例 PMSID: 1965159
 * 用例标题: 【启动器】【wine应用卸载】从启动器卸载wine应用
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1965159-【启动器】【wine应用卸载】从启动器卸载wine应用', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const winePkg = 'com.popcap.plantsvszombies.deepin';
  const wineAppName = '植物大战僵尸';

  // ── 工具函数：等待"卸载成功"通知 ──
  // super+M 打开通知中心，每5秒检查一次，最多轮询60秒；找到即返回，超时抛错
  const waitForUninstallNotice = async (agent, device) => {
    const checkDeadline = Date.now() + 60000;
    while (Date.now() < checkDeadline) {
      await device.pressKey('super', 'm');
      await new Promise(resolve => setTimeout(resolve, 500));
      const found = await agent.aiBoolean(`通知中心长驻区域显示'${wineAppName}'相关的卸载成功通知（文案包含植物大战僵尸或卸载成功字样）`, { deepThink: true });
      await device.pressKey('esc');
      if (found) {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error(`60秒内未检测到"${wineAppName}"卸载成功通知`);
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('========== beforeAll ==========');
    // 清理历史通知，避免干扰后续"卸载成功"通知判断
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    await device.releaseAllKeys();
  });

  test('1965159-【启动器】【wine应用卸载】从启动器卸载wine应用', async ({ device, agent, uos, system, env }) => {
    console.log('========== 用例执行开始 ==========');

    // ── 步骤 1/5：先 apt update 更新软件源，再终端下载 wine 应用"植物大战僵尸" ──
    console.log('[步骤 1/5] 先 apt update 更新软件源，再终端下载 wine 应用：植物大战僵尸');
    // 先更新软件源，避免过期索引导致 apt install 找不到/安装失败
    const updateCmd = `echo '${env.testPassword}' | sudo -S apt update`;
    const updateResult = await system.exec(updateCmd, 300000);
    if (!updateResult.success) {
      throw new Error('apt update 更新软件源失败');
    }
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y ${winePkg}`;
    const installResult = await system.exec(installCmd, 600000);
    if (!installResult.success) {
      throw new Error('终端下载安装植物大战僵尸失败');
    }
    const checkResult = await system.exec(`dpkg -l ${winePkg} 2>/dev/null | grep "^ii"`);
    if (!checkResult.success || checkResult.stdout.trim() === '') {
      throw new Error('植物大战僵尸下载成功确认失败：包未处于已安装状态');
    }
    console.log('  - 植物大战僵尸下载安装成功');
    // 重启 dde-shell，确保启动器刷新应用列表并出现在"最近安装"
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));

    // ── 步骤 2/5：打开启动器，右键最近安装的植物大战僵尸并确认卸载 ──
    console.log('[步骤 2/5] 打开启动器，右键最近安装的植物大战僵尸');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('启动器最近安装区域中的植物大战僵尸应用图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('卸载');
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 检查卸载确认弹窗已弹出
    await agent.aiAssert('屏幕中央显示标题为"是否确定卸载植物大战僵尸"的卸载确认弹窗，包含确认卸载按钮');
    await agent.aiTap('卸载确认对话框中的确认卸载按钮', { deepThink: true });
    // 确认按钮文案为"确认卸载"而非"确定"，点击后等待弹窗关闭、卸载执行
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('  - 已点击确认卸载，弹窗已关闭');

    // ── 步骤 3/5：super+M 等待卸载成功通知（轮询60秒，超时即报错）──
    console.log('[步骤 3/5] super+M 打开通知中心，等待卸载成功通知（最多60秒）');
    await waitForUninstallNotice(agent, device);
    console.log('  - 卸载成功通知已确认');

    // ── 步骤 4/5：重新打开启动器，检查"最近安装"菜单 ──
    console.log('[步骤 4/5] 重新打开启动器，检查无"最近安装"菜单');
    // 重启 dde-shell 规避应用列表"隐形缓存"（dde-application-manager 可能把已删应用写回）
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasRecentMenu = await agent.aiBoolean('启动器界面存在"最近安装"菜单');
    if (!hasRecentMenu) {
      console.log('  - 启动器已无"最近安装"菜单');
    } else {
      await agent.aiAssert('启动器"最近安装"菜单中不显示植物大战僵尸应用');
      console.log('  - "最近安装"菜单仍在但已无植物大战僵尸（可能还有其他最近安装应用）');
    }

    // ── 步骤 5/5：搜索"植物大战僵尸"，搜索为空即 pass ──
    console.log('[步骤 5/5] 搜索"植物大战僵尸"，验证搜索为空');
    await agent.aiTap('启动器底部中央的搜索输入框，呈矩形，内有放大镜图标');
    await device.typeText('植物大战僵尸');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('启动器搜索结果为空白，显示"无搜索结果"提示，未展示植物大战僵尸应用');
    console.log('  - 搜索为空，卸载验证通过');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1965159', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ agent, device, system, env }) => {
    console.log('========== afterAll ==========');
    // 终端 apt remove 兜底卸载植物大战僵尸
    console.log('[1/2] 终端 apt remove 卸载植物大战僵尸（兜底）');
    const removeCmd = `echo '${env.testPassword}' | sudo -S apt remove -y ${winePkg}`;
    await system.exec(removeCmd, 300000);
    // 清理通知并恢复桌面
    console.log('[2/2] 清理通知并恢复桌面');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
