/**
 * 用例 PMSID: 1806479
 * 用例标题: 重命名文件时命名内容检查
 * 生成时间: 2026-07-22 16:36:19
 * 用例编写人: UT002411(胡戬)
 */

const test_folder = '1806479te';
const name255 = 'a'.repeat(255);
const name256 = 'a'.repeat(256);

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ~/Desktop/${test_folder}`);
    await system.exec(`cd ~/Desktop && python3 -c "import shutil,os; f='a'*255; shutil.rmtree(os.path.expanduser(f),ignore_errors=True)"`);
    await system.exec(`rm -rf ~/Desktop/；`);
    await system.exec(`rm -rf ~/Desktop/'1806479 test'`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

async function assertFileNameLength(system, pattern, expectedLength, label) {
  const result = await system.exec(`cd ~/Desktop && ls -d ${pattern} 2>/dev/null | head -1 | tr -d '\\n' | wc -m`);
  const length = parseInt(result.stdout ? result.stdout.trim() : '0', 10);
  if (length === expectedLength) {
    console.log(`${label}: 文件名长度为${expectedLength}，验证通过`);
  } else {
    throw new Error(`${label}: 文件名长度为${length}，期望${expectedLength}`);
  }
}

async function assertFileExists(system, fileName, label) {
  const result = await system.exec(`cd ~/Desktop && ls -d '${fileName}' 2>/dev/null | wc -l`);
  const count = parseInt(result.stdout ? result.stdout.trim() : '0', 10);
  if (count > 0) {
    console.log(`${label}: 文件名为${fileName}，验证通过`);
  } else {
    throw new Error(`${label}: 文件名不为${fileName}`);
  }
}

describe('1806479-重命名文件时命名内容检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件：桌面创建一个测试文件夹1806479te
    await system.exec(`mkdir ~/Desktop/${test_folder}`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806479-重命名文件时命名内容检查', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中测试文件夹，重命名为255字符的名称，比如255个字母a
    console.log('步骤 1: 选中测试文件夹，重命名为255个字母a');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的桌面");
    await agent.aiWaitFor("文件管理器显示桌面内容");
    await agent.aiRightClick(test_folder);
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText(name255);
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言1: 重命名成功，文件名长度为255
    await assertFileNameLength(system, 'aaaaaa*', 255, '断言1');

    // 步骤 2: 选中测试文件夹，重命名为256字符的名称
    console.log('步骤 2: 选中测试文件夹，重命名为256个字母a');
    await agent.aiRightClick("名称全是字母a的长名称文件夹", { deepThink: true });
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText(name256);
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言2: 截断，仅保留255字符且重命名成功
    await assertFileNameLength(system, 'aaaaaa*', 255, '断言2');

    // 步骤 3: 测试文件夹重命名为不支持的特殊字符\/:*?"<>|；
    console.log('步骤 3: 重命名为不支持的特殊字符');
    await agent.aiRightClick("名称全是字母a的长名称文件夹", { deepThink: true });
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText('\\/:*?"<>|；');
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言3: 不支持的字符处理为空，最终名称为；
    await assertFileExists(system, '；', '断言3');

    // 步骤 4: 重命名为支持的特殊字符，例如空格
    console.log('步骤 4: 重命名为支持的特殊字符（空格）');
    await agent.aiRightClick("名称为；的文件夹", { deepThink: true });
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.typeText("1806479 test");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言4: 重命名成功
    await assertFileExists(system, '1806479 test', '断言4');

    // 步骤 5: 重命名时清空内容按enter
    console.log('步骤 5: 重命名时清空内容按enter');
    await agent.aiRightClick("名称为1806479 test的文件夹");
    await agent.aiTap("重命名");
    await device.pressKey("Control", "a");
    await device.pressKey("Backspace");
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 断言5: 保留重命名之前的名称
    await assertFileExists(system, '1806479 test', '断言5');

    // 断言: 文件管理器没有崩溃
    await agent.aiAssert("文件管理器没有崩溃，界面正常显示");

  }, { timeout: 600000, tags: ['1806479', 'level3', 'file_operation', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await clearEnv(system);
  });
});
