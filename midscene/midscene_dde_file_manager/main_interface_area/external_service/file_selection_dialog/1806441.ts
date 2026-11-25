
/**
 * 用例 PMSID: 1806441
 * 用例标题: 文管选择窗-重名优化-向333权限目录中添加重名文件
 * 生成时间: 2026-07-25 10:00:00
 * 用例编写人：UT002411（胡戬）
 */
// @ts-nocheck
require("dotenv/config");

const testDir = '~/Documents/1806441_test';
const dupFile = '~/Documents/AA.txt';

describe('1806441-文管选择窗-重名优化-向333权限目录中添加重名文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
    await uos.showDesktop();
    await system.exec(`rm -rf ${testDir} ${dupFile}`, 500);
    await system.exec(`mkdir -p ${testDir} && chmod 222 ${testDir}`, 500);
    await system.exec(`touch ${dupFile}`, 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806441-文管选择窗-重名优化-向333权限目录中添加重名文件', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文本编辑器，按ctrl+shift+s
    console.log('步骤1：打开文本编辑器，按ctrl+shift+s打开文件保存窗口');
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+Shift+S');
    // 断言1：打开文件保存窗口
    await agent.aiAssert("文件保存窗口已打开");
    console.log('断言1：打开文件保存窗口');

    // 步骤2：在文件保存窗口中，进入文档目录test文件夹，点击保存
    console.log('步骤2：进入文档目录1806441_test文件夹，点击保存');
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiDoubleClick("文件保存窗口中的1806441_test文件夹");
    await agent.aiTap("文件保存窗口的保存按钮");
    // 断言2：提示没有权限
    await agent.aiAssert("文件保存窗口弹出提示没有权限的对话框或提示");
    console.log('断言2：提示没有权限');
    // 关闭提示与文件保存窗口
    await device.pressKey('Esc');

    // 步骤3：按ctrl+shift+s，输入名称AA，进入文档目录，点击保存
    console.log('步骤3：按ctrl+shift+s，输入名称AA，进入文档目录，点击保存');
    await device.pressKey('Ctrl+Shift+s');
    await agent.aiTap("文件保存窗口下方文件名输入框");
    await device.pressKey('Ctrl', 'a');
    await device.typeText('AA.txt');
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiTap("窗口右下角的保存按钮");
    // 断言3：提示文件已存在，您是否要替换
    await agent.aiAssert("弹出提示文件已存在，是否要替换的对话框");
    console.log('断言3：提示文件已存在，是否要替换');

    // 步骤4：点击弹窗中的取消
    console.log('步骤4：点击弹窗中的取消');
    await agent.aiTap("替换提示对话框中的取消按钮");
    // 断言4：回到文件保存界面
    await agent.aiAssert("回到文件保存界面，文件保存窗口仍然显示");
    console.log('断言4：回到文件保存界面');

    // 步骤5：按ctrl+shift+s，输入名称AA，进入文档目录，点击保存
    await agent.aiTap("文件保存窗口的保存按钮");

    // 步骤6：点击弹窗中的替换
    console.log('步骤6：点击弹窗中的替换');
    await agent.aiTap("替换提示对话框中的替换按钮");
    // 断言5：保存成功，文件保存窗口关闭
    await agent.aiAssert("文件保存窗口已关闭，显示文本编辑器界面");
    console.log('断言5：保存成功，文件保存窗口关闭');

  }, { timeout: 600000, tags: ['1806441', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境，删除创建的测试文件夹和文件
    await system.exec(`chmod -R 777 ${testDir} 2>/dev/null; rm -rf ${testDir} ${dupFile}`, 500);
    // 关闭所有文管窗口和文本编辑器
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
