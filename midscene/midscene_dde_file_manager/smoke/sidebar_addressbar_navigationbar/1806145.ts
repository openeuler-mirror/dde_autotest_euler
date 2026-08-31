/**
 * 用例 PMSID: 1806145
 * 用例标题: 侧边栏目-查看主目录
 * 生成时间: 2026-02-11
 * 用例编写人: UT000211(陈依)
 */

describe('1806145-侧边栏目-查看主目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true'); 
    await device.pressKey('Esc');
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已出现');
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806145-侧边栏目-查看主目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，点击文件管理器侧边栏主目录，进入到主目录，主目录存在视频，图片，文档，下载，音乐，桌面，并且从左到右排序
    console.log("=== 步骤1：打开文件管理器并进入主目录，验证目录内容 ===");
    await uos.openApp('文件管理器');
    await agent.aiAssert("文件管理器窗口已打开");
    await device.pressKey('Super', 'Up');
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiAssert("当前目录为主目录");
    await agent.aiAssert("主目录视频文件夹");
    await agent.aiAssert("主目录中存在图片文件夹");
    await agent.aiAssert("主目录中存在文档文件夹");
    await agent.aiAssert("主目录中存在下载文件夹");
    await agent.aiAssert("主目录中存在音乐文件夹");
    await agent.aiAssert("主目录中存在桌面文件夹");
    await agent.aiAssert("主目录中的视频，图片，文档，下载，音乐，桌面文件夹从左到右依次排列", { deepThink: true });
    console.log("✅ 主目录包含所有必需的文件夹");

    // 步骤 2: 点击文档，并打开文档的右键菜单，右键菜单中存在选项"打开"，"在新窗口中打开"、在新标签中打开、属性，复制，共享此文件夹
    console.log("=== 步骤2：验证文档文件夹右键菜单选项 ===");
    await agent.aiRightClick("主目录中的文档文件夹");
    await agent.aiAssert("右键菜单中存在打开、在新窗口中打开、在新标签中打开、属性、复制、共享文件夹选项");
    await device.pressKey('Esc'); // 关闭右键菜单
    console.log("✅ 文档文件夹右键菜单包含所有必需选项");

    // 步骤 3: 按照步骤2，依次操作图片、下载、视频、音乐
    console.log("=== 步骤3：验证图片文件夹右键菜单选项 ===");
    await agent.aiRightClick("主目录中的图片文件夹");
    await agent.aiAssert("右键菜单中存在打开、在新窗口中打开、在新标签中打开、属性、复制、共享文件夹选项");
    await device.pressKey('Esc');
    console.log("✅ 图片文件夹右键菜单包含所有必需选项");

    console.log("=== 步骤4：验证下载文件夹右键菜单选项 ===");
    await agent.aiRightClick("主目录中的下载文件夹");
    await agent.aiAssert("右键菜单中存在打开、在新窗口中打开、在新标签中打开、属性、复制、共享文件夹选项");
    await device.pressKey('Esc');
    console.log("✅ 下载文件夹右键菜单包含所有必需选项");

    console.log("=== 步骤5：验证视频文件夹右键菜单选项 ===");
    await agent.aiRightClick("主目录中的视频文件夹");
    await agent.aiAssert("右键菜单中存在打开、在新窗口中打开、在新标签中打开、属性、复制、共享文件夹选项");
    await device.pressKey('Esc');
    console.log("✅ 视频文件夹右键菜单包含所有必需选项");

    console.log("=== 步骤6：验证音乐文件夹右键菜单选项 ===");
    await agent.aiRightClick("主目录中的音乐文件夹");
    await agent.aiAssert("右键菜单中存在打开、在新窗口中打开、在新标签中打开、属性、复制、共享文件夹选项");
    await device.pressKey('Esc');
    console.log("✅ 音乐文件夹右键菜单包含所有必需选项");

    // 步骤 4: 点击侧边栏系统盘，双击home目录，双击主目录，进入到主目录
    console.log("=== 步骤7：通过系统盘路径进入主目录 ===");
    await agent.aiTap("文件管理器侧边栏的系统盘");
    await agent.aiAssert("当前目录为系统盘");
    await agent.aiDoubleClick("系统盘中的home目录");
    await agent.aiAssert("当前目录为home目录");
    await agent.aiDoubleClick("home目录中的主目录");
    await agent.aiAssert("当前目录为主目录");
    console.log("✅ 通过系统盘路径成功进入主目录");

    // 步骤 5: 点击数据盘，进入到主目录，主目录存在视频，图片，文档，下载，音乐，桌面
    console.log("=== 步骤8：通过数据盘进入主目录并验证内容 ===");
    await agent.aiTap("文件管理器侧边栏的数据盘");
    await agent.aiAssert("目录中存在视频,图片,文档,下载，音乐，桌面文件夹");
    console.log("✅ 通过数据盘进入主目录，目录内容验证成功");

    console.log("===1806145-侧边栏目-查看主目录，执行成功===");

  }, { timeout: 1500000, tags: ["1806145", "level1", "smoke", "DITT", "chenyi"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
 
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文件管理器窗口
    await device.pressKey('Super', 'Down')
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await device.pressKey('Esc');
    // 显示桌面
    await uos.showDesktop();
  });
});
