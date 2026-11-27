/**
 * 用例 PMSID: 1814335
 * 用例标题: 【本地磁盘】盘符展示-本地磁盘属性信息检查
 * 生成时间: 2026-10-20 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1814335-【本地磁盘】盘符展示-本地磁盘属性信息检查', () => {

  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 关闭可能残留的文件管理器
    console.log('准备步骤：关闭可能残留的文件管理器');
    // const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // await closeFileManager(system);
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤: 打开文件管理器并定位到计算机视图
    console.log('准备步骤：打开文件管理器并定位到计算机视图');
    await system.exec('nohup dde-file-manager computer:/// >/dev/null 2>&1 &');
    await agent.aiWaitFor('文件管理器计算机视图打开成功，显示本地磁盘图标');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 本用例为只读属性检查，无需额外准备
    console.log('准备步骤：本用例为只读属性检查，无需额外准备');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭可能打开的属性窗口
    console.log('清理步骤：关闭可能打开的属性窗口');
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性窗口已关闭');
  });

  afterAll(async ({ device, agent, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭属性窗口
    console.log('清理步骤：关闭属性窗口');
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性窗口已关闭');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    // const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // await closeFileManager(system);
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  test('1814335-【本地磁盘】盘符展示-本地磁盘属性信息检查   #2', async ({ device, agent, uos, system }) => {

    // 步骤 1: 右键本地磁盘图标
    console.log('步骤 1：右键本地磁盘图标');
    await agent.aiRightClick('文件管理器计算机视图中的系统盘图标');

    // 预期 1: 弹出右键菜单
    console.log('预期 1：弹出右键菜单');
    await agent.aiWaitFor('弹出系统盘的右键菜单');

    // 步骤 2: 选择属性选项
    console.log('步骤 2：选择属性选项');
    await agent.aiTap('右键菜单中的属性选项');

    // 预期 2: 打开本地磁盘属性窗口
    console.log('预期 2：打开系统盘属性窗口');
    await agent.aiWaitFor('系统盘属性窗口已打开');

    // 步骤 3: 检查设备类型
    console.log('步骤 3：检查设备类型');
    // 预期 3: 设备类型显示本地磁盘
    console.log('预期 3：设备类型显示本地磁盘');
    await agent.aiAssert('属性窗口中设备类型字段显示为本地磁盘');

    // 步骤 4: 检查总容量
    console.log('步骤 4：检查总容量');
    // 预期 4: 总容量显示正确
    console.log('预期 4：总容量显示正确');
    await agent.aiAssert('属性窗口中总容量字段显示正确');

    // 步骤 5: 检查文件系统
    console.log('步骤 5：检查文件系统');
    // 预期 5: 文件系统显示ext4
    console.log('预期 5：文件系统显示ext4');
    await agent.aiAssert('属性窗口中文件系统字段显示为ext4');

    // 步骤 6: 检查文件个数
    console.log('步骤 6：检查文件个数');
    // 预期 6: 文件个数显示当前磁盘分区下的文件总数
    console.log('预期 6：文件个数显示当前磁盘分区下的文件总数');
    await agent.aiAssert('属性窗口中文件个数字段显示当前磁盘分区下的文件总数');

    // 步骤 7: 检查可用空间
    console.log('步骤 7：检查可用空间');
    // 预期 7: 可用空间展示正确
    console.log('预期 7：可用空间展示正确');
    await agent.aiAssert('属性窗口中可用空间字段显示正确');

    // 清理步骤: 关闭属性窗口
    console.log('清理步骤：关闭属性窗口');
    await device.pressKey('Escape');
    await agent.aiWaitFor('属性窗口已关闭');

    console.log('===PMSID-1814335，执行成功===');
  }, { timeout: 600000, tags: ['1814335', 'level2', 'DITT', 'youwei', 'local_disk', 'properties'] });
});
