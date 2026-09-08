
/**
 * 用例 PMSID: 1811843
 * 用例标题: 保险箱内各菜单功能检查-文件操作
 * 生成时间: 2026-01-23 15:52:44
 * 用例编写人：UT006252(杨通)
 */

describe('1811843-保险箱内各菜单功能检查-文件操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('步骤1: 打开文管并全屏显示');
    await uos.showDesktop();
    //打开文件管理器并全屏显示
    await uos.showDesktop();
    console.log('打开文件管理器');
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();

    //前置进行保险箱删除操作确保环境干净
    console.log('步骤2: 双重保险清理保险箱环境');
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
    await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    const result = await system.exec(`fusermount -u /home/${TEST_USERNAME}/.config/Vault/vault_unlocked`);
    console.log(result.stderr);
	    if (result.success) {
      console.log('保险箱环境有残留，已强制卸载');
      await system.exec(`rm -r /home/${TEST_USERNAME}/.config/Vault`);
      await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    } else {
        console.log('保险箱环境无需清理');
      }
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    const TEST_USERNAME = process.env.TEST_USERNAME;
    //密匙加密创建保险箱
    console.log('步骤1: 创建保险箱');
    await agent.aiDoubleClick('保险箱图标');
    await agent.aiWaitFor('出现专属于个人的安全空间文本');
    await agent.aiTap('开启按钮');
    await agent.aiInput('Aa!12345', '密码输入框');
    await agent.aiInput('Aa!12345', '重复密码输入框');
    await agent.aiTap('下一步按钮');
    await agent.aiWaitFor('下一步按钮');
    await agent.aiAssert('出现保存恢复密匙文件并将其存放在安全的地方文本');
    await agent.aiTap('选择密匙文件保存路径文本右侧的蓝色底三个白色圆点的按钮');
    await agent.aiTap('保存按钮');
    await agent.aiTap('下一步按钮');
    await agent.aiTap('加密保险箱按钮');
    await device.typeText(`${TEST_PASSWORD}`, true);
    await agent.aiWaitFor('确定按钮',{ timeoutMs: 60000 });
    await agent.aiAssert('出现加密已完成文本');
    await agent.aiTap('确定按钮');

    console.log('步骤2: 将测试文件拷贝至保险箱中');
    const caseDir = process.env.TESTCASE_DIR;
    // 使用系统命令复制文件
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1970081/* /home/${TEST_USERNAME}/.config/Vault/vault_unlocked`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log(`文件已复制到保险箱`);
  });

  test('1811843-保险箱内各菜单功能检查-文件操作', async ({ device, agent, uos ,system}) => {

    console.log('步骤1: 右键菜单选择默认程序');
    await agent.aiRightClick('周期.pdf文件');
    await agent.aiWaitFor('菜单出现');
    await agent.aiTap('打开方式选项');
    await agent.aiTap('选择默认程序选项');
    await agent.aiTap('确定按钮');
    await agent.aiWaitFor('打开窗口出现');
    await agent.aiAssert('出现头部超出部分文本');
    await system.exec('killall deepin-reader');

    console.log('步骤2: 右键菜单属性检查');
    await agent.aiRightClick('界面空白处');
    await agent.aiWaitFor('菜单出现');
    await agent.aiTap('属性选项');
    await agent.aiWaitFor('基本信息文本');
    await agent.aiAssert('属性弹窗显示大小、文件个数、类型、位置、创建时间、访问时间、上锁时间信息');
    await agent.aiTap('属性弹窗右上角的x'); // 关闭属性窗口

    console.log('步骤3: 右键菜单全选功能');
    await agent.aiRightClick('界面空白处');
    await agent.aiWaitFor('菜单出现');
    await agent.aiTap('全选选项');
    await agent.aiAssert('文件的文件名背景变为蓝色');

    console.log('步骤4: 复制粘贴功能');
    await agent.aiTap('页面空白处');
    await agent.aiRightClick('源.txt文件');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('复制选项');
    await agent.aiRightClick('界面空白处');
    await agent.aiWaitFor('菜单出现');
    await agent.aiAssert('粘贴选项');
    await agent.aiTap('粘贴选项');
    await agent.aiAssert('出现源（副本）.txt文件');
  }, { timeout: 1200000, tags: ['1811843', 'level2', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const TEST_PASSWORD = process.env.TEST_PASSWORD;
    const TEST_USERNAME = process.env.TEST_USERNAME;
    //删除保险箱
    console.log('卸载保险箱');
    await agent.aiTap('计算机文本');
    await agent.aiRightClick('保险箱文本');
    await agent.aiTap('删除保险箱选项');
    await agent.aiTap('密码文本');
    await device.typeText('Aa!12345', true);
    await device.typeText(`${TEST_PASSWORD}`);
    await agent.aiTap('确定按钮');
    await agent.aiTap('确定按钮');
    const result = await system.exec(`rm /home/${TEST_USERNAME}/recoveryKey.key`);
    if (result.success) {
      console.log('删除密匙文件成功');
    } else {
      console.error('错误:', result.stderr);
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    console.log('关闭文件管理器');
    await uos.closeCurrentWindow();
    await uos.showDesktop(); // 恢复桌面状态
    //双重保险清理文件管理器环境
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager');
  });
});
