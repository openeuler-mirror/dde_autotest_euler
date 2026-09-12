/**
 * 用例 PMSID: 1853733
 * 用例标题: 【文件操作】文件夹创建软链接
 * 生成时间: 2026-02-05 09:50:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1853733-【文件操作】文件夹创建软链接', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建测试文件夹和测试图片，后续测试
    await system.exec('mkdir -p /home/$USER/test-cc')
    await system.exec('touch /home/$USER/test-cc/test.png')

    });

  test('1853733-【文件操作】文件夹创建软链接', async ({ system, agent, uos, device }) => {
    // 步骤 1: 进入数据盘，在空白处右键，在终端打开
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiDoubleClick('数据盘')
    await agent.aiRightClick('文件管理器窗口的空白处');
    await agent.aiTap('在终端中打开')
    await agent.aiWaitFor('终端窗口打开');

    // 步骤 2: 给测试文件创建软链接
    console.log('步骤 2: 给测试文件创建软链接');
    await device.typeText('ln -s /home/$USER/test-cc /home/$USER/Desktop/test-cc-link')
    await device.pressKey('enter')
    //关闭终端窗口
    await system.exec('killall deepin-terminal')

    // 步骤 3： 到桌面双击test-cc-link软链接
    await uos.showDesktop();
    await agent.aiDoubleClick('test-cc-link')
    await agent.aiWaitFor('文件夹标签显示为test-cc');
    await agent.aiDoubleClick('test.png')
    await agent.aiAssert('正常打开（显示为破图）');
    //关闭文件管理器窗口
    await system.exec('killall dde-file-manager')
    //关闭看图窗口
    await system.exec('killall deepin-image-viewer')

    // 步骤 4: 再次给test-cc创建软链接，软链接名称和源文件名一致
    console.log('步骤 4: 再次给test-cc创建软链接，软链接名称和源文件名一致');
    await system.exec('ln -s /home/$USER/test-cc /home/$USER/Desktop/')
    await uos.showDesktop();
    await agent.aiDoubleClick('test-cc')
    await agent.aiWaitFor('文件夹标签显示为test-cc');
    await agent.aiDoubleClick('test.png')
    await agent.aiAssert('正常打开（显示为破图');
    //关闭看图窗口
    await system.exec('killall deepin-image-viewer')


  }, { timeout: 600000, tags: ['1853733', 'level3', 'smoke','file_operations', 'DITT', 'hushimin'] });

  afterEach(async ({ uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //删除测试文件夹和测试文件
    await system.exec('rm -rf /home/$USER/test-cc /home/$USER/test-cc/* ')
    await system.exec('rm -rf /home/$USER/Desktop/test-cc*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //关闭文件管理器窗口
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});
