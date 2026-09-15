/**
 * 用例 PMSID: 1816723
 * 用例标题: 标签页-调整标签页顺序
 * 生成时间: 2026-01-19 14:00:00
 * 用例编写人: UT000159（游伟）
 */

const test_dir1 = "test_dir1";
const test_dir2 = "test_dir2";

describe('1816723-标签页-调整标签页顺序', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`mkdir -p ~/Desktop/${test_dir1}/${test_dir2}`);
  });

  test('1816723-调整标签页顺序', async ({ device, agent, uos }) => {
    // 准备步骤: 打开桌面文件夹
    console.log('准备步骤: 打开桌面文件夹');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    await agent.aiTap('左侧侧边栏中的桌面', { deepThink: true });
    await agent.aiWaitFor('文件管理器窗口跳转到桌面目录');

    // 步骤 1: 打开多个标签页
    console.log('步骤 1: 打开多个标签页');
    await agent.aiRightClick(`右侧窗口中的${test_dir1}文件夹`, { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('在新标签页中打开');
    await agent.aiWaitFor(`${test_dir1}标签页打开成功`);

    await agent.aiRightClick(`右侧窗口中的${test_dir2}文件夹`, { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('在新标签页中打开');
    await agent.aiWaitFor(`${test_dir2}标签页打开成功`);


    // 步骤 2: 拖拽第一个标签页到最后
    console.log('步骤 2: 拖拽第一个标签页到最后');
    await agent.aiAction(`拖拽第一个标签页桌面页签向右水平移动到最后一个标签页中心坐标处`, { cacheable: true});
    await agent.aiWaitFor('第三个标签页变为桌面');

    // 确认第三个标签页是激活状态, ${test_dir2}文件夹被选中
    console.log(`预期 2: 确认第三个标签页是激活状态, ${test_dir2}文件夹被选中`);
    await agent.aiAssert('右边窗口最上面的第三个标签页页签是激活状态, 标签页页签中有蓝色的矩形', { deepThink: true });
    await agent.aiAssert('当前目录是桌面');

    // 步骤 3: 拖拽第三个标签到最前
    console.log('步骤 3: 拖拽第三个标签到最前');
    await agent.aiAction(`拖拽第三个标签页桌面页签向右水平移动到第一个标签页中心坐标处`, { cacheable: true});
    await agent.aiWaitFor('第一个标签页变为桌面');

    // 确认第一个标签页是激活状态, ${test_dir1}文件夹被选中
    console.log(`预期 3: 确认第一个标签页是激活状态, ${test_dir1}文件夹被选中`);
    await agent.aiAssert('右边窗口最上面的第一个标签页页签是激活状态, 标签页页签中有蓝色的矩形', { deepThink: true });
    await agent.aiAssert('当前目录是桌面');


  }, { timeout: 600000, tags: ['1816723', 'level2', 'smoke', 'DITT', 'youwei', 'tab', 'file-manager', 'tab drag'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`rm -rf ~/Desktop/${test_dir1}`);

     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
