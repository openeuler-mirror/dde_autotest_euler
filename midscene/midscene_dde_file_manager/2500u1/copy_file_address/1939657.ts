/**
 * 用例 PMSID: 1939657
 * 用例标题: 【复制文件地址】ctrl + 单击属性中的链接打开软链指向的源文件
 * 生成时间: 2026-05-20 17:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const testPassword = process.env.TEST_PASSWORD;
const usbFlash = process.env.USB_FLASH || 'uos';

// 定义测试常量
const testConfig = {
  usbFolderName: 'A', // U盘中创建的文件夹名称
  desktopShortcutName: 'A 快捷方式' // 桌面生成的快捷方式名称
};

describe('1939657-【复制文件地址】ctrl + 单击属性中的链接打开软链指向的源文件', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试环境，确保U盘已挂载');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前准备，创建U盘文件夹及桌面快捷方式');
    await uos.showDesktop();  

  });

  test('1939657-【复制文件地址】ctrl + 单击属性中的链接打开软链指向的源文件', async ({ device, system, agent, uos }) => {
    // 前置条件：在U盘中创建文件夹A
    console.log('===== 在U盘中创建文件夹A =====');

    // 获取U盘挂载路径
    const usbPath = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const targetUsbPath = usbPath.stdout.trim();
    if (!targetUsbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }
    
    // 创建文件夹A
    await system.exec(`mkdir -p ${targetUsbPath}/${testConfig.usbFolderName}`);
    
    // 打开U盘目录
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap(`文件管理器左侧栏${usbFlash}`);
    
    // 右键文件夹A -> 发送到 -> 桌面创建连接
    await agent.aiRightClick(`${testConfig.usbFolderName}文件夹图标`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");
    
    // 关闭文件管理器窗口
    await device.pressKey('Alt+F4');

    // 步骤1：右键桌面上文件夹A的快捷方式，选择属性
    console.log('===== 步骤1：右键快捷方式打开属性对话框 =====');
    await agent.aiRightClick(`桌面上的${testConfig.desktopShortcutName}图标`);

    await agent.aiTap("属性");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 预期结果1：弹出属性对话框
    await agent.aiAssert("成功弹出属性对话框");

    // 步骤2：按ctrl + 单击，点击位置的地址，检查是否可以打开U盘中的文件夹A
    console.log('===== 步骤2：Ctrl+单击属性中位置地址，打开U盘文件夹 =====');
    // 按下Ctrl键并单击位置地址
    await device.keyDown("ctrl");
    await agent.aiTap(`${targetUsbPath}`);  
    
    // 预期结果2：可以正常打开U盘的文件夹A
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiAssert(`U盘中的${testConfig.usbFolderName}文件夹被选中`);
    await device.keyUp("ctrl");
    // 验证文件夹A中可正常创建文件
    console.log('===== 验证文件夹A中可创建文件 =====');
    await agent.aiRightClick("U盘内空白处");
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('test1939657');
    await device.pressKey('Enter');
    await agent.aiAssert("成功创建test1939657.txt文件");
    
    // 验证文件夹A中可正常删除文件
    console.log('===== 验证文件夹A中可删除文件 =====');
    await agent.aiRightClick("test1939657.txt");    
    await agent.aiTap("删除");
    await agent.aiTap("删除按钮");
    await agent.aiAssert("U盘里没有test1939657.txt文件");

  }, { timeout: 600000, tags: ['1939657','level4','2500u1','copy_file_address','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 清理测试环境');
    // 关闭所有打开的窗口
    await system.exec(`pkill -f dde-file-manager 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 删除桌面快捷方式
    await system.exec(`rm -rf ~/Desktop/${testConfig.desktopShortcutName} 2>/dev/null`);
    
    // 删除U盘中的测试文件夹
    const usbPath = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const targetUsbPath = usbPath.stdout.trim();
    await system.exec(`rm -rf ${targetUsbPath}/${testConfig.usbFolderName} 2>/dev/null`);
    await system.exec(`rm -rf ${targetUsbPath}/test* 2>/dev/null`);
    await system.exec(`rm -rf ~/Desktop/${testConfig.usbFolderName}*`);
    await uos.showDesktop();
    await agent.aiTap(`${testConfig.usbFolderName}快捷方式属性窗口右上角的x按钮`);
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 测试完成，清理全部环境');
    // 强制关闭所有文件管理器进程
    await system.exec(`ps aux |grep -E 'wps|dde-file-manager|deepin-editor' | grep -v grep | awk '{print $2}' | xargs kill -15`);
  });
});