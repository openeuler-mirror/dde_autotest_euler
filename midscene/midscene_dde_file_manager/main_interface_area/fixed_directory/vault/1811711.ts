/**
 * 用例 PMSID: 1811711
 * 用例标题: 【组策略配置侧边栏三方插件显示隐藏】- 组策略配置保险箱黑名单
 * 生成时间: 2026-06-01 16:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811711-【组策略配置侧边栏三方插件显示隐藏】- 组策略配置保险箱黑名单', () => {
  const default_value = "[]";
  const vault_disable_list = '["dfmplugin-vault"]';
  const vault_black_list = '["serverplugin-vaultdaemon"]';

  async function setVaultInBlackList(system) {
    // 设置文管黑名单
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.plugins -k filemanager.disablelist -v '${vault_disable_list}'`, 500);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.plugins -k server.blackList -v '${vault_black_list}'`, 500);

    // 重启文管, 使组策略生效
    await system.exec('killall dde-file-manager', 500);
  }

  async function restoreBlacklistDefaultSetting(system) {
    // 恢复文管黑名单
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.plugins -k filemanager.disablelist -v '${default_value}'`, 500);
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.plugins -k server.blackList -v '${default_value}'`, 500);

    // 重启文管, 使组策略生效
    await system.exec('killall dde-file-manager', 500);
  }

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 组策略恢复到默认值
    console.log('准备步骤: 组策略恢复到默认值');
    await restoreBlacklistDefaultSetting(system);
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 组策略恢复到默认值
    console.log('清理步骤: 组策略恢复到默认值');
    await restoreBlacklistDefaultSetting(system);
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1811711-【组策略配置侧边栏三方插件显示隐藏】- 组策略配置保险箱黑名单', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 设置保险箱到文管黑名单
    console.log('步骤 1: 设置保险箱到文管黑名单');
    await setVaultInBlackList(system);

    // 步骤 2: 打开文管计算机页面
    console.log('步骤 2: 打开文管计算机页面');
    await system.exec('dde-file-manager computer:///', 500);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');

    // 预期 2: 文件管理器侧边栏和文管右边内容区域没有保险箱
    console.log('预期 2: 文件管理器侧边栏和文管右边内容区域没有保险箱');
    await agent.aiAssert('文件管理器侧边栏没有保险箱');
    await agent.aiAssert('文件管理器右边内容区域没有保险箱');

    // 步骤 3: 恢复文管黑名单默认值
    console.log('步骤 3: 恢复文管黑名单默认值');
    await restoreBlacklistDefaultSetting(system);

    // 步骤 4: 打开文管
    console.log('步骤 4: 打开文管计算机页面');
    await system.exec('dde-file-manager computer:///', 500);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');

    // 预期 4: 文件管理器侧边栏和文管右边内容区域有保险箱
    console.log('预期 4: 文件管理器侧边栏和文管右边内容区域有保险箱');
    await agent.aiAssert('文件管理器侧边栏有保险箱');
    await agent.aiAssert('文件管理器右边内容区域有保险箱');

  }, { timeout: 1200000, tags: ['1811711', 'level2', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'blacklist'] });
});