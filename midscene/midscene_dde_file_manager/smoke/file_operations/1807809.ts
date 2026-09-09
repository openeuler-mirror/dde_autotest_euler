/**
 * 用例 PMSID: 1807809
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除
 * 生成时间: 2025-1-27 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec(`rm -rf ~/Desktop/1807809te`);
    await system.exec('pkill -f dde-file-manager || true');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807809-文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件1：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
    // 前置条件2：创建测试文件
    await system.exec(`cd ~/Desktop && mkdir -p 1807809te/dir01 1807809te/dir02 && touch 1807809te/file01.txt 1807809te/file02.txt`);
    await system.exec(`cd ~/Desktop && cp /usr/share/applications/uos-service-support.desktop 1807809te/`)
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807809-文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除', async ({ device, agent, uos }) => {
    // 步骤 1: 进入测试文件夹
    await agent.aiDoubleClick('桌面上的1807809te文件夹');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤2：在文管内右键单击一个文件，唤起右键菜单，按快捷键：D
    await agent.aiRightClick('文件管理器中的file01.txt文件')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiAssert("当前目录没有file01.txt文件");
    // 步骤3：在文管内右键单击一个文件夹，唤起右键菜单，按快捷键：D
    await agent.aiRightClick('文件管理器中的dir01文件夹')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiAssert("当前目录没有dir01文件夹");
    // 步骤4：在文管内选中多个文件、文件夹、应用等，唤起右键菜单，按快捷键：D
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('文件管理器中的服务与支持')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiAssert("文件管理器当前目录为空");

  }, { timeout: 600000,
       tags: ['1807809', 'level2', 'smoke', 'midscene_dde_file_manager/smoke/file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 环境清理
    await clearEnv(system);
  });
});
