/**
 * 用例 PMSID: 1810241
 * 用例标题: 【1071桌面整理】单次整理，拖拽桌面文件到符合规则集合内
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1810241-【1071桌面整理】单次整理，拖拽桌面文件到符合规则集合内', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810241-【1071桌面整理】单次整理，拖拽桌面文件到符合规则集合内', async ({ device, agent, uos , system}) => {
    // 步骤 1: 创建文件
    await system.exec(`touch /home/$USER/Desktop/1810241.txt`)

    // 步骤 2: 开启桌面整理
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("桌面整理");
    await agent.aiAssert("开启桌面整理，桌面右上角桌面整理文档分类聚合框内存在1810241.txt文件");

    // 步骤 3: 创建文件拖拽到聚合中
    await system.exec(`touch /home/$USER/Desktop/1810241-2.txt`)
    await agent.aiDrag("桌面1810241-2.txt文件","桌面右上角桌面整理文档分类聚合框内空白处");
    await agent.aiAssert("桌面右上角桌面整理文档分类聚合框内存在1810241-2.txt文件");

    // 步骤 4: 清理环境
    //await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 0`)
    //await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop.organizer -k enableOrganizer -v 1`)
   

  }, { timeout: 600000, tags: ['1810241', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
     await system.exec(`rm -rf /home/$USER/Desktop/1810241*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});