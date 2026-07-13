
/**
 * 用例 PMSID: 1806431
 * 用例标题: 文管选择窗-文件过滤
 * 生成时间: 2026-01-06 17:43:53
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806431-文管选择窗-文件过滤', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806431-文管选择窗-文件过滤', async ({ device, agent, uos, system }) => {
    await system.exec(`mkdir ~/Documents/1806431 & touch ~/Documents/1806431.txt & touch ~/Documents/1806431.mp3 & touch ~/Documents/1806431.mp4 & touch ~/Documents/1806431.jpg`, 500);
    //检查相册
    await uos.openApp("相册");
    await agent.aiTap('文管窗口右上角菜单按钮', { deepThink: true });
    await agent.aiTap('从文件夹导入');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口内只有1个文件夹名称显示为1806431');
    await device.pressKey('Esc');
    await uos.closeCurrentWindow();
    
    // 检查音乐
    await uos.openApp("音乐");
    await agent.aiTap('添加歌曲');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口内名称显示为“1806431.mp4、1806431.txt、1806431.jpg”文件名称比名称显示为“1806431.mp3”文件和名称显示为“1806431”文件夹名称颜色较浅');
    await device.pressKey('Esc');
    await agent.aiTap('添加歌曲目录');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口名称显示为“1806431.txt、1806431.mp3、1806431.mp4、1806431.jpg”文件对比文件夹内“1806431”文件夹名称颜色较浅');
    await device.pressKey('Esc');
    await system.exec('killall deepin-music & killall dde-file-dialog', 500);
    
    // 检查看图
    await uos.openApp("看图");
    await agent.aiTap('打开图片');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口内名称显示为“1806431.txt、1806431.mp3、1806431.mp4”文件名称对比文件夹内 “1806431”文件夹和名称显示为“1806431.jpg”文件名称颜色较浅');
    await device.pressKey('Esc');
    await uos.closeCurrentWindow();
    
    // 检查影院
    await uos.openApp("影院");
    await agent.aiTap('影院窗口中心');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口内名称显示为“1806431.mp3、1806431.txt、1806431.jpg”文件名称比名称显示为“1806431.mp4”文件和名称显示为“1806431”文件夹名称颜色较浅');
    await device.pressKey('Esc');
    await uos.closeCurrentWindow();
    // 检查归档管理器
    await uos.openApp("归档管理器");
    await agent.aiTap('选择文件');
    await agent.aiWaitFor('文管选择窗口已打开');
    await agent.aiTap('文管窗口左侧边栏文档');
    await agent.aiAssert('文管窗口内文件名称颜色显示一样');
    await device.pressKey('Esc');
    await uos.closeCurrentWindow();

  }, { timeout: 1200000, tags: ['1806431', 'level3', 'file_selection_dialog', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Documents/1806431* `, 500);
    //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall deepin-music & killall dde-file-dialog', 500);
    
  });
});
