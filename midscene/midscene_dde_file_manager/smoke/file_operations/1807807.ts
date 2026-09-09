/**
 * 用例 PMSID: 1807807
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-文管内快捷键重命名
 * 生成时间: 2025-1-27 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const TEST_DIR = '1807807te'

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec(`rm -rf ~/Desktop/${TEST_DIR}`);
    await system.exec('pkill -f dde-file-manager || true');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807807-文管右键菜单显示快捷键-快捷键功能-文管内快捷键重命名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件1：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
    // 前置条件2：创建测试文件
    await system.exec(`cd ~/Desktop && mkdir -p ${TEST_DIR}/dir01 ${TEST_DIR}/dir02 && touch ${TEST_DIR}/file01.txt ${TEST_DIR}/file02.txt`);
    await system.exec(`cd ~/Desktop && cp /usr/share/applications/uos-service-support.desktop ${TEST_DIR}/`)
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807807-文管右键菜单显示快捷键-快捷键功能-文管内快捷键重命名', async ({ device, agent, uos }) => {
    // 步骤 1: 进入测试文件夹
    await agent.aiDoubleClick('桌面上的1807807te文件夹');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤2：在文管内右键单击一个文件，唤起右键菜单，按快捷键：M
    await agent.aiRightClick('文件管理器中的file01.txt文件')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('M');
    await device.typeText("rename01");
    await device.pressKey('Enter');
    await agent.aiAssert("当前目录有rename01.txt文件");
    // 步骤3：在文管内右键单击一个文件夹，唤起右键菜单，按快捷键：M
    await agent.aiRightClick('文件管理器中的dir01文件夹')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('M');
    await device.typeText("rename01");
    await device.pressKey('Enter');
    await agent.aiAssert("当前目录有rename01文件夹");
    // 步骤4：在文管内选中多个文件、文件夹、应用等，唤起右键菜单，按快捷键：M
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('文件管理器中的服务与支持')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('M');
    await device.typeText("0");
    await device.pressKey('Tab');
    await device.typeText("6");
    await agent.aiTap('文件管理器右上角的重命名按钮');
    await agent.aiAssert("文件管理器目录有以下文件：rename61、dir62、rename61.txt、file62.txt");

  }, { timeout: 600000,
       tags: ['1807807', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试环境
    await clearEnv(system);
  });
});
