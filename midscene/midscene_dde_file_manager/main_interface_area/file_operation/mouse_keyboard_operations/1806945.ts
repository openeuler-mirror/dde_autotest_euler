/**
 * 用例 PMSID: 1806945
 * 用例标题: 文件操作-在有缩略图的文件夹使用F5不断刷新
 * 生成时间: 2026-08-27 16:30:30
 * 用例编写人: UT000159（游伟）
 */

describe('1806945-文件操作-在有缩略图的文件夹使用F5不断刷新', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  const work_dir = `/home/${USERNAME}/Documents/缩略图测试目录`;
  const work_dir_name = "缩略图测试目录";
  const test_file_count = 50;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 准备步骤: 清理可能存在的测试目录
    console.log('准备步骤：清理可能存在的测试目录');
    await system.exec(`rm -rf ${work_dir}`);

    // 准备步骤: 创建测试目录
    console.log('准备步骤：创建测试目录');
    await system.exec(`mkdir -p ${work_dir}`);

    // 准备步骤: 创建50个JPG测试图片文件
    console.log(`准备步骤：创建${test_file_count}个JPG测试图片文件`);
    const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
    for (let i = 1; i <= test_file_count; i++) {
      const fileName = `test_image_${i}.jpg`;
      await system.exec(`cp ${pic_url} ${work_dir}/${fileName}`);
    }

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤：打开测试文件夹
    console.log(`准备步骤：打开测试文件夹 ${work_dir}`);
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);
  });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 恢复环境
    console.log('清理步骤：恢复环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 清理步骤：回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 清理测试目录
    console.log('清理步骤：清理测试目录');
    await system.exec(`rm -rf ${work_dir}`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤：回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();

  });

  /**
   * 测试用例1: 图标模式下按住F5不断刷新
   * 验证在图标视图下，持续按F5刷新10秒，文件管理器不会崩溃
   */
  test('1806945-文件操作-在有缩略图的文件夹使用F5不断刷新_图标模式', async ({ device, agent, uos, system }) => {
    // 步骤 1: 切换到图标视图模式
    console.log('步骤 1：切换到图标视图模式');
    await device.pressKey('Ctrl', '1');
    await agent.aiWaitFor(`文件夹${work_dir_name}以图标视图模式显示`);

    // 步骤 2: 验证缩略图已加载
    console.log('步骤 2：验证缩略图已加载');
    await agent.aiWaitFor(`文件夹${work_dir_name}中有${test_file_count}个图片文件, 可见的文件图标都是龙猫图片`);

    // 步骤 3: 按住F5持续刷新10秒
    console.log('步骤 3：按住F5持续刷新10秒（每500ms按一次）');
    const refreshDuration = 10000; // 10秒
    const refreshInterval = 500;   // 每500ms按一次
    const startTime = Date.now();

    while (Date.now() - startTime < refreshDuration) {
      await device.pressKey('F5');
      await system.exec(`sleep 0.5`);
    }

    // 预期 3-1: 文件管理器窗口仍然存在
    console.log('预期 3-1：文件管理器窗口仍然存在');
    await agent.aiWaitFor(`文件夹${work_dir_name}窗口存在`);

    // 预期 3-2: 文件仍然正确显示
    console.log('预期 3-2：文件仍然正确显示');
    await agent.aiAssert(`文件夹${work_dir_name}中有${test_file_count}个图片文件, 可见的文件图标都是龙猫图片`);
  }, { timeout: 600000, tags: ['1806945', 'level3', 'remote', 'DITT', 'youwei', 'file operation', 'refresh', 'thumbnail', 'F5', 'icon view'] });

  /**
   * 测试用例2: 列表模式下按住F5不断刷新
   * 验证在列表视图下，持续按F5刷新10秒，文件管理器不会崩溃
   */
  test('1806945-文件操作-在有缩略图的文件夹使用F5不断刷新_列表模式', async ({ device, agent, uos, system }) => {
    // 步骤 1: 切换到列表视图模式
    console.log('步骤 1：切换到列表视图模式');
    await device.pressKey('Ctrl', '2');
    await agent.aiWaitFor(`文件夹${work_dir_name}以列表视图模式显示`);

    // 步骤 2: 验证文件列表已加载
    console.log('步骤 2：验证文件列表已加载');
    await agent.aiWaitFor(`文件夹${work_dir_name}中有${test_file_count}个图片文件, 可见的文件图标都是龙猫图片`);

    // 步骤 3: 按住F5持续刷新10秒
    console.log('步骤 3：按住F5持续刷新10秒（每500ms按一次）');
    const refreshDuration = 10000; // 10秒
    const refreshInterval = 500;   // 每500ms按一次
    const startTime = Date.now();

    while (Date.now() - startTime < refreshDuration) {
      await device.pressKey('F5');
      await system.exec(`sleep 0.5`);
    }

    // 预期 1: 文件管理器窗口仍然存在
    console.log('预期 1：文件管理器窗口仍然存在');
    await agent.aiWaitFor(`文件夹${work_dir_name}窗口存在`);

    // 预期 2: 文件管理器没有崩溃
    console.log('预期 2：文件管理器没有崩溃');
    await agent.aiAssert(`文件夹${work_dir_name}可以正常操作`);

    // 预期 3: 文件仍然正确显示
    console.log('预期 3：文件仍然正确显示');
    await agent.aiAssert(`文件夹${work_dir_name}中有${test_file_count}个图片文件, 可见的文件图标都是龙猫图片`);
  }, { timeout: 600000, tags: ['1806945', 'level3', 'remote', 'DITT', 'youwei', 'file operation', 'refresh', 'thumbnail', 'F5', 'list view'] });
});
