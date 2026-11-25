
/**
 * 用例 PMSID: 1806427
 * 用例标题: 文管选择窗-不同权限目录下的操作
 * 生成时间: 2026-07-25 10:00:00
 * 用例编写人：UT002411（胡戬）
 */
// @ts-nocheck
require("dotenv/config");

const dirA = '~/Documents/1806427_A';
const dirB = '~/Documents/1806427_B';
const dirC = '~/Documents/1806427_C';

describe('1806427-文管选择窗-不同权限目录下的操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    await uos.showDesktop();
    // 前置条件：在文档目录创建3个目录：A可读写(777)；B只读(555)；C不可读(222)
    await system.exec(`rm -rf ${dirA} ${dirB} ${dirC}`, 500);
    await system.exec(`mkdir -p ${dirA} ${dirB} ${dirC}`, 500);
    await system.exec(`chmod 777 ${dirA} && chmod 555 ${dirB} && chmod 222 ${dirC}`, 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806427-文管选择窗-不同权限目录下的操作', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文本编辑器，按ctrl+shift+s
    console.log('步骤1：打开文本编辑器，按ctrl+shift+s打开文件保存窗口');
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+Shift+S');
    // 断言1：打开文件保存窗口
    await agent.aiAssert("文件保存窗口已打开");
    console.log('断言1：打开文件保存窗口');

    // 步骤2：在文件保存窗口中，进入文档目录B只读
    console.log('步骤2：进入文档目录1806427_B只读文件夹');
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiDoubleClick("文件保存窗口中的1806427_B文件夹");

    // 步骤3：在目录空白处右键单击，在右键菜单中点击新建文件夹
    console.log('步骤3：在目录空白处右键单击，点击新建文件夹');
    await agent.aiRightClick("文件保存窗口内空白处");
    await agent.aiTap("右键菜单中的新建文件夹");
    // 断言2：没有生成新建文件夹
    await agent.aiAssert("文件保存窗口内没有生成新的新建文件夹");
    console.log('断言2：没有生成新建文件夹');
    // 按两次esc退出
    await device.pressKey('Esc');
    await device.pressKey('Esc');

    // 步骤5：按ctrl+shift+s，在文件保存窗口中，进入文档目录A可读写
    console.log('步骤5：按ctrl+shift+s，进入文档目录1806427_A可读写文件夹');
    await device.pressKey('Ctrl+Shift+S');
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiDoubleClick("文件保存窗口中的1806427_A文件夹");

    // 步骤6：在目录空白处右键单击，在右键菜单中点击新建文件夹
    console.log('步骤6：在目录空白处右键单击，点击新建文件夹');
    await agent.aiRightClick("文件保存窗口内空白处");
    await agent.aiTap("右键菜单中的新建文件夹");
    // 断言3：生成一个新建文件夹
    await agent.aiAssert("文件保存窗口内生成了一个新建文件夹");
    console.log('断言3：生成一个新建文件夹');
    // 按一次esc退出
    await device.pressKey('Esc');

    // 步骤8：按ctrl+shift+s，在文件保存窗口中，进入文档目录C不可读
    console.log('步骤8：按ctrl+shift+s，进入文档目录1806427_C不可读文件夹');
    await device.pressKey('Ctrl+Shift+S');
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiDoubleClick("文件保存窗口中的1806427_C文件夹");
    // 断言4：目录中提示：您没有权限访问该文件夹
    await agent.aiAssert("文件保存窗口中提示您没有权限访问该文件夹");
    console.log('断言4：提示您没有权限访问该文件夹');
    // 按一次esc退出
    await device.pressKey('Esc');

  }, { timeout: 600000, tags: ['1806427', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境，删除创建的测试文件夹
    await system.exec(`chmod -R 777 ${dirC} 2>/dev/null; rm -rf ${dirA} ${dirB} ${dirC}`, 500);
    // 关闭所有文管窗口和文本编辑器
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
