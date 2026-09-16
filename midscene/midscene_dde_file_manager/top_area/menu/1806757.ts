/**
 * 用例 PMSID: 1806757
 * 用例标题:  剪切-选中10000个文件按ctrl+x
 * 生成时间: 2026-02-27 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1806757-剪切-选中10000个文件按ctrl+x', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建10000个测试文件作为前置条件，后续测试
    await system.exec('mkdir -p /home/$USER/Downloads && cd /home/$USER/Downloads && seq -w 10000 | xargs -P 16 -I {} touch f_{}.txt')

      });

  test('1806757-剪切-选中10000个文件按ctrl+x', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入下载目录
    console.log('步骤 1: 打开文件管理器，进入下载目录');
    await uos.openApp('文件管理器');
    await agent.aiDoubleClick('下载')

    //步骤 2：选中10000个文件后，按快捷键Ctrl+x
    console.log('步骤 2：选中10000个文件后，按快捷键Ctrl+x');
    await agent.aiTap("右上角的图标视图")
    await agent.aiTap('下载目录空白处')
    await device.pressKey('Ctrl','A')
    await device.pressKey('Ctrl','X');
    await agent.aiAssert('选中的文件名称显示蓝色，文件图标显示灰色')

  }, { timeout: 600000, tags: ["1806757", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件
    await system.exec('rm -rf /home/$USER/Downloads/*')

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