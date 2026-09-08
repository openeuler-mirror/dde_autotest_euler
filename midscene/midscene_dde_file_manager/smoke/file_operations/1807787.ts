/**
 * 用例 PMSID: 1807787
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-桌面快捷键打开
 * 生成时间: 2025-2-9 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const TEST_DIR = '~/Desktop'
const COPY_DIR = '~/Desktop/1807787cp'
const caseDir = process.env.TESTCASE_DIR;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${TEST_DIR}/dir01 ${TEST_DIR}/dir02 ${TEST_DIR}/file01.txt ${TEST_DIR}/file02.txt`);
    await system.exec(`rm ${TEST_DIR}/deepin-compressor.desktop`)
    await system.exec(`rm -rf ${COPY_DIR}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807787-文管右键菜单显示快捷键-快捷键功能-桌面快捷键打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件1：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件2：创建测试文件
    await system.exec(`mkdir -p ${TEST_DIR}/dir01 ${TEST_DIR}/dir02 && touch ${TEST_DIR}/file01.txt ${TEST_DIR}/file02.txt`);
    await system.exec(`cp /usr/share/applications/deepin-compressor.desktop ${TEST_DIR}`)
    await system.exec(`mkdir -p  ${COPY_DIR}`)
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807787-文管右键菜单显示快捷键-快捷键功能-桌面快捷键打开', async ({ device, agent, uos }) => {
    // 步骤 1: 进入测试文件夹
    await uos.showDesktop();
    // 步骤2：在文管内右键单击一个文件，唤起右键菜单，按快捷键：O
    await agent.aiRightClick('文件管理器中的file01.txt文件')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('O');
    await agent.aiAssert("file01.txt文件被打开，内容为空");
    await device.pressKey('Alt','F4');
    // 步骤3：在文管内右键单击一个文件夹，唤起右键菜单，按快捷键：O
    await agent.aiRightClick('文件管理器中的dir01文件夹')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('O');
    await agent.aiAssert("dir01文件夹被打开，内容为空");
    await device.pressKey('Alt','F4');
    // 步骤4：在文管内选中多个文件、文件夹、应用等，唤起右键菜单，按快捷键：O
    await agent.aiTap("桌面空白处");
    await device.keyDown("Ctrl");
    await agent.aiTap('桌面的file02.txt文件');
    await agent.aiTap('桌面的dir02文件夹');
    await agent.aiTap('桌面的归档管理器');
    await device.keyUp("Ctrl");
    await agent.aiRightClick('桌面的归档管理器');
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('O');
    await agent.aiAssert("多个应用窗口被打开");

  }, { timeout: 600000,
       tags: ['1807787', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

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
