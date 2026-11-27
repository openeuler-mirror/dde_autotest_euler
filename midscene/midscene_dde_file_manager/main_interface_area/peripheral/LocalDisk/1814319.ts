/**
 * 用例 PMSID: 1814319
 * 用例标题: 【本地磁盘】盘符展示-挂载磁盘容量进度条颜色检查
 * 生成时间: 2026-10-22 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1814319-【本地磁盘】盘符展示-挂载磁盘容量进度条颜色检查', () => {

  const work_dir = "/work_dir";
  const test_file = `${work_dir}/test_file`;

  const vol = "系统盘";

  const PASSWORD = process.env.TEST_PASSWORD;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤1：初始化测试环境 ===');

    // 准备步骤: 点击桌面空白处, 关闭可能打开的启动器
    console.log('准备步骤：点击桌面空白处，关闭可能打开的启动器');
    await agent.aiTap('桌面空白处');

    // 准备步骤：关闭可能残留的文件管理器窗口
    console.log('准备步骤：关闭可能残留的文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤：创建测试文件夹');
    await system.exec(`echo ${PASSWORD} | sudo -S mkdir -p "${work_dir}"`);

  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤2：每个测试前的准备 ===');

    // 准备步骤：本用例为只读视觉检查，无需额外准备
    console.log('准备步骤：本用例为只读视觉检查，无需额外准备');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤4：每个测试后的清理 ===');

    // 清理步骤: 删除测试文件
    console.log('清理步骤：删除测试文件');
    await system.exec(`test -f "${test_file}" && echo ${PASSWORD} | sudo -S rm -rf "${test_file}" || true`, 60000);

    // 清理步骤: 关闭可能打开的文件管理器窗口
    console.log('清理步骤：关闭可能打开的文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

    // // 清理步骤：关闭可能打开的属性或提示窗口
    // console.log('清理步骤：关闭可能打开的属性或提示窗口');
    // await device.pressKey('Escape');
  });

  afterAll(async ({ device, agent, uos, system }) => {
    console.log('=== 步骤5：清理测试套件 ===');

    // 清理步骤: 删除测试文件夹
    console.log('清理步骤：删除测试文件夹');
    await system.exec(`test -d "${work_dir}" && echo ${PASSWORD} | sudo -S rm -rf "${work_dir}" || true`, 60000);

    // 清理步骤：关闭文件管理器窗口
    console.log('清理步骤：关闭文件管理器窗口');
    await system.exec('killall -15 dde-file-manager || true');

    // 清理步骤：回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  test('1814319-【本地磁盘】盘符展示-挂载磁盘容量进度条颜色检查_<70%', async ({ device, agent, uos, system }) => {

    // 步骤 1：获取当前磁盘空间占用
    console.log('步骤 1：获取当前磁盘空间占用');
    const usage_res = await system.exec("df -h / | tail -1 | awk '{print $5}' | tr -d '%'");
    const usage = parseInt(String(usage_res.stdout ?? usage_res).trim(), 10);
    console.log(`当前根分区占用: ${usage}%`);

    // 预期 1: 磁盘空间占用小于70%
    console.log('预期 1-1：磁盘空间占用小于70%');
    assertTrue(usage < 70, '磁盘空间占用小于70%');

    // 步骤 2: 打开文件管理器并定位到计算机视图
    console.log('步骤 2：打开文件管理器并定位到计算机视图');
    await system.exec('dde-file-manager computer:///');
    await agent.aiWaitFor('文件管理器计算机视图已打开');

    // 预期 2：文件管理器计算机视图已打开，显示本地磁盘及容量进度条
    console.log('预期 2：文件管理器计算机视图中本地磁盘的容量进度条显示为蓝色');
    await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为蓝色`);

  }, { timeout: 600000, tags: ['1814319', 'level2', 'DITT', 'youwei', 'local_disk', 'capacity', 'progress_bar', '<70%'] });

  test('1814319-【本地磁盘】盘符展示-挂载磁盘容量进度条颜色检查_70%~90%', async ({ device, agent, uos, system }) => {

    // 步骤 1：获取当前磁盘空间占用
    console.log('步骤 1：获取当前磁盘空间占用');
    const usage_res = await system.exec("df -h / | tail -1 | awk '{print $5}' | tr -d '%'");
    const used_res = await system.exec("df -h / | tail -1 | awk '{print $3}' | tr -d 'G'");
    const total_res = await system.exec("df -h / | tail -1 | awk '{print $2}' | tr -d 'G'");
    const usage = parseInt(String(usage_res.stdout ?? usage_res).trim(), 10);
    const used = parseInt(String(used_res.stdout ?? used_res).trim(), 10);
    const total = parseInt(String(total_res.stdout ?? total_res).trim(), 10);
    console.log(`当前根分区占用: ${usage}%`);
    console.log(`当前根分区已使用: ${used}G`);
    console.log(`当前根分区总容量: ${total}G`);

    // 预期 1: 磁盘空间占用小于70%
    console.log('预期 1-1：磁盘空间占用小于70%');
    assertTrue(usage < 70, '磁盘空间占用小于70%');

    // 步骤 2: 创建测试文件使得${vol}空间占用大于70%小于90%
    console.log(`步骤 2：创建测试文件使得${vol}空间占用大于70%小于90%`);
    let test_file_size = Math.ceil(1024 * 1024 * (total * 80 / 100 - used));
    await system.exec(`echo ${PASSWORD} | sudo -S fallocate -l ${test_file_size}K ${test_file}`, 60000);

    // 步骤 3: 打开文件管理器并定位到计算机视图
    console.log('步骤 3：打开文件管理器并定位到计算机视图');
    await system.exec('dde-file-manager computer:///');
    await agent.aiWaitFor('文件管理器计算机视图已打开');

    // 预期 3：文件管理器计算机视图已打开，显示本地磁盘及容量进度条
    console.log('预期 3：文件管理器计算机视图中本地磁盘的容量进度条显示为黄色');
    await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为黄色`);

  }, { timeout: 600000, tags: ['1814319', 'level2', 'DITT', 'youwei', 'local_disk', 'capacity', 'progress_bar', '70%~90%'] });

  test('1814319-【本地磁盘】盘符展示-挂载磁盘容量进度条颜色检查_>90%', async ({ device, agent, uos, system }) => {

    // 步骤 1：获取当前磁盘空间占用
    console.log('步骤 1：获取当前磁盘空间占用');
    const usage_res = await system.exec("df -h / | tail -1 | awk '{print $5}' | tr -d '%'");
    const used_res = await system.exec("df -h / | tail -1 | awk '{print $3}' | tr -d 'G'");
    const total_res = await system.exec("df -h / | tail -1 | awk '{print $2}' | tr -d 'G'");
    const usage = parseInt(String(usage_res.stdout ?? usage_res).trim(), 10);
    const used = parseInt(String(used_res.stdout ?? used_res).trim(), 10);
    const total = parseInt(String(total_res.stdout ?? total_res).trim(), 10);
    console.log(`当前根分区占用: ${usage}%`);
    console.log(`当前根分区已使用: ${used}G`);
    console.log(`当前根分区总容量: ${total}G`);

    // 预期 1: 磁盘空间占用小于70%
    console.log('预期 1-1：磁盘空间占用小于70%');
    assertTrue(usage < 70, '磁盘空间占用小于70%');

    // 步骤 2: 创建测试文件使得${vol}空间占用大于70%小于90%
    console.log(`步骤 2：创建测试文件使得${vol}空间占用大于70%小于90%`);
    let test_file_size = Math.ceil(1024 * 1024 * (total * 90 / 100 - used));
    await system.exec(`echo ${PASSWORD} | sudo -S fallocate -l ${test_file_size}K ${test_file}`, 60000);

    // 步骤 3: 打开文件管理器并定位到计算机视图
    console.log('步骤 3：打开文件管理器并定位到计算机视图');
    await system.exec('dde-file-manager computer:///');
    await agent.aiWaitFor('文件管理器计算机视图已打开');

    // 预期 3：文件管理器计算机视图已打开，显示本地磁盘及容量进度条
    console.log('预期 3：文件管理器计算机视图中本地磁盘的容量进度条显示为红色');
    await agent.aiAssert(`文件管理器计算机视图中${vol}的容量进度条显示为红色`);

  }, { timeout: 600000, tags: ['1814319', 'level2', 'DITT', 'youwei', 'local_disk', 'capacity', 'progress_bar', '90%'] });
});
