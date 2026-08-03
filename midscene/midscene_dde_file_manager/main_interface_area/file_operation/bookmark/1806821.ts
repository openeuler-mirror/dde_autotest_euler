
/**
 * 用例 PMSID: 1806821
 * 用例标题: 快捷访问-弹窗移除
 * 生成时间: 2026-03-05 14:57:56
 * 用例编写人: UT000193（郑豪）
 */

describe('1806821-快捷访问-弹窗移除', () => {
  // 文件夹名称参数
  const folderA = '1806821';
  const testFolderB = 'test_folder_B';
  const usbFlash = process.env.USB_FLASH;

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`echo ${process.env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop(); 
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建普通目录测试文件夹
    await system.exec(`mkdir -p /home/${process.env.USER}/${testFolderB}`);
  });

  test('1806821-快捷访问-弹窗移除', async ({ device, agent, uos, system, env }) => {
    // 步骤1：进入外设（光盘/U盘等）目录-选中单个文件夹A-右键添加快捷访问-拔掉外设-点击侧边栏文件夹A快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    
    // 进入U盘目录
    
    await agent.aiTap(`侧边栏中的${usbFlash}磁盘`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec(`mkdir /media/${process.env.USER}/${usbFlash}/${folderA}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 添加快捷访问
    await agent.aiRightClick(`'${folderA}'文件夹图标`);
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 卸载SMB（模拟拔掉外设）
    await agent.aiRightClick(`侧边栏中的${usbFlash}磁盘`);
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("右键菜单中的卸载");
    await system.exec('killall -15 dde-file-manager');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    
    // 点击侧边栏文件夹A快捷访问
    await agent.aiTap(`侧边栏中的'${folderA}'快捷访问`);

    // 断言1：弹窗提示“抱歉，找不到您的快捷访问目录，是否移除”
    await agent.aiAssert("弹窗提示'抱歉，找不到您的快捷访问目录，是否移除'");

    // 先关闭弹窗（点击取消）以便继续测试
    await agent.aiTap("弹窗上的'取消'按钮");
    await system.exec('killall -15 dde-file-manager');

    // 步骤2：进入普通目录-选中单个文件夹B-右键添加快捷访问-删除文件夹B-点击侧边栏文件夹B快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("左侧栏主目录");
    await agent.aiWaitFor("主目录加载完成");
    await agent.aiRightClick(`'${testFolderB}'文件夹图标`);
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 删除文件夹B
    await system.exec(`rm -rf /home/${process.env.USER}/${testFolderB}`);
    await system.exec(`rm -rf /media/${process.env.USER}/${usbFlash}/${folderA}`);
    await system.exec('killall -15 dde-file-manager');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    
    // 点击侧边栏文件夹B快捷访问
    await agent.aiTap(`侧边栏中的'${testFolderB}'快捷访问`);

    // 断言2：弹窗提示“抱歉，找不到您的快捷访问目录，是否移除”
    await agent.aiAssert("弹窗提示'抱歉，找不到您的快捷访问目录，是否移除'");

    // 步骤3：侧边栏文件夹A/文件夹B快捷访问右键
    await device.pressKey('Esc');
    await agent.aiRightClick(`侧边栏中的'${testFolderB}'快捷访问`);
    await agent.aiTap("'右键菜单的'重命名'");
    
    // 断言3：仅移除高亮，其余选项灰显不可点击
    // await agent.aiAssert("右键菜单中'从快捷访问移除'选项高亮，其它选项置灰，请认真观察，从快捷访问移除是黑色字体，其它是灰色字体");
    await agent.aiAssert("不会弹出重命名文本输入框");

    // 步骤4：点击弹窗上取消或右上角X或按Esc
    await device.pressKey('Esc');
    
    // 断言4：关闭弹窗
    await agent.aiAssert("弹窗已关闭");

    // 步骤5：点击弹窗上移除按钮
    await agent.aiTap(`侧边栏中的'${testFolderB}'快捷访问`);
    await agent.aiAssert("弹窗提示'抱歉，找不到您的快捷访问目录，是否移除'");
    await agent.aiTap("弹窗上的'移除'按钮");
    
    // 断言5：成功移除快捷访问
    await agent.aiAssert(`侧边栏中'${testFolderB}'快捷访问已消失`);

  }, { timeout: 600000, tags: ['1806821', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件夹
    await system.exec(`rm -rf ~/${testFolderB}`);
    await system.exec(`rm -rf /media/${process.env.USER}/${usbFlash}/${folderA}`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall -15 dde-file-manager');
    await system.exec('killall dde-file-dialog'); 
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
