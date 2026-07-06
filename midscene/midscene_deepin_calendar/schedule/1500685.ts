// @ts-nocheck
// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1500685
 * 用例标题: 创建自定义日程类型日程
 * 生成时间: 2025-12-15 20:09:00
 * 用例编写人: UT004175（张美）
 */

describe('1500685-创建自定义日程类型日程', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1500685-创建自定义日程类型日程', async ({ device, agent, uos }) => {
    // 步骤 1: 打开日历，切换到月视图页面，点击标题栏“+”
    await uos.openApp("日历");
    await agent.aiWaitFor("界面有窗口显示年、月、周、日");
    // 切换到月视图
    await agent.aiTap("月视图按钮");
    await agent.aiWaitFor("月视图已显示");
    // 点击标题栏“+”
    await agent.aiTap("最上边一行搜索框右边的+号按钮");
    await agent.aiWaitFor("弹窗出框打开有新建日程展示");

    // 步骤 2: 点击类型下拉框，选择自定义类型：会议1
    await agent.aiTap("类型下拉框");
    await agent.aiWaitFor("类型下拉菜单显示");
    await agent.aiAssert("类型下拉菜单中包含新增日程类型");
    await agent.aiTap("新增日程类型");
    await device.typeText("会议1");
    await agent.aiWaitFor("类型已选择会议1");
    await agent.aiAssert("类型显示为会议1");
    await agent.aiTap("内容文本输入框");
    await device.typeText("日程test");

    // 步骤 3: 点击“保存”，检查日历页面显示
    await agent.aiTap("保存按钮");
    //await agent.aiWaitFor("日程保存成功提示");
    // 检查日历页面显示
    await agent.aiAssert("日程test在日历页面显示");
   // await agent.aiAssert("日程标签色显示为粉色");

  }, { timeout: 600000, tags: ["1500685", "level1", "demo"] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除日程test
    await agent.aiRightClick("日程test");
    await agent.aiWaitFor("右键菜单显示删除按钮");
    await agent.aiTap("删除按钮");
    await agent.aiWaitFor("确认删除提示框显示");
    await agent.aiTap("确认删除按钮");
    await agent.aiWaitFor("日程test已消失");
    await agent.aiAssert("日程test不存在于日历页面");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭日历窗口
    await system.exec("pkill dde-calendar"); 
    await uos.showDesktop(); // 恢复桌面状态
  });
});