/**
 * 用例 PMSID: 1806621
 * 用例标题: 重启系统后，检查桌面和文管的标记
 * 生成时间: 2026-11-05 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const username = process.env.TEST_USERNAME || 'uos';
const desktopFilePath = `/home/${username}/Desktop/1806621_test.txt`;

describe('1806621-重启系统后，检查桌面和文管的标记', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('beforeAll: 初始化测试环境');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment, removeAllMark } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await removeAllMark(device, agent, uos);
    await system.exec(`rm -f ${desktopFilePath}`);
    // 创建桌面测试文件
    await system.exec(`touch ${desktopFilePath}`);
    await system.exec(`echo '1806621 reboot tag test' >> ${desktopFilePath}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  test('1806621-重启系统后，检查桌面和文管的标记', async ({ device, agent, uos, system }) => {
    // ========== 步骤1：桌面，选中文件，添加标记 ==========
    console.log('===== 步骤1：桌面上为文件添加标记 =====');
    await agent.aiRightClick('桌面上的1806621_test.txt文件的图标');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap('标记信息下方红色圆圈的中心', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('桌面空白处');
    await agent.aiAssert('桌面上的1806621_test.txt文件已带有标记');
    console.log('步骤1通过：桌面标记添加成功');

    // ========== 步骤2：打开文管，选中文件，添加标记 ==========
    console.log('===== 步骤2：文件管理器中为文件添加标记 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap('左侧边栏的桌面目录');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Ctrl+1');
    await agent.aiRightClick('桌面目录下的1806621_test.txt文件');
    await agent.aiTap('标记信息下方绿色圆圈的中心', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('当前工作区空白处');
    await agent.aiAssert('桌面目录下的1806621_test.txt文件名左侧或上方有绿色标记');
    await agent.aiAssert('文件管理器左侧栏标记分组下方有红色和绿色');
    console.log('步骤2通过：文管标记添加成功');

    // 关闭文件管理器
    await device.pressKey('Alt+F4');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ========== 步骤3：重启系统 ==========
    console.log('===== 步骤3：重启系统 =====');
    await device.pressKey("Control", "Alt", "Delete");
    await agent.aiWaitFor('电源管理界面已显示');
    await agent.aiTap('重启按钮',{ deepThink: true });
    await agent.aiWaitFor('登录界面已显示');
    //await agent.aiInput(`${process.env.TEST_PASSWORD}`, '密码输入框');
    await device.typeAscii(`${process.env.TEST_PASSWORD}`);
    await agent.aiTap('登录按钮');
    await agent.aiWaitFor("桌面已显示", { timeoutMs: 10000,checkIntervalMs: 2000 });
    console.log('系统重启完成，桌面已恢复');

    // ========== 重启后检查：桌面标记 ==========
    console.log('===== 重启后检查：桌面标记是否保留 =====');
    await agent.aiAssert("桌面上的1806621_test.txt文件有红色和绿色标记");
    console.log('重启后桌面标记检查通过：标记未消失');

    // ========== 重启后检查：文管标记 ==========
    console.log('===== 重启后检查：文管标记是否保留 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('左侧边栏的桌面目录');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Ctrl+1');
/*
    await agent.aiRightClick('桌面目录下的1806621_test.txt文件');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('标记信息');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert(`标记分组里有红色和绿色`);
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
*/
    await agent.aiAssert('文件管理器左侧栏标记分组下方有红色和绿色');
    console.log('重启后文管标记检查通过：标记未消失');

    // 同时验证侧边栏标记仍存在
    await agent.aiAssert("文件管理器左侧边栏标记组有红色和绿色", { deepThink: true });

    await device.pressKey('Alt+F4');
    await new Promise(resolve => setTimeout(resolve, 1000));

  }, { timeout: 1800000, tags: ['1806621', 'level3', 'main_interface_area', 'file_operation','mark','remote','DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });

  afterAll(async ({ uos, device, agent, system }) => {
    console.log('afterAll: 清理测试环境');

    // 删除测试文件
    await system.exec(`rm -f ${desktopFilePath}`);

    const { removeAllMark } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await removeAllMark(device, agent, uos);

    // 关闭相关进程
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    console.log('afterAll: 清理完成');
  });
});