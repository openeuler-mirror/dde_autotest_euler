/**
 * 用例 PMSID: 1964069
 * 用例标题: 【标签页支持右键固定】固定标签页+不勾选“总是在新窗口打开文件夹”配置
 * 生成时间: 2026-07-15 15:17:22
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1964069-【标签页支持右键固定】固定标签页+不勾选总是在新窗口打开文件夹配置', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A/A1 ~/Downloads/B');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1964069-【标签页支持右键固定】固定标签页+不勾选总是在新窗口打开文件夹配置', async ({ uos, agent, device, system }) => {
    //前置条件 1：固定标签页A，且A中有子文件夹A1
    console.log('前置条件 1：固定标签页A，且A中有子文件夹A1');
    await uos.openApp('文件管理器')
    await agent.aiTap('当前窗口左侧边栏的下载');
    await agent.aiDoubleClick('A')
    await agent.aiRightClick('标签A，左侧显示蓝色小点');
    await agent.aiTap('固定标签');

    // 前置条件 2：打开文管设置-总是在新窗口打开文件夹不勾选
    console.log("前置条件 2：打开文管设置-总是在新窗口打开文件夹不勾选")
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    const isBoxCheck = await agent.aiBoolean("总是在新窗口打开文件夹复选框是否勾选");
    if (isBoxCheck) {
        console.log("需要取消勾选复选框")
        await agent.aiTap("总是在新窗口打开文件夹前面的复选框");
    } else {
        console.log("不需要取消勾选复选框");
            }
    await device.pressKey("ESC")
    await system.exec('killall dde-file-manager');

    // 步骤 1：在固定标签页A中双击打开A1，检查A1是否以新标签页打开
    console.log('步骤 1：在固定标签页A中双击打开A1，检查A1是否以新标签页打开');
    await uos.openApp('文件管理器')
    await agent.aiTap("标签A")
    await agent.aiDoubleClick('文件夹A1');
    await agent.aiAssert('在当前窗口打开新标签页，标签栏显示标签A1');

    // 步骤 2：点击+打开普通标签页，在普通标签页中双击文件d夹B，检查B是否从当前标签页打开
    console.log('步骤 2：点击+打开普通标签页，在普通标签页中双击文件夹B，检查B是否从当前标签页打开');
    await agent.aiTap('标题栏的+号');
    await agent.aiTap('窗口左侧侧边栏的下载');
    await agent.aiDoubleClick('B');
    await agent.aiAssert('在当前窗口打开新标签页，标签栏显示标签B');

  }, { timeout: 900000, tags: ['1964069', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, system,agent }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Downloads/A ~/Downloads/B');
    await uos.showDesktop();
  });
});
