/**
 * 用例 PMSID: 1964067
 * 用例标题: 【标签页支持右键固定】固定标签页+勾选“总是在新窗口打开文件夹”配置
 * 生成时间: 2026-07-14 18:52:14
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964067-【标签页支持右键固定】固定标签页+勾选总是在新窗口打开文件夹配置', () => {
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

  test('1964067-【标签页支持右键固定】固定标签页+勾选总是在新窗口打开文件夹配置', async ({ uos, agent, device, system }) => {
    //前置条件 1：固定标签页A，且A中有子文件夹A1
    console.log('前置条件 1：固定标签页A，且A中有子文件夹A1');
    await uos.openApp('文件管理器')
    await agent.aiTap('窗口左侧边栏的下载');
    await agent.aiDoubleClick('A')
    await agent.aiRightClick('标签A，左侧显示蓝色小点');
    await agent.aiTap('固定标签');

    // 前置条件 2：打开文管设置-总是在新窗口打开文件夹
    console.log("前置条件 2：打开文管设置-总是在新窗口打开文件夹")
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    const isBoxCheck = await agent.aiBoolean("总是在新窗口打开文件夹复选框是否勾选");
    if (isBoxCheck) {
        console.log("不需要勾选复选框")
    } else {
        console.log("需要勾选复选框");
        await agent.aiTap("总是在新窗口打开文件夹前面的复选框");
    }
    await device.pressKey("ESC")
    await system.exec('killall dde-file-manager');

    //步骤 1：在固定标签页A中双击打开A1，检查A1是否以新窗口2打开
    console.log('步骤 1：在固定标签页A中双击打开A1，检查A1是否以新窗口2打开');
    await uos.openApp('文件管理器')
    await agent.aiTap("标签A")
    await agent.aiDoubleClick('文件夹A1');
    await agent.aiAssert('重新打开了一个文件管理器窗口，标签栏存在A1标签');

    //步骤 2：在新打开的文管窗口2中，检查是否有固定标签页A
    console.log('步骤 2：在新打开的文管窗口2中，检查是否有固定标签页A');
    await agent.aiAssert('新打开的文管窗口中，标签栏存在固定标签页A');

    //步骤 3：在第一个文管窗口1中打开普通标签页并双击文件夹B，检查B是否以新窗口3打开
    console.log('步骤 3：在第一个文管窗口1中打开普通标签页并双击文件夹B，检查B是否以新窗口3打开');
    await agent.aiTap('任务栏文件管理器图标');
    await agent.aiTap('标题栏的+号');
    await agent.aiTap('窗口左侧边栏的下载');
    await agent.aiDoubleClick('B');
    await agent.aiAssert('重新打开了一个文件管理器窗口，标签栏存在B标签');

    //步骤 4：在新打开的文管窗口3中，检查是否有固定标签页A
    console.log('步骤 4：在新打开的文管窗口3中，检查是否有固定标签页A');
    await agent.aiAssert('新打开的文管窗口中，标签栏存在固定标签页A');
    await system.exec('killall dde-file-manager');

  }, { timeout: 1200000, tags: ['1964067', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ uos, agent, device }) => {

    console.log('7. afterEach: 每个测试后的清理');
    // 清理文管环境：取消勾选总在新窗口打开文件夹的复选框
    await uos.openApp('文件管理器')
    await agent.aiTap("右上角主菜单")
    await agent.aiTap("设置")
    const isBoxChecked = await agent.aiBoolean("总是在新窗口打开文件夹复选框是否勾选");
    if (isBoxChecked) {
        console.log("需要取消勾选复选框")
        await agent.aiTap("总是在新窗口打开文件夹前面的复选框");
    } else {
        console.log("不需要取消勾选复选框");
    }
    await device.pressKey("ESC")
  });

  afterAll(async ({ uos, system, agent, device }) => {
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
