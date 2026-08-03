/**
 * 用例 PMSID: 1806811
 * 用例标题:  [058]快捷访问-右键重命名
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1806811- [058]快捷访问-右键重命名', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent ,system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`mkdir /home/$USER/Documents/新建测试文件夹`)
  });

  test('1806811- [058]快捷访问-右键重命名', async ({ device, agent, uos , system}) => {
    // 步骤 1: 桌面创建文件创建快捷方式
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器加载完成");
    await agent.aiTap("侧边栏的文档");
    
    await agent.aiRightClick("'新建测试文件夹'文件夹图标",{deepThink:true});
    await agent.aiTap("添加到快捷访问");
    await agent.aiAssert("侧边栏目录显示新建测试文件夹");

    // 步骤 2: 快捷访问重命名为空格
    await agent.aiRightClick("侧边栏的新建测试文件夹");
    await agent.aiTap("重命名");
    await device.typeText(` `)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷访问名称为 ");

    
    // 步骤 3: 快捷访问重命名为数字/字母/特殊字符
    await agent.aiRightClick("文件管理器窗口内回收站下面的按钮");
    await agent.aiTap("重命名");
    await device.typeText(`1234`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为1234");

    await agent.aiRightClick("侧边栏的1234");
    await agent.aiTap("重命名");
    await device.typeText(`test`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为test");
    await agent.aiRightClick("侧边栏的test");
    await agent.aiTap("重命名");
    await device.typeText(`!@#$`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为!@#$");

    // 步骤 3: 快捷访问重命名为中文数字/字母/特殊字符的任意组合字符
    await agent.aiRightClick("侧边栏的!@#$");
    await agent.aiTap("重命名");
    await device.typeText(`测试A12#$`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为测试A12#$");

    // 步骤 4: 快捷访问重命名为85个字符字符 
    await agent.aiRightClick("侧边栏的测试A12#$");
    await agent.aiTap("重命名");
    await device.typeText(`新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在快捷方式名称为新建测试文件新建");

    // 步骤 5: 快捷访问重命名已存在的名称
    await agent.aiRightClick("侧边栏的新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件新建测试文件");

    await agent.aiTap("重命名");
    await device.typeText(`桌面`)
    await device.pressKey(`Enter`)
    await agent.aiAssert("侧边栏存在两个桌面");

    // 步骤 4: 清理环境
    await agent.aiRightClick("文件管理器侧边栏回收站下方的桌面");
    await agent.aiTap("从快捷访问移除");
    await system.exec(`rm -rf /home/$USER/Documents/新建测试*`)

  }, { timeout: 1200000, tags: ['1806811', 'level3',  'bookmark', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});