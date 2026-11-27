/**
 * 用例 PMSID: 1807433
 * 用例标题: 属性复制-属性字段最长支持5行，超出从中间隐藏字符
 * 生成时间: 2026-08-25 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1807433-属性复制-属性字段最长支持5行，超出从中间隐藏字符', () => {

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;

  // 创建超长路径的测试文件
  const testdir = 'testdir_1807433';
  const deep_path = `${testdir}/subdir_1807433_1/subdir_1807433_2/subdir_1807433_3/subdir_1807433_4/subdir_1807433_5/subdir_1807433_6/subdir_1807433_7/subdir_1807433_81/subdir_1807433_2/subdir_1807433_3/subdir_1807433_4/subdir_1807433_5/subdir_1807433_6/subdir_1807433_7/subdir_1807433_8`;
  const work_dir = `/home/${username}/Desktop/`;
  const test_file = 'testfile.txt';
  const full_path = `${work_dir}${deep_path}/${test_file}`;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理可能存在的测试文件和文件夹
    console.log('准备步骤：清理可能存在的测试文件和文件夹');
    await system.exec(`rm -rf ${work_dir}/${testdir} || true`);

    // 准备步骤: 清空回收站
    console.log('准备步骤：清空回收站');
    await system.exec('gio trash --empty');

    // 准备步骤: 创建超长路径的文件夹和测试文件
    console.log('准备步骤：创建超长路径的文件夹和测试文件');
    await system.exec(`mkdir -p ${work_dir}${deep_path}`);
    await system.exec(`echo "Hello World" > ${full_path}`);

    // 准备步骤: 导航到测试文件所在位置
    console.log('准备步骤：导航到测试文件所在位置');
    await system.exec(`dde-file-manager ${work_dir}${deep_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件夹打开成功');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 清理测试文件和文件夹
    console.log('清理步骤：清理测试文件和文件夹');
    await system.exec(`rm -rf ${work_dir}/${testdir} || true`);

    // 清理步骤: 清空回收站
    console.log('清理步骤：清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 关闭终端
    console.log('清理步骤：关闭终端');
    await system.exec('killall -15 deepin-terminal');

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理测试文件夹
    console.log('清理步骤：清理测试文件夹');
    await system.exec(`rm -rf ${work_dir}/${testdir} || true`);
  });

  test('1807433-属性复制-属性字段最长支持5行_查看超长路径属性', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中测试文件
    console.log('步骤 1：选中测试文件');
    await agent.aiTap(`文件管理器中的${test_file}文件图标`);
    await agent.aiWaitFor(`文件管理器中选中${test_file}文件`);

    // 步骤 2: 打开属性窗口
    console.log('步骤 2：打开属性窗口');
    await device.pressKey('Ctrl', 'I');
    await agent.aiWaitFor(`${test_file}属性窗口打开成功`);

    // 预期 2: 属性字段最多支持5行，超出的从中间展示省略号隐藏字符
    console.log('预期 2：属性字段最多支持5行，超出的从中间展示省略号隐藏字符');
    await agent.aiAssert(`${test_file}属性窗口中位置字段分为5行显示，中间有省略号···或者--`, { deepThink: true });

    // 步骤 3: 选中路径文本并复制
    console.log('步骤 3：选中路径文本并复制');
    await agent.aiTap(`${test_file}属性窗口中的路径字段`, { deepThink: true });
    await device.pressKey('Ctrl', 'A');
    await agent.aiRightClick(`${test_file}属性窗口中的位置字段对应的路径`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('右键菜单中的复制完整信息')

    // 步骤 4: 打开终端
    console.log('步骤 4：打开终端');
    await system.exec('deepin-terminal');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('终端打开成功');

    // 步骤 5: 在终端中粘贴路径
    console.log('步骤 5：在终端中粘贴路径');
    await device.pressKey('Ctrl', 'Shift', 'V');

    // 预期 5: 终端显示完整的路径
    console.log('预期 5：终端显示完整的路径');
    await agent.aiAssert(`终端显示${full_path}, 中间可能换行显示`);

  }, { timeout: 600000, tags: ['1807433', 'level3', 'DITT', 'youwei', 'property', 'long-path', 'ellipsis', 'display', 'file'] });

  test('1807433-属性复制-属性字段最长支持5行_查看超长路径属性_回收站', async ({ device, agent, uos, system }) => {   

    // 步骤 1: 删除测试文件到回收站
    console.log('步骤 1：删除测试文件到回收站');
    let isSelected = await agent.aiBoolean(`文件管理器中的${test_file}文件图标倍选中`);
    if (!isSelected) {
      await agent.aiTap(`文件管理器中的${test_file}文件图标`);
    }
    await device.pressKey('Delete');
    await agent.aiWaitFor(`文件夹右侧内容窗口没有${test_file}文件图标`);

    // 步骤 2: 打开回收站
    console.log('步骤 2：打开回收站');
    await agent.aiTap('文件管理器侧边栏中的回收站');
    await agent.aiWaitFor('回收站内容已加载');

    // 步骤 3: 打开属性窗口
    console.log('步骤 3：打开属性窗口');
    await agent.aiTap(`回收站中的${test_file}文件图标`);
    await device.pressKey('Ctrl', 'I');
    await agent.aiWaitFor(`${test_file}属性窗口打开成功`);

    // 预期 3: 属性窗口中原始路径字段为5行，中间有省略号
    console.log('预期 3：属性窗口中原始路径字段为5行，中间有省略号');
    await agent.aiAssert(`${test_file}属性窗口中原始路径字段分为5行显示，中间有省略号`);

  }, { timeout: 600000, tags: ['1807433', 'level3', 'DITT', 'youwei', 'property', 'long-path', 'ellipsis', 'display', 'recycle file'] });

});
