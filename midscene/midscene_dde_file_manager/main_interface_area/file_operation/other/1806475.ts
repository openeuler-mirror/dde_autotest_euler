/**
 * 用例 PMSID: 1806475
 * 用例标题: 重命名共享文件夹名称
 * 生成时间: 2026-07-24 11:34:07
 * 用例编写人: UT002411（胡戬）
 */

const test_folder = '1806475te';

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/Desktop/${test_folder}`);
    await system.exec(`rm -rf ~/Desktop/测试名称`);
    await system.exec(`rm -rf ~/Desktop/1806475`);
    await system.exec(`rm -rf ~/Desktop/TestFile`);
    await system.exec(`rm -rf ~/Desktop/'-=+!@'`);
    await system.exec(`rm -rf ~/Desktop/'测试Test475!!'`);
    const testPassword = process.env.TEST_PASSWORD;
    await system.exec(`echo '${testPassword}' | sudo -S net usershare delete ${test_folder} 2>/dev/null || true`);
    await system.exec(`echo '${testPassword}' | sudo -S net usershare delete 测试名称 2>/dev/null || true`);
    await system.exec(`echo '${testPassword}' | sudo -S net usershare delete TestFile 2>/dev/null || true`);
    await system.exec(`echo '${testPassword}' | sudo -S net usershare delete 测试Test475 2>/dev/null || true`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

async function assertFileExists(system, fileName, label) {
  const result = await system.exec(`cd ~/Desktop && ls -d -- '${fileName}' 2>/dev/null | wc -l`);
  const count = parseInt(result.stdout ? result.stdout.trim() : '0', 10);
  if (count > 0) {
    console.log(`${label}: 文件名为${fileName}，验证通过`);
  } else {
    throw new Error(`${label}: 文件名不为${fileName}`);
  }
}

async function renameFolder(agent, device, system, currentName, newName) {
  await agent.aiRightClick(currentName);
  await agent.aiWaitFor("显示重命名菜单项");
  await agent.aiTap("重命名");
  await device.pressKey("Control", "a");
  await device.typeText(newName);
  await device.pressKey("Enter");
  await new Promise(resolve => setTimeout(resolve, 1000));
}

describe('1806475-重命名共享文件夹名称', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件1：桌面创建测试文件夹1806475te
    await system.exec(`mkdir ~/Desktop/${test_folder}`);
    // 前置条件2：共享该文件夹
    console.log('前置条件：共享文件夹');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiWaitFor("文件管理器显示桌面内容");
    await agent.aiRightClick(test_folder);
    await agent.aiHover('共享文件夹');
    await agent.aiTap("共享文件夹");
    await agent.aiTap("共享管理");
    await agent.aiAssert("弹出属性窗口，并展开共享管理卡片区域");
    await agent.aiTap("共享此文件夹");
    const needAuth = await agent.aiBoolean("出现需要认证的密码输入框");
    if (needAuth) {
      await device.typeText(process.env.TEST_PASSWORD);
      await agent.aiTap("确定");
      await agent.aiWaitFor("认证完成", { timeoutMs: 30000 });
    }
    await device.pressKey("Esc");
    await uos.closeCurrentWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806475-重命名共享文件夹名称', async ({ device, agent, uos, system }) => {
    let currentName = test_folder;

    // 步骤 1: 重命名1806475te文件夹，输入汉字：测试名称
    console.log('步骤 1: 重命名为汉字"测试名称"');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiWaitFor("文件管理器显示桌面内容");
    await renameFolder(agent, device, system, currentName, "测试名称");
    // 断言1: 命名成功
    await assertFileExists(system, '测试名称', '断言1');
    currentName = '测试名称';

    // 步骤 2: 重命名文件夹，输入数字：1806475
    console.log('步骤 2: 重命名为数字"1806475"');
    await renameFolder(agent, device, system, currentName, "1806475");
    // 断言2: 命名成功
    await assertFileExists(system, '1806475', '断言2');
    currentName = '1806475';

    // 步骤 3: 输入大小写英文：TestFile
    console.log('步骤 3: 重命名为大小写英文"TestFile"');
    await renameFolder(agent, device, system, currentName, "TestFile");
    // 断言3: 命名成功
    await assertFileExists(system, 'TestFile', '断言3');
    currentName = 'TestFile';

    // 步骤 4: 输入特殊字符-=+!@
    console.log('步骤 4: 重命名为特殊字符"-=+!@"');
    await renameFolder(agent, device, system, currentName, "-=+!@");
    // 断言4: 命名成功
    await assertFileExists(system, '-=+!@', '断言4');
    currentName = '-=+!@';

    // 步骤 5: 输入汉字+英文+数字+特殊字符：测试Test475!!
    console.log('步骤 5: 重命名为"测试Test475!!"');
    await renameFolder(agent, device, system, currentName, "测试Test475!!");
    // 断言5: 命名成功
    await assertFileExists(system, '测试Test475!!', '断言5');
    currentName = '测试Test475!!';

    // 步骤 6: 输入'\/:*?"<>| -- 命名失败，恢复之前的名称
    console.log('步骤 6: 重命名为非法字符，期望命名失败');
    await agent.aiRightClick(currentName);
    await agent.aiWaitFor("显示重命名菜单项");
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText('\'\\/:*?"<>|');
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言6: 命名失败，名称恢复为测试Test475!!
    await assertFileExists(system, '测试Test475!!', '断言6');
    console.log('断言6通过: 非法字符命名失败，名称已恢复');

    // 步骤 7: 输入 .. -- 提示文件名被占用
    console.log('步骤 7: 重命名为".."，期望提示文件名被占用');
    await agent.aiRightClick(currentName);
    await agent.aiWaitFor("显示重命名菜单项");
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText("..");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言7: 提示文件名被占用
    await agent.aiAssert("提示文件名被占用");
    console.log('断言7通过: 提示文件名被占用');

    // 步骤 8: 点击确认关闭弹窗
    console.log('步骤 8: 点击确认关闭弹窗');
    await agent.aiTap("确定");
    await new Promise(resolve => setTimeout(resolve, 500));
    // 断言8: 弹窗已关闭，名称恢复
    await assertFileExists(system, '测试Test475!!', '断言8');
    console.log('断言8通过: 弹窗已关闭，名称恢复');

    // 最终断言: 文件管理器没有崩溃，界面正常显示
    await agent.aiAssert("文件管理器没有崩溃，界面正常显示");

  }, { timeout: 600000, tags: ['1806475', 'level3', 'file_operation', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });
});
