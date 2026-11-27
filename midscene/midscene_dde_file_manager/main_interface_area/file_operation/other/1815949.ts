/**
 * 用例 PMSID: 1815949
 * 用例标题: 长文件名功能 - 复制，剪切，拖拽到/tmp目录
 * 生成时间: 2026-08-06
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

// 定义长文件名常量
const folderName = "复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到tmp目录长文件名功能复制剪切拖拽到功能复制剪切拖拽功能复制剪切";

describe('1815949-长文件名功能 - 复制，剪切，拖拽到/tmp目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('清理步骤：删除文档目录和tmp目录下的测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName}"`, 500);
    await system.exec(`rm -rf /tmp/"${folderName}"`, 500);

    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');

    console.log('前置条件：在文档目录创建长文件名文件夹');
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Documents/"${folderName}"`, 1000);
    console.log('长文件名文件夹创建完成');

    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815949-长文件名功能 - 复制，剪切，拖拽到/tmp目录', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：选中"复制剪切"开头的文件夹，右键点击复制');
    await agent.aiRightClick('复制剪切开头的文件夹');
    await agent.aiTap('复制');

    console.log('步骤2：点击左侧栏的系统盘');
    await agent.aiTap('左侧栏的系统盘');
    await agent.aiWaitFor('系统盘目录已打开');

    console.log('步骤2：点击tmp目录');
    await agent.aiDoubleClick('tmp目录');
    await agent.aiWaitFor('tmp目录已打开');

    console.log('步骤2：点击Ctrl+v粘贴');
    await device.pressKey('Control', 'v');

    console.log('断言：粘贴失败，有提示文件名过长的提示信息');
    await agent.aiWaitFor('文件名过长');
    await agent.aiAssert('文件名过长的提示信息');
    console.log('断言通过：粘贴失败，提示文件名过长');
    await device.pressKey('Enter');

    console.log('步骤3：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤3：选中"复制剪切"开头的文件夹，右键点击剪切');
    await agent.aiRightClick('复制剪切开头的文件夹');
    await agent.aiTap('剪切');

    console.log('步骤4：点击左侧栏的系统盘');
    await agent.aiTap('左侧栏的系统盘');
    await agent.aiWaitFor('系统盘目录已打开');

    console.log('步骤4：点击tmp目录');
    await agent.aiDoubleClick('tmp目录'); 
    await agent.aiWaitFor('tmp目录已打开');

    console.log('步骤4：点击Ctrl+v粘贴');
    await device.pressKey('Control', 'v');

    console.log('断言：粘贴失败，有提示文件名过长的提示信息');
    await agent.aiWaitFor('文件名过长');
    await agent.aiAssert('文件名过长的提示信息');
    console.log('断言通过：粘贴失败，提示文件名过长');
    await device.pressKey('Enter');
    await device.pressKey('esc');
    // await agent.aiWaitFor('tmp目录已打开');
    await agent.aiTap('左侧栏的系统盘');
    await agent.aiDoubleClick('tmp目录'); 
    await agent.aiWaitFor('tmp目录已打开');
    await device.pressKey('win+right');

    await device.pressKey('ctrl+N');
    await agent.aiWaitFor('文管窗口显示');
    await device.pressKey('win+left');

    console.log('步骤5：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');
    await agent.aiDrag('复制剪切开头的文件夹', 'tmp目录');

    console.log('断言：粘贴失败，有提示文件名过长的提示信息');
    await agent.aiWaitFor('文件名过长');
    await agent.aiAssert('文件名过长的提示信息');
    console.log('断言通过：粘贴失败，提示文件名过长');
    await device.pressKey('Enter');

  }, { timeout: 1200000, tags: ['1815949', 'level3', 'longfilename','remote', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：删除测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName}"`, 500);
    await system.exec(`rm -rf /tmp/"${folderName}"`, 500);

    console.log('清理步骤：关闭文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
