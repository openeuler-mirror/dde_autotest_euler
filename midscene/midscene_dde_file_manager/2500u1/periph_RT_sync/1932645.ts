/**
 * 用例 PMSID: 1932645
 * 用例标题: 【外设支持实时同步】设置模式后恢复默认值
 * 生成时间: 2026-10-21 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1932645-【外设支持实时同步】设置模式后恢复默认值', () => {

  const TESTCASE_DIR = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${TESTCASE_DIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  test('1932645-【外设支持实时同步】设置模式后恢复默认值', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器设置
    console.log('步骤 1：打开文件管理器设置');
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器已打开');

    // 打开文件管理器设置
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已打开');

    // 步骤 2: 定位到高级设置->外部存储设备
    console.log('步骤 2：定位到高级设置->外部存储设备');
    await agent.aiTap('高级设置', { deepThink: true });
    await agent.aiScroll('设置窗口侧边栏', { direction: 'down', distance: 10 });
    await agent.aiTap('设置窗口侧边栏中的外部存储设备', { deepThink: true });

    // 预期 2: 外部存储设备使用模式默认值是数据实时同步（推荐）
    console.log('预期 2：外部存储设备使用模式默认值是数据实时同步');
    await agent.aiAssert('外部存储设备使用模式默认值是数据实时同步, 后面可能跟着推荐字样');
    await agent.aiAssert('数据实时同步对应的文案是: 文件拷贝完成后，您可以直接移除外部存储设备，无需使用“安全移除”功能')

    // 步骤 3: 设置为性能优先
    console.log('步骤 3：设置为性能优先');
    await agent.aiTap('外部存储设备使用模式下的性能优先选项左边的空圈', { deepThink: true });

    // 预期 3: 性能优先设置成功
    console.log('预期 3：性能优先设置成功');
    await agent.aiAssert('外部存储设备使用模式设置为性能优先, 后面可能跟着需安全移除字样');

    // 步骤 4: 滚动设置窗口侧边栏到底部
    console.log('步骤 4：滚动设置窗口侧边栏到底部');
    await agent.aiScroll('设置窗口右侧设置区域', { direction: 'down', distance: 100 });
    await agent.aiWaitFor('设置窗口底部出现恢复默认的按钮');

    // 步骤 5: 点击恢复默认
    console.log('步骤 5：点击恢复默认');
    await agent.aiTap('恢复默认按钮');

    // 步骤 6: 跳转到高级设置->外部存储设备
    console.log('步骤 6：跳转到高级设置->外部存储设备');
    await agent.aiTap('设置窗口侧边栏中的外部存储设备', { deepThink: true });

    // 预期 6: 外部存储设备使用模式默认值是数据实时同步（推荐）
    console.log('预期 6：外部存储设备使用模式默认值是数据实时同步');
    await agent.aiAssert('外部存储设备使用模式默认值是数据实时同步, 后面可能跟着推荐字样');
    await agent.aiAssert('数据实时同步对应的文案是: 文件拷贝完成后，您可以直接移除外部存储设备，无需使用“安全移除”功能')

  }, { timeout: 600000, tags: ['1932645', 'level3', 'DITT', 'youwei', 'periph_RT_sync', 'default'] });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理环境
    console.log('清理步骤：清理环境');
    const { clearEnvironment } = await import(`${TESTCASE_DIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 清理步骤: 显示桌面
    console.log('清理步骤: 显示桌面');
    await uos.showDesktop();

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
