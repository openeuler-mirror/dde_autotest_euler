/**
 * 用例 PMSID: 1806599
 * 用例标题: 标记-标记输入框输入特殊字符
 * 生成时间: 2026-08-05 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806599-标记-标记输入框输入特殊字符', () => {

  const test_file = 'test_1806599.txt';

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;

  const work_dir = `/home/${username}/Documents/`;
  const work_dir_name = "文档";

  const special_chars = "\\/':*?" + '"<>|%&';

  const markUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/file_operation/mark/common.ts`;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

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
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 按下esc, 关闭可能的标记信息框
    console.log('清理步骤：按下esc, 关闭可能的标记信息框');
    await device.pressKey('Esc')

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

  test('1806599-标记-标记输入框输入特殊字符', async ({ device, agent, uos, system }) => {
    const mark = 'test';
    // 步骤 1：打开测试文件夹
    console.log('步骤 1：打开测试文件夹');
    await uos.showDesktop();
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);

    // 步骤 2: 右击测试文件打开右键菜单
    console.log('步骤 2：右击测试文件打开右键菜单');
    await agent.aiRightClick(`文件管理器右侧内容窗口中的${test_file}文件图标, 文件名可能省略显示, 可能会换行显示`);
    await agent.aiWaitFor(`右键菜单加载成功`);

    // 步骤 3: 点击右键菜单中的标记信息
    console.log('步骤 3：点击右键菜单中的标记信息');
    await agent.aiTap(`右键菜单中标记信息`);
    await agent.aiWaitFor(`文件图标下出现一个矩形框, 里边可能有|形光标`);

    // 步骤 4: 输入特殊字符
    console.log(`步骤 4：输入特殊字符${special_chars}`);
    await device.typeText(special_chars, false);

    // 预期 4: 没有新增标记
    console.log(`预期 4：没有新增标记`);
    await agent.aiAssert(`标记信息编辑框中没有${special_chars}中的任意字符`);

    // 步骤 5: 再次右击信息并输入标记${mark}
    console.log(`步骤 5：再次右击信息并输入标记${mark}`);
    // await agent.aiRightClick(`文件管理器右侧内容窗口中的${test_file}文件图标, 文件名可能省略显示, 可能会换行显示`);
    // await agent.aiTap(`右键菜单中标记信息`);
    // await agent.aiWaitFor(`文件图标下出现一个矩形框, 里边可能有|形光标`);
    await device.typeText(mark, false);
    await agent.aiTap('标记信息编辑框下方的提示信息"输入标记信息..."');

    // 预期 5: 文件${test_file}新增标记
    console.log(`预期 5：文件${test_file}新增标记`);
    await agent.aiWaitFor(`标记信息编辑框中出现一个带底色的${mark}标记`);

    // 根据BUG https://pms.uniontech.com/bug-view-372877.html 备注8/9 修改用例
    // 步骤 6: 再次打开标记并输入特殊字符
    console.log(`步骤 6：再次打开标记并输入特殊字符${special_chars}`);
    // await agent.aiRightClick(`文件管理器右侧内容窗口中的${test_file}文件图标, 文件名可能省略显示, 可能会换行显示`);
    // await agent.aiTap(`右键菜单中标记信息`);
    // await agent.aiWaitFor(`文件图标下出现一个矩形框, 里边可能有|形光标`);
    await agent.aiTap(`标记信息编辑框中${mark}标记右侧的空白区域`)
    await device.typeText(special_chars, false);
    await agent.aiTap('标记信息编辑框下方的提示信息"输入标记信息..."');

    // 预期 6: 新增标记
    console.log(`预期 6：新增标记`);
    await agent.aiAssert(`标记信息编辑框中出现一个带底色的${special_chars}标记`);
  }, { timeout: 600000, tags: ['1806599', 'level3', 'DITT', 'youwei', 'right click menu', 'text mark'] });

});
