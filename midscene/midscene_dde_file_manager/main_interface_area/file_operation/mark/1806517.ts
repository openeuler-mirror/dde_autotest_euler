/**
 * 用例 PMSID: 1806517
 * 用例标题: 角标设置-更改状态或改变路径情况下，角标显示
 * 生成时间: 2026-08-25 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806517-角标设置-更改状态或改变路径情况下，角标显示', () => {
  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  // 龙猫图片
  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const pic_url1 = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20161117212144_JLnAa.jpeg`;
  const test_file = "testfile_1806517.txt"
  const auxiliary_file = "auxiliary_file.txt"
  const test_dir = "testdir_1806517";

  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;
  const auxiliary_file_path = `${work_dir}/${auxiliary_file}`;
  const test_dir_path = `${work_dir}/${test_dir}`;
  const test_pic = "test.png";
  const test_pic1 = "test1.png";
  const test_pic_path = `${work_dir}/${test_pic}`;
  const test_pic_path1 = `${work_dir}/${test_pic1}`;

  async function openDir(agent, system, device, dir_path, dir_name = "") {
    if (dir_name == "") {
      dir_name = dir_path.split('/').pop();
    }
    await system.exec(`dde-file-manager ${dir_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${dir_name}打开成功`);
  }

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);

    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`mkdir -p ${test_dir_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
    await system.exec(`cp ${pic_url} ${test_pic_path}`);
    await system.exec(`test -f ${test_pic1} && rm ${test_pic1} || true`);
    await system.exec(`cp ${pic_url1} ${test_pic_path1}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();

    // 准备步骤: 给文件设置角标
    console.log('准备步骤: 给文件设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上${test_file}角标设置成功, 文件${test_file}右上角有缩小的正方形龙猫图片`);
  });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_移动文件到其它目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 移动设置了角标的文件到其他目录
    console.log('步骤 1: 移动设置了角标的文件到其他目录');
    await system.exec(`mv ${test_file_path} ${test_dir_path}`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面没有${test_file}文件图标`);

    // 预期 1: 文件角标消失
    console.log('预期1: 文件角标消失');
    // 打开测试目录
    await openDir(agent, system, device, test_dir_path, test_dir);

    // 断言没有角标
    await agent.aiAssert(`文件管理器右侧内容窗口中${test_dir}右上角没有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'change file path'] });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_移动图片到其它位置', async ({ device, agent, uos, system }) => {

    // 步骤 1: 移动角标图片
    console.log('步骤 1: 移动角标图片');
    await system.exec(`mv ${test_pic_path} ${test_dir_path}`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面没有${test_pic}文件图标`);

    // 预期 1: 文件角标消失
    console.log('预期 1: 文件角标消失');
    // 刷新桌面
    await device.pressKey('F5');

    // 断言没有角标
    await agent.aiAssert(`桌面上文件${test_file}右上角没有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'change pic path'] });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_删除文件再恢复', async ({ device, agent, uos, system }) => {

    // 步骤 1: 删除设置了角标的文件
    console.log('步骤 1: 删除设置了角标的文件');
    let isSelected = await agent.aiBoolean(`桌面上的${test_file}文件图标有亮蓝色背景`);
    if (!isSelected) {
      await agent.aiTap(`桌面上的${test_file}文件图标`);
    }
    await agent.aiWaitFor(`桌面上${test_file}文件有亮蓝色背景`);
    await device.pressKey('Delete');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面没有${test_file}文件图标`);

    // 步骤 2: 按Ctrl+Z撤销删除操作
    console.log('步骤 2: 按Ctrl+Z撤销删除操作');
    await device.pressKey('Ctrl+Z');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上有文件${test_file}图标`);

    // 预期 2: 文件角标恢复
    console.log('预期 2: 文件角标恢复');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上文件${test_file}右上角有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'delete file'] });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_移动图片再恢复', async ({ device, agent, uos, system }) => {

    // 步骤 1: 删除被设置了角标的图片
    console.log('步骤 1: 删除被设置了角标的图片');
    let isSelected = await agent.aiBoolean(`桌面上的${test_pic}文件有亮蓝色背景`);
    if (!isSelected) {
      await agent.aiTap(`桌面上的${test_pic}文件图标`);
    }
    await agent.aiWaitFor(`桌面上${test_pic}文件有亮蓝色背景`);
    await device.pressKey('Delete');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面没有${test_pic}文件图标`);

    // 预期 1: 文件角标消失
    console.log('预期 1: 文件角标消失');
    await agent.aiAssert(`桌面上文件${test_file}右上角没有缩小的正方形龙猫图片`);

    // 步骤 2: 按Ctrl+Z撤销删除操作
    console.log('步骤 2: 按Ctrl+Z撤销删除操作');
    await device.pressKey('Ctrl+Z');
    await agent.aiWaitFor(`桌面上有${test_file}文件图标`);

    // 预期 2: 文件角标恢复
    console.log('预期 2: 文件角标恢复');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上文件${test_file}右上角有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'delete pic'] });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_重命名文件再恢复', async ({ device, agent, uos, system }) => {

    // 步骤 1: 重命名设置了角标的文件
    console.log('步骤 1: 重命名设置了角标的文件');
    await system.exec(`mv ${test_file_path} ${auxiliary_file_path}`);

    // 预期 1: 文件角标消失
    console.log('预期 1: 文件角标消失');
    await agent.aiAssert(`桌面上文件${auxiliary_file}右上角没有缩小的正方形龙猫图片`);

    // 步骤 2: 恢复重命名的文件
    console.log('步骤 2: 恢复重命名的文件');
    await system.exec(`mv ${auxiliary_file_path} ${test_file_path}`);

    // 预期 2: 文件角标恢复
    console.log('预期 2: 文件角标恢复');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上文件${test_file}右上角有缩小的正方形龙猫图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'change file path'] });

  test('1806517-角标设置-更改状态或改变路径情况下，角标显示_替换被设置了角标的图片', async ({ device, agent, uos, system }) => {

    // 步骤 1: 替换被设置了角标的图片
    console.log('步骤 1: 替换被设置了角标的图片');
    await system.exec(`mv ${test_pic_path1} ${test_pic_path}`);

    // 预期 1: 文件有角标, 但不是龙猫
    console.log('预期 1: 文件有角标, 但不是龙猫');
    await device.pressKey('F5');
    await agent.aiWaitFor(`桌面上文件${test_file}右上角有缩小的不是龙猫的图片`);

  }, { timeout: 600000, tags: ['1806517', 'level3', 'DITT', 'youwei', 'emblems', 'change state', 'change path'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    await system.exec(`test -f ${test_pic_path1} && rm ${test_pic_path1} || true`);

    // 清理步骤: 清空回收站
    console.log('清理步骤: 清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
