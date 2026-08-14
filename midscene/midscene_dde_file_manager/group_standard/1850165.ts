/**
 * 用例 PMSID: 1850165
 * 用例标题: 文件不同程序打开方式
 * 生成时间: 2026-02-09 16:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850165-文件不同程序打开方式', () => {
  // 测试相关变量定义
  const test_dir = "~/Videos/testdir";
  const test_file = "desktop.jpg";
  const source_dir = "/usr/share/wallpapers/deepin/";
  let file_type = '';
  let current_app = '';
  const default_app = 'deepin-image-viewer.desktop';
  const default_app_name = '看图';

  const user_config = "~/.config/mimeapps.list";
  const system_config = "/usr/share/applications/mimeapps.list";


  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 获取测试文件当前打开方式
    let result = await system.exec(`file --mime-type ${source_dir}${test_file} | cut -d ":" -f 2`);
    await agent.aiAssert(`${result.success}等于true, 表示获取测试文件当前打开方式成功`);
    file_type = result.stdout.trim();
    result = await system.exec(`xdg-mime query default ${file_type}`);
    if (result.success) {
      console.log(`测试文件当前打开方式为: ${result.stdout}`);
      current_app = result.stdout.trim();
    } else {
      console.log('获取测试文件当前打开方式失败, 直接查询mime配置文件');
      result = await system.exec(`test -f ${user_config} && grep ${file_type} ${user_config} | head -n 1 | cut -d "=" -f 2 | cut -d ";" -f 1 || grep ${file_type} ${system_config} | head -n 1 | cut -d "=" -f 2 | cut -d ";" -f 1`);
      console.log(`测试文件当前打开方式为: ${result.stdout}`);
      current_app = result.stdout.trim();
    };

    // 备份当前mime配置文件
    console.log('备份当前mime配置文件');
    await system.exec(`test -f ${user_config} && mv -v ${user_config} ${user_config}.bak`);

    // await agent.aiAssert(`${current_app}以desktop结尾`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 步骤 1: 创建测试目录${test_dir}
    console.log(`步骤 1: 创建测试目录${test_dir}`);
    await system.exec(`mkdir -pv ${test_dir}`);

    // 步骤 2: 打开${test_dir}目录
    console.log(`步骤 2: 打开${test_dir}目录`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 3: 最大化文件管理器窗口
    console.log('步骤 3: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');

    // 步骤 4: 准备测试文件${test_file}
    console.log(`步骤 4: 准备测试文件${test_file}`);
    await system.exec(`cp -v ${source_dir}${test_file} ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口有${test_file}`);

    // 步骤 6: 设置默认文件打开方式
    console.log('步骤 6: 设置默认文件打开方式');
    await system.exec(`xdg-mime default ${default_app} ${file_type}`);
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 恢复默认文件打开方式
    console.log('恢复默认文件打开方式');
    let result = await system.exec(`xdg-mime default ${default_app} ${file_type}`);
    if (result.success) {
      console.log('恢复默认文件打开方式成功');
    };

    // 清理步骤: 清理用户配置
    console.log('清理用户配置');
    await system.exec(`test -f ${user_config} && rm -v ${user_config}`);

    // 清理步骤: 关闭应用
    console.log('关闭应用');
    result = await system.exec(`ps aux | grep "${test_file}" | grep -v grep | awk '{print $2}' | xargs kill -15`);
    if (result.success) {
      console.log('关闭应用成功');
    } else {
      console.log(`关闭应用失败, 错误信息: ${result.stderr}`);
    }

    // 清理步骤: 清理测试文件和文件夹
    console.log('清理步骤: 清理测试文件和文件夹');
    await system.exec(`test -f ${test_dir}/${test_file} && rm -v ${test_dir}/${test_file} | true`);
    await system.exec(`test -d ${test_dir} && rmdir -v ${test_dir} | true`);

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();

    // 清理步骤: 恢复测试文件当前打开方式
    console.log('恢复测试文件当前打开方式');
    let result = await system.exec(`xdg-mime default ${current_app} ${file_type}`);
    if (result.success) {
      console.log('恢复测试文件当前打开方式成功');
    };
    await system.exec(`test -f ${user_config}.bak && mv -v ${user_config}.bak ${user_config}`);
  });

  test('1850165-文件不同程序打开方式_双击打开', async ({ device, system, agent, uos }) => {
    // 步骤 1: 双击${test_file}
    console.log(`步骤 1: 双击${test_file}`);
    await agent.aiDoubleClick(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor(`文件${test_file}已使用${default_app_name}打开`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期: ${test_file} 使用${default_app_name}打开
    console.log(`预期: ${test_file} 使用${default_app_name}打开`);
    await agent.aiAssert(`文件${test_file}已使用${default_app_name}打开`);

  }, { timeout: 600000, tags: ['1850165', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'open', 'default app', 'double click'] });

  test('1850165-文件不同程序打开方式_右键选择应用打开', async ({ device, system, agent, uos }) => {
    const app = "浏览器";
    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 悬停到打开方式
    console.log('步骤 2: 悬停到打开方式');
    await agent.aiHover('右击菜单中的打开方式');
    await agent.aiWaitFor('打开方式子菜单已展开');

    // 步骤 3: 点击${app}
    console.log(`步骤 3: 点击${app}`);
    await agent.aiTap(`打开方式子菜单中的${app}`);
    await agent.aiWaitFor(`文件${test_file}已使用${app}打开`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期: ${test_file} 使用${app}打开
    console.log(`预期: ${test_file} 使用${app}打开`);
    await agent.aiAssert(`文件${test_file}已使用${app}打开`);

  }, { timeout: 600000, tags: ['1850165', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'open', 'default app', 'right click', 'selected app'] });

  test('1850165-文件不同程序打开方式_修改默认应用后打开', async ({ device, system, agent, uos }) => {
    const app = "浏览器";

    // 步骤 1: 右击${test_file}
    console.log(`步骤 1: 右击${test_file}`);
    await agent.aiRightClick(`右侧窗口中的${test_file}`);
    await agent.aiWaitFor('右击菜单已弹出');

    // 步骤 2: 悬停到打开方式
    console.log('步骤 2: 悬停到打开方式');
    await agent.aiHover('右击菜单中的打开方式');
    await agent.aiWaitFor('打开方式子菜单已展开');

    // 步骤 3: 点击选择默认应用
    console.log('步骤 3: 点击选择默认应用');
    await agent.aiTap('打开方式子菜单中的选择默认应用选项');
    await agent.aiWaitFor('弹出打开方式窗口');

    // 步骤 4: 点击${app}
    console.log(`步骤 4: 点击${app}`);
    await agent.aiTap(`打开方式窗口中的${app}`);
    await agent.aiWaitFor(`${app}已被选中`);

    // 步骤 5: 点击确定按钮
    console.log('步骤 5: 点击确定按钮');
    await agent.aiTap('打开方式窗口中的确定按钮');
    await agent.aiWaitFor(`文件${test_file}已使用${app}打开`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期: ${test_file} 使用${app}打开
    console.log(`预期: ${test_file} 使用${app}打开`);
    await agent.aiAssert(`文件${test_file}已使用${app}打开`);

  }, { timeout: 600000, tags: ['1850165', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'open', 'default app', 'right click', 'modified default app'] });
});
