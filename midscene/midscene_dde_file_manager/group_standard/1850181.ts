/**
 * 用例 PMSID: 1850181
 * 用例标题: 回收站清空、回收站删除
 * 生成时间: 2026-02-10 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850181-回收站清空、回收站删除', () => {

  // 测试相关变量定义
  const test_file = "testfile.txt";
  const test_dir = "testdir";

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 准备步骤: 清空回收站
    console.log('准备步骤: 清空回收站');
    await system.exec('gio trash --empty');

    // 准备步骤: 创建测试文件${test_file}和测试目录${test_dir}
    console.log(`准备步骤: 创建测试文件${test_file}和测试目录${test_dir}`);
    await system.exec(`touch ~/Desktop/${test_file}`);
    await system.exec(`mkdir -pv ~/Desktop/${test_dir}`);

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 删除测试文件${test_file}和文件夹${test_dir}
    console.log(`清理步骤 : 清理测试文件${test_file}和文件夹${test_dir}`);
    await system.exec(`test -f ~/Desktop/${test_file} && rm -v ~/Desktop/${test_file}`);
    await system.exec(`test -d ~/Desktop/${test_dir} && rm -rf -v ~/Desktop/${test_dir}`);

    // 清理步骤: 清空回收站
    console.log('清理步骤 : 清空回收站');
    await system.exec('gio trash --empty');

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 清理步骤: 恢复桌面
    console.log('清理步骤: 恢复桌面');
    await uos.showDesktop();
  });

  test('1850181-回收站清空、回收站删除', async ({ device, system, agent, uos }) => {
    // 预期 0: 直接检查桌面是否有回收站图标
    console.log('预期 0: 直接检查桌面是否有回收站图标');
    await agent.aiAssert('桌面上有回收站图标');

    // 步骤 1: 选中测试文件${test_file}, 右击删除
    console.log(`步骤 1: 选中测试文件${test_file}, 右击删除`);
    await agent.aiRightClick(`右侧窗口中的${test_file}`);
    await agent.aiTap('右击菜单中的删除');
    await agent.aiWaitFor(`桌面上没有${test_file}文件`);

    // 步骤 2: 选中测试文件夹${test_dir}, 右击删除
    console.log(`步骤 2: 选中测试文件夹${test_dir}, 右击删除`);
    await agent.aiRightClick(`右侧窗口中的${test_dir}`);
    await agent.aiTap('右击菜单中的删除');
    await agent.aiWaitFor(`桌面上没有${test_dir}文件夹`);

    // 步骤 3: 双击回收站图标并最大化回收站窗口
    console.log('步骤 3: 双击回收站图标');
    await agent.aiDoubleClick('回收站图标');
    await agent.aiWaitFor('回收站已打开');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('桌面上只有任务栏和文件管理器窗口');

    // 预期 3: 回收站中有${test_file}和${test_dir}
    console.log(`预期 3: 回收站中有${test_file}和${test_dir}`);
    await agent.aiAssert(`回收站中有${test_file}`);
    await agent.aiAssert(`回收站中有${test_dir}`);

    // 步骤 4: 选中测试文件${test_file}, 右击删除
    console.log(`步骤 4: 选中测试文件${test_file}, 右击删除`);
    await agent.aiRightClick(`右侧窗口中的${test_file}`);
    await agent.aiTap('右击菜单中的删除');
    await agent.aiWaitFor('有删除确认弹窗');
    await agent.aiTap('删除确认弹窗中的删除按钮');

    // 预期 4: 回收站中没有${test_file}
    console.log(`预期 4: 回收站中没有${test_file}`);
    await agent.aiAssert(`回收站中没有${test_file}`);

    // 步骤 5: 关闭回收站窗口
    console.log('步骤 5: 关闭回收站窗口');
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 预期 5: 显示桌面并且桌面上有回收站图标
    console.log('预期 5: 显示桌面');
    await agent.aiAssert('当前窗口有桌面和任务栏');
    await agent.aiAssert('桌面上有回收站图标');

    // 步骤 6: 右击回收站图标点击清空回收站
    console.log('步骤 6: 右击回收站图标点击清空回收站');
    await agent.aiRightClick('回收站图标');
    await agent.aiTap('右击菜单中的清空回收站');
    await agent.aiWaitFor('有清空确认弹窗');
    await agent.aiTap('删除确认弹窗中的清空按钮');

    // 步骤 7: 打开回收站窗口
    console.log('步骤 7: 打开回收站窗口');
    await agent.aiDoubleClick('回收站图标');
    await agent.aiWaitFor('回收站已打开');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('桌面上只有任务栏和文件管理器窗口');

    // 预期 7: 回收站已清空
    console.log('预期 7: 回收站已清空');
    await agent.aiAssert('回收站右侧没有文件和文件夹');

    // 步骤 8: 关闭回收站窗口
    console.log('步骤 8: 关闭回收站窗口');
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  }, { timeout: 600000, tags: ['1850181', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'trash', 'clear', 'delete'] });
});
