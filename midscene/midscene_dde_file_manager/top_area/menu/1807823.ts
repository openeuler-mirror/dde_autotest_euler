/**
 * 用例 PMSID: 1807823
 * 用例标题:  文管右键菜单显示快捷键-快捷键功能-文件保存对话框内右键菜单显示快捷键
 * 生成时间: 2026-02-09 14:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1807823-文管右键菜单显示快捷键-快捷键功能-文件保存对话框内右键菜单显示快捷键', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/$USER/Desktop/aa.txt && echo helloUOS >> /home/$USER/Desktop/aa.txt')
    await system.exec('mkdir -p /home/$USER/Desktop/测试文件夹')

  });

  test('1807823-文管右键菜单显示快捷键-快捷键功能-文件保存对话框内右键菜单显示快捷键', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开测试文件后保存，显示文件保存对话框
    console.log('步骤 1: 打开测试文件后保存，显示文件保存对话框');
    await agent.aiDoubleClick('aa.txt');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('另存为')

    //步骤 2：选中文件夹，查看右键菜单快捷键
    console.log('步骤 2：选中文件夹，查看右键菜单快捷键');
    await agent.aiRightClick('测试文件夹')
    await agent.aiAssert('显示选项：打开(O)、剪切(T)、复制(C)、重命名(M)、删除(D)')

    // 步骤 3：空白处，查看右键菜单快捷键
    console.log('步骤 3：空白处，查看右键菜单快捷键');
    await agent.aiTap('文件对话框空白处')
    await agent.aiRightClick('文件对话框空白处')
    await agent.aiAssert('显示选项：粘贴(P)')

    await agent.aiTap('文件对话框空白处')
    await agent.aiTap('取消')
    await agent.aiTap('文本编辑器右上角关闭按钮')

    //数据清理：清除文件管理器的最近使用访问记录
    console.log('数据清理：清除文件管理器的最近使用访问记录"');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('最近使用')
    await agent.aiRightClick('最近使用')
    await agent.aiTap('清除最近使用')

  }, { timeout: 600000, tags: ["1807823", "level3", "menu","DITT", "hushimin"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件和测试文件夹
    await system.exec('rm -rf /home/$USER/Desktop/测试文件夹')
    await system.exec('rm -rf /home/$USER/Desktop/aa.txt')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});