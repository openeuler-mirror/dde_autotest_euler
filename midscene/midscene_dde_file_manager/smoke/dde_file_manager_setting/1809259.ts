/**
 * 用例 PMSID: 1809259
 * 用例标题: 盘符名称修改-重命名输入框唤起及保存-侧边栏重命名
 * 生成时间: 2025-1-26 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1809259-盘符名称修改-重命名输入框唤起及保存-侧边栏重命名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809259-盘符名称修改-重命名输入框唤起及保存-侧边栏重命名', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤 2: 右键系统盘，点击重命名
    await agent.aiRightClick("侧边栏计算机下方的系统盘");
    await agent.aiTap("右键菜单中的重命名");
    // 步骤 3: 显示重命名输入框
    await agent.aiAssert("系统盘的名称显示选中状态，背景为蓝色");

  }, { timeout: 600000,
       tags: ['1809259', 'level2', 'smoke', 'midscene_dde_file_manager/smoke/dde_file_manager_setting', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
