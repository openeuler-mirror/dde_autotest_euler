/**
 * 用例 PMSID: 1850141
 * 用例标题: 主目录、桌面、文档、下载、回收站
 * 生成时间: 2026-01-26 15:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1850141-主目录、桌面、文档、下载、回收站', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850141-主目录、桌面、文档、下载、回收站', async ({ device, system, agent, uos }) => {
    // 准备步骤: 打开文件管理器
    console.log('准备步骤: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 1: 在侧边栏选择主目录
    console.log('步骤 1: 在侧边栏选择主目录');
    await agent.aiTap('侧边栏中的主目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到主目录');

    // 预期 1: 验证页面已跳转到主目录
    console.log('预期 1: 验证页面已跳转到主目录');
    await agent.aiAssert('当前目录为主目录');

    // 步骤 2: 在侧边栏选择桌面目录
    console.log('步骤 2: 在侧边栏选择桌面目录');
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 预期 2: 验证页面已跳转到桌面目录
    console.log('预期 2: 验证页面已跳转到桌面目录');
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 在侧边栏选择下载
    console.log('步骤 3: 在侧边栏选择下载');
    await agent.aiTap('侧边栏中的下载', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到下载目录');

    // 预期 3: 验证页面已跳转到下载目录
    console.log('预期 3: 验证页面已跳转到下载目录');
    await agent.aiAssert('当前目录为下载目录');

    // 步骤 4: 在侧边栏选择文档
    console.log('步骤 4: 在侧边栏选择文档');
    await agent.aiTap('侧边栏中的文档', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到文档目录');

    // 预期 4: 验证页面已跳转到文档目录
    console.log('预期 4: 验证页面已跳转到文档目录');
    await agent.aiAssert('当前目录为文档目录');

    // 辅助步骤: 创建测试文件并删除
    let testfile = 'test.txt';
    console.log('辅助步骤: 创建测试文件并删除');
    await system.exec(`touch ~/Documents/${testfile}`);
    await agent.aiWaitFor(`文件管理器窗口内容区域有${testfile}文件`);

    await agent.aiRightClick(`文件管理器窗口内容区域的${testfile}文件`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('删除');
    await agent.aiWaitFor(`文件管理器窗口内容区域没有${testfile}文件`);

    // 步骤 5: 在侧边栏选择回收站
    console.log('步骤 5: 在侧边栏选择回收站');
    await agent.aiTap('侧边栏中的回收站', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到回收站目录');

    // 预期 5: 验证页面已跳转到回收站目录
    console.log('预期 5: 验证页面已跳转到回收站目录');
    await agent.aiAssert('当前目录为回收站目录');

    // 预期 6: 验证回收站目录有${testfile}文件
    console.log('预期 6: 验证回收站目录有${testfile}文件');
    await agent.aiAssert(`文件管理器窗口内容区域有${testfile}文件`);

  }, { timeout: 600000, tags: ['1850141', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'home', 'desktop', 'document', 'download', 'trash'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 清除视图和排序配置
    console.log('清除视图和排序配置');
    let re = await system.exec("echo > ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    if (re.success) {
      console.log('清除文件恢复成功');
    } else {
      console.log('清除文件恢复失败');
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
