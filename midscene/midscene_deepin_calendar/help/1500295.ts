// @ts-nocheck
// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * AI 生成的测试脚本
 * 用例 PMSID: 1500295
 * 用例标题: 日历帮助
 * 生成时间: 2025-12-12 13:19:00
 * 用例编写人: UT004175（张美）
 */

describe('1500295-日历帮助', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1500295-日历帮助', async ({ device, agent, uos }) => {
    // 步骤 1: 在启动器中打开日历
    await uos.openApp("日历");

    // 步骤 2: 日历界面已显示
    await agent.aiWaitFor("界面有窗口显示年、月、周、日");
    // 步骤 2: 点击界面右上角三个小横线的按钮，在弹出的选项中点击帮助按钮，
    // 能正常进入帮助页面，帮助内容显示符合应用功能
    await agent.aiTap("界面右上角三个小横线的按钮");
    // 等待菜单显示，增加超时时间
    await agent.aiWaitFor("选项菜单已显示", { timeout: 30000 });
    await agent.aiTap("帮助按钮");
    await agent.aiWaitFor("帮助页面弹出框含概述菜单", { timeout: 30000 });
    await agent.aiAssert("帮助内容显示,含日历主窗口图片、概述、使用入门、操作介绍以及主菜单");

    // 步骤 3: 点击帮助弹出框左侧的菜单栏中的运行日历按钮
    // 可以正确跳转，且内容显示正确
    await agent.aiTap("帮助弹出框左侧的菜单栏中的运行日历菜单");
    await agent.aiWaitFor("运行日历页面已打开", { timeout: 30000 });
    await agent.aiAssert("显示运行日历介绍内容");

  }, { timeout: 600000, tags: ["1500295", "level1", "demo"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // try {
    //   await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    // } catch (e) {
    //   console.log('帮助手册窗口可能已关闭，跳过');
    // }
    // try {
    //   await agent.aiTap("日历窗口右上角关闭按钮:X");
    // } catch (e) {
    //   console.log('日历窗口可能已关闭，跳过');
    // }
    await system.exec("pkill dde-calendar"); 
    await uos.showDesktop(); // 恢复桌面状态
  });
}); 