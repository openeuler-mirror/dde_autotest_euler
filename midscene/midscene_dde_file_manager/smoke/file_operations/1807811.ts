/**
 * 用例 PMSID: 1807811
 * 用例标题: 文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除（开启普通删除提示）
 * 生成时间: 2025-1-27 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const TEST_DIR = '1807811te'

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

async function configSet({system, device, agent}) {
  try {
    // 文管设置：开启普通文件删除提示
    await device.pressKey('Win','E');
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('右上角设置按钮');
    await agent.aiTap('设置菜单中的设置');
    await agent.aiScroll('设置界面左侧区域',{direction:'down', distance:5 });
    await agent.aiTap('左侧的对话框选项');
    await agent.aiTap('右侧区域开启普通删除提示左边的方框');
    await device.pressKey('Alt','F4');
    await device.pressKey('Alt','F4');
  } catch (err) {
    console.error('普通删除提示开启失败:', err);
  }
}

describe('1807811-文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除（开启普通删除提示）', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件1：文管测试环境初始化
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件2：创建测试文件
    await system.exec(`cd ~/Desktop && mkdir -p ${TEST_DIR}/dir01 ${TEST_DIR}/dir02 && touch ${TEST_DIR}/file01.txt ${TEST_DIR}/file02.txt`);
    await system.exec(`cd ~/Desktop && cp /usr/share/applications/uos-service-support.desktop ${TEST_DIR}/`)
    // 前置条件3：开启普通文件删除提示
    await configSet({system, device, agent});
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807811-文管右键菜单显示快捷键-快捷键功能-文管内快捷键删除（开启普通删除提示）', async ({ device, agent, uos }) => {
    // 步骤 1: 进入测试文件夹
    await agent.aiDoubleClick('桌面上的1807811te文件夹');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤2：在文管内右键单击一个文件，唤起右键菜单，按快捷键：D
    await agent.aiRightClick('文件管理器中的file01.txt文件')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiWaitFor("弹出是否删除的提示框");
    await agent.aiTap('提示框右侧的删除按钮');
    await agent.aiAssert("当前目录没有file01.txt文件");
    // 步骤3：在文管内右键单击一个文件夹，唤起右键菜单，按快捷键：D
    await agent.aiRightClick('文件管理器中的dir01文件夹')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiWaitFor("弹出是否删除的提示框");
    await agent.aiTap('提示框右侧的删除按钮');
    await agent.aiAssert("当前目录没有dir01文件夹");
    // 步骤4：在文管内选中多个文件、文件夹、应用等，唤起右键菜单，按快捷键：D
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('文件管理器中的服务与支持')
    await agent.aiWaitFor("显示右键菜单");
    await device.pressKey('D');
    await agent.aiWaitFor("弹出是否删除的提示框");
    await agent.aiTap('提示框右侧的删除按钮');
    await agent.aiAssert("文件管理器当前目录为空");

  }, { timeout: 600000,
       tags: ['1807811', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试环境
    await clearEnv(system);
  });
});
