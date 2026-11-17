// @ts-nocheck

/**
 * 用例 PMSID: 1940211
 * 用例标题: 【复制文件地址】复制多层级超长路径文件的地址
 * 生成时间: 2026-07-30
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const testPassword = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

// 定义255个英文字符的长文件夹名
const longFolderName = 'abcdefghijklmnopqrstuvwxyz0123456789'.repeat(8).substring(0, 255);
// 构建10层级超长路径（每层文件夹名均为255个字符）
const deepDir = `/home/${userName}/Desktop` + `/${longFolderName}`.repeat(10);
const deepFilePath = `${deepDir}/1.txt`;

describe('1940211-【复制文件地址】复制多层级超长路径文件的地址', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  test('1940211-【复制文件地址】复制多层级超长路径文件的地址', async ({ device, system, agent, uos }) => {

    // 前置条件：桌面上创建10层级文件夹，每层级文件夹名称为255个字符，第10层级里有1.txt
    console.log('===== 前置条件：创建10层级超长路径文件夹及1.txt文件 =====');
    await system.exec(`mkdir -p '${deepDir}'`);
    await system.exec(`echo "测试文件" > '${deepFilePath}'`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 打开文件管理器
    await uos.openApp("文件管理器", 3000, 20000, true);

    // 步骤1：进入到前置条件准备的1.txt所在目录，选中1.txt文件
    console.log('===== 步骤1：进入1.txt所在目录并选中文件 =====');
    // 通过地址栏输入超长路径进入目录
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(deepDir, true);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));

    // 选中1.txt文件
    await agent.aiTap("1.txt文件图标");
    await agent.aiAssert("1.txt文件被选中");

    // 步骤2：按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
    console.log('===== 步骤2：复制文件地址并粘贴到文本文件 =====');
    await device.pressKey('Ctrl', 'Shift', 'c');

    // 打开文本编辑器
    console.log('===== 打开文本编辑器 =====');
    await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file %F -- -- deepin-editor %%F`);

    // 切换到文本编辑器粘贴
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl', 'V');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 预期结果2：文件地址粘贴成功，且路径正确
    await agent.aiAssert(`文本编辑器里看到路径为：/home/uos/Desktop/abcdefghijklmnopqrstuvwxyz0123456789开头的长路径`);

    // 关闭文本编辑器（不保存）
    await device.pressKey('Ctrl', 'W');
    await agent.aiTap("不保存按钮");

  }, { timeout: 600000, tags: ['1940211', 'level3', '2500u1', 'copy_file_address', 'DITT', 'huangtian'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试环境');
    // 清理10层级超长路径文件夹
    await system.exec(`rm -rf '/home/${userName}/Desktop/${longFolderName}'`);
    // 关闭所有测试相关进程
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-editor', 500);
    await uos.showDesktop();
  });
});
