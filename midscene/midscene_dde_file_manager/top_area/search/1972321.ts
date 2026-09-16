/**
 * 用例 PMSID: 1972321
 * 用例标题: 【搜索】【黑名单配置】黑名单路径默认路径检查
 * 生成时间: 2026-04-28 10:00:00
 * 用例编写人: UT002411（胡戬）
 */

const case_Dir = process.env.TESTCASE_DIR;
const username = process.env.TEST_USERNAME;
const test_name = "black-path.txt" 
const test_File = `/home/${username}/.config/${test_name}`;

async function clearEnv(system) {
  try {
    // 清理文管环境
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    // 清理测试文件
    await system.exec(`rm -f ${test_File}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1972321-【搜索】【黑名单配置】黑名单路径默认路径检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`echo "测试搜索黑名单路径" > ${test_File}`);
  });

  test('1972321-【搜索】【黑名单配置】黑名单路径默认路径检查', async ({ device, agent, uos, system }) => {
    // 步骤1：检查默认黑名单配置
    const defaultResult = await system.exec('dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths');
    console.log('默认黑名单配置:', defaultResult.stdout);

    // 断言1：检查dde-dconfig get的返回值是否为空数组
    const cleanResult = defaultResult.stdout.replace(/\s/g, '');
    if (cleanResult !== '"[]"') {
      throw new Error(`默认黑名单配置应该为空数组 "[]"，实际为: ${cleanResult}`);
    }

    // 步骤2：设置黑名单路径
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[".git",".svn",".cache",".config",".local/share/Trash",".avfs"]\'');
    
    // 步骤3：等待几秒后验证黑名单路径设置成功
    await new Promise(resolve => setTimeout(resolve, 3000));
    const setResult = await system.exec('dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths');
    console.log('设置后的黑名单配置:', setResult.stdout);

    // 断言2：检查dde-dconfig get的返回值是否为'[".git",".svn",".cache",".config",".local/share/Trash",".avfs"]'
    if (!setResult.stdout.includes('.config')) {
      throw new Error(`黑名单配置应包含 '.config'，实际为: ${setResult.stdout}`);
    }

    // 步骤4：打开文管，搜索.config目录下a.txt文件
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(`${test_name}`);
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言3：无法搜索到.config目录下a.txt文件
    await agent.aiAssert(`搜索结果中不包含${test_name}文件，或者没有搜索结果`);

  }, { timeout: 600000, tags: ['1972321', 'level3', 'search', 'hujian'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复环境：清除黑名单配置
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    // 删除测试文件
    await system.exec('rm -f ~/.config/a.txt');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
