/**
 * 用例 PMSID: 1972957
 * 用例标题: 【搜索】【黑名单配置】配置黑名单路径-异常系
 * 生成时间: 2026-05-13 14:45:00
 * 用例编写人: UT002411（胡戬）
 */

const username = process.env.TEST_USERNAME;
const gitPath = `/home/${username}/.git`;
const desktopFilePath = `/home/${username}/Desktop/a-search.txt`;

// 功能函数：初始化文管测试环境
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    await system.exec(`rm -rf ${gitPath}`);
    await system.exec(`rm -f ${desktopFilePath}`);
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1972957-【搜索】【黑名单配置】配置黑名单路径-异常系', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await device.pressKey('Esc');
    await uos.showDesktop();
    await system.exec(`mkdir -p ${gitPath}`);
    await system.exec(`echo "测试搜索黑名单路径" > ${gitPath}/black-path.txt`);
    await system.exec(`echo "测试文件搜索" > ${desktopFilePath}`);
    
    // 前置条件：打开文管设置，勾选"显示隐藏文件"
    console.log('前置条件：打开文管设置，勾选"显示隐藏文件"');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置");
    await agent.aiTap("设置项左侧边的文件和目录");
    await agent.aiWaitFor("显示隐藏文件复选框已显示");
    const boolopen = await agent.aiBoolean(`显示隐藏文件复选框没有勾选`);
      if (boolopen) {
          console.log('开启显示隐藏文件');
          await agent.aiTap("显示隐藏文件复选框");
      } else {
          console.log('显示隐藏文件已开启，无需操作');
      }
    await agent.aiTap("设置窗口右上角关闭按钮");
    await device.pressKey('Alt','F4');
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  test('1972957-【搜索】【黑名单配置】配置黑名单路径-异常系', async ({ device, agent, uos, system }) => {
    // 步骤1：打开终端，检查黑名单默认配置
    console.log('步骤1：检查黑名单默认配置');
    const result1 = await system.exec(`dde-dconfig get -a org.deepin.anything -r org.deepin.anything -k blacklist_paths`);
    
    // 断言1：检查dde-dconfig get的返回值默认为'[ ]'
    console.log('断言1：检查黑名单默认值为空');
    const blacklistValue1 = result1.stdout.trim();
    console.log(`黑名单配置返回值: ${blacklistValue1}`);
    const normalizedValue = blacklistValue1.replace(/\s+/g, '').replace(/"/g, '');
    if (normalizedValue !== '[]') {
      throw new Error(`断言1失败：黑名单配置默认值应为空，实际返回值: ${blacklistValue1}`);
    }
    console.log('断言1通过：成功验证黑名单默认值为空');

    // 步骤2：打开文管，搜索black-path
    console.log('步骤2：打开文件管理器，搜索black-path');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('black-path');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言2：可以搜索出文件
    console.log('断言2：验证可以搜索出black-path.txt文件');
    await agent.aiAssert('搜索结果中包含black-path.txt文件');
    console.log('断言2通过：成功验证未配置黑名单时可以搜索出文件');

    // 步骤3：设置黑名单为[".git",".git"]（重复配置）
    console.log('步骤3：设置黑名单为[".git",".git"]');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '[".git",".git"]'`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 更新一次索引，使得搜索结果更准确（需要文管已开启）
    console.log('打开设置，更新索引');
    try {
      await device.pressKey('Esc');
      await agent.aiTap("文件管理器右上角菜单按钮");
      await agent.aiWaitFor("菜单已显示");
      await agent.aiTap("设置");
      await agent.aiWaitFor("设置窗口已显示");
      await agent.aiTap("左侧导航栏的搜索选项");
      await agent.aiWaitFor("搜索设置页面已显示");
      await agent.aiTap("立即更新索引按钮");
      await agent.aiWaitFor("全文搜索下方提示索引更新完成");
      await device.pressKey('Alt','F4');
      console.log('索引更新完成');
    } catch (err) {
      console.error('索引更新失败:', err);
    }

    // 步骤4：搜索black-path
    console.log('步骤4：搜索black-path');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.pressKey('Ctrl', 'a');
    await device.typeText('black-path');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言3：不能搜索出文件
    console.log('断言3：验证不能搜索出black-path.txt文件');
    await agent.aiAssert('仅检查文件名称，搜索结果中没有名称为black-path.txt的文件');
    console.log('断言3通过：成功验证配置黑名单后无法搜索出文件');

    // 步骤5：设置一个不存在的路径
    console.log('步骤5：设置一个不存在的路径');
    await system.exec(`dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v '["/home/${username}/Desktop/yichangxi"]'`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 步骤6：搜索a-search.txt
    console.log('步骤6：搜索a-search.txt');
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.pressKey('Ctrl', 'a');
    await device.typeText('a-search.txt');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果加载完毕");

    // 断言4：能搜索出来
    console.log('断言4：验证能搜索出a-search.txt文件');
    await agent.aiAssert('搜索结果中包含a-search.txt文件');
    console.log('断言4通过：成功验证不存在的路径不影响正常搜索');

  }, { timeout: 600000, tags: ['1972957', 'level4', 'search', 'hujian'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('afterAll: 清理测试套件');
    await system.exec('dde-dconfig set -a org.deepin.anything -r org.deepin.anything -k blacklist_paths -v \'[ ]\'');
    await clearEnv(system);
    await device.pressKey('Esc');
  });
});
