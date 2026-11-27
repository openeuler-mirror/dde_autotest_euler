/**
 * 用例 PMSID: 1816077
 * 用例标题: 长文件名功能 - 标记信息，文件属性中添加标记
 * 生成时间: 2026-07-20 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816077-长文件名功能 - 标记信息，文件属性中添加标记', () => {

  const test_file = 
    '一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一.txt'

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;

  const work_dir = `/home/${username}/Documents/`;
  const work_dir_name = "文档";

  const markUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/file_operation/mark/common.ts`;

  const mark_color = "橙色";
  const mark_color_position = 1;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 开启长文件名功能
    console.log('准备步骤：开启长文件名功能');
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    
    // 准备步骤: 清理可能存在的标记, 防止干扰测试
    console.log('准备步骤：清理可能存在的标记');
    const { removeAllMarks } = await import(markUtil);
    await removeAllMarks(device, agent, system);

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理可能存在的测试文件, 防止干扰测试
    console.log('准备步骤：清理可能存在的测试文件');
    await system.exec(`test -f ${work_dir}/${test_file} && rm ${work_dir}/${test_file} || true`);

    // 准备步骤: 创建测试文件
    console.log('准备步骤：创建测试文件');
    await system.exec(`yes "Hello World" | head -n 10 > ${work_dir}/${test_file}`);

    // 准备步骤：打开测试文件夹
    console.log('准备步骤：打开测试文件夹');
    await uos.showDesktop();
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);

    // 准备步骤: 选中测试文件
    console.log('准备步骤：选中测试文件');
    await agent.aiTap(`文件管理器右侧内容窗口中的${test_file}文件图标, 文件名可能省略显示, 可能会换行显示`);
    await agent.aiWaitFor(`文件管理器右侧内容窗口中选中文件${test_file}图标, 文件名可能省略显示, 可能会换行显示`);

    // 准备步骤: 打开属性窗口
    console.log('准备步骤：打开属性窗口');
    await device.pressKey('Ctrl', "I")
    await agent.aiWaitFor(`文件${test_file}属性窗口打开成功`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 移除所有标记
    console.log('清理步骤：移除所有标记');
    const { removeAllMarks } = await import(markUtil);
    await removeAllMarks(device, agent, system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${work_dir}/${test_file} && rm ${work_dir}/${test_file} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1816077-长文件名功能 - 标记信息，文件属性中添加标记_颜色标记', async ({ device, agent, uos, system }) => {
    // 步骤 1: 添加颜色标记
    console.log('步骤 1：添加颜色标记');
    await agent.aiTap(`文件${test_file}属性窗口中的标记下的第${mark_color_position}个圆点`);

    // 预期 1: 文件${test_file}新增${mark_color}标记
    console.log(`预期 1：文件${test_file}新增${mark_color}标记`);
    await agent.aiWaitFor(`文件${test_file}属性窗口中显示${mark_color}标记`);

    // 步骤 2: 关闭属性窗口
    console.log('步骤 2：关闭属性窗口');
    await agent.aiTap(`文件${test_file}属性窗口右上方的关闭按钮X`);
    await agent.aiWaitFor(`没有文件${test_file}属性窗口`);

    // 预期 2: 文管侧边栏标记中有${mark_color}标记项
    console.log(`预期 2：文管侧边栏标记中有${mark_color}标记项`);
    await agent.aiAssert(`文件${test_file}侧边栏标记中有${mark_color}标记项`);
  }, { timeout: 600000, tags: ['1816077', 'level3', 'remote', 'DITT', 'youwei', 'main interface area', 'file operation', 'property window', 'mark', 'color mark'] });

  test('1816077-长文件名功能 - 标记信息，文件属性中添加标记_文本标记', async ({ device, agent, uos, system }) => {
    // 步骤 1: 添加文本标记
    console.log('步骤 1：添加文本标记');
    await agent.aiTap(`文件${test_file}属性窗口中的标记下的矩形编辑框`);
    await device.typeText('test');
    await agent.aiTap(`文件${test_file}属性窗口中的任意空白处`);

    // 预期 1: 文件${test_file}新增test标记
    console.log(`预期 1：文件${test_file}新增test标记`);
    await agent.aiWaitFor(`文件${test_file}属性窗口中显示test标记`);

    // 步骤 2: 关闭属性窗口
    console.log('步骤 2：关闭属性窗口');
    await agent.aiTap(`文件${test_file}属性窗口右上方的关闭按钮X`);
    await agent.aiWaitFor(`没有文件${test_file}属性窗口`);

    // 预期 2: 文管侧边栏标记中有test标记项
    console.log(`预期 2：文管侧边栏标记中有test标记项`);
    await agent.aiAssert(`文件${test_file}侧边栏标记中有test标记项`);
  }, { timeout: 600000, tags: ['1816077', 'level3', 'remote', 'DITT', 'youwei', 'main interface area', 'file operation', 'property window', 'mark', 'text mark'] });

  test('1816077-长文件名功能 - 标记信息，文件属性中添加标记_多标记', async ({ device, agent, uos, system }) => {
    const mark_count = 3;

    // 步骤&预期 1: 添加多个文本标记
    console.log('步骤 1：添加多个文本标记');

    for (let i = 0; i < mark_count; i++) {
      await agent.aiTap(`文件${test_file}属性窗口中的标记下的矩形编辑框中的空白区域`);
      await device.typeText(`test_${i}`);
      await agent.aiTap(`文件${test_file}属性窗口中的任意空白处`);

      await agent.aiWaitFor(`文件${test_file}属性窗口中显示test_${i}标记`);
    }

    // 步骤 2: 关闭属性窗口
    console.log('步骤 2：关闭属性窗口');
    await agent.aiTap(`文件${test_file}属性窗口右上方的关闭按钮X`);
    await agent.aiWaitFor(`没有文件${test_file}属性窗口`);

    // 预期 2: 文管侧边栏标记中有${mark_count}个以test_开头的标记项
    console.log(`预期 2：文管侧边栏标记中有${mark_count}个以test_开头的标记项`);
    for (let i = 0; i < mark_count; i++) {
      await agent.aiAssert(`文件${test_file}侧边栏标记中有test_${i}标记项`);
    }
  }, { timeout: 600000, tags: ['1816077', 'level3', 'remote', 'DITT', 'youwei', 'main interface area', 'file operation', 'property window', 'mark', 'text mark', 'multi mark'] });
});
