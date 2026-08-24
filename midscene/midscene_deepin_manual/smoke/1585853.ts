/**
 
 * 用例 PMSID:1585853
 * 用例标题: 桌面环境
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585853-桌面环境', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册、控制中心、启动器
    await uos.showDesktop();
    await system.exec('ll-cli kill org.deepin.manual');
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585853-桌面环境', async ({ device, agent, system,uos }) => {
    // 步骤 1: 打开帮助手册，执行快捷键F1，预期系统的帮助手册被启动，位于屏幕中央，并直接打开桌面环境项目
    await device.pressKey('F1');
    await agent.aiWaitFor("展示快速入门，系统，应用模块");
    await agent.aiAssert("帮助手册直接打开陈正文概述，侧边栏展示概述，桌面，任务栏");
    await system.exec('ll-cli kill org.deepin.manual');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("帮助手册关闭");
  

    // 步骤 2: 进入系统，打开控制中心，按F1按钮，预期启动帮助手册，并进入到桌面环境项目
    await uos.openApp("控制中心");
    await agent.aiWaitFor("系统设置界面已显示");
    await device.pressKey('F1');
    await agent.aiWaitFor("帮助手册已启动");
    await agent.aiAssert("帮助手册直接打开正文介绍控制中心，侧边栏控制中心高亮");
    await system.exec('ll-cli kill org.deepin.manual');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("帮助手册关闭");
    await system.exec('pkill -f dde-control-center || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("控制中心关闭");
    

    // 步骤 3: 进入系统，打开启动器，按F1按钮，预期启动帮助手册，并进入到桌面环境项目中
    await device.pressKey('Super');
    await agent.aiWaitFor("启动器已打开");
    await device.pressKey('F1');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("帮助手册直接打开正文介绍启动器，侧边栏启动器高亮");

  }, { timeout: 400000, tags: ['1585853', 'level1'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 点击右上角的x按钮，帮助手册关闭
    await system.exec('ll-cli kill org.deepin.manual');
    await agent.aiWaitFor("帮助手册窗口已关闭");
  });

});
