/**
 * 用例 PMSID: 1936023
 * 用例标题: 【支持固定标签页】修改新窗口打开默认目录
 * 生成时间: 2026-01-29 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1936023-【支持固定标签页】修改新窗口打开默认目录', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/$USER/Videos/A1')

     });

  test('1936023-【支持固定标签页】修改新窗口打开默认目录', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器，并且最大化窗口
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-设置-新窗口目录
    console.log('步骤 2: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 3: 默认目录选择主目录
    console.log('步骤 3: 默认目录选择主目录');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的主目录',{ deepThink: true })
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为主目录
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为主目录');

    // 步骤 4: 进入主菜单-设置-新窗口目录
    console.log('步骤 4: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 5: 默认目录选择桌面
    console.log('步骤 5: 默认目录选择桌面');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的桌面')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为桌面
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为桌面');

    // 步骤 6: 进入主菜单-设置-新窗口目录
    console.log('步骤 6: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 7: 默认目录选择视频
    console.log('步骤 7: 默认目录选择视频');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的视频')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为视频
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为视频');

    // 步骤 8: 进入主菜单-设置-新窗口目录
    console.log('步骤 8: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 9: 默认目录选择音乐
    console.log('步骤 9: 默认目录选择音乐');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的音乐')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为音乐
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为音乐');

    // 步骤 10: 进入主菜单-设置-新窗口目录
    console.log('步骤 10: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 11: 默认目录选择图片
    console.log('步骤 11: 默认目录选择图片');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的图片')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为图片
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为图片');

    // 步骤 12: 进入主菜单-设置-新窗口目录
    console.log('步骤 12: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 13: 默认目录选择文档
    console.log('步骤 13: 默认目录选择文档');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的文档')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为图片
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为文档');

    // 步骤 14: 进入主菜单-设置-新窗口目录
    console.log('步骤 14: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 15: 默认目录选择下载
    console.log('步骤 15: 默认目录选择下载');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('下拉选项的下载')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为图片
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录为下载');

    // 步骤 16: 进入主菜单-设置-新窗口目录
    console.log('步骤 16: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 17: 默认目录选择指定目录
    console.log('步骤 17: 默认目录选择指定目录');
    await agent.aiTap('默认目录右侧的下拉选项')
    await agent.aiTap('指定目录')
    await agent.aiWaitFor('文件管理器界面显示');
    await agent.aiDoubleClick('视频')
    await agent.aiDoubleClick('A1')
    await agent.aiTap('打开')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //新打开一个文件管理器窗口，检查默认显示目录为图片
    await uos.openApp('文件管理器');
    await agent.aiAssert('打开的目录标签显示为A1');

  }, { timeout: 1800000, tags: ['1936023', 'level2', 'smoke', 'DITT', 'hushimin', '2500u1'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/Videos/A1')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
});
