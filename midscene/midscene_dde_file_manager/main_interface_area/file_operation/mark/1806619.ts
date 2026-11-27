/**
 * 用例 PMSID: 1806619
 * 用例标题: 角标设置-桌面文件/文件夹反复设置角标，桌面/文管不崩溃
 * 生成时间: 2026-08-25 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806619-角标设置-桌面文件/文件夹反复设置角标，桌面/文管不崩溃', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const PASSWD = process.env.TEST_PASSWORD;
  const CASEDIR = process.env.TESTCASE_DIR;

  const desktop_path = `/home/${USERNAME}/Desktop`;
  const picture_path = `/home/${USERNAME}/Pictures`;
  const test_file_name = 'test_emblem_file.txt';
  const test_folder_name = 'test_emblem_folder';
  const test_pic_name = 'test_pic.jpg';
  const test_pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file_path = `${desktop_path}/${test_file_name}`;
  const test_folder_path = `${desktop_path}/${test_folder_name}`;
  const test_pic_path = `${picture_path}/${test_pic_name}`;

  // 角标位置列表: lu(左上), ld(左下), ru(右上), rd(右下)
  const positions = ['lu', 'ld', 'ru', 'rd'];
  // 循环设置角标的次数
  const loop_count = 5;

  let crash_count = 0; // 记录崩溃次数

  async function getCrashCount(system, assertTrue) {
    let result = await system.exec(`echo ${PASSWD} | sudo -S coredumpctl list 2>/dev/null | grep -c dde-file-manager`);
    assertTrue(result.success || result.stdout.trim() === '0', '获取崩溃次数失败');
    let crash_count = Number(result.stdout.trim());
    result = await system.exec("ps -eww -o pid,args | grep -v grep | grep dde-shell | grep desktop | awk '{print $1}'");
    assertTrue(result.success, '获取桌面PID失败');
    let desktop_pids = result.stdout.split('\n').map(line => line.trim()).filter(Boolean);
    for (let desktop_pid of desktop_pids) {
      result = await system.exec(`echo ${PASSWD} | sudo -S coredumpctl list 2>/dev/null | grep -c " ${desktop_pid} "`);
      assertTrue(result.success || result.stdout.trim() === '0', '获取桌面崩溃次数失败');
      crash_count += Number(result.stdout.trim());
    }
    return crash_count;
  }

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 准备步骤: 清理可能存在的测试数据
    console.log('准备步骤：清理可能存在的测试数据');
    await system.exec(`test -f ${test_file_path} && rm -f ${test_file_path} || true`);
    await system.exec(`test -d ${test_folder_path} && rm -rf ${test_folder_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm -f ${test_pic_path} || true`);

    // 准备步骤: 创建测试图标文件(SVG格式, <=100kb)
    console.log('准备步骤：创建测试图标文件');
    await system.exec(`cp ${test_pic_url} ${test_pic_path}`);

    // 准备步骤: 创建测试文件
    console.log('准备步骤：创建测试文件');
    await system.exec(`echo "Test content for emblem" > ${test_file_path}`);

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤：创建测试文件夹');
    await system.exec(`mkdir -p ${test_folder_path}`);

    // 准备步骤: 清理可能存在的角标(防止干扰测试)
    console.log('准备步骤：清理可能存在的角标');
    await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems ""`);
    await system.exec(`gio set "${test_folder_path}" -t stringv metadata::emblems ""`);

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理可能存在的角标
    console.log('准备步骤：清理可能存在的角标');
    await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems ""`);
    await system.exec(`gio set "${test_folder_path}" -t stringv metadata::emblems ""`);

    // 准备步骤: 关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤: 获取当前崩溃次数
    console.log('准备步骤：获取当前崩溃次数');
    crash_count = await getCrashCount(system, assertTrue);

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 移除角标
    console.log('清理步骤：移除角标');
    await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems ""`);
    await system.exec(`gio set "${test_folder_path}" -t stringv metadata::emblems ""`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 清理测试数据
    console.log('清理步骤：清理测试数据');
    await system.exec(`test -f ${test_file_path} && rm -f ${test_file_path} || true`);
    await system.exec(`test -d ${test_folder_path} && rm -rf ${test_folder_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm -f ${test_pic_path} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  /**
   * 测试用例1: 反复给桌面文件设置角标 - 桌面无崩溃
   * 在终端反复给桌面同一文件设置角标（切换上下左右位置）
   * 预期：角标设置成功，桌面无崩溃
   */
  test('1806619-角标设置-桌面文件/文件夹反复设置角标，桌面/文管不崩溃_桌面文件', async ({ device, agent, uos, system }) => {
    // 步骤 1: 循环设置角标(lu, ld, ru, rd各设置loop_count次)
    console.log(`步骤 1：循环设置角标(每个位置${loop_count}次)`);
    for (let i = 0; i < loop_count; i++) {
      for (const position of positions) {
        const emblemValue = `${test_pic_path};${position}`;
        console.log(`  第${i * positions.length + positions.indexOf(position) + 1}次: 设置角标位置=${position}`);
        await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems "${emblemValue}"`);
        await device.pressKey('F5');
        await system.exec('sleep 0.3');
      }
    }

    // 预期 1-1: 验证桌面文件角标设置成功
    console.log('预期 1-1：验证桌面文件角标设置成功');
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件${test_file_name}图标右下角有缩小的绿色图标, 内容是龙猫`);

    // 预期 1-2: 桌面环境无崩溃
    console.log('预期: 桌面环境无崩溃');
    let currentCrashCount = await getCrashCount(system, assertTrue);
    assertFalse(currentCrashCount > crash_count, '桌面环境有崩溃过');

  }, { timeout: 600000, tags: ['1806619', 'level3', 'DITT', 'youwei', 'emblem', 'desktop', 'file', 'crash'] });

  /**
   * 测试用例2: 反复给桌面文件夹设置角标 - 桌面无崩溃
   * 在终端反复给桌面同一文件夹设置角标（切换上下左右位置）
   * 预期：角标设置成功，桌面无崩溃
   */
  test('1806619-角标设置-桌面文件夹反复设置角标，桌面/文管不崩溃_桌面文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 验证桌面存在测试文件夹
    console.log('步骤 1：验证桌面存在测试文件夹');
    await agent.aiWaitFor(`桌面显示${test_folder_name}文件夹`);

    // 步骤 2: 循环设置角标(lu, ld, ru, rd各设置loop_count次)
    console.log(`步骤 2：循环设置角标(每个位置${loop_count}次)`);
    for (let i = 0; i < loop_count; i++) {
      for (const position of positions) {
        const emblemValue = `${test_pic_path};${position}`;
        console.log(`  第${i * positions.length + positions.indexOf(position) + 1}次: 设置角标位置=${position}`);
        await system.exec(`gio set "${test_folder_path}" -t stringv metadata::emblems "${emblemValue}"`);
        await device.pressKey('F5');
        await system.exec('sleep 0.3');
      }
    }

    // 步骤 3: 验证桌面文件夹角标设置成功
    console.log('步骤 3：验证桌面文件夹角标设置成功');
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件${test_folder_name}图标右下角有缩小的绿色图标, 内容是龙猫`);

    // 预期: 桌面环境无崩溃
    console.log('预期: 桌面环境无崩溃');
    let currentCrashCount = await getCrashCount(system, assertTrue);
    assertFalse(currentCrashCount > crash_count, '桌面环境有崩溃过');
  }, { timeout: 600000, tags: ['1806619', 'level3', 'DITT', 'youwei', 'emblem', 'desktop', 'folder', 'crash'] });

  /**
   * 测试用例3: 打开文件所在目录，反复给文件设置角标 - 文管无崩溃
   * 打开被设置文件所在目录，在终端反复给桌面同一文件设置角标
   * 预期：角标设置成功，文管无崩溃
   */
  test('1806619-角标设置-桌面文件/文件夹反复设置角标，桌面/文管不崩溃_文件', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开桌面文件夹(文件所在目录)
    console.log('步骤 1：打开桌面文件夹');
    await system.exec(`dde-file-manager ${desktop_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹桌面打开成功`);

    // 预期 1: 验证文件存在
    console.log('预期 1：验证文件存在');
    await agent.aiWaitFor(`忽略文件名中的空格, 文件管理器右侧内容窗口有${test_file_name}文件图标`);

    // 步骤 2: 循环设置角标(lu, ld, ru, rd各设置loop_count次)
    console.log(`步骤 2：循环设置角标(每个位置${loop_count}次)`);
    for (let i = 0; i < loop_count; i++) {
      for (const position of positions) {
        const emblemValue = `${test_pic_path};${position}`;
        console.log(`  第${i * positions.length + positions.indexOf(position) + 1}次: 设置角标位置=${position}`);
        await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems "${emblemValue}"`);
        await device.pressKey('F5');
        await system.exec('sleep 0.3');
      }
    }

    // 步骤 3: 验证文管中文件角标设置成功
    console.log('步骤 3：验证文管中文件角标设置成功');
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件${test_file_name}图标右下角有缩小的绿色图标, 内容是龙猫`);

    // 预期 3: 文件管理器无崩溃
    console.log('预期 3：文件管理器无崩溃');
    let currentCrashCount = await getCrashCount(system, assertTrue);
    assertFalse(currentCrashCount > crash_count, '文件管理器有崩溃过');
  }, { timeout: 600000, tags: ['1806619', 'level3', 'DITT', 'youwei', 'emblem', 'file manager', 'file', 'crash'] });

  /**
   * 测试用例4: 打开文件夹所在目录，反复给文件夹设置角标 - 文管无崩溃
   * 打开被设置文件夹所在目录，在终端反复给桌面同一文件夹设置角标
   * 预期：角标设置成功，文管无崩溃
   */
  test('1806619-角标设置-桌面文件/文件夹反复设置角标，桌面/文管不崩溃_文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开桌面文件夹(文件夹所在目录)
    console.log('步骤 1：打开桌面文件夹');
    await system.exec(`dde-file-manager ${desktop_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹桌面打开成功`);

    // 预期 1: 验证文件夹存在
    console.log('预期 1：验证文件夹存在');
    await agent.aiWaitFor(`文件管理器右侧内容窗口有${test_folder_name}文件夹图标`); 

    // 步骤 2: 循环设置角标(lu, ld, ru, rd各设置loop_count次)
    console.log(`步骤 2：循环设置角标(每个位置${loop_count}次)`);
    for (let i = 0; i < loop_count; i++) {
      for (const position of positions) {
        const emblemValue = `${test_pic_path};${position}`;
        console.log(`  第${i * positions.length + positions.indexOf(position) + 1}次: 设置角标位置=${position}`);
        await system.exec(`gio set "${test_folder_path}" -t stringv metadata::emblems "${emblemValue}"`);
        await device.pressKey('F5');
        await system.exec('sleep 0.3');
      }
    }

    // 步骤 3: 验证文管中文件夹角标设置成功
    console.log('步骤 3：验证文管中文件夹角标设置成功');
    await device.pressKey('F5');
    await agent.aiWaitFor(`文件夹${test_folder_name}图标右下角有缩小的绿色图标, 内容是龙猫`);

    // 预期 3: 文件管理器无崩溃
    console.log('预期 3: 文件管理器无崩溃');
    let currentCrashCount = await getCrashCount(system, assertTrue);
    assertFalse(currentCrashCount > crash_count, '文件管理器有崩溃过');
  }, { timeout: 600000, tags: ['1806619', 'level3', 'DITT', 'youwei', 'emblem', 'file manager', 'folder', 'crash'] });
});
