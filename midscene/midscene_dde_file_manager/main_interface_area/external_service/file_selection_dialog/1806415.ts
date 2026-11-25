/**
 * 用例 PMSID: 1806415
 * 用例标题: 文管选择窗-截图调用_
 * 生成时间: 2026-10-28 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';
const userName = process.env.TEST_USERNAME;

describe('1806415-文管选择窗-截图调用_', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 前置条件：确保目标目录 ~/Pictures/test 存在
    await system.exec(`mkdir -p /home/${userName}/Pictures/test`);
    await system.exec(`rm -f /home/${userName}/Pictures/test/* 2>/dev/null || true`);
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 确保回到桌面
    await device.pressKey('Win', 'D');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1806415-文管选择窗-截图调用_', async ({ device, system, agent, uos, env }) => {
    const pictureDir = `/home/${userName}/Pictures/test`;

    // 获取U盘挂载路径
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }
    console.log(`U盘挂载路径: ${usbPath}`);

    // ==================== 步骤1：截图保存到 ~/Pictures/test，文件名 test.png ====================
    console.log('===== 步骤1：截图保存到 ~/Pictures/test，文件名 test.png =====');
    await device.pressKey('Ctrl', 'Alt', 'A');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 点击桌面上任意位置进行截图
    await agent.aiTap('桌面上的任意位置');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 点击截图中的向下箭头按钮
    await agent.aiTap('截图工具功能栏中下载按钮右侧的下拉箭头▽', { deepThink: true });
    await agent.aiTap("'指定位置'", { deepThink: true });
    await agent.aiTap("'指定位置'子菜单中的'保存时选择位置'或'保存时更新位置'", { deepThink: true });
    await agent.aiTap('截图工具功能栏中的下载按钮↓', { deepThink: true });

    // 点击文件保存对话框左侧栏的图片
    await agent.aiTap("文件保存对话框左侧栏的'图片'");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 进入 test 文件夹
    await agent.aiDoubleClick('test文件夹');

    // 在文件名输入框中填写文件名
    await agent.aiTap('另存为对话框中的文件名输入框');
    await device.pressKey('Ctrl', 'A');
    await device.pressKey('Delete');
    await agent.aiInput('test.png', '另存为对话框中的文件名输入框');
    await agent.aiTap('保存按钮');

    // 预期结果1：文件保存到 ~/Pictures/test 成功（文件系统层面校验）
    const exists = await system.exec(`ls "${pictureDir}/test.png" 2>/dev/null | wc -l`);
    const existsCount = parseInt(exists.stdout.trim(), 10);
    if (existsCount === 0) {
      throw new Error(`截图保存到图片目录失败，未找到文件：${pictureDir}/test.png`);
    }
    console.log(`===== 步骤1验证通过：截图保存成功 ${pictureDir}/test.png =====`);

    // ==================== 步骤2：截图保存到外插U盘 ====================
    console.log('===== 步骤2：截图保存到外插U盘 =====');
    await device.pressKey('Ctrl', 'Alt', 'A');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 点击桌面上任意位置进行截图
    await agent.aiTap('桌面上的任意空白位置');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 点击截图中的向下箭头按钮
    await agent.aiTap('截图工具功能栏中下载按钮右侧的下拉箭头▽', { deepThink: true });
    await agent.aiTap("'指定位置'", { deepThink: true });
    await agent.aiTap("'指定位置'子菜单中的'保存时选择位置'或'保存时更新位置'", { deepThink: true });
    await agent.aiTap('截图工具功能栏中的下载按钮↓', { deepThink: true });

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 点击文件保存对话框左侧栏的浏览，导航到U盘
    await agent.aiTap("文件保存对话框左侧栏的'图片'");
    await agent.aiScroll('图片', { direction: 'down', distance: 10 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("文件保存对话框左侧栏的'UOS'");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在文件名输入框中填写文件名
    await agent.aiTap('另存为对话框中的文件名输入框');
    await device.pressKey('Ctrl', 'A');
    await device.pressKey('Delete');
    await agent.aiInput('test.png', '另存为对话框中的文件名输入框');
    await agent.aiTap('保存按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 若出现“文件已存在，是否替换”提示，选择替换
    const isReplaceUsb = await agent.aiBoolean('是否出现文件已存在是否替换的提示');
    if (isReplaceUsb) {
      await agent.aiTap('替换按钮');
    }

    // 预期结果2：文件保存到U盘成功（文件系统层面校验）
    const usbExists = await system.exec(`ls "${usbPath}/test.png" 2>/dev/null | wc -l`);
    const usbExistsCount = parseInt(usbExists.stdout.trim(), 10);
    if (usbExistsCount === 0) {
      throw new Error(`截图保存到U盘失败，未找到文件：${usbPath}/test.png`);
    }
    console.log(`===== 步骤2验证通过：截图保存成功 ${usbPath}/test.png =====`);

  }, { timeout: 1800000, tags: ['1806415', 'level3', 'main_interface_area', 'external_service', 'file_selection_dialog', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec(`ps aux |grep -E 'deepin-screenshot|dde-screenshot|screenshot' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log('5. afterAll: 清理测试文件');

    // 清理截图产生的测试文件
    await system.exec(`rm -rf /home/${userName}/Pictures/test 2>/dev/null || true`);

    // 清理U盘上的测试文件
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -f "${usbPath}"/test.png 2>/dev/null || true`);
    }
  });
});