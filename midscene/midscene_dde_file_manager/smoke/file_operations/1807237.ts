/**
 * 用例 PMSID: 1807237
 * 用例标题: [034][core]预览-在桌面/文管按住空格键预览文件不松
 * 生成时间: 2025-12-15 13:22:54
 * 用例编写人: UT000649
 */

describe('1807237-[034][core]预览-在桌面/文管按住空格键预览文件不松', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807237-[034][core]预览-在桌面/文管按住空格键预览文件不松', async ({ device, agent, uos , system}) => {
    // 步骤 1: 桌面创建文件，预览
    await agent.aiTap("计算机图标");
    await device.pressKey(`space`)
    await agent.aiAssert("预览窗口显示正常");
    await agent.aiTap("预览窗口右上角关闭按钮:X");
    
    // 步骤 2: 进入文管桌面目录
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("侧边栏的音乐目录");
    await agent.aiWaitFor("音乐目录页面加载完成");

    // 步骤 3: 文管目录预览
    await agent.aiTap("bensound-sunny.mp3图标");
    await device.pressKey(`space`)
    await agent.aiAssert("预览窗口显示正常");
    await agent.aiTap("预览窗口右上角关闭按钮:X");

  }, { timeout: 1200000, tags: ['1807237', 'level2','smoke','huangtian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});