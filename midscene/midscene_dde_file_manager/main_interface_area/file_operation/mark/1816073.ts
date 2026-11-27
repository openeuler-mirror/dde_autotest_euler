/**
 * 用例 PMSID: 1816073
 * 用例标题: 长文件名功能 - 标记信息，文件title信息栏添加标记
 * 生成时间: 2026-08-04 17:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816073-长文件名功能 - 标记信息，文件title信息栏添加标记', () => {

  const test_file = 
    '一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一.txt'

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  const work_dir = `/home/${USERNAME}/Documents/`;
  const work_dir_name = "文档";

  const markUtil = `${CASEDIR}midscene_dde_file_manager/main_interface_area/file_operation/mark/common.ts`;

  const mark_color = "橙色";
  const mark_color_position = 1;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 开启长文件名功能
    console.log('准备步骤：开启长文件名功能');
    const { enableLongFileName } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
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

    // 准备步骤: 右击测试文件打开右键菜单
    console.log('准备步骤：右击测试文件打开右键菜单');
    await agent.aiRightClick(`文件管理器右侧内容窗口中的${test_file}文件图标, 文件名可能省略显示, 可能会换行显示`);
    await agent.aiWaitFor(`右键菜单加载成功`);
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

  test('1816073-长文件名功能 - 标记信息，文件title信息栏添加标记_颜色标记', async ({ device, agent, uos, system }) => {
    // 步骤 1: 添加颜色标记
    console.log('步骤 1：添加颜色标记');
    await agent.aiTap(`右键菜单中标记信息下的第${mark_color_position}个圆点`);

    // 预期 1-1: 文件${test_file}新增${mark_color}标记
    console.log(`预期 1-1：文件${test_file}新增${mark_color}标记`);
    await agent.aiWaitFor(`文件${test_file}名前面出现${mark_color}圆点的标记`);

    // 预期 1-2: 文管侧边栏标记中有${mark_color}标记项
    console.log(`预期 1-2：文管侧边栏标记中有${mark_color}标记项`);
    await agent.aiAssert(`文件${test_file}侧边栏标记中有${mark_color}标记项`);
  }, { timeout: 600000, tags: ['1816073', 'level3', 'remote', 'DITT', 'youwei', 'right click menu', 'color mark'] });

  test('1816073-长文件名功能 - 标记信息，文件title信息栏添加标记_文本标记', async ({ device, agent, uos, system }) => {
    // 步骤 1: 点击右键菜单中的标记信息
    console.log('步骤 1：点击右键菜单中的标记信息');
    await agent.aiTap(`右键菜单中标记信息`);
    await agent.aiWaitFor(`文件图标下出现一个矩形框, 里边可能有|形光标`);

    // 步骤 2: 输入test
    console.log('步骤 2：输入test');
    await device.typeText('test', true);
    await agent.aiTap('文件管理器右侧内容窗口任意空白处');

    // 预期 2-1: 文件${test_file}新增标记
    console.log(`预期 2-1：文件${test_file}新增标记`);
    await agent.aiWaitFor(`文件${test_file}名前面出现一个带颜色的圆点标记, 颜色随机`);

    // 预期 2-2: 文管侧边栏标记中有test标记项
    console.log(`预期 2-2：文管侧边栏标记中有test标记项`);
    await agent.aiAssert(`文件${test_file}侧边栏标记中有test标记项`);
  }, { timeout: 600000, tags: ['1816073', 'level3', 'remote', 'DITT', 'youwei', 'right click menu', 'text mark'] });

  test('1816073-长文件名功能 - 标记信息，文件title信息栏添加标记_多标记', async ({ device, agent, uos, system }) => {
    const mark_count = 3;

    // 步骤&预期 1: 添加多个文本标记
    console.log('步骤 1：添加多个文本标记');

    for (let i = 0; i < mark_count; i++) {
      let isRightClickMenu = await agent.aiBoolean('有右键菜单');
      if (!isRightClickMenu) {
        await agent.aiRightClick(`文件管理器右侧内容区域的文件${test_file}图标`);
        await agent.aiWaitFor(`右键菜单加载完成`);
      }

      // 点击右键菜单中的标记信息
      await agent.aiTap(`右键菜单中标记信息`);
      await agent.aiWaitFor(`文件图标下出现一个矩形框, 里边可能有|形光标`);

      // 输入`test_${i}`
      await device.typeText(`test_${i}`, true);
      await agent.aiTap('文件管理器右侧内容窗口任意空白处');

      // 文件${test_file}新增标记
      await agent.aiWaitFor(
        `[预期文件](文件${test_file})名前面出现部分重叠${i+1}个带随机颜色的圆点标记,
        [匹配规则]
          1. 文件名匹配
            * 提取该项中可见的文件名文本（去除首尾空格、零宽字符 \u200b、圆点、重叠在一起的多个圆点）
            * 如果文件名中有换行符或者显示为多行，去除文件名文本中的换行符, 将多行字符拼接到一起作为识别到的文件名
            * 允许以下情况视为匹配:
                - 识别到的文件名恰好等于 [预期文件]
                - 识别到的文件名为 [预期文件] 的前缀且后面紧跟省略号(···)
                - 识别到的文件名没有缺失后缀
          2. 圆点标记数量匹配
            * 提取 [预期文件] 名同一行前面的符号
            * 识别提取的符号中的颜色数量, 作为识别到的圆点标记数量
        [容错规则]
          * 允许圆点标记重叠或者部分重叠, 使得部分圆点显示不完整
          * 允许圆点标记因过小或者重叠而识别成少于${i+1}个
      `);
    }

    // 预期 2: 文管侧边栏标记中有${mark_count}个以test_开头的标记项
    console.log(`预期 2：文管侧边栏标记中有${mark_count}个以test_开头的标记项`);
    for (let i = 0; i < mark_count; i++) {
      await agent.aiAssert(`文件${test_file}侧边栏标记中有test_${i}标记项`);
    }
  }, { timeout: 600000, tags: ['1816073', 'level3', 'remote', 'DITT', 'youwei', 'right click menu', 'text mark', 'multi mark'] });
});
