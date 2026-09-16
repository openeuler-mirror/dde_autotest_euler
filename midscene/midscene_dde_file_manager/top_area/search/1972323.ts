/**
 * 用例 PMSID: 1972323
 * 用例标题: 【搜索】【黑名单配置】通过路径关键词配置黑名单路径
 * 生成时间: 2026-04-30 10:00:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const homeBlackPath = `/home/${username}/black-path`;
const desktopBlackPath = `/home/${username}/Desktop/black-path`;

async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${homeBlackPath}`);
    await system.exec(`rm -rf ${desktopBlackPath}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1972323-【搜索】【黑名单配置】通过路径关键词配置黑名单路径', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec(`mkdir -p ${homeBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${homeBlackPath}/black-path.txt`);
    await system.exec(`mkdir -p ${desktopBlackPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${desktopBlackPath}/black-path.txt`);
  });

  test('1972323-【搜索】【黑名单配置】通过路径关键词配置黑名单路径', async ({ device, agent, uos, system }) => {
    // 步骤1：设置黑名单路径配置
    console.log('步骤1：设置黑名单路径配置');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[".git",".svn",".cache",".config",".local/share/Trash",".avfs","black-path"]\'');
    
    // 步骤2：等待几秒后验证黑名单配置
    console.log('步骤2：等待并验证黑名单配置');
    await new Promise(resolve => setTimeout(resolve, 3000));
    const getResult = await system.exec('dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths');
    console.log('黑名单配置:', getResult.stdout);

    // 断言1：检查dde-dconfig get的返回值
    const expectedArray = [".git", ".svn", ".cache", ".config", ".local/share/Trash", ".avfs", "black-path"];
    let rawOutput = getResult.stdout.trim();
    if (rawOutput.startsWith('"') && rawOutput.endsWith('"')) {
      rawOutput = rawOutput.slice(1, -1);
    }
    let actualArray;
    try {
      actualArray = JSON.parse(rawOutput);
    } catch (e) {
      console.log('断言1失败：无法解析黑名单配置 JSON');
      throw new Error(`黑名单配置 JSON 解析失败，实际输出: ${rawOutput}`);
    }
    if (JSON.stringify(actualArray.sort()) !== JSON.stringify(expectedArray.sort())) {
      console.log('断言1失败：黑名单配置不匹配');
      throw new Error(`黑名单配置应为 ${JSON.stringify(expectedArray)}，实际为: ${JSON.stringify(actualArray)}`);
    }
    console.log('断言1通过：黑名单配置正确');

    // 步骤3：打开文件管理器
    console.log('步骤3：打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");

    // 步骤4：在搜索框输入关键词black-path
    console.log('步骤4：在搜索框输入关键词black-path');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('black-path');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言2：验证无法搜索出black-path相关文件
    console.log('断言2：验证无法搜索出black-path相关文件');
    await agent.aiAssert('搜索结果中不包含black-path文件夹或black-path.txt文件，或者没有搜索结果');
    console.log('断言2通过：成功验证无法搜索出黑名单路径中的文件');

  }, { timeout: 600000, tags: ['1972323', 'level1', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
