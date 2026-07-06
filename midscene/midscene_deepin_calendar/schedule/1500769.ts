// @ts-nocheck
// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1500769
 * 用例标题: 删除未被占用的日程类型
 * 生成时间: 2025-12-15 20:15:00
 * 用例编写人: UT004175（张美）
 */

describe('1500769-删除未被占用的日程类型', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1500769-删除未被占用的日程类型', async ({ device, agent, uos, scroll }) => {
    // 步骤 1: 打开日历，创建日程类型C，自动化脚本创建的日程命名新建日程1500769
    await uos.openApp("日历");
    await agent.aiWaitFor("界面有窗口显示年、月、周、日");
    
    // 点击标题栏“+”
    await agent.aiTap("最上边一行搜索框右边的+号按钮");
    await agent.aiWaitFor("新建日程弹窗已打开含新建日程字样");
    // 点击类型下拉框
    await agent.aiTap("类型下拉框");
    await agent.aiWaitFor("类型下拉菜单显示");
    await agent.aiAssert("类型下拉菜单中包含新增日程类型");
    await agent.aiTap("新增日程类型");
    // 点击“新增日程类型”
    // await agent.aiTap("新增日程类型");
    await device.typeText("新建日程1500769");
    // 等待类型显示为新建日程1500769
    await agent.aiWaitFor("类型显示为新建日程1500769");
    //在内容文本框中输入内容为test123
    await agent.aiTap("内容文本输入框");
    await device.typeText("test123");

    // 点击保存按钮
    await agent.aiTap("保存按钮");
    // 等待日程在日历页面显示（验证创建成功）
    await agent.aiWaitFor("含test字样的日程在日历页面显示");
    
    // 步骤 2: 主菜单->管理，进入日历管理页面
    await agent.aiTap("主菜单按钮");
    //await agent.aiWaitFor("主菜单显示管理、主题字样");
    await agent.aiTap("管理菜单项");
   //点击日程类型
    await agent.aiTap("弹出框中最左侧的日程类型");
    // 步骤 3: 鼠标悬停新建日程1500769栏上，检查页面显示，展示“编辑”、“删除”图标
    await agent.aiHover("新建日程1500769", { deepThink: true });
    await agent.aiAssert("新建日程1500769右边第一个编辑图标");

    // 步骤 4: 点击“删除”按钮，日程类型直接被删除，同时日程类型列表不展示该日程类型
    await agent.aiTap("新建日程1500769右边第二个垃圾箱图标");
    await agent.aiAssert("包含删除按钮的弹出框");
    await agent.aiTap("删除按钮");
    //await agent.aiWaitFor("日程类型C已从列表中消失");
    await agent.aiAssert("日程类型列表中不包含新建日程1500769");

    // 步骤 5: 返回到日历页面，并点击标题栏“+”，检查类型下拉框显示，不显示日程类型C
    await agent.aiTap("弹出框的右上角关闭按钮X");
    await agent.aiWaitFor("日历主页面已显示");

    await agent.aiAssert("本地账户下不包含新建日程1500769");

  }, { timeout: 1800000, tags: ["1500769", "level1", "demo"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("pkill dde-calendar");
    await uos.showDesktop(); // 恢复桌面状态
  });
});