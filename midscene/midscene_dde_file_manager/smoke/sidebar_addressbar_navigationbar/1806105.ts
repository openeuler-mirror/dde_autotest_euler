/**
 * 用例 PMSID: 1806105
 * 用例标题: 侧边栏固定目录，空白处右键，属性
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806105-侧边栏固定目录，空白处右键，属性', () => {
  const work_dir = "~/Videos/";
  const work_dir_name = "视频";

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806105-侧边栏固定目录，空白处右键，属性', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择${work_dir_name}目录
    await agent.aiTap(`侧边栏中的${work_dir_name}目录`, { deepThink: true });
    await agent.aiWaitFor(`文件管理器跳转到${work_dir_name}目录`);
    
    // 验证页面已跳转到${work_dir_name}目录
    await agent.aiAssert(`当前目录为${work_dir_name}目录`);

    // 步骤 3: 在右侧内容区域打开属性窗口
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiTap('属性');

    // 验证属性窗口已打开
    await agent.aiAssert('属性窗口已打开');

  }, { timeout: 600000, tags: ['1806105', 'level2', 'smoke', 'youwei', 'sidebar', 'file-manager', 'property'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('属性窗口右上角关闭按钮:X');

    // 清理步骤: 删除设置并关闭文件管理器
    console.log('清理步骤: 删除设置并关闭文件管理器');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
