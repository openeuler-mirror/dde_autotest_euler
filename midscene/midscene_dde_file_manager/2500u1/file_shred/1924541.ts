/**
 * 用例 PMSID: 1924541
 * 用例标题: 【文件粉碎】粉碎开关打开再关闭
 * 生成时间: 2026-07-27 17:09:32
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1924541-【文件粉碎】粉碎开关打开再关闭', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent, uos, device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/Desktop/A`)
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

  test('1924541-【文件粉碎】粉碎开关打开再关闭', async ({ uos, agent, device }) => {
    // 步骤 1: 关闭文件粉碎开关
    console.log('步骤 1: 关闭文件粉碎开关');
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
    await agent.aiTap("右上角关闭按钮")

    //步骤 2: 右键桌面文件，检查没有文件粉碎选项
    console.log('步骤 2: 右键桌面文件，检查没有文件粉碎选项');
    await agent.aiRightClick('A')
    await agent.aiAssert('右键菜单不存在文件粉碎选项');
    await agent.aiTap("桌面空白区域")

  }, { timeout: 600000, tags: ['1924541', 'level4', '2500u1', 'hushimin'] });

  afterEach(async ({ agent, device, uos }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, system }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Desktop/A')
    await uos.showDesktop();
  });
});
