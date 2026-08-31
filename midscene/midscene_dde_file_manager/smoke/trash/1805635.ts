// @ts-nocheck

/**
 * 用例 PMSID: 1805635
 * 用例标题: [106]添加数据到回收站-其他本地目录快捷键delete删除文件/文件夹
 * 生成时间：2026-01-20 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805635-[106]添加数据到回收站-其他本地目录快捷键delete删除文件/文件夹', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805635-[106]添加数据到回收站-其他本地目录快捷键delete删除文件/文件夹', async ({ device, agent, uos, system }) => {
    // 步骤1：从启动器打开文件管理器，点击侧边栏的“图片”目录
    await system.exec('rm -rf ~/Pictures/pic5635.txt')
    await system.exec('rm -rf ~/Videos/file*')
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor("文件管理器已打开");
    
    // 点击侧边栏的“图片”目录
    await agent.aiTap("左侧侧边栏的图片目录");
    
    // 在图片目录的空白处，右键hover到新建文档，点击“文本文档”
    await agent.aiRightClick("图片目录的空白区域");
    await agent.aiHover("新建文档");
    await agent.aiWaitFor("右键菜单加载完成")
    await agent.aiTap("文本文档");
    
    // 重命名为“pic5635”
    await device.typeText("pic5635");
    await device.pressKey("Enter");
    await agent.aiWaitFor("pic5635命名成功")
    await device.pressKey("Delete");
    
    // 步骤2：点击侧边栏的“视频”目录
    await agent.aiTap("左侧侧边栏的视频目录");
    
    // 利用ctrl+shift+n快捷键新建文件夹、命名并删除
    const folderNames = ['file', 'file2'];
    for (const folderName of folderNames) {
      await device.pressKey("ctrl+shift+N");
      await agent.aiWaitFor("文件夹创建成功")
      await device.typeText(folderName); // 直接命名新文件夹
      await device.pressKey("Enter"); // 确认新建文件夹
      await agent.aiWaitFor(folderName+"处于选中的状态")
      await device.pressKey("Delete"); // 删除文件夹
      await agent.aiWaitFor("视频目录无"+folderName+"文件夹")
    }
    
    // 步骤3：点击侧边栏的“回收站”目录
    await agent.aiTap("左侧侧边栏的回收站目录");
    
    // 断言回收站内有“pic5635
    // ”文件、file文件夹、file2文件夹
    await agent.aiAssert("回收站内包含pic5635、file、file2");
    
    // 步骤5：点击右上角的清空按钮
    await agent.aiTap("页面右上角的清空按钮");
    
    // 等清空弹框加载完成，点击“清空”
    await agent.aiWaitFor("清空回收站弹框已出现");
    await agent.aiTap("清空");
    
    // 关闭文件管理器界面
     await system.exec('killall dde-file-manager', 500);
    
  }, { timeout: 600000, tags: ['1805635', 'level2', 'smoke', 'trash', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async () => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
  });
});