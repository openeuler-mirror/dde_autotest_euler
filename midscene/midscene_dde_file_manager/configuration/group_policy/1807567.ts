/**
 * 用例 PMSID: 1807567
 * 用例标题: 右键菜单整体隐藏，检查文件管理器最近使用窗口右键菜单情况
 * 生成时间: 2026-08-08 12:26:24
 * 用例编写人: UT002899（胡诗敏）
 */


describe('1807567-右键菜单整体隐藏，检查文件管理器最近使用窗口右键菜单情况', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/Desktop/A`)
    await system.exec(`cd ~/Desktop/A && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1807567.zip && unzip 1807567.zip  && rm 1807567.zip`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '["dde-file-manager", "org.deepin.dde-shell","dde-file-dialog","extension-menu"]'`);
  });

  test('1807567-右键菜单整体隐藏，检查文件管理器最近使用窗口右键菜单情况', async ({ device, agent, uos, system }) => {
    // 前置条件：在文件管理器最近使用目录制造数据
    console.log('前置条件：在文件管理器最近使用目录制造数据')
    await agent.aiDoubleClick('文件夹A')
    await agent.aiWaitFor("文件夹A显示已打开");
    await agent.aiDoubleClick('可可爱爱小猫咪.png');
    await agent.aiAssert('正常打开');
    await system.exec('killall deepin-image-viewer || true');

    await agent.aiDoubleClick('武汉介绍.txt');
    await agent.aiAssert('正常打开');
    await system.exec('killall deepin-editor || true');

    // 步骤 1：在文管最近使用窗口空白区域，单击右键
    console.log('步骤 1：在最近使用目录窗口空白区域，单击右键')
    await uos.openApp('文件管理器')
    await agent.aiTap('文件管理器窗口左侧边栏的最近使用')
    await agent.aiRightClick('最近使用目录空白区域', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 2：在文管最近使用窗口空白区域，使用alt+m唤起右键菜单
    console.log('步骤 2：在文管最近使用窗口空白区域，使用alt+m唤起右键菜单')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 3：在文管普最近使用窗口选中单个文件，单击右键
    console.log('步骤 3：在文管最近使用窗口选中单个文件，单击右键')
    await agent.aiRightClick('武汉介绍.txt', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 4：在文管最近使用窗口选中单个文件，使用alt+m唤起右键菜单
    console.log('步骤 4：在文管最近使用窗口选中单个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('最近使用目录空白区域')
    await agent.aiTap('武汉介绍.txt')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 5：在文管最近使用窗口选中多个文件，单击右键
    console.log('步骤 5：在文管最近使用窗口选中多个文件，单击右键')
    await device.keyDown('ctrl')
    await agent.aiTap('武汉介绍.txt')
    await agent.aiTap('可可爱爱小猫咪.png')
    await device.keyUp('ctrl')
    await agent.aiRightClick('武汉介绍.txt')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 6：在文管最近使用窗口选中多个文件，使用alt+m唤起右键菜单
    console.log('步骤 6：在文管最近使用窗口选中多个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('最近使用目录空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('武汉介绍.txt')
    await agent.aiTap('可可爱爱小猫咪.png')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

  }, {
    timeout: 600000, tags: ['1807567', 'level3', 'group_policy', 'hushimin']
  });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理环境
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '[]'`);
    await system.exec(`rm -rf ~/Desktop/A`)
    await system.exec(`killall dde-file-manager`)
  });
});