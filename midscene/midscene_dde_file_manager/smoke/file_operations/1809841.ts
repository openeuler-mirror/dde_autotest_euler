/**
 * 用例 PMSID: 1809841
 * 用例标题: 【撤销交互】【桌面】复制文件后粘贴至其他文件夹，Ctrl+Z撤销粘贴操作，再利用Ctrl+Y恢复撤销
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809841-【撤销交互】【桌面】复制文件后粘贴至其他文件夹，Ctrl+Z撤销粘贴操作，再利用Ctrl+Y恢复撤销', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/$USER/Desktop/测试1.txt`)
  });

  test('1809841-【撤销交互】【桌面】复制文件后粘贴至其他文件夹，Ctrl+Z撤销粘贴操作，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos , system}) => {
     // 步骤 1: 复制test.txt文件
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的桌面");
    await agent.aiWaitFor("桌面目录页面加载完成");
    await agent.aiTap("测试1.txt");
    await device.pressKey(`Ctrl+C`)

    // 步骤 2: 粘贴test.txt文件到文档目录
    await agent.aiTap("侧边栏的文档");
    await agent.aiWaitFor("文档目录页面加载完成");
    await agent.aiRightClick("文档目录空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("粘贴");
    await agent.aiAssert("文档目录存在测试1.txt");

    // 步骤 3: 撤销粘贴操作
    await device.pressKey(`Ctrl+Z`)
    await agent.aiWaitFor("交互弹窗加载完成");
    await agent.aiTap("删除");
    await agent.aiAssert("文档目录无测试1.txt");

    // 步骤 4: 恢复新建文本文档
    await device.pressKey(`Ctrl+Y`)
    await agent.aiAssert("文档目录存在测试1.txt");

  }, { timeout: 600000, tags: ['1809841', 'level1',  'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/测试1*`)
    await system.exec(`rm -rf /home/$USER/Documents/测试1*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});