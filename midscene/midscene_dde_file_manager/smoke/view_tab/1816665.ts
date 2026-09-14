/**
 * 用例 PMSID: 1816665
 * 用例标题: 地址栏-悬停状态显示
 * 生成时间: 2026-01-16 09:50:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['测试目录', '一级目录', '二级目录', '三级目录'];

describe('1816665-地址栏-悬停状态显示', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
  });

  test('1816665-地址栏-悬停状态显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择桌面目录
    console.log('步骤 2: 在侧边栏选择桌面目录');
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证页面已跳转到桌面目录
    console.log('预期 2: 验证页面已跳转到桌面目录');
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 双击打开多层级目录路径
    console.log('步骤 3: 双击打开多层级目录路径');
    for (const level of levels) {
      await agent.aiDoubleClick(`文件列表中的${level}文件夹`, { deepThink: true });
      await agent.aiAssert(`文件管理器跳转到${level}目录`);
    };

    // 验证页面已跳转到最深层目录
    console.log('预期 3:验证页面已跳转到最深层目录');
    await agent.aiAssert('当前目录内容为空');

    // 步骤 4: hover到地址栏
    console.log('步骤 4: hover到地址栏');
    await agent.aiHover('地址栏');

    // 确认地址栏编辑框显示
    console.log('预期 4: 确认地址栏编辑框显示');
    await agent.aiAssert('地址栏编辑框已显示, 背景色为浅灰色');

  }, { timeout: 600000, tags: ['1816665', 'level2', 'smoke', 'DITT', 'youwei', 'addressbar', 'file-manager', 'hover'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);

     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
