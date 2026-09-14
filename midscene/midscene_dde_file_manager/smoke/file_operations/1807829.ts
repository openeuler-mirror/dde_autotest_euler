/**
 * 用例 PMSID: 1807829
 * 用例标题: 【多选图片右键打印】选中多张图片，右键菜单点击"打印"
 * 生成时间: 2025-1-26 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
  } 
    catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807829-【多选图片右键打印】选中多张图片，右键菜单点击"打印"', () => {
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

  test('1807829-【多选图片右键打印】选中多张图片，右键菜单点击"打印"', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await device.pressKey("Super+E");
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤 2: 进入图片的目录
    await agent.aiTap("侧边栏的图片目录");
    await agent.aiDoubleClick("Wallpapers目录");
    // 步骤 3: 选中多个图标，查看右键菜单
    await device.pressKey("Ctrl+A");
    await agent.aiRightClick("第一张图片");
    await agent.aiAssert("右键菜单中有打印选项");
    // 步骤 4: 点击打印，显示打印窗口
    await agent.aiTap("右键菜单中的打印");
    await agent.aiWaitFor('显示打印的基础设置窗口', {
        timeoutMs: 60000, // 等待 60 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
    await agent.aiAssert("显示打印的基础设置窗口");

  }, { timeout: 600000,
       tags: ['1807829', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有打开的窗口
    const caseDir = process.env.TESTCASE_DIR;
    const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeAllWindows(device, agent);
    // 清理测试环境
    await clearEnv(system);
  });
});
