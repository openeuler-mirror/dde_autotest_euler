/**
 * 用例 PMSID: 1807651
 * 用例标题:  【文件右键】空白处右键-新建文档
 * 生成时间: 2025-2-24 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const test_w= '1807651w';
const test_r= '1807651r';
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

describe('1807651-【文件右键】空白处右键-新建文档', () => {
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

    test('1807651-【文件右键】空白处右键-新建文档', async ({ device,agent,uos,system}) => {
        // 步骤1：进入可读写的测试文件夹
        await agent.aiDoubleClick(`桌面上的${test_dir_w}文件夹`);
        await agent.aiWaitFor("文件管理器已经打开");
        // 步骤2：新建办公文档
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文档");
        await agent.aiTap("二级菜单中的办公文档");
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有新建Word文档");
        // 步骤3：新建电子表格
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文档");
        await agent.aiTap("二级菜单中的电子表格");
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有新建Excel文档");
        // 步骤4：新建演示文档
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文档");
        await agent.aiTap("二级菜单中的演示文档");
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有演示文档");
        // 步骤5：新建文本文档
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的新建文档");
        await agent.aiTap("二级菜单中的文本文档");
        await device.pressKey("Enter");
        await agent.aiAssert("当前目录有新建文本");
        // 步骤6：关闭所有文管窗口，并进入只读文件夹
        await system.exec('pkill -f dde-file-manager || true');
        await agent.aiDoubleClick(`桌面上的${test_dir_r}文件夹`);
        await agent.aiWaitFor("文件管理器已经打开");
        // 步骤7：在只读文件夹下新建文件夹
        await agent.aiRightClick("文件管理器当前目录的空白处");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiAssert("右键菜单中的新建文件夹选项，显示浅色");

      }, { timeout: 600000,
       tags: ['1807651', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });