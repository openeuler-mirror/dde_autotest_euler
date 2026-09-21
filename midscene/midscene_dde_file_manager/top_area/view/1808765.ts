/**
 * 用例 PMSID: 1808765
 * 用例标题: 树状结构-默认展示检查
 * 生成时间: 2026-01-04 21:07:47
 * 用例编写人: UT000244（李庆玲）
 */

describe('1808765-树状结构-默认展示检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //恢复文件管理器设置
    await system.cleanupFileManager();
  });
  
  test('1808765-树状结构-默认展示检查', async ({ device, agent, uos, system, env }) => {
    // 步骤1：打开文件管理器
    await uos.openApp("文件管理器");
    
    // 步骤2：在文档目录中创建嵌套文件夹结构
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/1808765_1/1808765_2/1808765_3/`);

    // 步骤4：点击对应目录右侧树状视图中的1808756_1文件夹
    await agent.aiTap("左侧导航栏文档目录");
    await agent.aiRightClick('文档目录右侧中间空白处');
    await agent.aiHover('显示方式');
    await agent.aiTap('树状视图');
    await agent.aiTap('文档目录右侧中间空白处');
    await agent.aiRightClick('文档目录右侧中间空白处');
    await agent.aiHover('显示方式');
    await agent.aiAssert('树状视图被勾选');
    await agent.aiTap('文档目录右侧中间空白处', 500);

    // 步骤5：树形列表所有目录默认为折叠状态
    await agent.aiAssert('1808765_1文件夹前面的箭头方向指向右,默认为折叠状态');
    
    // 步骤8：多层级文件点击展开按钮查看子目录结构
    await agent.aiTap("1808765_1目录左侧的展开按钮", 500);
    await agent.aiAssert('1808765_2文件夹前面的箭头方向指向右');
    await agent.aiTap("1808765_2目录左侧的展开按钮", 500);
    await agent.aiAssert('1808765_3文件夹前面的箭头方向指向右');
    
  }, { timeout: 1800000, tags: ["1808765", "level3", "view", "liqingling"] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    //恢复文件管理器设置
    await system.cleanupFileManager();

    // 关键清理操作 - 删除测试创建的文件夹和文件
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1808765*`);

    // 关闭文件管理器
    await system.exec('killall dde-file-manager');
  });
});
