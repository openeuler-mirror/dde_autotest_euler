/**
 * 用例 PMSID: 1891067
 * 用例标题: sh脚本权限为给647时，普通用户执行
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1891067-sh脚本权限为给647时，普通用户执行', () => {
  let work_dir = "~/Desktop/";
  let test_file = "root.sh";
  let excepted_file = "testfile_1891067.txt";
  let permission = "647";
  let shell_content = `#!/bin/bash\necho \'hello world\' > ${work_dir}${excepted_file}`;
  let excepted_content = "hello world";

  async function clean(system, device, env) {
    // 清理测试文件${test_file}和预期文件${excepted_file}
    console.log(`清理测试文件${test_file}和预期文件${excepted_file}`);
    await system.exec(`test -f ${work_dir}${test_file} && echo ${env.testPassword} | sudo -S rm -v ${work_dir}${test_file} || true`);
    await system.exec(`test -f ${work_dir}${excepted_file} && echo ${env.testPassword} | sudo -S rm -v ${work_dir}${excepted_file} || true`);

    // 按esc键退出可能的对话框
    console.log('按esc键退出可能的对话框');
    await device.pressKey('Esc');
  }

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

  beforeEach(async ({ device, agent, system, env}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理测试相关文件, 避免干扰测试
    await clean(system, device, env);
  });

  afterEach(async ({ device, agent, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试相关文件
    await clean(system, device, env);
  });

  test('1891067-sh脚本权限为给647时，普通用户执行', async ({ device, agent, uos, system, env }) => {
    // 步骤 1: 创建shell脚本文件${test_file}，内容为${shell_content}
    console.log(`步骤 1: 创建shell脚本文件${test_file}, 内容为${shell_content}`);
    await system.exec(`echo "${shell_content}" > ${work_dir}${test_file}`);

    // 预期 1: 桌面上有文件${test_file}图标
    console.log(`预期 1: 桌面上有文件${test_file}图标`);
    await agent.aiAssert(`桌面上有文件${test_file}图标`);

    // 步骤 2: 设置文件${test_file}所属者为root, 权限为${permission}
    console.log(`步骤 2: 设置文件${test_file}所属者为root, 设置文件${test_file}权限为${permission}`);
    await system.exec(`echo ${env.testPassword} | sudo -S chown root:root ${work_dir}${test_file}`);
    await system.exec(`echo ${env.testPassword} | sudo -S chmod ${permission} ${work_dir}${test_file}`);

    // 预期 2: 文件${test_file}所属者为root, 权限为${permission}
    console.log('预期 2: 文件' + test_file + '所属者为root, 权限为' + permission);
    let cmd = `stat -c "%U %G %a" ${work_dir}${test_file}`;
    let result = await system.exec(cmd);
    assertTrue(result.success, `命令执行失败, 命令为${cmd}`);
    assertTrue(result.stdout.trim() === `root root ${permission}`, `文件${test_file}所属者不为root或者权限不为${permission}`);

    // 步骤 3: 双击文件${test_file}图标
    console.log(`步骤 3: 双击文件${test_file}图标`);
    await agent.aiDoubleClick(`桌面上的${test_file}图标`);

    // 预期 3: 有包含取消, 运行, 显示按钮的对话框弹出
    console.log('预期 3: 有包含取消, 运行, 显示按钮的对话框弹出');
    await agent.aiAssert('有包含取消, 运行, 显示按钮的对话框弹出');

    // 步骤 4: 点击运行按钮
    console.log('步骤 4: 点击运行按钮');
    await agent.aiTap('运行');

    // 预期 4-1: 桌面有文件${excepted_file}图标
    console.log(`预期 4: 桌面有文件${excepted_file}图标`);
    await agent.aiAssert(`桌面有文件${excepted_file}图标`);

    // 预期 4-2: 文件${excepted_file}内容为${excepted_content}
    console.log(`预期 4: 文件${excepted_file}内容为${excepted_content}`);
    cmd = `cat ${work_dir}${excepted_file}`;
    result = await system.exec(cmd);
    assertTrue(result.success, `命令执行失败, 命令为${cmd}`);
    assertTrue(result.stdout.trim() === excepted_content, `文件${excepted_file}内容不为${excepted_content}`);

  }, { timeout: 600000, tags: ['1891067', 'level3', 'permission', 'DITT', 'youwei', 'root', 'shell script', '647', 'file manager'] });
});
