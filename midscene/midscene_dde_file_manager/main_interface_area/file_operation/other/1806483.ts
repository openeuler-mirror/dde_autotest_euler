/**
 * 用例 PMSID: 1806483
 * 用例标题: 【文件操作】【Bug211431转】使用2022文本中的内容重命名文件时不会导致文管崩溃
 * 生成时间: 2026-07-22 16:36:19
 * 用例编写人: UT002411(胡戬)
 */

const caseDir = process.env.TESTCASE_DIR;
const test_dir = '~/Desktop/1806483';

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${test_dir}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806483-使用2022文本中的内容重命名文件时不会导致文管崩溃', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件：下载测试文件夹到桌面
    await system.exec(`cd ~/Desktop && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806483.zip && unzip 1806483.zip && rm 1806483.zip`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806483-使用2022文本中的内容重命名文件时不会导致文管崩溃', async ({ device, agent, uos, system }) => {
    const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 步骤 1: 进入桌面测试文件夹1806483，双击打开CJK-B-1.txt
    console.log('步骤 1: 进入桌面测试文件夹1806483，双击打开CJK-B-1.txt');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiDoubleClick("1806483文件夹");
    await agent.aiWaitFor("进入1806483文件夹，显示文件夹内容");
    await agent.aiDoubleClick("CJK-B-1.txt");
    await agent.aiWaitFor("文本编辑器已打开CJK-B-1.txt文件");
    // 断言1: 打开成功
    await agent.aiAssert("文本编辑器成功打开了CJK-B-1.txt文件");
    console.log('断言1: 打开成功');

    // 步骤 2: 双击文本内容第一行，复制文本，然后关闭文本编辑器
    console.log('步骤 2: 双击文本内容第一行，复制文本，然后关闭文本编辑器');
    await agent.aiDoubleClick("文本编辑器中第一行的文本内容");
    await device.pressKey("Ctrl+C");
    await closeAllTxt(agent, device);
    // await agent.aiWaitFor("文本编辑器已关闭");

    // 步骤 3: 将CJK-B-2.txt重命名为刚刚复制的文本
    console.log('步骤 3: 将CJK-B-2.txt重命名为刚刚复制的文本');
    await agent.aiTap("文件管理器窗口");
    await agent.aiRightClick("CJK-B-2.txt");
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.pressKey("Control", "v");
    await device.pressKey("Enter");
    // 断言2: 重命名成功，名称为"𠀀𠀁𠀂𠀃"
    await agent.aiAssert("文件重命名成功，文件名称显示为复制的乱码字符，文件管理器没有崩溃");
    console.log('断言2: 重命名成功，名称为复制的乱码字符');

  }, { timeout: 600000, tags: ['1806483', 'level2', 'file_operation', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await clearEnv(system);
  });
});
