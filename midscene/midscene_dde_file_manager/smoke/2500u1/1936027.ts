/**
 * 用例 PMSID: 1936027
 * 用例标题: 【支持固定标签页】新窗口添加/删除多个自定义目录
 * 生成时间: 2026-01-29 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1936027-【支持固定标签页】新窗口添加/删除多个自定义目录', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建文件夹作为前置条件，后续测试
    await system.exec('mkdir /home/$USER/Videos/A1')
    await system.exec('mkdir /home/$USER/Music/B1')
    await system.exec('mkdir /home/$USER/Pictures/C2')
    await system.exec('mkdir /home/$USER/Documents/D1')

  });

  test('1936027-【支持固定标签页】新窗口添加/删除多个自定义目录', async ({ system, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 进入主菜单-设置-新窗口目录
    console.log('步骤 2: 进入主菜单-设置-新窗口目录');
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')

    // 步骤 3: 新窗口选择视频-A1
    console.log('步骤 3: 新窗口选择视频-A1');
    await agent.aiTap('自定义目录右侧的+号')
    await agent.aiDoubleClick('视频')
    await agent.aiTap('A1')
    await agent.aiTap('打开')

    // 步骤 4: 新窗口选择音乐-B1
    console.log('步骤 3: 新窗口选择音乐-B1');
    await agent.aiTap('自定义目录右侧的+号')
    await agent.aiDoubleClick('音乐')
    await agent.aiTap('B1')
    await agent.aiTap('打开')

    // 步骤 5: 新窗口选择图片-C1
    console.log('步骤 5: 新窗口选择图片-C1');
    await agent.aiTap('自定义目录右侧的+号')
    await agent.aiDoubleClick('图片')
    await agent.aiTap('C2')
    await agent.aiTap('打开')

    // 步骤 6: 新窗口选择文档-D1
    console.log('步骤 3: 新窗口选择文档-D1');
    await agent.aiTap('自定义目录右侧的+号')
    await agent.aiDoubleClick('文档')
    await agent.aiTap('D1')
    await agent.aiTap('打开')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    // 步骤 7: 打开文件管理器，检查标签页
    console.log('步骤 7: 打开文件管理器，检查标签页');
    await uos.openApp('文件管理器');
    await agent.aiAssert('显示5个标签页，分别为计算机、A1、B1、C2、D1');
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')

    //步骤 8：删除目录B1，检查添加目录状态
    console.log('步骤 8：删除目录B1，检查添加目录状态');
    await uos.openApp('文件管理器')
    await agent.aiTap('窗口主菜单')
    await agent.aiTap('设置')
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('新窗口')
    await agent.aiTap('/home/$USER/Music/B1右侧的删除图标')
    await agent.aiTap('自定义目录右侧的+号')
    await agent.aiWaitFor('文件管理器界面显示');
    await agent.aiTap('文件对话框的取消')



  }, { timeout: 1800000, tags: ['1936027', 'level2', 'smoke', 'DITT', 'hushimin', '2500u1'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    //还原环境
    console.log('步骤 9：删除所有自定义的目录');
    await agent.aiWaitFor('设置窗口已显示');
    await agent.aiTap('/home/$USER/Videos/A1右侧的删除图标')
    await agent.aiTap('/home/$USER/Pictures/C2右侧的删除图标')
    await agent.aiTap('/home/$USER/Documents/D1右侧的删除图标')
    //关闭设置窗口
    await agent.aiTap('设置窗口关闭按钮')
    //关闭文管窗口
    await system.exec('killall dde-file-manager')
    console.log('步骤 10: 打开文件管理器，检查标签页');
    await uos.openApp('文件管理器');
    await agent.aiAssert('显示1个标签页，为计算机');

    //删除测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/Videos/A1')
    await system.exec('rm -rf /home/$USER/Music/B1')
    await system.exec('rm -rf /home/$USER/Pictures/C1')
    await system.exec('rm -rf /home/$USER/Documents/D1')

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
