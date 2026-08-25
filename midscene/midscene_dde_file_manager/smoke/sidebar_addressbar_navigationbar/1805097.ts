/**
 * 用例 PMSID: 1805097
 * 用例标题: 文管历史导航，检查多层级目录路径，新建文件夹_
 * 生成时间: 2025-12-16 19:00:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['测试目录', '一级目录', '二级目录', '三级目录'];

describe('1805097-文管历史导航，检查多层级目录路径，新建文件夹_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
  });

  test('1805097-文管历史导航，检查多层级目录路径，新建文件夹_', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择桌面目录
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证页面已跳转到桌面目录
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 双击打开多层级目录路径
    for (const level of levels) {
      await agent.aiDoubleClick(`文件列表中的${level}文件夹`, { deepThink: true });
      await agent.aiAssert(`文件管理器跳转到${level}目录`);
    }

    // 验证页面已跳转到最深层目录
    await agent.aiAssert('当前目录内容为空')

    // 步骤 4: 最深层目录新建文件夹
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiTap('新建文件夹');
    await agent.aiWaitFor('字符新建文件夹被选中, 且显示在选中框内');
    await device.typeText('测试文件夹', false);
    await agent.aiTap('右侧内容区域空白处');

    // 验证测试文件夹已创建成功
    await agent.aiAssert('界面存在测试文件夹');

  }, { timeout: 600000, tags: ['1805097', 'level2', 'smoke', 'youwei', 'navigation', 'file-manager', 'multi-level folder', 'new folder'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
