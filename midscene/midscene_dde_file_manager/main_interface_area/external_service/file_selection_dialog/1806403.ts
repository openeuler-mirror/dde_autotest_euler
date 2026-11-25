
/**
 * 用例 PMSID: 1806403
 * 用例标题: 文管选择窗-软件包安装器调用
 * 生成时间: 2026-08-05 19:53:07
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const caseDir = process.env.TESTCASE_DIR;

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-deb-installer || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec('rm -f ~/Downloads/d-feet.deb', 500);
    console.log('软件包安装器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

// 功能函数：处理安装过程中的认证弹窗
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

describe('1806403-文管选择窗-软件包安装器调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：下载测试文件到下载目录
    await system.exec(`cd ~/Downloads && wget -O d-feet.deb http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806403/d-feet.deb`, 30000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806403-文管选择窗-软件包安装器调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开软件包安装器，点击选择文件
    console.log('步骤1：打开软件包安装器，点击选择文件');
    await uos.openApp("软件包安装器");
    await agent.aiTap("软件包安装器主界面的选择文件按钮");
    // 断言1：打开文件选择窗口
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');

    // 步骤2：文件选择窗口侧边栏点击下载，点击d-feet.deb，点击打开
    console.log('步骤2：文件选择窗口侧边栏点击下载，点击d-feet.deb，点击打开');
    await agent.aiTap("文件选择窗口左侧边栏的下载");
    await agent.aiTap("文件选择窗口中的d-feet.deb");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：软件包安装器打开d-feet.deb安装界面
    await agent.aiAssert("软件包安装器打开了d-feet.deb安装界面，显示软件包信息");
    console.log('断言2：软件包安装器打开d-feet.deb安装界面');

    // 步骤3：点击安装或者重新安装，等待出现授权弹窗后，输入用户密码，点击确定
    console.log('步骤3：点击安装或者重新安装，处理授权弹窗，输入密码');
    await agent.aiTap("软件包安装器主界面的安装或者重新安装按钮");
    await handleAuthDialog(agent, device, system);

    // 步骤4：等待安装完成
    console.log('步骤4：等待安装完成');
    await agent.aiWaitFor("软件包安装器界面提示安装完成或安装成功", { timeoutMs: 300000, checkIntervalMs: 5000 });
    // 断言3：提示安装成功
    await agent.aiAssert("软件包安装器界面提示安装成功");
    console.log('断言3：提示安装成功');

    // 步骤5：点击完成
    console.log('步骤5：点击完成');
    await agent.aiTap("软件包安装器主界面的完成按钮");

  }, { timeout: 600000, tags: ['1806403', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-deb-installer & killall dde-file-dialog），删除创建的测试文件
    await clearEnv(system);
    await uos.showDesktop();
  });
});
