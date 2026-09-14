/**
 * 用例 PMSID: 1873487
 * 用例标题: 侧边栏固定目录，排序方式 - 创建时间
 * 生成时间: 2026-02-05 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1873487-侧边栏固定目录，排序方式 - 创建时间', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件，后续测试
    await system.exec('touch /home/$USER/Videos/1.txt')
    await system.exec('sleep 5')
    await system.exec('touch /home/$USER/Videos/2.txt')
    await system.exec('sleep 5')
    await system.exec('touch /home/$USER/Videos/a.txt')
    await system.exec('sleep 5')
    await system.exec('touch /home/$USER/Videos/b.txt')
    await system.exec('sleep 5')
    await system.exec('touch /home/$USER/Videos/测试.txt')
    await system.exec('sleep 5')
    await system.exec('touch /home/$USER/Videos/文本文档.txt')

    });

  test('1873487-侧边栏固定目录，排序方式 - 创建时间', async ({ system, agent, uos, device }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 侧边栏选择固定目录，如视频
    console.log('步骤 2: 侧边栏选择固定目录，如视频');
    await agent.aiTap('窗口侧边栏的视频，不是中间上面的视频',{deepThink: true})
    await agent.aiWaitFor('标签显示为视频');

    // 步骤 3: 右侧内容区域，切换为列表视图
    console.log('步骤 3: 右侧内容区域，切换为列表视图');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('显示方式')
    await agent.aiTap('显示方式右侧的列表视图')
    await agent.aiAssert('目录下的文件为列表显示');

    // 步骤 4: 右侧内容区域，排序方式切换为创建时间
    console.log('步骤 4: 右侧内容区域，排序方式切换为创建时间');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧的创建时间')
    await agent.aiAssert('目录下的文件按照创建时间排序');

    //清理环境：右侧内容区域，切换为图标视图模式
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('显示方式')
    await agent.aiTap('显示方式右侧的图标视图')

    //清理环境：右侧内容区域，排序方式切换为名称
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧的名称')

  }, { timeout: 1200000, tags: ['1873487', 'level2', 'smoke','sidebar_addressbar_navigationbar', 'DITT', 'hushimin'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件
    await system.exec('rm -rf /home/$USER/Videos/*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});
