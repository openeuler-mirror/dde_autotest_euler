/**
 * 用例 PMSID: 1807305
 * 用例标题: 右侧预览-文件夹类型信息栏基本信息
 * 生成时间: 2025-2-25 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const test_dir= '1807305te';
const test_file = 'testing'
const test_file_road = `~/Desktop/${test_dir}/${test_file}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/Desktop/${test_dir}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807305-右侧预览-文件夹类型信息栏基本信息', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：准备测试文件
        await system.exec(`cd ~/Desktop && mkdir -p ${test_file_road}`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807305-右侧预览-文件夹类型信息栏基本信息', async ({ device,agent,uos,system}) => {
        // 步骤1：打开文件管理器，进入测试路径
        await agent.aiDoubleClick(`桌面上的${test_dir}文件`);
        await agent.aiWaitFor("文件管理器被打开");
        // 步骤2：开启详情视图
        await agent.aiTap("文件管理器右上角的视图选项（一个方框中间包含三个点）", { deepThink: true });
        const hasOpen = await agent.aiBoolean("显示预览被勾选");
        if (hasOpen === true) {
          console.log('显示预览已被勾选');
        }
        else {
          await agent.aiTap("视图选项中的显示预览");
        }
        await device.pressKey("Esc");
        // 步骤3：选中文档文件夹，打开右侧信息栏，查看信息展示
        await agent.aiTap(`当前目录的${test_file}文件夹`);
        await agent.aiAssert("文件管理器右侧显示详情窗口");
        // 步骤4：查看图标
        await agent.aiAssert("文件管理器右侧详情窗口中，上方显示文件夹图标");
        // 步骤5：查看基本信息
        await agent.aiAssert("文件管理器右侧详情窗口中，中间显示基本信息，包含名称、类型、访问时间、修改时间");
        // 步骤6：查看tag
        await agent.aiAssert("文件管理器右侧详情窗口中，下方显示标记，标记下方信息栏默认为空");
        // 步骤7：恢复环境，关闭详情视图
        await agent.aiTap("文件管理器右上角的视图选项（一个方框中间包含三个点）", { deepThink: true });
        const hasClose = await agent.aiBoolean("显示预览被勾选");
        if (hasClose === true) {
          await agent.aiTap("视图选项中的显示预览");
        }
        else {
          console.log('显示预览没有被勾选');
        }
        await device.pressKey("Esc");

      }, { timeout: 600000,
       tags: ['1807305', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });

    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });