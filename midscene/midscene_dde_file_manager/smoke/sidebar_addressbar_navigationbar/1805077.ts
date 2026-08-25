/**
 * 用例 PMSID: 1805077
 * 用例标题: 【历史导航】历史导航-面包屑右键菜单
 * 生成时间: 2025-12-17 10:00:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['测试目录', '一级目录', '二级目录', '三级目录'];

describe('1805077-【历史导航】历史导航-面包屑右键菜单', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
  });

  test('1805077-[033][core]历史导航-面包屑右键菜单', async ({ device, agent, uos }) => {
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

    // 步骤 4: 右击地址栏
    await agent.aiRightClick(`导航栏中的地址栏中${levels[levels.length - 1]}部分`);

    // 验证右键菜单已弹出
    await agent.aiAssert('地址栏右键菜单已弹出');
    await agent.aiAssert('地址栏右键菜单中从上到下依次是复制路径、在新窗口打开、在新标签中打开, 编辑地址');

  }, { timeout: 600000, tags: ['1805077', 'level2', 'smoke', 'youwei', 'addressbar', 'file-manager', 'Right-click menu'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
  });
});
