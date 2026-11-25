
/**
 * 用例 PMSID: 1806411
 * 用例标题: 文管选择窗-文本编辑器调用
 * 生成时间: 2026-07-29 09:33:01
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'UOS';

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-editor || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec('rm -f ~/Desktop/test1.txt', 500);
    await system.exec('rm -f ~/Documents/test2.txt', 500);
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -f ${usbPath}/test2.txt`, 500);
    }
    console.log('文本编辑器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806411-文管选择窗-文本编辑器调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：下载网络测试文件到桌面目录
    await system.exec(`cd ~/Desktop && wget -O test1.txt http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806411/test1.txt`, 30000);
    // 前置条件2：下载网络测试文件到U盘中
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`cd ${usbPath} && wget -O test2.txt http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806411/test2.txt`, 30000);
    } else {
      console.log('未找到U盘挂载路径，跳过U盘测试文件下载');
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806411-文管选择窗-看图调用', async ({ device, agent, uos, system }) => {
    const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 步骤1：打开文本编辑器，ctrl+o打开文件选择窗口，点击侧边栏桌面，点击test1.txt，点击打开
    console.log('步骤1：打开文本编辑器，ctrl+o打开文件选择窗口，选择桌面test1.txt');
    await uos.openApp("文本编辑器");
    await agent.aiWaitFor("文本编辑器已打开");
    await device.pressKey('Ctrl', 'o');
    // 断言1：文件选择窗口已打开
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');
    await agent.aiTap("文件选择窗口左侧边栏的桌面");
    await agent.aiTap("文件选择窗口中的test1.txt");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：test1.txt在文本编辑器中打开
    await agent.aiAssert("test1.txt已在文本编辑器中打开");
    console.log('断言2：test1.txt在文本编辑器中打开');

    // 步骤2：ctrl+o打开文件选择窗口，鼠标悬浮侧边栏，向下滚动到底部，点击名称为UOS的U盘，点击U盘中的test2.txt，点击打开
    console.log('步骤2：ctrl+o打开文件选择窗口，悬浮侧边栏滚动到底部，点击UOS磁盘，选择test2.txt');
    await device.pressKey('Ctrl', 'o');
    await agent.aiAssert("文件选择窗口已打开");
    await agent.aiHover("文件选择窗口左侧边栏");
    await agent.aiScroll("文件选择窗口左侧边栏", { direction: "down", distance: 500 });
    await agent.aiTap("文件选择窗口左侧边栏的UOS磁盘");
    await agent.aiTap("文件选择窗口中的test2.txt");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言3：test2.txt在文本编辑器中打开
    await agent.aiAssert("test2.txt已在文本编辑器中打开");
    console.log('断言3：test2.txt在文本编辑器中打开');

    // 步骤3：ctrl+shift+s，打开文件保存窗口，点击侧边栏文档，点击保存
    console.log('步骤3：ctrl+shift+s打开保存窗口，点击侧边栏文档，点击保存');
    await device.pressKey('Ctrl', 'Shift', 's');
    await agent.aiAssert("文件保存窗口已打开");
    await agent.aiTap("文件保存窗口左侧边栏的文档");
    await agent.aiTap("文件保存窗口的保存按钮");
    // 断言4：ls ~/Documents | grep test2.txt可以看到test2.txt被保存到Documents目录
    const result = await system.exec('ls ~/Documents | grep test2.txt');
    if (!result.stdout.includes('test2.txt')) {
      throw new Error('断言4失败：test2.txt未被保存到Documents目录');
    }
    console.log('断言4：test2.txt已保存到Documents目录');

  }, { timeout: 600000, tags: ['1806411', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-editor & killall dde-file-dialog）
    await clearEnv(system);
    await uos.showDesktop();
  });
});
