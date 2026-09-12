/**
 * 用例 PMSID: 1816711
 * 用例标题: 排序方式-排序方式修改
 * 生成时间: 2026-02-05 21:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1816711-排序方式-排序方式修改', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件作为前置条件，后续测试
    await system.exec('touch /home/$USER/Downloads/1.mp4 && touch -t 202312311809 /home/$USER/Downloads/1.mp4')
    await system.exec('touch /home/$USER/Downloads/2.zip && touch -t 202501012356 /home/$USER/Downloads/2.zip')
    await system.exec('touch /home/$USER/Downloads/3.sh && touch -t 202602052114 /home/$USER/Downloads/3.sh')
    await system.exec('touch /home/$USER/Downloads/4.txt && echo helloUOS >> /home/$USER/Downloads/4.txt')

    //下载目录显示方式修改为列表视图作为前置条件，方便后续测试中查看排序方式
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiDoubleClick('下载')
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('显示方式')
    await agent.aiTap('显示方式右侧的列表视图')
    await  agent.aiWaitFor('显示为列表视图')
    });

  test('1816711-排序方式-排序方式修改', async ({ system, agent, uos }) => {
    // 步骤 1: 右侧内容区域，排序方式-修改时间
    console.log('步骤 1: 右侧内容区域，排序方式-修改时间');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧选项的修改时间')
    await agent.aiAssert('列表按照修改时间排序');

    // 步骤 3: 右侧内容区域，排序方式-类型
    console.log('步骤 3: 右侧内容区域，排序方式-类型');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧选项的类型')
    await agent.aiAssert('类型的右侧显示排序箭头',{deepThink:true});

    // 步骤 2: 右侧内容区域，排序方式-大小
    console.log('步骤 2: 右侧内容区域，排序方式-大小');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧选项的大小')
    await agent.aiAssert('大小的右侧显示排序箭头',{deepThink:true});

    // 步骤 4: 右侧内容区域，排序方式-名称
    console.log('步骤 4: 右侧内容区域，排序方式-名称');
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('排序方式')
    await agent.aiTap('排序方式右侧选项的名称')
    await agent.aiAssert('名称的右侧显示排序箭头',{deepThink:true});

    //数据清理：修改下载目录的排序方式为默认视图，即图标视图
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('显示方式')
    await agent.aiTap('显示方式右侧的图标视图')
    await agent.aiAssert('列表显示为图标视图');


  }, { timeout: 600000, tags: ['1816711', 'level2', 'smoke','file_operations', 'DITT', 'hushimin'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/Downloads/1.mp4 /home/$USER/Downloads/2.zip /home/$USER/Downloads/3.sh /home/$USER/Downloads/4.txt')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});
