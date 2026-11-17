// @ts-nocheck

/**
 * 用例 PMSID: 1940143
 * 用例标题: 【复制文件地址】复制软硬连接的文件地址
 * 生成时间: 2026-07-30
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const testPassword = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

describe('1940143-【复制文件地址】复制软硬连接的文件地址', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1940143-【复制文件地址】复制软硬连接的文件地址', async ({ device, system, agent, uos }) => {
    // 前置条件：桌面上有1940143.txt文件
    console.log('===== 前置条件：在桌面创建1940143.txt文件 =====');
    await system.exec(`echo "测试文件" > /home/${userName}/Desktop/1940143.txt`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 打开文件管理器并进入桌面
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏上的桌面");

    // 步骤1：创建软链接文件：右键1.txt的文件，点击发送到-创建链接，在弹出对话框中选择图片目录
    console.log('===== 步骤1：创建软链接文件 =====');
    await agent.aiRightClick("1940143.txt文件");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("发送到");
    await agent.aiTap("创建链接");
    // 在弹出的对话框中选择图片目录
    await agent.aiTap("对话框左侧栏的图片");
    await agent.aiTap("保存");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 预期结果1：创建成功
    await agent.aiTap("文件管理器左侧栏上的图片");
    await agent.aiTap("1940143 快捷方式.txt");
    await agent.aiAssert("图片目录存在1940143 快捷方式.txt");

    // 步骤2：创建硬链接文件：在桌面上右键-在终端中打开，输入命令创建硬链接
    console.log('===== 步骤2：创建硬链接文件 =====');
    // 切换到文件管理器，进入桌面
    await agent.aiTap("文件管理器左侧栏上的桌面");
    await agent.aiRightClick("文件管理器窗口的空白处");
    await agent.aiTap("在终端中打开");
    await agent.aiWaitFor("终端窗口打开", { timeoutMs: 5000 });
    await device.typeText(`ln 1940143.txt /home/${userName}/Downloads/1940143-hardlink.txt`);
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 关闭终端
    await agent.aiTap("终端窗口右上角的关闭按钮：x");
    // 预期结果2：创建成功
    await agent.aiTap("文件管理器左侧栏上的下载");
    await agent.aiAssert("下载目录存在1940143-hardlink.txt");
    console.log('===== 硬链接创建成功 =====');

    // 步骤3：选择步骤1和2创建软硬链接文件，按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
    console.log('===== 步骤3：复制软硬链接文件地址并粘贴到文本文件 =====');

    // 切换到文件管理器，进入图片目录复制软链接地址
    await agent.aiTap("文件管理器左侧栏上的图片");
    await agent.aiTap("1940143 快捷方式.txt");
    await device.pressKey('Ctrl', 'Shift', 'c');

    // 切换到文本编辑器粘贴软链接地址
    await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file %F -- -- deepin-editor %%F`);
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl', 'V');
    await agent.aiAssert(`文本编辑器里看到原始文件路径/home/${userName}/Pictures/1940143 快捷方式.txt`);

    //关闭文本编辑器（不保存）
    await device.pressKey('Ctrl', 'W');
    await agent.aiTap("不保存按钮");

    // 切换到文件管理器，进入下载目录复制硬链接地址
    await agent.aiTap("文件管理器左侧栏上的下载");
    await agent.aiTap("1940143-hardlink.txt");
    await device.pressKey('Ctrl', 'Shift', 'c');

    // 切换到文本编辑器粘贴软链接地址
    await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file %F -- -- deepin-editor %%F`);
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Ctrl', 'V');
    await agent.aiAssert(`文本编辑器里看到原始文件路径/home/${userName}/Downloads/1940143-hardlink.txt`);

    // 关闭文本编辑器（不保存）
    await device.pressKey('Ctrl', 'W');
    await agent.aiTap("不保存按钮");
    // 关闭文件管理器
    await agent.aiTap("文本编辑器窗口右上角的关闭按钮：x");

  }, { timeout: 600000, tags: ['1940143', 'level3', '2500u1', 'copy_file_address', 'DITT', 'huangtian'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试环境');
    // 清理桌面1940143.txt文件
    await system.exec(`rm -f /home/${userName}/Desktop/1940143.txt`);
    // 清理图片目录中的软链接
    await system.exec(`rm -f /home/${userName}/Pictures/1940143*.txt`);
    // 清理下载目录中的硬链接
    await system.exec(`rm -f /home/${userName}/Downloads/1940143*.txt`);
    // 关闭所有测试相关进程
    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-editor', 500);
    await uos.showDesktop();
  });
});
