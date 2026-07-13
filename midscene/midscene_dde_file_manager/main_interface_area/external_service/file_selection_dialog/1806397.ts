
/**
 * 用例 PMSID: 1806397
 * 用例标题: 文管选择窗-单个文件夹/文件右键操作
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806397-文管选择窗-单个文件夹/文件右键操作', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806397-文管选择窗-单个文件夹/文件右键操作', async ({ device, agent, uos, system }) => {
    await system.exec(`touch ~/Documents/1806397.txt & mkdir ~/Documents/1806397`, 500);
    //复制
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+o');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiRightClick('文管窗口内1806397.txt上方文件图标');
    await agent.aiAssert('右键菜单存在“打开、剪切、复制、重名名、删除”');
    console.log('开始执行复制');
    await agent.aiTap('复制')
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('粘贴')
    await agent.aiAssert('文管窗口内多出一个文件1806397（副本）.txt');
    //删除
    console.log('开始执行删除');
    await agent.aiRightClick('文管窗口内1806397.txt上方文件图标');
    await agent.aiTap('删除')
    await agent.aiRightClick('1806397（副本）.txt上方文件图标');
    await agent.aiTap('删除')
    await agent.aiAssert('文管窗口内不存在文件1806397.txt');
    //剪切
    console.log('开始执行剪切');
    await agent.aiRightClick('文管窗口内1806397');
    await agent.aiAssert('右键菜单存在“打开、剪切、复制、重名名、删除”');
    await agent.aiTap('剪切')
    await agent.aiTap('文管窗口左侧边栏下载');
    await agent.aiRightClick('文管窗口内空白处');
    await agent.aiTap('粘贴')
    await agent.aiAssert('文管窗口内多出一个文件夹1806397');
    //重命名
    console.log('开始执行重命名');
    await agent.aiRightClick('文管窗口内1806397');
    await agent.aiTap('重命名')
    await device.typeText('1806397a', true);
    await agent.aiAssert('文管窗口内不存在文件夹1806397,文管窗口内存在文件夹1806397a');
    //打开文件夹
    // await device.pressKey('Enter');
    await agent.aiRightClick('文管窗口内1806397a');
    await agent.aiTap('右键菜单中打开')
    await agent.aiAssert('成功进入文件夹1806397a内');

  }, { timeout: 1200000, tags: ['1806397', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Documents/1806397* & rm -rf ~/Downloads/1806397* & rm -rf ~/Desktop/1806397* `, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
  });
});
