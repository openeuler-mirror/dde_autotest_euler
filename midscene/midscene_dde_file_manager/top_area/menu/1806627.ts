/**
 * 用例 PMSID: 1806627
 * 用例标题:  [043]快捷键-按住Ctrl复制
 * 生成时间: 2026-02-27 15:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1806627-[043]快捷键-按住Ctrl复制', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //新建测试文件作为前置条件，后续测试
    await system.exec('touch /home/$USER/Desktop/aaa.txt ')

      });

  test('1806627-[043]快捷键-按住Ctrl复制', async ({ device, agent, uos, system }) => {
    // 步骤 1: 按住Ctrl键，鼠标拖拽文件
    console.log('步骤 1: 按住Ctrl键，鼠标拖拽文件');
    await device.keyDown("Ctrl")
    await agent.aiDrag('aaa.txt','桌面空白处')
    await device.keyUp("Ctrl")
    await agent.aiAssert('桌面新增文件aaa（副本）.txt')

  }, { timeout: 600000, tags: ["1806627", "level4", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();

    //删除测试文件
    await system.exec('rm -rf /home/$USER/Desktop/aaa*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});