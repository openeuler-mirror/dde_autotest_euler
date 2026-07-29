/**
 * 用例 PMSID: 1809255
 * 用例标题: 文件名称分词优化-桌面图标大小为小，文件名称为汉字+英文组合，检查文件显示
 * 生成时间: 2025-1-27 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec(`rm -rf ~/Desktop/测试*`);
    await system.exec('pkill -f dde-file-manager || true');

  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1809255-文件名称分词优化-桌面图标大小为小，文件名称为汉字+英文组合，检查文件显示', () => {
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

  test('1809255-文件名称分词优化-桌面图标大小为小，文件名称为汉字+英文组合，检查文件显示', async ({ device, agent, uos }) => {
    // 步骤 1: 桌面新建文件夹，命名为汉字+英文
    await agent.aiRightClick("桌面空白处");
    await agent.aiTap("右键菜单中的新建文件夹");
    await device.typeText("测试1809255_这是一个test文件夹用于UI自动化测试FileOperations")
    await agent.aiTap("桌面空白处");
    // 步骤 2: 检查文件夹名称显示
    await agent.aiAssert("测试开头的文件夹，名称显示为两行，第二行展示不全，开头显示...");
    // 步骤 3: 再次点击测试文件夹
    await agent.aiTap("测试开头的文件夹");
    // 步骤 4: 检查文件夹名称显示
    await agent.aiAssert("测试开头的文件夹，名称多行显示完整，没有省略号");

  }, { timeout: 600000,
       tags: ['1809255', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Desktop/测试*`);
    // await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
