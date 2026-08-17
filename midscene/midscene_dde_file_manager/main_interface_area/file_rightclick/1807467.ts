/**
 * 用例 PMSID: 1807467
 * 用例标题:  重命名支持特殊符号-搜索特殊符号文件和文件夹
 * 生成时间: 2026-03-20 13:34:00
 * 用例编写人:  UT002899(胡诗敏)
 */

describe('1807467-重命名支持特殊符号-搜索特殊符号文件和文件夹', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //创建包含特殊符号的测试文件和文件夹，后续测试
    await system.exec('mkdir /home/$USER/Desktop/++ /home/$USER/Desktop/== /home/$USER/Desktop/[[ /home/$USER/Desktop/]] /home/$USER/Desktop/,, /home/$USER/Desktop/+=[],')
    await system.exec('touch /home/$USER/Desktop/++.txt /home/$USER/Desktop/==.txt /home/$USER/Desktop/[[.txt /home/$USER/Desktop/]].txt /home/$USER/Desktop/,,.txt /home/$USER/Desktop/+=[],.txt')

      });

  test('1807467-重命名支持特殊符号-搜索特殊符号文件和文件夹', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，进入主目录，按Ctrl+f，输入+，查看搜索结果
    console.log('步骤 1: 打开文件管理器，进入主目录，按Ctrl+f，输入+，查看搜索结果');
    await uos.openApp('文件管理器')
    await agent.aiTap('主目录')
    await device.pressKey('ctrl','f')
    await device.typeText('+')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：++和+=[],文件夹，++.txt和+=[],.txt文件')

    // 步骤 2: 再次在搜索框Ctrl+a，输入=，查看搜索结果
    console.log('步骤 2: 再次在搜索框Ctrl+a，输入=，查看搜索结果');
    await device.pressKey('ctrl','a')
    await device.typeText('=')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：==和+=[],文件夹，==.txt和+=[],.txt文件')

    // 步骤 3: 再次在搜索框Ctrl+a，输入[，查看搜索结果
    console.log('步骤 3: 再次在搜索框Ctrl+a，输入[，查看搜索结果');
    await device.pressKey('ctrl','a')
    await device.typeText('[')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：[[和+=[],文件夹，[[.txt和+=[],.txt文件')

    // 步骤 4: 再次在搜索框Ctrl+a，输入]，查看搜索结果
    console.log('步骤 4: 再次在搜索框Ctrl+a，输入]，查看搜索结果');
    await device.pressKey('ctrl','a')
    await device.typeText(']')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：]]和+=[],文件夹，]].txt和+=[],.txt文件')

    // 步骤 5: 再次在搜索框Ctrl+a，输入,，查看搜索结果
    console.log('步骤 5: 再次在搜索框Ctrl+a，输入,，查看搜索结果');
    await device.pressKey('ctrl','a')
    await device.typeText(',')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：,,和+=[],文件夹，,,.txt和+=[],.txt文件')

    // 步骤 6: 再次在搜索框Ctrl+a，输入+=[],，查看搜索结果
    console.log('步骤 6: 再次在搜索框Ctrl+a，输入+=[],，查看搜索结果');
    await device.pressKey('ctrl','a')
    await device.typeText('+=[],')
    await device.pressKey('enter')
    await agent.aiAssert('显示搜索结果：+=[],文件夹，+=[],.txt文件')

  }, { timeout: 600000, tags: ["1807467", "level3", "menu","DITT", "hushimin1"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf  /home/$USER/Desktop/++*')
    await system.exec('rm -rf  /home/$USER/Desktop/==*')
    await system.exec('rm -rf  /home/$USER/Desktop/[[*')
    await system.exec('rm -rf  /home/$USER/Desktop/]]*')
    await system.exec('rm -rf  /home/$USER/Desktop/,,*')
    await system.exec('rm -rf  /home/$USER/Desktop/+=[],*')

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理文件管理器配置文件
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

  });
});