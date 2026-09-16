/**
 * 用例 PMSID: 1806871
 * 用例标题:  [052]文件操作-选中文件后底部状态栏展示
 * 生成时间: 2026-02-26 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1806871-[052]文件操作-选中文件后底部状态栏展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建测试文件作为前置条件，后续测试
    await system.exec('mkdir -p /home/$USER/Downloads && cd /home/$USER/Downloads && seq -w 30 | xargs -P 16 -I {} touch f_{}.txt')
    await system.exec('mkdir -p /home/$USER/Downloads/testFolder && cd /home/$USER/Downloads/testFolder && seq -w 1 100000 | xargs -P 16 -I {} touch f_{}.txt')

  });

  test('1806871-[052]文件操作-选中文件后底部状态栏展示', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入下载目录
    console.log('步骤 1: 打开文件管理器，进入下载目录');
    await uos.openApp('文件管理器');
    await agent.aiDoubleClick('下载')
    await agent.aiTap("右上角图标视图")

    //步骤 2：未选中任何文件，显示文件总数
    console.log('步骤 2：未选中任何文件，显示文件总数');
    await agent.aiAssert('目录底部显示：31项')

    // 步骤 3：选中某些文件时，显示选中的文件夹个数和文件个数
    console.log('步骤 3：选中某些文件时，显示选中的文件夹个数和文件个数');
    await agent.aiTap('f_11.txt')
    await device.keyDown("ctrl")
    await agent.aiTap('f_16.txt')
    await agent.aiTap('f_21.txt')
    await agent.aiTap('f_30.txt')
    await agent.aiTap('testFolder')
    await device.keyUp("ctrl")
    await agent.aiAssert('目录底部显示：选中1个文件夹（包含100000项），选中4个文件（0B）')

    // 步骤 4：进入包含大量小文件的文件夹，查看底部状态栏的数据加载
    console.log('步骤 4：进入包含大量小文件的文件夹，查看底部状态栏的数据加载');
    await agent.aiDoubleClick('testFolder')
    await agent.aiAssert('目录底部显示：正在加载')

  }, { timeout: 600000, tags: ["1806871", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件
    await system.exec('rm -rf /home/$USER/Downloads/*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});