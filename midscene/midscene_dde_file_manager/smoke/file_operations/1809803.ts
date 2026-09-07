/**
 * 用例 PMSID: 1809803
 * 用例标题: 【撤销交互】【桌面】新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809803-【撤销交互】【桌面】新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent ,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`rm -rf /home/$USER/Desktop/新建*`)
  });

  test('1809803-【撤销交互】【桌面】新建文件后Ctrl+Z撤销新建操作，再利用Ctrl+Y恢复撤销', async ({ device, agent, uos , system}) => {
    // 步骤 1: 桌面创建文件
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await agent.aiTap("桌面空白处");
    await agent.aiWaitFor("桌面文件创建完成");

    // 步骤 2: 撤销新建文本文档
    await device.pressKey(`Ctrl+Z`)
    await agent.aiWaitFor("弹出撤销提示窗口");
    await agent.aiTap("弹窗右侧删除按钮");
    await agent.aiAssert("桌面无新建文本.txt文件");
    
    // 步骤 3: 恢复新建文本文档
    await device.pressKey(`Ctrl+Y`)
    await agent.aiAssert("桌面存在新建文本.txt文件");

  }, { timeout: 600000, tags: ['1809803', 'level1',  'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/新建*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});