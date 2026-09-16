/**
 * 用例 PMSID: 1806877
 * 用例标题:  文件操作-快捷键选中文件_
 * 生成时间: 2026-02-26 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1806877-文件操作-快捷键选中文件_', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件，用于后续测试
    await system.exec('mkdir -p /home/$USER/Downloads/testFolder && cd /home/$USER/Downloads/testFolder && seq -w 1 30 | xargs -P 16 -I {} touch f_{}.txt')
      });

  test('1806877-文件操作-快捷键选中文件_', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入testFolder目录
    console.log('步骤 1: 打开文件管理器，进入testFolder目录');
    await uos.openApp('文件管理器');
    await agent.aiDoubleClick('下载')
    await agent.aiDoubleClick('testFolder')
    await agent.aiTap("右上角图标视图")

    //步骤 2：通过快捷键选中文件
    console.log('步骤 2：通过快捷键选中文件');
    await device.pressKey('home');
    await agent.aiAssert('选中文件f_01.txt')

    await device.pressKey('end');
    await agent.aiAssert('选中文件f_30.txt')

    await device.pressKey('left');
    await agent.aiAssert('选中前一个文件f_29.txt')

    await device.pressKey('right');
    await agent.aiAssert('选中后一个文件f_30.txt')

    await device.pressKey('up');
    await agent.aiAssert('选中文件f_21.txt')

    await device.pressKey('down');
    await agent.aiAssert('选中文件f_30.txt')

    await agent.aiTap('f_13.txt')
    await device.pressKey('shift','home');
    await agent.aiAssert('选中文件f_13.txt之前的文件')

    await device.pressKey('shift','end');
    await agent.aiAssert('选中文件f_13.txt之后的文件')

    await agent.aiTap('f_13.txt')
    await device.pressKey('shift','left');
    await agent.aiAssert('选中文件f_13.txt和文件f_12.txt')

    await agent.aiTap('f_13.txt')
    await device.pressKey('shift','right');
    await agent.aiAssert('选中文件f_13.txt和文件f_14.txt')

    await agent.aiTap('f_13.txt')
    await device.pressKey('shift','up');
    await agent.aiAssert('选中文件f_13.txt和文件f_04.txt之间的文件')

    await agent.aiTap('f_13.txt')
    await device.pressKey('shift','down');
    await agent.aiAssert('选中文件f_13.txt和文件f_22.txt之间的文件')

    await device.pressKey('Ctrl','a');
    await agent.aiAssert('选中所有文件')

    //按下shitf，再选中其他文件
    await agent.aiTap('f_13.txt')
    await device.keyDown("shift")
    await agent.aiTap('f_25.txt')
    await device.keyUp("shift")
    await agent.aiAssert('选中文件f_13.txt和文件f_25.txt之间的文件')

    //ctrl，再选中其他文件
    await agent.aiTap('f_13.txt')
    await device.keyDown("ctrl")
    await agent.aiTap('f_25.txt')
    await device.keyUp("ctrl")
    await agent.aiAssert('选中文件f_13.txt和文件f_25.txt')

  }, { timeout: 600000, tags: ["1806877", "level3", "menu","DITT", "hushimin1"] });

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