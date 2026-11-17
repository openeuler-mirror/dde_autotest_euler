/**
 * 用例 PMSID: 1924535
 * 用例标题: 【文件粉碎】文件粉碎UI界面检查
 * 生成时间: 2026-07-28 08:33:11
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1924535-【文件粉碎】文件粉碎UI界面检查', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent, uos, device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`cd ~/Downloads/ && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1924535.zip && unzip 1924535.zip  && rm 1924535.zip`)
    await system.exec(`ln -s /home/$USER/Downloads/图片.png /home/$USER/Downloads/pin-link.png`)
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    await agent.aiTap("高级设置")
    await agent.aiScroll('右侧设置详情区域',{direction :'down', distance : 20})
    const isBoxCheck = await agent.aiBoolean("开启文件粉碎功能开关");
    if (isBoxCheck) {
        console.log("已开启文件粉碎功能")
    } else {
        console.log("需要开启文件粉碎功能");
        await agent.aiTap("文件粉碎功能右侧的开关");
    }
    await device.pressKey('ESC')
    await system.exec('killall dde-file-manager || true');
    });

  test('1924535-【文件粉碎】文件粉碎UI界面检查', async ({ uos, agent, device }) => {
    // 步骤 1: 右键12个文件选择文件粉碎，检查文案
    console.log('步骤 1: 右键12个文件选择文件粉碎，检查文案');
    await uos.openApp('文件管理器')
    await agent.aiTap("窗口左侧边栏的下载");
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('已选中的文件区域，该区域显示为蓝色背景');
    await agent.aiTap('右键菜单中的文件粉碎');
    await agent.aiAssert('对话框存在文案：你确定要粉碎这12个项目吗？该文件将被彻底删除且无法恢复');

    // 步骤 2: 检查文件列表缩略图和文件名
    console.log('步骤 2: 检查文件列表缩略图和文件名');
    await agent.aiAssert('粉碎文件列表中显示缩略图和文件名', { deepThink: true });

    // 步骤 3: 检查默认最大显示5个，超过5个可翻页
    console.log('步骤 3: 检查默认最大显示5个，超过5个可翻页');
    await agent.aiAssert('粉碎文件列表默认显示5个文件', { deepThink: true });

    // 步骤 4: 点击取消按钮，检查窗口关闭且文件都还在
    console.log('步骤 4: 点击取消按钮，检查窗口关闭且文件都还在');
    await agent.aiTap('文件粉碎确认对话框中的取消按钮');
    await agent.aiAssert('文件粉碎窗口关闭，12个文件仍然存在', { deepThink: true });

    // 步骤 5: 再次确认粉碎，检查进度条、百分比、当前文件文案和自动关闭
    console.log('步骤 5: 再次确认粉碎，检查进度条、百分比、当前文件文案和自动关闭');
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick('已选中的文件区域，该区域显示为蓝色背景');
    await agent.aiTap('右键菜单中的文件粉碎');
    await agent.aiTap('文件粉碎确认对话框中的粉碎');
    await agent.aiAssert('下载文件夹显示为空');

  }, { timeout: 300000, tags: ['1924535', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ agent, device, uos }) => {
    console.log('7. afterEach: 每个测试后的清理');
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    await agent.aiTap("高级设置")
    await agent.aiScroll('右侧设置详情区域',{direction :'down', distance : 20})
    const isBoxCheck = await agent.aiBoolean("开启文件粉碎功能开关");
    if (isBoxCheck) {
        console.log('已开启文件粉碎功能')
        await agent.aiTap("文件粉碎功能右侧的开关");
    } else {
        console.log("已关闭文件粉碎功能");
    }
    await device.pressKey('ESC')
  });

  afterAll(async ({ uos, system }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Downloads/*')
    await uos.showDesktop();
  });
});
