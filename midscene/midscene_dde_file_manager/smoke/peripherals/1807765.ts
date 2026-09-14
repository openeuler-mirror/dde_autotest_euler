/**
 * 用例 PMSID: 1807765
 * 用例标题:  U盘搜索结果重命名
 * 生成时间: 2025-2-11 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const usb_file= '1807765te';
const usb_flash = process.env.USB_FLASH || 'uos';
const user = process.env.TEST_USERNAME || 'uos';
const usb_mount_point = `/media/${user}/${usb_flash}`;
const usb_expected_dir= `/media/${user}/${usb_flash}/${usb_file}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${usb_expected_dir}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807765-U盘搜索结果重命名', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：在U盘创建测试文件
        await system.exec(`mkdir -p ${usb_expected_dir}`);
        await system.exec(`cd ${usb_expected_dir} && mkdir dir01 dir02 && touch file01.txt file02.txt`);
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807765-U盘搜索结果重命名', async ({ device,agent,uos,system}) => {
        // 步骤1：打开文件管理器，进入U盘内部
        await device.pressKey("Super+E");
        await agent.aiWaitFor("文件管理器已经打开");
        await agent.aiDoubleClick(`磁盘列表下方中的${usb_flash}磁盘`);
        // 步骤2：进入U盘内部搜索文件
        await agent.aiDoubleClick(usb_file);
        await agent.aiWaitFor("显示有测试文件file01.txt");
        await agent.aiTap("窗口右上方的搜索图标");
        await device.typeText("file01")
        await device.pressKey("Enter");
        // 步骤3：搜索结果中，选择文件进行重命名
        await agent.aiRightClick("file01.txt文件");
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的重命名");
        await device.typeText("rename01")
        await device.pressKey("Enter");
        await agent.aiTap("搜索框右侧的x按钮");
        await agent.aiAssert("当前目录没有file01.txt文件，有rename01.txt文件");

      }, { timeout: 600000,
       tags: ['1807765', 'level2', 'smoke', 'peripherals', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });