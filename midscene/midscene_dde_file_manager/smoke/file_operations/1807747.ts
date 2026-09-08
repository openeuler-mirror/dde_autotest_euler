/**
 * 用例 PMSID: 1807747
 * 用例标题: 【右键菜单增加反选选项】桌面和文管，选中多个文件，右键菜单单击反选
 * 生成时间: 2025-2-9 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const DIR_NAME = '1807747te'
const TEST_DIR = `~/Desktop/${DIR_NAME}`
const caseDir = process.env.TESTCASE_DIR;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${TEST_DIR}`);
    await system.exec(`rm -rf ~/Desktop/dir01 ~/Desktop/dir02 ~/Desktop/file01.txt ~/Desktop/file02.txt`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807747-【右键菜单增加反选选项】桌面和文管，选中多个文件，右键菜单单击反选', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件1：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件2：创建测试文件
    await system.exec(`mkdir -p ${TEST_DIR}/dir01 ${TEST_DIR}/dir02 && touch ${TEST_DIR}/file01.txt ${TEST_DIR}/file02.txt`);
    await system.exec(`cp -r ${TEST_DIR}/* ~/Desktop`)
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807747-【右键菜单增加反选选项】桌面和文管，选中多个文件，右键菜单单击反选', async ({ device, agent, uos }) => {
    // 步骤 1: 进入桌面
    await uos.showDesktop();
    // 步骤2：桌面，选中多个文件，右键菜单单击"反选"
    await agent.aiTap("桌面空白处");
    await device.keyDown("Ctrl");
    await agent.aiTap('桌面的file01.txt文件');
    await agent.aiTap('桌面的dir01文件夹');
    await device.keyUp("Ctrl");
    await agent.aiRightClick('桌面的file01.txt文件');
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap('右键菜单中的反选');
    await agent.aiAssert("桌面上除了file01.txt、dir01，其他的文件为选中状态，图标被框选", { deepThink: true });
    // 步骤3：文管目录，选中多个文件，右键菜单单击"反选"
    await agent.aiDoubleClick(DIR_NAME);
    await agent.aiWaitFor("打开文件管理器");
    await device.keyDown("Ctrl");
    await agent.aiTap('文件管理器中的file01.txt文件');
    await agent.aiTap('文件管理器中的dir01文件夹');
    await device.keyUp("Ctrl");
    await agent.aiRightClick('文件管理器中的file01.txt文件');
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap('右键菜单中的反选');
    await agent.aiAssert("文件管理器中除了file01.txt、dir01，其他的文件为选中状态，图标被框选");

  }, { timeout: 600000,
       tags: ['1807747', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有打开的窗口
    const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeAllWindows(device, agent);
    // 清理测试环境
    await clearEnv(system);
  });
});
