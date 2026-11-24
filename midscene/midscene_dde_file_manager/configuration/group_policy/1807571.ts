/**
 * 用例 PMSID: 1807571
 * 用例标题: 右键菜单整体隐藏，检查文件选择对话框右键菜单情况
 * 生成时间: 2026-08-08 11:55:01
 * 用例编写人: UT002899（胡诗敏）
 */


describe('1807571-右键菜单整体隐藏，检查文件选择对话框右键菜单情况', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '["dde-file-manager", "org.deepin.dde-shell","dde-file-dialog","extension-menu"]'`);
    await system.exec(`mkdir -p ~/Documents/测试文件夹A ~/Documents/测试文件夹B`)
    await system.exec(`touch ~/Documents/aaa.txt ~/Documents/bbb.txt`)
  });

  test('1807571-右键菜单整体隐藏，检查文件选择对话框右键菜单情况', async ({ device, agent, uos, system }) => {
    // 步骤 1：在文件选择对话框内空白区域，单击右键
    console.log('步骤 1：在文件选择对话框内空白区域，单击右键')
    await uos.openApp('文本编辑器')
    await device.pressKey('ctrl','o')
    await agent.aiTap('文件管理器窗口左侧边栏的文档')
    await agent.aiRightClick('文件对话框内空白区域', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 2：在文件选择对话框内空白区域，使用alt+m唤起右键菜单
    console.log('步骤 2：在文件选择对话框内空白区域，使用alt+m唤起右键菜单')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 3：在文件选择对话框内选中单个文件，单击右键
    console.log('步骤 3：在文件选择对话框内选中单个文件，单击右键')
    await agent.aiRightClick('aaa.txt', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 4：在文件选择对话框内选中单个文件，使用alt+m唤起右键菜单
    console.log('步骤 4：在文件选择对话框内选中单个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('文件对话框空白区域')
    await agent.aiTap('aaa.txt')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 5：在文件选择对话框内选中单个文件夹，单击右键
    console.log('步骤 5：在文件选择对话框内选中单个文件夹，单击右键')
    await agent.aiTap('文件对话框空白区域')
    await agent.aiRightClick('测试文件夹A', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 6：在文件选择对话框内选中单个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 6：在文件选择对话框内选中单个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('文件对话框空白区域')
    await agent.aiTap('测试文件夹A')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 7：在文件选择对话框内选中多个文件，单击右键
    console.log('步骤 7：在文件选择对话框内选中多个文件，单击右键')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await device.keyUp('ctrl')
    await agent.aiRightClick('aaa.txt')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 8：在文件选择对话框内选中多个文件，使用alt+m唤起右键菜单
    console.log('步骤 8：在文件选择对话框内选中多个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 9：在文件选择对话框内选中多个文件夹，单击右键
    console.log('步骤 9：在文件选择对话框内选中多个文件夹，单击右键')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('测试文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 10：在文件选择对话框内选中多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 10：在文件选择对话框内选中多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 11：在文件选择对话框内选中多个文件+多个文件夹，单击右键
    console.log('步骤 11：在文件选择对话框内选中多个文件+多个文件夹，单击右键')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('测试文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 12：在文件选择对话框内选中多个文件+多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 12：在文件选择对话框内选中多个文件+多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('文件对话框空白区域')
    await device.keyDown('ctrl')
    await agent.aiTap('aaa.txt')
    await agent.aiTap('bbb.txt')
    await agent.aiTap('测试文件夹A')
    await agent.aiTap('测试文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

  }, {
    timeout: 900000, tags: ['1807571', 'level3', 'group_policy', 'hushimin']
  });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理环境
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '[]'`);
    await system.exec(`rm -rf ~/Documents/测试文件夹A ~/Documents/测试文件夹B ~/Documents/aaa.txt ~/Documents/bbb.txt`)
    await device.pressKey('Esc');
    await system.exec(`killall deepin-editor`)
  });
});