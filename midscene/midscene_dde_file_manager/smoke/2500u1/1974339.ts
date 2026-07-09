/**
 * 用例 PMSID: 1974339
 * 用例标题: 【在新标签页中打开新文件夹】修改从新标签打开默认目录
 * 生成时间: 2026-01-29 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1974339-【在新标签页中打开新文件夹】修改从新标签打开默认目录', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
     });

  test('1974339-【在新标签页中打开新文件夹】修改从新标签打开默认目录', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-设置-新标签目录-
    console.log('步骤 2: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 3: 从新标签打开选择计算机，打开新标签进入计算机目录
    console.log('步骤 3: 从新标签打开选择计算机，打开新标签进入计算机目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的计算机')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('计算机标签后面的+号')
    await agent.aiAssert('标签页显示为计算机');

    // 步骤 4: 进入主菜单-设置-新标签目录
    console.log('步骤 4: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 5: 从新标签打开选择主目录，打开新标签进入主目录目录
    console.log('步骤 5: 从新标签打开选择主目录，打开新标签进入主目录目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的主目录')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('计算机标签后面的+号')
    await agent.aiAssert('标签页显示为主目录');

    // 步骤 6: 进入主菜单-设置-新标签目录
    console.log('步骤 6: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 7: 从新标签打开选择桌面，打开新标签进入桌面目录
    console.log('步骤 7: 从新标签打开选择桌面，打开新标签进入桌面目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的桌面')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('主目录标签后面的+号')
    await agent.aiAssert('标签页显示为桌面');

    // 步骤 8: 进入主菜单-设置-新标签目录
    console.log('步骤 8: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 9: 从新标签打开选择视频，打开新标签进入视频目录
    console.log('步骤 9: 从新标签打开选择视频，打开新标签进入视频目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的视频')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('桌面标签后面的+号')
    await agent.aiAssert('标签页显示为视频');

    // 步骤 10: 进入主菜单-设置-新标签目录
    console.log('步骤 10: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 11: 从新标签打开选择音乐，打开新标签进入音乐目录
    console.log('步骤 11: 从新标签打开选择音乐，打开新标签进入音乐目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的音乐')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('视频标签后面的+号')
    await agent.aiAssert('标签页显示为音乐');

    // 步骤 12: 进入主菜单-设置-新标签目录
    console.log('步骤 12: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 13: 从新标签打开选择图片，打开新标签进入图片目录
    console.log('步骤 13: 从新标签打开选择图片，打开新标签进入图片目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的图片')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('音乐标签后面的+号')
    await agent.aiAssert('标签页显示为图片');

    // 步骤 14: 进入主菜单-设置-新标签目录
    console.log('步骤 14: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 15: 从新标签打开选择文档，打开新标签进入文档目录
    console.log('步骤 15: 从新标签打开选择文档，打开新标签进入文档目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的文档')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('图片标签后面的+号')
    await agent.aiAssert('标签页显示为文档');

    // 步骤 16: 进入主菜单-设置-新标签目录
    console.log('步骤 16: 进入主菜单-设置-新标签目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')

    // 步骤 17: 从新标签打开选择下载，打开新标签进入下载目录
    console.log('步骤 17: 从新标签打开选择下载，打开新标签进入下载目录');
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的下载')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //打开新标签，标签页目录为计算机
    await agent.aiTap('文档标签后面的+号')
    await agent.aiAssert('标签页显示为下载');

    //还原环境：从新标签打开
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新标签')
    await agent.aiTap('从新标签打开右侧的下拉选项')
    await agent.aiTap('下拉选项的当前目录')

  }, { timeout: 1800000, tags: ['1974339', 'level2', 'smoke', 'DITT', 'hushimin', '2500u1'] });
  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

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
