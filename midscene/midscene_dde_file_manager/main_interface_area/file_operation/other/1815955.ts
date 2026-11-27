/**
 * 用例 PMSID: 1815955
 * 用例标题: 长文件名功能 - 文件和文件夹混合排序
 * 生成时间: 2026-08-11
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

// 定义长文件名常量
const longFolderName = "2文件夹混合排序长文件名功能文件夹混合排序长文件名功能文件夹混合排序长文件名功能文件夹混合排序长文件名功能文件夹混合排序长文件名功能文件夹混合排序长文件名功能文件夹混合排序长文件夹混合排序长文件名功能";
const longFileName = "1文件混合排序长文件名功能文件混合排序长文件名功能文件混合排序长文件名功能文件混合排序长文件名功能文件混合排序长文件名功能文件混合排序长文件名功能文件混合排序长文件混合排序长文件名功能";

// U盘配置（从.env文件获取）
const usbFlash = process.env.USB_FLASH || 'UOS';
const testUsername = process.env.TEST_USERNAME;

describe('1815955-长文件名功能 - 文件和文件夹混合排序', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 清理三个目录下的测试文件和文件夹
    console.log('清理步骤：删除文档、桌面、U盘目录下的测试文件和文件夹');
    const docDir = `/home/${testUsername}/Documents`;
    const desktopDir = `/home/${testUsername}/Desktop`;

    await system.exec(`rm -rf "${docDir}/${longFolderName}"`, 500);
    await system.exec(`rm -rf "${docDir}/${longFileName}"`, 500);
    await system.exec(`rm -rf "${desktopDir}/${longFolderName}"`, 500);
    await system.exec(`rm -rf "${desktopDir}/${longFileName}"`, 500);

    // 清理U盘内测试文件
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      console.log(`U盘挂载路径: ${usbPath}`);
      await system.exec(`rm -rf "${usbPath}/${longFolderName}"`, 500);
      await system.exec(`rm -rf "${usbPath}/${longFileName}"`, 500);
    } else {
      console.log(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }

    // 开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');

    // 在三个目录创建长文件名文件夹和文件
    console.log('创建测试文件：文档目录');
    await system.exec(`mkdir -p "${docDir}/${longFolderName}"`, 500);
    await system.exec(`touch "${docDir}/${longFileName}"`, 500);

    console.log('创建测试文件：桌面目录');
    await system.exec(`mkdir -p "${desktopDir}/${longFolderName}"`, 500);
    await system.exec(`touch "${desktopDir}/${longFileName}"`, 500);

    if (usbPath) {
      console.log('创建测试文件：U盘目录');
      await system.exec(`mkdir -p "${usbPath}/${longFolderName}"`, 500);
      await system.exec(`touch "${usbPath}/${longFileName}"`, 500);
    }

    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815955-长文件名功能 - 文件和文件夹混合排序', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await agent.aiWaitFor('文管窗口显示');
    await uos.maximizeWindow();

    console.log('步骤1：点击右上角的主菜单按钮');
    await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });

    console.log('步骤1：点击设置');
    await agent.aiTap('设置');

    console.log('步骤1：点击设置页面的"文件和目录"');
    await agent.aiTap('文件和目录', { deepThink: true });

    console.log('步骤1：检查"文件和文件夹混合排序"勾选状态');
    const isChecked = await agent.aiBoolean('文件和文件夹混合排序前面的勾选框已勾选');
    if (!isChecked) {
      console.log('未勾选，勾选"文件和文件夹混合排序"');
      await agent.aiTap('文件和文件夹混合排序前面的勾选框');
    } else {
      console.log('已勾选，直接关闭设置弹框');
    }

    console.log('步骤1：关闭设置弹框');
    await device.pressKey('Escape');

    console.log('步骤2：点击左侧栏的文档目录');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤2：右键空白处，点击排序方式，点击名称');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');

    console.log('步骤2：断言文件排序正常');
    await agent.aiAssert('文件和文件夹混合排序正常');
    console.log('断言通过：文档目录文件排序正常');

    console.log('步骤3：点击左侧栏的U盘');
    await agent.aiTap(`左侧栏的${usbFlash}`);
    // await agent.aiWaitFor('U盘目录已打开');

    console.log('步骤3：右键空白处，点击排序方式，点击名称');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');

    console.log('步骤3：断言文件排序正常');
    await agent.aiAssert('文件和文件夹混合排列');
    console.log('断言通过：U盘目录文件排序正常');

    console.log('步骤4：点击左侧栏的桌面');
    await agent.aiTap('左侧栏的桌面');
    await agent.aiWaitFor('桌面目录已打开');

    console.log('步骤4：右键空白处，点击排序方式，点击名称');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('排序方式');
    await agent.aiTap('名称');

    console.log('步骤4：断言文件排序正常');
    await agent.aiAssert('文件和文件夹混合排列');
    console.log('断言通过：桌面目录文件排序正常');

    console.log('测试完成');
  }, { timeout: 600000, tags: ['1815955', 'level3', 'longfilename', 'remote', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理三个目录下的测试文件和文件夹
    const docDir = `/home/${testUsername}/Documents`;
    const desktopDir = `/home/${testUsername}/Desktop`;

    await system.exec(`rm -rf "${docDir}/${longFolderName}"`, 500);
    await system.exec(`rm -rf "${docDir}/${longFileName}"`, 500);
    await system.exec(`rm -rf "${desktopDir}/${longFolderName}"`, 500);
    await system.exec(`rm -rf "${desktopDir}/${longFileName}"`, 500);

    // 清理U盘内测试文件
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      console.log(`清理U盘内的测试文件: ${usbPath}`);
      await system.exec(`rm -rf "${usbPath}/${longFolderName}"`, 500);
      await system.exec(`rm -rf "${usbPath}/${longFileName}"`, 500);
    }

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await device.pressKey('Esc');
  });
});
