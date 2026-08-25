/**
 * 用例 PMSID: 1805093
 * 用例标题: 文管历史导航，前进功能_
 * 生成时间: 2025-12-16 18:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1805093-文管历史导航，前进功能_', () => {
  const test_folder = "测试目录";
  const new_folder = "新建文件夹";
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 删除可能存在的测试目录
    await system.exec(`test -d ~/Desktop/${test_folder} && rm -rf ~/Desktop/${test_folder} || true`);
    await system.exec(`test -d ~/Desktop/${new_folder} && rm -rf ~/Desktop/${new_folder} || true`);
  });

  test('1805093-文管历史导航，前进功能_', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择桌面目录
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证页面已跳转到桌面目录
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 在桌面新建文件夹
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiTap('新建文件夹');
    await agent.aiWaitFor('有一个矩形框, 里边新建文件夹或者新建文件夹+数字被选中');
    await device.typeText(test_folder, false);
    await agent.aiTap('右侧内容区域空白处');

    // 验证${test_folder}已创建成功
    await agent.aiAssert(`界面存在${test_folder}`);

    // 步骤 4: 进入新建的${test_folder}
    await agent.aiDoubleClick(`文件列表中的${test_folder}文件夹图标`, { deepThink: true });
    await agent.aiWaitFor(`文件管理器跳转到${test_folder}`);

    // 步骤 5: 侧边栏点击桌面目录
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 步骤 6: 使用导航栏后退按钮
    await agent.aiTap('导航栏中的后退按钮');
    await agent.aiAssert(`当前目录为${test_folder}`);

    // 步骤 7: 使用导航栏前进按钮
    await agent.aiTap('导航栏中的前进按钮');
    await agent.aiAssert('当前目录为桌面目录');

    // 验证测试文件夹已创建成功
    // await agent.aiAssert('界面存在测试文件夹');

  }, { timeout: 600000, tags: ['1805093', 'level2', 'smoke', 'youwei', 'navigation', 'file-manager', 'forward', 'backward'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`test -d ~/Desktop/${test_folder} && rm -rf ~/Desktop/${test_folder} || true`);
    await system.exec(`test -d ~/Desktop/${new_folder} && rm -rf ~/Desktop/${new_folder} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
    await system.exec("killall dde-file-manager");
  });
});
