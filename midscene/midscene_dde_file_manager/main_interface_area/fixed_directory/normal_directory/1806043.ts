
/**
 * 用例 PMSID: 1806043
 * 用例标题: 普通目录中进行快捷键操作
 * 生成时间: 2025-12-30 10:20:21
 * 用例编写人：UT000374 (胡宏杰)
 */
// @ts-nocheck
require("dotenv/config");

describe('1806043-普通目录中进行快捷键操作', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806043-普通目录中进行快捷键操作', async ({ device, agent, uos, system }) => {
    //创建35个文件夹
    for (let i = 0; i < 35; i++) {
      await system.exec(`mkdir ~/Downloads/test${i + 1}`, 500);
    }

    await agent.aiDoubleClick('主目录');
    await agent.aiTap('文管左侧边栏下载');
    await agent.aiTap('文管窗口右上方口字型排列四个点形状按钮', { deepThink: true });
    
    // 判断是否是图标模式
    const result = await agent.aiBoolean('文管窗口内文件排列为图标视图模式');
    if (result) {
        console.log('文件排列为图标视图模式，跳过判断继续执行');
    } else {
        console.log('文件排列不为图标视图模式，重新点击');
        await agent.aiTap('文管窗口顶部搜索左侧图标视图', { deepThink: true });
    }

    await agent.aiTap('test15');
    await agent.aiAssert("test15文件夹被选中");
    await device.pressKey('Ctrl+C');
    await device.pressKey('Ctrl+V');
    await agent.aiAssert("多出1个test15（副本）文件夹");
    await device.pressKey('Ctrl+Z');
    await agent.aiTap('删除');
    await agent.aiAssert("不存在test15（副本）文件夹");
    await agent.aiTap('test15');
    await device.pressKey('Space');
    await agent.aiAssert("打开预览弹窗，左侧为文件夹图标，右侧显示test15");
    await device.pressKey('Space');
    await device.pressKey('left');
    await agent.aiAssert("未选中test15(选中状态名称字显示为白色，字体背景蓝色)");
    await device.pressKey('right');
    await agent.aiAssert("选中test15");
    await device.pressKey('down');
    await agent.aiAssert("选中第test15的下面一排文件夹其中一个");
    await device.pressKey('up');
    await agent.aiAssert("选中test15");
    await device.pressKey('tab');
    await agent.aiAssert("未选中test15(选中状态名称字显示为白色，字体背景蓝色)");
    await device.pressKey('Enter');
    await agent.aiAssert("新打开一个文件夹窗口");

  }, { timeout: 600000, tags: ['1806043', 'level3', 'normal_directory', 'huhongjie'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf ~/Downloads/test*`, 500);
      //关闭所有文管窗口
    await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
  });
});
