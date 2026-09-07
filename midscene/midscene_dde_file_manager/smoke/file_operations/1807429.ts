/**
 * 用例 PMSID: 1807429
 * 用例标题: 属性复制-快捷键复制
 * 生成时间: 2025-2-25 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const test_file= '1807429te';
const test_dir = `~/Desktop/${test_file}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${test_dir}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807429-属性复制-快捷键复制', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：准备测试文件
        await system.exec(`cd ~/Desktop && mkdir ${test_file}`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807429-属性复制-快捷键复制', async ({ device,agent,uos,system}) => {
        // 步骤1：在桌面目录中，选择测试文件夹右键-打开属性面板
        await agent.aiRightClick(`桌面上的${test_file}文件`);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的属性");
        await agent.aiWaitFor("弹出基本信息面板");
        // 步骤2：选中任意内容后使用快捷键Ctrl+C
        await agent.aiDoubleClick("位置信息右边的Desktop");
        await agent.aiAssert("位置信息的的Desktop被选中，背景为蓝色");
        await device.pressKey("Ctrl+C");
        // 步骤3：检查快捷键Ctrl+C是否正常复制粘贴
        await agent.aiTap("标记下方的输入框");
        await device.pressKey("Ctrl+V");
        await agent.aiAssert("标记下方的输入框中显示Desktop");
        // 步骤4：恢复环境，关闭属性窗口
        await device.pressKey("Alt+F4");

      }, { timeout: 600000,
       tags: ['1807429', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });