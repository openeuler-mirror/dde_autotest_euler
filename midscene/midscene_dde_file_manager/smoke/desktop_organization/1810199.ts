/**
 * 用例 PMSID: 1810199
 * 用例标题: 【1071桌面整理】单次整理，集合空白处-新建文档
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1810199-【1071桌面整理】单次整理，集合空白处-新建文档', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/1810199.txt`)
  });

  test('1810199-【1071桌面整理】单次整理，集合空白处-新建文档', async ({ device, agent, uos , system}) => {
    // 步骤 1: 开启桌面整理
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("桌面整理");
    await agent.aiAssert("开启桌面整理，桌面右上角桌面整理文档分类聚合框内存在1810199.txt文件");

    // 步骤 2: 新建文件散落在桌面
    await system.exec(`echo 1> /home/$USER/Desktop/1810199.docx`)
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内不存在1810199.docx文件");
    await system.exec(`echo 1> /home/$USER/Desktop/1810199.xlsx`)
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内不存在1810199.xlx文件");
    await system.exec(`echo 1> /home/$USER/Desktop/1810199.pptx`)
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内不存在1810199.pptx文件");
    await system.exec(`echo 1> /home/$USER/Desktop/1810199-2.txt`)
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内不存在1810199-2.txt文件");
    await system.exec(`echo 1> /home/$USER/Desktop/1810199-2.wps`)
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内不存在1810199.wps文件");

    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1`)

  }, { timeout: 600000, tags: ['1810199', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0`)
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1`)
    await system.exec(`rm -rf /home/$USER/Desktop/1810199*`)
  });
});