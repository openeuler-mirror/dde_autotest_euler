
/**
 * 用例 PMSID: 1806409
 * 用例标题: 文管选择窗-文档查看器调用
 * 生成时间: 2026-08-04 10:00:00
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'UOS';

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-reader || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec('rm -f ~/Documents/pdftest.pdf', 500);
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -f ${usbPath}/pdftest.pdf`, 500);
    }
    console.log('文档查看器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806409-文管选择窗-文档查看器调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：下载网络测试文件到文档目录
    await system.exec(`cd ~/Documents && wget -O pdftest.pdf http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806409/pdftest.pdf`, 30000);
    // 前置条件2：复制一份测试文件到U盘目录中
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | head -1 | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`cp ~/Documents/pdftest.pdf ${usbPath}/pdftest.pdf`, 10000);
    } else {
      console.log('未找到U盘挂载路径，跳过U盘测试文件复制');
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806409-文管选择窗-文档查看器调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文档查看器，点击选择文件，点击文件选择窗中的文档，点击pdftest.pdf，点击打开
    console.log('步骤1：打开文档查看器，点击选择文件，选择文档目录中的pdftest.pdf');
    await uos.openApp("文档查看器");
    await device.pressKey('Ctrl', 'O');
    // await agent.aiTap("文档查看器主界面的选择文件按钮");
    // 断言1：文件选择窗口已打开
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');
    await agent.aiTap("文件选择窗口左侧边栏的文档");
    await agent.aiTap("文件选择窗口中的pdftest.pdf");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：pdftest.pdf被打开
    await agent.aiAssert("文档查看器成功打开pdftest.pdf");
    console.log('断言2：pdftest.pdf被打开');

    // 步骤2：alt+f4关闭当前文档查看器窗口
    console.log('步骤2：alt+f4关闭当前文档查看器窗口');
    await device.pressKey('Alt', 'F4');

    // 步骤3：打开文档查看器，点击选择文件，鼠标悬浮侧边栏，向下滚动到底部，点击名称为UOS的U盘，点击U盘中的pdftest.pdf，点击打开
    console.log('步骤3：打开文档查看器，点击选择文件，悬浮侧边栏滚动到底部，点击UOS磁盘，选择U盘中的pdftest.pdf');
    await uos.openApp("文档查看器");
    await device.pressKey('Ctrl', 'O');
    // await agent.aiTap("文档查看器主界面的选择文件按钮");
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言3：文件选择窗口已打开');
    await agent.aiHover("文件选择窗口左侧边栏");
    await agent.aiScroll("文件选择窗口左侧边栏", { direction: "down", distance: 500 });
    await agent.aiTap("文件选择窗口左侧边栏的UOS磁盘");
    await agent.aiTap("文件选择窗口中的pdftest.pdf");
    await agent.aiTap("文件选择窗口的打开按钮");
    await agent.aiWaitFor("文档查看器成功打开pdftest.pdf");
    // 断言4：pdftest.pdf被打开
    await agent.aiAssert("文档查看器成功打开pdftest.pdf");
    console.log('断言4：pdftest.pdf被打开');

  }, { timeout: 600000, tags: ['1806409', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-reader & killall dde-file-dialog），删除创建的测试文件
    await clearEnv(system);
    await uos.showDesktop();
  });
});
