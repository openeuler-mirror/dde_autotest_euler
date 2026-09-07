/**
 * 用例 PMSID: 1807585
 * 用例标题:  [050]打开方式页面-勾选设为默认修改推荐应用
 * 生成时间: 2025-2-25 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const test_file= '1807585.jpg';
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

describe('1807585-[050]打开方式页面-勾选设为默认修改推荐应用', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：准备测试文件
        await system.exec(`cd ~/Desktop && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/${test_file}`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807585-[050]打开方式页面-勾选设为默认修改推荐应用', async ({ device,agent,uos,system}) => {
        // 步骤1：右键打开方式，点击选中选择默认程序
        await agent.aiRightClick(`桌面上的${test_file}文件`);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的打开方式");
        await agent.aiTap("二级菜单中的选择默认程序");
        await agent.aiWaitFor("弹出打开方式的选择弹窗");
        // 步骤2：切换推荐应用中的应用
        await agent.aiTap("推荐应用中的浏览器");
        await agent.aiTap("弹窗右下角的确定按钮");
        await agent.aiWaitFor("浏览器被打开");
        await agent.aiAssert("浏览器中显示测试图片");
        // 步骤3：关闭浏览器窗口
        await system.exec('pkill -f browser || true');
        // 步骤4：再次右键打开选择默认程序页面，检查推荐应用
        await agent.aiRightClick(`桌面上的${test_file}文件`);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的打开方式");
        await agent.aiTap("二级菜单中的选择默认程序");
        await agent.aiWaitFor("弹出打开方式的选择弹窗");
        await agent.aiAssert("推荐应用下方的浏览器被勾选");
        // 步骤5：将打开方式恢复成默认
        await agent.aiTap("推荐应用中的看图");
        await agent.aiTap("弹窗右下角的确定按钮");
        await device.pressKey("Alt+F4");

      }, { timeout: 600000,
       tags: ['1807585', 'level2', 'smoke', 'file_operations', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });