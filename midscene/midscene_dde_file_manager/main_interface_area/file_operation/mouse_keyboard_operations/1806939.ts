/**
 * 用例 PMSID: 1806939
 * 用例标题: 选中多个文件后，再取消选中一些
 * 生成时间: 2026-08-27 16:30:30
 * 用例编写人: UT000159（游伟）
 */

describe('1806939-选中多个文件后，再取消选中一些', () => {

  // 测试相关变量定义
  const work_dir = "~/Videos/dir_1806939/";
  const test_file_prefix = "file_";
  const test_file_pre = `${test_file_prefix}1806939_`;
  const suffix = ".txt";
  const test_file_count = 20; // 数量需要大于3
  // const check_file = 'checkfile_1806939.txt';

  beforeAll(async ({ uos, system, device, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 测试前清理测试文件和文件夹, 避免之前测试影响
    // 准备步骤: 删除可能存在的测试文件和测试文件夹
    console.log(`准备步骤 : 清理可能存在的测试文件和测试文件夹`);
    await system.exec(`test -d ${work_dir} && rm -rf ${work_dir} || true`);

    // 准备步骤: 创建测试文件夹, 测试文件和检查文件
    console.log(`准备步骤 : 创建测试文件夹${work_dir}和测试文件(以${test_file_pre}开头的${suffix}文件)`);
    await system.exec(`mkdir -p ${work_dir}`);
    for (let i = 1; i <= test_file_count; i++) {
      await system.exec(`echo testfile${i} > ${work_dir}${test_file_pre}${i}${suffix}`);
    }
    // await system.exec(`echo ${check_file} > ${work_dir}${check_file}${suffix}`);

    // 准备步骤: 打开测试文件夹
    console.log(`准备步骤 : 打开测试文件夹${work_dir}`);
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件管理器打开${work_dir}文件夹成功`);
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');
    await agent.aiWaitFor(`文件管理器窗口内容区域有${test_file_count}个以${test_file_pre}开头的文件`);
    // await agent.aiAssert(`文件管理器窗口内容区域有${check_file}文件`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 释放所有按下的按键
    console.log('准备步骤: 释放所有按下的按键');
    await device.releaseAllKeys();

    // 准备步骤: 清空选中状态
    console.log('准备步骤: 清空选中状态');
    await agent.aiTap("文件管理器窗口内容区域任意空白处");
    await agent.aiWaitFor("没有选中文件管理器窗口内容区域任何文件或文件夹");
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 释放所有按下的按键
    console.log('清理步骤: 释放所有按下的按键');
    await device.releaseAllKeys();

    // 清理步骤: 清空选中状态
    console.log('清理步骤: 清空选中状态');
    await agent.aiTap("文件管理器窗口内容区域任意空白处");
    await agent.aiWaitFor("没有选中文件管理器窗口内容区域任何文件或文件夹");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 删除可能存在的测试文件和测试文件夹
    console.log(`清理步骤 : 清理可能存在的测试文件和测试文件夹`);
    await system.exec(`test -d ${work_dir} && rm -rf ${work_dir} || true`);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    await uos.showDesktop();
  });

  test('1806939-选中多个文件后，再取消选中一些_单选取消', async ({ device, system, agent, uos }) => {
    // 步骤 1: 右键全选所有文件
    console.log('步骤 1: 右键全选所有文件');
    await agent.aiRightClick('文件管理器窗口内容区域任意空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('全选');

    // 预期 1: 所有文件都被选中
    console.log('预期 1: 所有文件都被选中');
    await agent.aiWaitFor(`文件管理器窗口内容区域有${test_file_count}个以${test_file_prefix}开头的文件都被选中`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    const selected_file = test_file_pre + "1" + suffix;
    // 步骤 2: 单选其中一个文件
    console.log('步骤 2: 单选其中一个文件');
    await agent.aiTap(`文件管理器窗口内容区域${selected_file}文件图标`);

    // 预期 2: 只有一个文件被选中
    console.log('预期 2: 只有一个文件被选中');
    await agent.aiWaitFor(`文件管理器窗口内容区域${selected_file}文件被选中`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiAssert(`文件管理器窗口内容区域除${selected_file}文件外的其他${test_file_count - 1}个以${test_file_pre}开头的文件都没有被选中`);
  }, { timeout: 600000, tags: ['1806939', 'level3', 'DITT', 'youwei', 'file-manager', 'select','select all', 'unselect'] });

  test('1806939-选中多个文件后，再取消选中一些_Shift取消', async ({ device, system, agent, uos }) => {
    const check_files = [
      `${test_file_pre}1${suffix}`,
      `${test_file_pre}2${suffix}`,
      `${test_file_pre}3${suffix}`,
      `${test_file_pre}4${suffix}`,
      `${test_file_pre}5${suffix}`
    ];
    const check_files_count = check_files.length - 3;

    // 步骤 1: Shift键选中
    console.log('步骤 1: Shift键选中');
    await device.keyDown('Shift');
    await agent.aiTap(`文件管理器窗口内容区域${check_files[0]}文件图标`);
    await agent.aiTap(`文件管理器窗口内容区域${check_files[check_files.length-1]}文件图标`);
    await device.keyUp('Shift');

    // 预期 1: Shift键选中多个文件
    console.log('预期 1: Shift键选中多个文件');
    await agent.aiWaitFor(`文件管理器窗口内容区域文件${check_files.join(',')}被选中`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 取消选中部分文件
    console.log('步骤 2: 取消选中部分文件');
    await device.keyDown('Shift');
    await agent.aiTap(`文件管理器窗口内容区域${check_files[check_files_count]}文件图标`);
    await device.keyUp('Shift');

    // 预期 2: 取消选中部分文件
    console.log('预期 2: 取消选中部分文件');
    await agent.aiWaitFor(`文件管理器窗口内容区域文件${check_files.slice(0, check_files_count).join(',')}被选中`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );


  }, { timeout: 600000, tags: ['1806939', 'level3', 'DITT', 'youwei', 'file-manager', 'select', 'shift', 'unselect'] });

});
