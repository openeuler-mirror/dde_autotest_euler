/**
 * 用例 PMSID: 1816663
 * 用例标题: 地址栏-默认状态显示
 * 生成时间: 2026-01-16 09:10:00
 * 用例编写人: UT000159（游伟）
 */

const levels = ['测试目录', '一级目录', '二级目录', '三级目录'];
const long_dir_name = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012';
const sub_dir_name_start = long_dir_name.slice(0, 6);
const sub_dir_name_end = long_dir_name.slice(-5);

describe('1816663-地址栏-默认状态显示', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    system.exec(`mkdir -p ~/Desktop/${levels.join('/')}`);
    system.exec(`mkdir -p ~/Desktop/${long_dir_name}`);
  });

  test('1816663-地址栏-默认状态显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择桌面目录
    console.log('步骤 2: 在侧边栏选择桌面目录');
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 验证页面已跳转到桌面目录
    console.log('预期 2: 验证页面已跳转到桌面目录');
    await agent.aiAssert('当前目录为桌面目录');

    // 步骤 3: 双击打开多层级目录路径
    console.log('步骤 3: 双击打开多层级目录路径');
    for (const level of levels) {
      await agent.aiDoubleClick(`文件列表中的${level}文件夹图标`, { deepThink: true });
      await agent.aiAssert(`文件管理器跳转到${level}目录`);
    };

    // 验证页面已跳转到最深层目录
    console.log('预期 3-1: 验证页面已跳转到最深层目录');
    await agent.aiAssert('当前目录内容为空');

    // 确认地址栏显示完整路径
    console.log('预期 3-2: 确认地址栏显示完整路径');
    await agent.aiAssert('地址栏显示为一整条面包屑样式，每一级路径之间用"/"分隔');

    // 步骤 4: 点击左侧栏中的桌面目录
    console.log('步骤 4: 点击左侧栏中的桌面目录');
    await agent.aiTap('侧边栏中的桌面目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到桌面目录');

    // 步骤 5: 双击打开以${sub_dir_name}开头的目录
    console.log(`步骤 5: 双击打开以${sub_dir_name_start}开头的目录`);
    await agent.aiDoubleClick(`文件列表中的以${sub_dir_name_start}开头的文件夹图标`)
    await agent.aiWaitFor(`文件管理器跳转到以${sub_dir_name_start}开头的目录`)

    // 验证长目录名省略显示
    console.log('预期 5: 验证长目录名省略显示');
    await agent.aiAssert(`文件管理器窗口中, 地址栏中从左到右依次是..., ${long_dir_name}, 忽略/和空格`);

    // 步骤 6: 使用快捷键恢复窗口模式
    console.log('步骤 6: 使用快捷键恢复窗口模式');
    await device.pressKey("Super", "Down");
    await agent.aiWaitFor('文件管理器窗口恢复到窗口模式');

    // 验证长目录名省略显示
    console.log('预期 6: 验证长目录名省略显示');
    await agent.aiAssert(`文件管理器窗口中, 地址栏中从左到右依次是..., 以${sub_dir_name_start}开头并以${sub_dir_name_end}结尾的目录名, 目录中间会有省略号, 忽略/和空格`);

  }, { timeout: 600000, tags: ['1816663', 'level2', 'smoke', 'DITT', 'youwei', 'addressbar', 'file-manager', 'edit address'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    system.exec(`rm -rf ~/Desktop/${levels[0]}`);
    system.exec(`rm -rf ~/Desktop/${long_dir_name}`);

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
