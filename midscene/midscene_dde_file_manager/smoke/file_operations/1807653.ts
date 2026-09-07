/**
 * 用例 PMSID: 1807653
 * 用例标题:  【文件右键】空白处右键-新建文件夹
 * 生成时间: 2025-2-24 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const test_w= '1807653w';
const test_r= '1807653r';
const test_dir_w = `~/Desktop/${test_w}`;
const test_dir_r = `~/Desktop/${test_r}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${test_dir_w} ${test_dir_r}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807653-【文件右键】空白处右键-新建文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：在桌面创建测试文件夹
        await system.exec(`mkdir -p ${test_dir_w} ${test_dir_r} && chmod 444 ${test_dir_r}`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807653-【文件右键】空白处右键-新建文件夹', async ({ device,agent,uos,system}) => {
        // 步骤1：进入可读写的测试文件夹
        await agent.aiDoubleClick(`桌面上的${test_dir_w}文件夹`);
        await agent.aiWaitFor("文件管理器已经打开");
        // 步骤2：新建文件夹不编辑名字
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文件夹");
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有新建文件夹");
        // 步骤3：新建文件夹，修改一个不存在的名称
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文件夹");
        await device.typeText("test")
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有test文件夹");
        // 步骤4：新建文件夹，修改一个已存在的名称
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文件夹");
        await device.typeText("test")
        await device.pressKey("Enter");
        await agent.aiAssert("弹窗提示文件名已被占用");
        await agent.aiTap("弹窗中的确定按钮");
        // 步骤5：新建文件夹，名称超长
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文件夹");
        await device.typeText("long这是一个超长的文件名称用于自动化测试")
        await device.pressKey("Enter");
        await agent.aiTap("文件管理器当前目录的空白处");
        await agent.aiAssert("long开头的文件夹仅显示两行，中间显示...");
        // 步骤6：关闭所有文管窗口，并进入只读文件夹
        await system.exec('pkill -f dde-file-manager || true');
        await agent.aiDoubleClick(`桌面上的${test_dir_r}文件夹`);
        await agent.aiWaitFor("文件管理器已经打开");
        await agent.aiAssert("当前目录提示没有权限");
        // 步骤7：在只读文件夹下新建文件夹
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文件夹");
        await agent.aiAssert("当前目录没有生成新建文件夹");

      }, { timeout: 600000,
       tags: ['1807653', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });