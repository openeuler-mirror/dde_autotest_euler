/**
 * 用例 PMSID: 1805043
 * 用例标题: 顶部右键-"总在可见工作区"功能
 * 生成时间: 2026-05-14
 * 用例编写人: UT000649（黄甜）
 */

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('1805043-顶部右键-"总在可见工作区"功能', () => {
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
    for (let i = 2; i <= 5; i++) {
      try {
        await agent.aiTap(`左侧第${i}个工作区`);
        workspaceCount = i;
        await sleep(200);
      } catch (e) {
        break;
      }
    }
    
    console.log(`当前工作区数量: ${workspaceCount}`);
    
    if (workspaceCount < 2) {
      console.log('工作区数量小于2，新增1个工作区');
      await agent.aiTap('右上角+');
      await sleep(500);
      console.log('✅ 已新增工作区');
    } else {
      console.log('工作区数量已大于等于2，无需新增');
    }
    
    await device.pressKey('Super', 's');

    console.log('前置条件: 新建多个工作区');
    console.log('✅ 已创建多个工作区');
  });

  test('1805043-顶部右键-"总在可见工作区"功能', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1805043-总在可见工作区 ===');

    console.log('步骤1: 在文件管理器顶部工作栏空白处右键');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiRightClick('顶部工作栏空白区域');
    await agent.aiAssert("右键菜单已显示");
    await agent.aiAssert("总在可见工作区没有√");
    console.log('✅ 显示右键菜单，"总在可见工作区"为勾选框，默认未勾选');

    console.log('步骤2: 勾选"总在可见工作区"');
    await agent.aiTap("总在可见工作区");
    await agent.aiAssert("右键菜单已关闭");
    console.log('✅ 右键菜单被关闭');

    console.log('步骤3: 再次在顶部右键');
    await agent.aiRightClick('顶部工作栏空白区域');
    await agent.aiAssert("总在可见工作区显示√");
    console.log('✅ 总在工作区可见被勾选');

    console.log('步骤4: super+s 调出所有工作区，查看文件文件管理器');
    await device.pressKey('Super+s');
    await agent.aiAssert("工作区存在文件管理器窗口");
    console.log('✅ 所有工作区都有文件管理器窗口且保持操作前页面');

    console.log('步骤5: 新建工作区，查看新建工作区');
    await agent.aiTap('右上角+'); 
    await agent.aiAssert("新建工作区存在文件管理器窗口");
    console.log('✅ 在新建的工作区桌面显示同样的文件管理器');

    console.log('步骤6: 在其中一个工作区关闭文件管理器');
    await device.pressKey('Super+s');
    await agent.aiTap("空白处");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
    await device.pressKey('Super+s');
    await agent.aiAssert("工作区不存在文件管理器窗口");
    console.log('✅ 所有工作区的文件管理器被关闭');

    console.log('✅ 1805043用例测试完成');
  }, { timeout: 600000, tags: ["1805043", "level3", "top_right", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    for (let i = 2; i <= 6; i++) {
      try {
        await agent.aiTap(`左侧第${i}个工作区`);
        await agent.aiTap(`左侧第${i}个工作区右上角的关闭按钮:X`);
        await sleep(500);
        console.log(`✅ 已关闭第${i}个工作区`);
      } catch (e) {
        console.log(`⚠️  第${i}个工作区不存在，停止关闭`);
        break;
      }
    }
    
    await device.pressKey('super+s');
  });
});