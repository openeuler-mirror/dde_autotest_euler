/**
 * 用例 PMSID: 1806763
 * 用例标题: 文件权限-多选只读文件和非只读文件操作_
 * 生成时间: 2025-12-15
 * 用例编写人: UT000054（叶飞）
 */

describe('1806763-文件权限-多选只读文件和非只读文件操作_', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    await system.exec("killall deepin-editor");
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806763-文件权限-多选只读文件和非只读文件操作_', async ({ device, agent, uos, system, env }) => {

    console.log('新建多个文件并修改权限');

    //用例第一步，检查delete、enter键功能
    // 步骤 1: 命令行在家目录下创建测试文件
    const testFiles = ["readonly_test1.txt", "readonly_test2.txt", "normal_test1.txt", "normal_test2.txt"];
    await system.exec("mkdir -p ~/taest_folder");
    for (const filename of testFiles) {
      await system.exec(`echo "this is for testing"  > ~/taest_folder/${filename}`);
    }

    // 步骤 2: 命令行修改文件名权限为只读
    await system.exec("chmod 444 ~/taest_folder/readonly_test1.txt ~/taest_folder/readonly_test2.txt");

    // 步骤 3: 启动器中打开文件管理器图标
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器窗口已打开');

    // 步骤 4: 进入只读目录
    await agent.aiTap("主目录", { deepThink: true });
    await agent.aiDoubleClick('taest_folder', { deepThink: true });
    // 步骤 5: 多选只读文件
    await device.pressKey("Ctrl+A");
    //步骤6： 打开多选的文件
    await device.pressKey('Enter');
    await agent.aiWaitFor('文本文件被正常打开');
    await agent.aiAssert("文件名包含readonly_test、normal_test等4个页签被打开");

    // 步骤 7: 关闭打开的文件窗口
    await agent.aiTap('文本编辑器窗口的右上角的关闭按钮');
    await system.exec("killall deepin-editor");
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf');

    // 步骤 8: 测试删除文件
    await device.pressKey('Delete');
    await agent.aiAssert("当前目录为空");


    // 步骤 9: 清理测试文件
    await agent.aiTap("主目录");
    await device.pressKey('Delete');

    //用例第二步：检查右键菜单与功能
    //步骤 11：重复步骤1、2, 创建只读和普通文件
    const testFiles2 = ["testfile1.txt", "testfile2.txt"];
    await system.exec("mkdir -p ~/taest_folder2");
    for (const filename of testFiles2) {
      await system.exec(`echo "this is for testing!!"  > ~/taest_folder2/${filename}`);
    }
    //步骤12  进入普通文件目录
    await agent.aiTap("主目录");
    await agent.aiDoubleClick('taest_folder2');
    await agent.aiWaitFor('进入taest_folder2目录');
    //全选，检查右键菜单
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('testfile1.txt');
    await agent.aiAssert('右键菜单被打开');
    await agent.aiAssert('右键菜单显示： 打开、打开方式、压缩、添加到xxx.7z、添加到xxx.zip、剪切、复制、重命名、删除、反选、发送到、标记信息、病毒查杀、属性');

    // 验证右键菜单功能 --复制、粘贴功能
    await agent.aiTap('复制');
    await device.pressKey('Ctrl+V');
    await agent.aiAssert('复制成功，当前目录生成2个带副本的文件');

    //验证右键菜单功能 --属性
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('testfile1.txt');
    await agent.aiAssert('右键菜单被打开');
    await agent.aiTap('属性');
    await agent.aiWaitFor("四个属性弹窗");
    await agent.aiTap("界面下方的关闭全部按钮");

    //验证右键菜单功能 --反选
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('testfile1.txt');
    await agent.aiAssert('右键菜单被打开');
    await agent.aiTap('反选');
    await agent.aiAssert("文件被取消选中");

    // 步骤 13: 命令行修改文件名权限为只读,验证只读右键菜单功能 -打开
    await system.exec("chmod 444 ~/taest_folder2/testfile*");
    await system.exec("killall deepin-editor");
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf');

    //找到只读文件，验证右键菜单打开功能
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('testfile1.txt');
    await agent.aiAssert('右键菜单被打开');
    await agent.aiAssert('右键菜单显示： 打开、打开方式、压缩、添加到xxx.7z、添加到xxx.zip、剪切、复制、重命名、删除、反选、发送到、标记信息、病毒查杀、属性');
    await agent.aiTap("打开");
    await agent.aiAssert("四个文本文件都被打开");

    // 步骤 14 关闭打开的文件窗口
    await agent.aiTap('文本编辑器窗口的右上角的关闭按钮');

    // 步骤 15: 清理测试文件
    await agent.aiTap("主目录");
    await device.pressKey('Delete');

  }, { timeout: 600000, tags: ["1806763", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("killall dde-file-manager");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf ~/taest*`);
    await system.exec("killall deepin-editor");
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    
  });
});
