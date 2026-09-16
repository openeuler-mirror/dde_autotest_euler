/**
 * 用例 PMSID: 1807821
 * 用例标题:  文管右键菜单显示快捷键-快捷键功能-文件选择对话框内右键菜单显示快捷键
 * 生成时间: 2026-02-26 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1807821-文管右键菜单显示快捷键-快捷键功能-文件选择对话框内右键菜单显示快捷键', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/$USER/Downloads/aa.txt && echo helloUOS >> /home/$USER/Downloads/aa.txt')

  });

  test('1807821-文管右键菜单显示快捷键-快捷键功能-文件选择对话框内右键菜单显示快捷键', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文本编辑器，使用Ctrl+O选择文件
    console.log('步骤 1: 打开文本编辑器，使用Ctrl+O选择文件');
    await uos.openApp('文本编辑器');
    await device.pressKey('Ctrl+O');

    //步骤 2：选择桌面文件，查看右键菜单快捷键
    console.log('步骤 2：选择桌面文件，查看右键菜单快捷键');
    await agent.aiWaitFor('显示文件管理器对话框')
    await agent.aiTap('文件对话框的下载')
    await agent.aiTap('aa.txt')
    await agent.aiRightClick('aa.txt')
    await agent.aiAssert('显示选项：打开(O)、剪切(T)、复制(C)、重命名(M)、删除(D)')

    // 步骤 3：空白处，查看右键菜单快捷键
    console.log('步骤 3：空白处，查看右键菜单快捷键');
    await agent.aiTap('文件对话框空白处')
    await agent.aiRightClick('文件对话框空白处')
    await agent.aiAssert('显示选项：粘贴(P)')
    await agent.aiTap('文件对话框空白处')

    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");

  }, { timeout: 600000, tags: ["1807821", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件
    await system.exec('rm -rf /home/$USER/Downloads/aa.txt')

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