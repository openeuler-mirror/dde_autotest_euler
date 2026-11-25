
/**
 * 用例 PMSID: 1806407
 * 用例标题: 文管选择窗-启动盘制作工具调用
 * 生成时间: 2026-08-04 10:00:00
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-boot-maker || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec('rm -f ~/Downloads/DownloadTest.iso', 500);
    await system.exec('rm -f ~/Desktop/DesktopTest.iso', 500);
    console.log('启动盘制作工具环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

// 功能函数：处理启动盘制作工具可能出现的认证弹窗
async function handleAuthDialog(agent, device, system) {
  const needAuth = await agent.aiBoolean("出现需要认证的密码输入框");
  if (needAuth) {
    console.log('检测到认证弹窗，输入用户密码');
    await agent.aiTap("含有请输入密码文字的输入框");
    await device.typeText(process.env.TEST_PASSWORD);
    await agent.aiTap("确定");
    console.log('认证完成');
  } else {
    console.log('未检测到认证弹窗，继续执行');
  }
}

describe('1806407-文管选择窗-启动盘制作工具调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：在下载目录创建一个测试iso（dd 的 of= 参数不展开 ~，须用 $HOME）
    await system.exec(`dd if=/dev/zero of=$HOME/Downloads/DownloadTest.iso bs=1M count=10`, 30000);
    // 前置条件2：在桌面目录创建一个测试iso
    await system.exec(`dd if=/dev/zero of=$HOME/Desktop/DesktopTest.iso bs=1M count=10`, 30000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806407-文管选择窗-启动盘制作工具调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动盘制作工具，如有认证弹窗输入密码，点击"请选择镜像文件"，点击下载，点击DownloadTest.iso，点击打开
    await device.pressKey('win');
    await device.typeText("启动盘制作工具")
    await device.pressKey('enter');
    // await uos.openApp("启动盘制作工具");
    await handleAuthDialog(agent, device, system);
    await agent.aiTap("启动盘制作工具主界面的请选择镜像文件按钮");
    // 断言1：文件选择窗口已打开
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');
    await agent.aiTap("文件选择窗口左侧边栏的下载");
    await agent.aiTap("文件选择窗口中的DownloadTest.iso");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：工具主界面中心圆形图标下方的名称为DownloadTest.iso
    await agent.aiAssert("启动盘制作工具主界面中心圆形图标下方的名称为DownloadTest.iso");
    console.log('断言2：工具主界面中心圆形图标下方的名称为DownloadTest.iso');

    // 步骤2：alt+f4关闭当前工具窗口
    console.log('步骤2：alt+f4关闭当前工具窗口');
    await device.pressKey('Alt', 'F4');

    // 步骤3：打开启动盘制作工具，如有认证弹窗输入密码，拖动桌面的DesktopTest.iso到工具中心的圆形图标处
    console.log('步骤3：打开启动盘制作工具，处理认证弹窗，拖动桌面的DesktopTest.iso到工具中心圆形图标处');
    await device.pressKey('win');
    await device.typeText("启动盘制作工具")
    await device.pressKey('enter');
    await handleAuthDialog(agent, device, system);
    await agent.aiDrag("桌面上的DesktopTest.iso文件", "启动盘制作工具主界面中心的圆形图标处", { deepThink: true });
    // 断言3：工具主界面中心圆形图标下方的名称为DesktopTest.iso
    await agent.aiAssert("启动盘制作工具主界面中心圆形图标下方的名称为DesktopTest.iso");
    console.log('断言3：工具主界面中心圆形图标下方的名称为DesktopTest.iso');

  }, { timeout: 600000, tags: ['1806407', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-boot-maker & killall dde-file-dialog），删除创建的测试文件
    await clearEnv(system);
    await uos.showDesktop();
  });
});
