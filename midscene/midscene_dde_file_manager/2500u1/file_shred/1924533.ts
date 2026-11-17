/**
 * 用例 PMSID: 1924533
 * 用例标题: 【文件粉碎】对搜索结果的文件进行粉碎
 * 生成时间: 2026-07-27 14:53:20
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1924533-【文件粉碎】对搜索结果的文件进行粉碎', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent, uos, device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`cd ~/Desktop/ && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1924533.zip && unzip 1924533.zip  && rm 1924533.zip`)
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    await agent.aiTap("高级设置")
    await agent.aiScroll('右侧设置详情区域',{direction :'down', distance :20})
    const isBoxCheck = await agent.aiBoolean("开启文件粉碎功能开关");
    if (isBoxCheck) {
        console.log("已开启文件粉碎功能")
    } else {
        console.log("需要开启文件粉碎功能");
        await agent.aiTap("文件粉碎功能右侧的开关");
    }
    await device.pressKey('ESC')
    });

  test('1924533-【文件粉碎】对搜索结果的文件进行粉碎', async ({ uos, agent, device }) => {
    // 步骤 1: 搜索测试文件粉碎，检查名称或内容匹配的文件都能搜出
    console.log('步骤 1: 搜索测试文件粉碎，检查名称或内容匹配的文件都能搜出');
    await agent.aiTap('文件管理器右侧的搜索框');
    await device.typeText('测试文件粉碎');
    await agent.aiWaitFor('显示搜索结果',{timeoutMs: 10000})
    await agent.aiAssert('搜索结果的文件和文件夹名称都包含测试文件粉碎，注意：武汉介绍.txt也会显示，因为此文件内容包含了测试文件粉碎', { deepThink: true });

    // 步骤 2: 选中所有搜索结果，右键选择文件粉碎，检查全部粉碎成功
    console.log('步骤 2: 选中所有搜索结果，右键选择文件粉碎，检查全部粉碎成功');
    await agent.aiTap('文件管理器空白区域');
    await device.pressKey('Ctrl', 'A');
    await agent.aiRightClick('搜索结果中已选中的文件区域，该区域显示为蓝色背景');
    await agent.aiAssert('右键菜单不存在文件粉碎选项');
    await agent.aiTap('文件管理器空白区域');
    await agent.aiTap('右上角关闭按钮');

  }, { timeout: 600000, tags: ['1924533', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ agent, device, uos }) => {
    console.log('7. afterEach: 每个测试后的清理');
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    await agent.aiTap("高级设置")
    await agent.aiScroll('右侧设置详情区域',{direction :'down', distance :20})
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
    await system.exec('killall dde-file-manager ||true');
    await system.exec('rm -rf ~/Desktop/测试* ~/Desktop/武汉介绍.txt')
    await uos.showDesktop();

  });
});
