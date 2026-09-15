/**
 * 用例 PMSID: 1816697
 * 用例标题: 视图选项-在设置中拖动图标大小，滑动正常
 * 生成时间: 2026-04-24
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1816697-视图选项-在设置中拖动图标大小，滑动正常', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  test('1816697-视图选项-在设置中拖动图标大小，滑动正常', async ({ device, agent, uos, system }) => {
    console.log('===== 步骤1: 进入文件管理器设置界面，点击工作区-视图，查看视图选项 =====');
    
    // 打开设置界面
    await agent.aiTap("文件管理器右上角主菜单");
    await agent.aiTap("设置选项");
    await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });

    // 点击工作区-视图 
    await agent.aiTap("工作区中的视图选项");
    await agent.aiWaitFor("视图设置界面已展开", { timeout: 5000 });

    // 验证设置项"默认大小"更名为"默认图标大小"，交互方式变为滑动条
    await agent.aiWaitFor("视图设置界面中存在'默认图标大小'设置项");
    await agent.aiAssert("默认图标大小的交互方式为滑动条");
    console.log('✅ 步骤1验证通过：设置项"默认大小"更名为"默认图标大小"，交互方式变为滑动条');
    
    console.log('===== 步骤2: 滑动条调小、调大时，滚动条滑动正常 =====');
    
    // 拖动滑动条调小图标大小
    await agent.aiTap("默认图标大小滑动条上蓝色图标");
    await agent.aiDrag("默认图标大小滑动条上蓝色图标", { direction: "left", distance: 40 });
    
    // 验证滑动条调小时滑动正常
    const sliderMoveLeft = await agent.aiBoolean("默认图标大小滑动条蓝色图标已向左滑动，滑动流畅", { deepThink: true });
    if (!sliderMoveLeft) {

      throw new Error('默认图标大小滑动条调小失败：滑动条滑动不正常');
    }
    console.log('✅ 滑动条调小时滑动正常');
    
    // 拖动滑动条调大图标大小
    await agent.aiTap("默认图标大小滑动条上蓝色图标");
    await agent.aiDrag("默认图标大小滑动条上蓝色图标", { direction: "right", distance: 512 });
    
    // 验证滑动条调大时滑动正常
    const sliderMoveRight = await agent.aiBoolean("默认图标大小滑动条蓝色图标已向右滑动，滑动流畅", { deepThink: true });
    if (!sliderMoveRight) {
      throw new Error('默认图标大小滑动条调大失败：滑动条滑动不正常');
    }
    console.log('✅ 滑动条调大时滑动正常');
    console.log('✅ 步骤2验证通过：滑动条调小、调大时，滚动条滑动正常');

    // 关闭设置窗口
    await agent.aiTap("设置窗口右上角的关闭按钮(X)");
    await agent.aiWaitFor("设置窗口已关闭", { timeout: 5000 });

  }, { timeout: 600000, tags: ['1816697', 'level2', 'smoke', 'view_tab', 'settings', 'icon-size', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 关闭文件管理器窗口（如果存在）
    const isFileManagerOpen = await agent.aiBoolean("文件管理器窗口已打开", { deepThink: true });
    if (isFileManagerOpen) {
      await uos.closeCurrentWindow();
      await agent.aiWaitFor("文件管理器窗口已关闭", { timeout: 5000 });
    }
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});