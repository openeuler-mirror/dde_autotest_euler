/**
 * 用例 PMSID: 1805059
 * 用例标题: 顶部右键-"移至左边工作区"功能
 * 生成时间: 2026-05-14
 * 用例编写人: UT000649（黄甜）
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('1805059-顶部右键-"移至左边工作区"功能', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    
    console.log('检查当前工作区数量');
    await device.pressKey('Super', 's');
    await sleep(1000);
    
    let workspaceCount = 1;
    for (let i = 2; i <= 10; i++) {
      try {
        await agent.aiTap(`左侧第${i}个工作区`);
        workspaceCount = i;
        await sleep(200);
      } catch (e) {
        break;
      }
    }
    
    console.log(`当前工作区数量: ${workspaceCount}`);
    
    if (workspaceCount > 4) {
      console.log(`工作区数量大于4，需要关闭 ${workspaceCount - 4} 个工作区`);
      for (let i = workspaceCount; i > 4; i--) {
        try {
          await agent.aiTap(`左侧第${i}个工作区右上角的关闭按钮:X`);
          await sleep(500);
          console.log(`✅ 已关闭第${i}个工作区`);
        } catch (e) {
          console.log(`⚠️  关闭第${i}个工作区失败`);
        }
      }
    } else if (workspaceCount < 4) {
      console.log(`工作区数量小于4，需要新增 ${4 - workspaceCount} 个工作区`);
      for (let i = workspaceCount; i < 4; i++) {
        try {
          await agent.aiTap('右上角+');
          await sleep(500);
          console.log(`✅ 已新增第${i + 1}个工作区`);
        } catch (e) {
          console.log(`⚠️  新增工作区失败`);
        }
      }
    } else {
      console.log('工作区数量已等于4，无需调整');
    }
    console.log('✅ 工作区数量已调整为4个');
  });

  test('1805059-顶部右键-"移至左边工作区"功能', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1805059-移至左边工作区 ===');

    console.log('步骤1: 切换到最左侧工作区，打开文件管理器，在顶部菜单栏空白处右键');
    await agent.aiTap('左边第1个工作区');
    await device.pressKey('Super', 's');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiRightClick('顶部主菜单栏空白区域');
    await agent.aiAssert("移至左边的工作区显示为非黑色字体");
    await agent.aiTap("关闭按钮");
    console.log('✅ 显示右键菜单；移至左边的工作区显示为灰色字体');

    console.log('步骤2: 切换到中间的工作区，打开文件管理器，在顶部菜单栏空白处右键');
    await device.pressKey('Super', 's');
    await agent.aiTap('左边第2个工作区');
    await device.pressKey('Super', 's');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiRightClick('顶部菜单栏空白区域');
    await agent.aiAssert("右键菜单已显示");
    await agent.aiAssert("移至左边的工作区显示为黑色字体");
    await agent.aiTap("关闭按钮");
    console.log('✅ 显示右键菜单；移至左边的工作区显示高亮');

    console.log('步骤3: 在最后一个工作区（最右边）的文件管理器中点击"移至左边的工作区"');
    await device.pressKey('Super', 's');
    await agent.aiTap('右边边第一个工作区');
    await device.pressKey('Super', 's');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiRightClick('顶部菜单栏空白区域');
    await agent.aiTap('移至左边的工作区');
    await device.pressKey('ctrl+alt+left');
    await agent.aiAssert("桌面存在文件管理器窗口");
    console.log('✅ 文管窗口被移动到左边的工作区');

    console.log('步骤4: 切换到前一个工作区（向左）的工作区');
    await agent.aiRightClick('顶部菜单栏空白区域');
    await agent.aiTap('移至左边的工作区');
    await device.pressKey('ctrl+alt+left');
    await agent.aiAssert("桌面存在文件管理器窗口");
    console.log('✅ 文件管理器出现在倒数第二个工作区中，显示页面为移动前页面');

    console.log('步骤5: 再次点击"移至左边的工作区"，切换工作区');
    await agent.aiRightClick('顶部菜单栏空白区域');
    await agent.aiTap('移至左边的工作区');
    await device.pressKey('ctrl+alt+left');
    await agent.aiAssert("桌面存在文件管理器窗口");
    console.log('✅ 文件管理器被关闭，文件管理器出现在倒数第三个工作区中，显示页面为移动前页面');

    console.log('✅ 1805059用例测试完成');
  }, { timeout: 600000, tags: ["1805059", "level3", "top_right", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    console.log('检查当前工作区数量');
    await device.pressKey('Super', 's');
    await sleep(1000);
    
    let workspaceCount = 1;
    for (let i = 2; i <= 10; i++) {
      try {
        await agent.aiTap(`左侧第${i}个工作区`);
        workspaceCount = i;
        await sleep(200);
      } catch (e) {
        break;
      }
    }
    
    console.log(`当前工作区数量: ${workspaceCount}`);
    
    if (workspaceCount > 2) {
      console.log(`工作区数量大于2，需要关闭 ${workspaceCount - 2} 个工作区`);
      for (let i = workspaceCount; i > 2; i--) {
        try {
          await agent.aiTap(`左侧第${i}个工作区右上角的关闭按钮:X`);
          await sleep(500);
          console.log(`✅ 已关闭第${i}个工作区`);
        } catch (e) {
          console.log(`⚠️  关闭第${i}个工作区失败`);
        }
      }
    }
    
    await device.pressKey('Super', 's');
    await system.exec(`killall dde-file-manager`, 500);
  });
});