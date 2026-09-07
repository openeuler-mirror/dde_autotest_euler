/**
 * 用例 PMSID: 1810047
 * 用例标题: 【1071桌面整理】整理桌面
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1810047-【1071桌面整理】整理桌面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/1810047.txt`)
    await system.exec(`touch /home/$USER/Desktop/1810047.png`)
    await system.exec(`touch /home/$USER/Desktop/1810047.mp4`)
    await system.exec(`touch /home/$USER/Desktop/1810047.mp3`)
    await system.exec(`mkdir /home/$USER/Desktop/1810047`)
    await system.exec(`touch /home/$USER/Desktop/1810047.xmind`)
  });

  test('1810047-【1071桌面整理】整理桌面', async ({ device, agent, uos , system}) => {
    // 步骤 1: 开启桌面整理，显示5个合集
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("整理桌面");
    await agent.aiAssert("桌面显示5个合集框");

    // 步骤 2: 右键菜单存在整理桌面
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiAssert("右键菜单存在整理桌面按钮");

    // 步骤 2: xmind文件没有被集合收纳
    await agent.aiTap("整理桌面");
    await agent.aiAssert("1810047.xmind文件显示在合集框外面");


  }, { timeout: 600000, tags: ['1810047', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1`)
    await system.exec(`rm -rf /home/$USER/Desktop/1810047*`)
  });
});