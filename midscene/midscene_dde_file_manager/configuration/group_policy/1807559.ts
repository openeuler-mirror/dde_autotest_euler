/**
 * 用例 PMSID: 1807559
 * 用例标题: 右键菜单整体隐藏，检查文件管理器搜索结果页窗口右键菜单情况
 * 生成时间: 2026-08-10 10:37:24
 * 用例编写人: UT002899（胡诗敏）
 */

describe('1807559-右键菜单整体隐藏，检查文件管理器搜索结果页窗口右键菜单情况', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 前置条件： 设置组策略-隐藏右键菜单
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '["dde-file-manager", "org.deepin.dde-shell","dde-file-dialog","extension-menu"]'`);
    await system.exec(`mkdir -p ~/Downloads/哈哈哈文件夹A ~/Downloads/哈哈哈文件夹B`)
    await system.exec(`touch ~/Downloads/哈哈哈文件aaa.txt ~/Downloads/哈哈哈文件bbb.txt`)
     });

  test('1807559-右键菜单整体隐藏，检查文件管理器搜索结果页窗口右键菜单情况', async ({ device, agent, uos, system, env }) => {
    // 前置条件 ：搜索文件
    await uos.openApp('文件管理器')
    await agent.aiTap('含有搜索的输入框')
    await device.typeText('哈哈哈 ')
    await agent.aiWaitFor('搜索结果均包含哈哈哈文案')

    // 步骤 1：在文管搜索结果页窗口空白区域，单击右键
    console.log('步骤 1：在文管搜索结果页窗口空白区域，单击右键')
    await agent.aiRightClick('当前目录空白位置', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 2：在文管搜索结果页窗口空白区域，使用alt+m唤起右键菜单
    console.log('步骤 2：在文管搜索结果页窗口空白区域，使用alt+m唤起右键菜单')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 3：在文管搜索结果页窗口选中单个文件，单击右键
    console.log('步骤 3：在文管搜索结果页窗口选中单个文件，单击右键')
    await agent.aiRightClick('哈哈哈文件aaa.txt', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 4：在文管搜索结果页窗口选中单个文件，使用alt+m唤起右键菜单
    console.log('步骤 4：在文管搜索结果页窗口选中单个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('当前目录空白位置')
    await agent.aiTap('哈哈哈文件aaa.txt')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 5：在文管搜索结果页窗口选中单个文件夹，单击右键
    console.log('步骤 5：在文管搜索结果页窗口选中单个文件夹，单击右键')
    await agent.aiTap('当前目录空白位置')
    await agent.aiRightClick('哈哈哈文件夹A', { deepThink: true })
    await agent.aiAssert('不显示右键菜单')

    // 步骤 6：在文管搜索结果页窗口选中单个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 6：在文管搜索结果页窗口选中单个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('当前目录空白位置')
    await agent.aiTap('哈哈哈文件夹A')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 7：在文管搜索结果页窗口选中多个文件，单击右键
    console.log('步骤 7：在文管搜索结果页窗口选中多个文件，单击右键')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件aaa.txt')
    await agent.aiTap('哈哈哈文件bbb.txt')
    await device.keyUp('ctrl')
    await agent.aiRightClick('哈哈哈文件aaa.txt')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 8：在文管搜索结果页窗口选中多个文件，使用alt+m唤起右键菜单
    console.log('步骤 8：在文管搜索结果页窗口选中多个文件，使用alt+m唤起右键菜单')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件aaa.txt')
    await agent.aiTap('哈哈哈文件bbb.txt')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 9：在文管搜索结果页窗口选中多个文件夹，单击右键
    console.log('步骤 9：在文管搜索结果页窗口选中多个文件夹，单击右键')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件夹A')
    await agent.aiTap('哈哈哈文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('哈哈哈文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 10：在文管搜索结果页窗口选中多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 10：在文管搜索结果页窗口选中多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件夹A')
    await agent.aiTap('哈哈哈文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 11：在文管搜索结果页箱窗口选择对话框内选中多个文件+多个文件夹，单击右键
    console.log('步骤 11：在文管搜索结果页窗口选中多个文件+多个文件夹，单击右键')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件aaa.txt')
    await agent.aiTap('哈哈哈文件bbb.txt')
    await agent.aiTap('哈哈哈文件夹A')
    await agent.aiTap('哈哈哈文件夹B')
    await device.keyUp('ctrl')
    await agent.aiRightClick('哈哈哈文件夹A')
    await agent.aiAssert('不显示右键菜单')

    // 步骤 12：在文管搜索结果页窗口选中多个文件+多个文件夹，使用alt+m唤起右键菜单
    console.log('步骤 12：在文管搜索结果页窗口选中多个文件+多个文件夹，使用alt+m唤起右键菜单')
    await agent.aiTap('当前目录空白位置')
    await device.keyDown('ctrl')
    await agent.aiTap('哈哈哈文件aaa.txt')
    await agent.aiTap('哈哈哈文件bbb.txt')
    await agent.aiTap('哈哈哈文件夹A')
    await agent.aiTap('哈哈哈文件夹B')
    await device.keyUp('ctrl')
    await device.pressKey('alt','m')
    await agent.aiAssert('不显示右键菜单')

  }, {
    timeout: 1200000, tags: ['1807559', 'level3', 'group_policy', 'hushimin']
  });

  afterEach(async ({ agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    // 后置步骤：清理环境
    await system.exec("rm -rf ~/Downloads/哈哈哈*");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.menu.hidden -v '[]'`);
  });
});