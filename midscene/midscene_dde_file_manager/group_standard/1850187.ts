/**
 * 用例 PMSID: 1850187
 * 用例标题: 支持文件图标的拖拽摆放以及名称修改
 * 生成时间: 2026-02-28 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850187-支持文件图标的拖拽摆放以及名称修改', () => {

  // 测试相关变量定义
  const test_file_name = "testfile";
  const suffix = ".txt";
  const test_file = test_file_name + suffix;
  const modified_file_name = "modified";
  const modified_file = modified_file_name + suffix;

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件${test_file}
    console.log(`准备步骤: 创建测试文件${test_file}`);
    await system.exec(`touch ~/Desktop/${test_file}`);
    await agent.aiWaitFor(`桌面上有${test_file}文件`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试文件${test_file}和修改后文件${modified_file}
    console.log(`清理步骤 : 清理测试文件${test_file}和修改后文件${modified_file}`);
    await system.exec(`test -f ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
    await system.exec(`test -f ~/Desktop/${modified_file} && rm -v ~/Desktop/${modified_file}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await agent.aiTap('屏幕右上角');
    await agent.aiTap('屏幕中间上方位置');
  });

  test('1850187-支持文件图标的拖拽摆放以及名称修改_拖拽摆放', async ({ device, system, agent, uos }) => {
    const destination = '桌面右上角';
    // 步骤 1: 拖拽文件${test_file}到${destination}
    console.log(`步骤 1: 拖拽文件${test_file}到${destination}`);
    await agent.aiDrag(`桌面上的${test_file}文件`, destination);

    // 预期 1: 文件${test_file}移动到${destination}
    console.log(`预期 1: 文件${test_file}移动到${destination}`);
    await agent.aiWaitFor(`文件${test_file}移动到${destination}`);

  }, { timeout: 600000, tags: ['1850187', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'desktop', 'drap'] });

  test('1850187-支持文件图标的拖拽摆放以及名称修改_名称修改', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右击测试文件${test_file}, 选择“重命名”
    console.log(`步骤 1: 右击测试文件${test_file}, 选择“重命名”`);
    await agent.aiRightClick(`桌面上的${test_file}文件`);
    await agent.aiWaitFor('右击菜单已弹出');
    await agent.aiTap('右击菜单中的重命名');

    // 步骤 2: 删除所有字符, 输入${modified_file_name}
    console.log(`步骤 2: 删除所有字符, 输入${modified_file_name}`);
    await device.pressKey('Backspace');
    await device.typeText(modified_file_name, true);

    // 预期 2: 桌面上有${modified_file}文件, 没有${test_file}文件
    console.log(`预期 2: 桌面上有${modified_file}文件, 没有${test_file}文件`);
    await agent.aiAssert(`桌面上有${modified_file}文件`);
    await agent.aiAssert(`桌面上没有${test_file}文件`);

  }, { timeout: 600000, tags: ['1850187', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'desktop', 'rename'] });
});
