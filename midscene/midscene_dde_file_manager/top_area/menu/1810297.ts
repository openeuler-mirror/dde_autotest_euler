// @ts-nocheck

/**
 * 用例 PMSID: 1810297
 * 用例标题: 【菜单】不勾选【显示隐藏文件】-桌面/普通目录隐藏文件/文件夹
 * 生成时间：2026-01-23 16:46:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810297-不勾选显示隐藏文件时桌面和普通目录隐藏文件文件夹', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810297-不勾选显示隐藏文件时桌面和普通目录隐藏文件文件夹', async ({ device, agent, uos, system }) => {
    // 前置条件：确保不显示隐藏文件
    await system.exec('rm -rf ~/Desktop/*810* ~/Desktop/.1810*', 500);
    await system.exec('rm -rf ~/Documents/1810* ~/Documents/.1810*', 500);
    await system.exec('killall dde-file-manager', 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);

    await system.exec('mkdir ~/Desktop/1810297file ~/Documents/1810297file')
    await system.exec('touch ~/Desktop/1810297.txt ~/Documents/1810297.txt')
    await agent.aiWaitFor("文件和文件夹创建成功")
    await agent.aiRightClick("1810297txt")
    await agent.aiTap("重命名")
    
    // 重命名为“.1810297txt”
    await device.typeText(".18up");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("隐藏");
    await agent.aiAssert(".18up.txt不显示");

    await agent.aiRightClick("1810297file")
    await agent.aiTap("重命名")
    await device.typeText(".18fi");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("隐藏");
    await agent.aiAssert(".18fi不显示");

    // 步骤4：启动器-文件管理器，点击侧边栏的文档目录，重复步骤1~3
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开");

    // 在文档目录重复步骤1~3
    await agent.aiRightClick("1810297.txt")
    await agent.aiTap("重命名")
    await device.typeText(".18up");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("隐藏");
    await agent.aiAssert(".18up.txt不显示");

    await agent.aiRightClick("1810297file")
    await agent.aiTap("重命名")
    await device.typeText(".18fi");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("隐藏");
    await agent.aiAssert(".18fi不显示");

    // 切换显示隐藏文件
    await device.pressKey("Ctrl+H")
    await agent.aiAssert("文档目录隐藏文件已显示")
    await agent.aiTap("文件管理器侧边栏的桌面")
    await agent.aiWaitFor("已切换到桌面目录")
    await agent.aiAssert("桌面目录隐藏文件已显示")

  }, { timeout: 900000, tags: ['1810297', 'level2', 'top_area', 'menu', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("Ctrl+H")
    // 清理桌面和文档目录中可能创建的文件
    await system.exec('killall dde-file-manager', 500);
    await system.exec('rm -rf ~/Desktop/*810* ~/Desktop/.18*', 500);
    await system.exec('rm -rf ~/Documents/1810* ~/Documents/.18*', 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
  });
});