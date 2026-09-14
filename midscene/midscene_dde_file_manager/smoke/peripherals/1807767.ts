/**
 * 用例 PMSID: 1807767
 * 用例标题:  U盘中，文件属性-勾选隐藏此文件
 * 生成时间: 2025-2-10 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

const usb_file= '1807767te';
const usb_flash = process.env.USB_FLASH || 'uos';
const user = process.env.TEST_USERNAME || 'uos';
const usb_mount_point = `/media/${user}/${usb_flash}`;
const usb_expected_file= `/media/${user}/${usb_flash}/${usb_file}`;

async function clearEnv(system) {
  try {
    // 环境清理：安静删除配置文件，关闭文件管理器
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${usb_expected_file}`);
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1807767-U盘中，文件属性-勾选隐藏此文件', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        // 前置条件1：文管测试环境初始化
        await clearEnv(system);
        await uos.showDesktop();
        // 前置条件2：在U盘创建测试文件
        await system.exec(`echo 'testfile' > ${usb_expected_file}`);
  });
  
    beforeEach(async ({ device, agent,system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1807767-U盘中，文件属性-勾选隐藏此文件', async ({ device,agent,uos,system}) => {
        // 步骤1：打开文件管理器，进入U盘内部
        await device.pressKey("Super+E");
        await agent.aiWaitFor("文件管理器已经打开");
        await agent.aiDoubleClick(`磁盘列表下方中的${usb_flash}磁盘`);
        // 步骤2：选中文件，右键属性，勾选隐藏此文件，U盘中隐藏此文件
        await agent.aiRightClick(usb_file);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的属性");
        await agent.aiTap("属性面板中的隐藏此文件");
        await device.pressKey("Alt+F4");
        await agent.aiAssert("当前目录没有文件1807767te");
        // 步骤3：取消勾选"隐藏此文件"，U盘中重新显示该文件
        await device.pressKey("Ctrl+H");
        await agent.aiRightClick(usb_file);
        await agent.aiWaitFor("显示右键菜单");
        await agent.aiTap("右键菜单中的属性");
        await agent.aiTap("属性面板中的隐藏此文件");
        await device.pressKey("Alt+F4");
        await device.pressKey("Ctrl+H");
        await agent.aiAssert("当前目录有文件1807767te");
  
      }, { timeout: 600000,
       tags: ['1807767', 'level2', 'smoke', 'peripherals', 'DITT', 'hujian'] });
    
    afterEach(async ({ device,system}) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system}) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理测试环境
        await clearEnv(system);
    });
  });