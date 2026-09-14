/**
 * 用例 PMSID: 1808253
 * 用例标题:  桌面刷新优化-U盘挂载/卸载-桌面自动刷新
 * 生成时间: 2025-2-24 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const usb_file= '1808253te';
const usb_flash = process.env.USB_FLASH || 'uos';
const user = process.env.TEST_USERNAME || 'uos';
const usb_mount_point = `/media/${user}/${usb_flash}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1808253-桌面刷新优化-U盘挂载/卸载-桌面自动刷新', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
  });

    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1808253-桌面刷新优化-U盘挂载/卸载-桌面自动刷新', async ({ device,agent,uos,system}) => {
        // 步骤1：打开文件管理器，进入U盘内部
        await device.pressKey("Super+E");
        await agent.aiWaitFor("文件管理器已经打开");
        // 步骤2：卸载U盘
        await agent.aiRightClick(`磁盘列表下方中的${usb_flash}磁盘`);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的卸载");
        await agent.aiAssert(`${usb_flash}磁盘下方不显示容量，桌面文件、文件夹、图标、缩略图都正常显示`);
        // 步骤3：卸载U盘
        await agent.aiRightClick(`磁盘列表下方中的${usb_flash}磁盘`);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的挂载");
        await agent.aiAssert(`${usb_flash}磁盘下方显示容量，桌面文件、文件夹、图标、缩略图都正常显示`);

      }, { timeout: 600000,
       tags: ['1808253', 'level2', 'smoke', 'peripherals', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });