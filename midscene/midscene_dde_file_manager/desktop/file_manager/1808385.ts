/**
 * 用例 PMSID: 1808385
 * 用例标题: [061][core]勾选自动排列-移动文件/文件夹
 * 生成时间: 2026-02-4 15:09:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808385-[061][core]勾选自动排列-移动文件/文件夹', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    //在桌面创建测试文件夹和测试文本文件
    await system.exec('mkdir -p ~/Desktop/YF文件夹A && mkdir -p ~/Desktop/YF文件夹B && mkdir -p ~/Desktop/YF文件夹C'); //创建测试文件夹

    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //显示桌面
   // await uos.showDesktop();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 3000));//等到3秒
    //勾选自动排列
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    //开关按钮是否是打开状态， 如果未打开，则执行下面动作，否则不执行
      const switchStatus = await agent.aiBoolean(`自动排列图标后面的开关按钮的状态`); 
    if (switchStatus == false) {
      await agent.aiTap("自动排列图标后面的开关按钮");
    }
    await device.pressKey("ESC");
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808385-[061][core]勾选自动排列-移动文件/文件夹', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面拖拽文件B
    //await agent.aiAction("选中YF文件夹B，拖拽至YF文件夹A图标之前");
    await agent.aiDrag("YF文件夹C", "YF文件夹A和YF文件夹B之间空白处");
    await agent.aiAssert("桌面图标保持连续对齐网格状态");
    await agent.aiAssert("桌面文件顺序为：YF文件夹C 在 YF文件夹B 之前");

    //步骤2：拖拽文件到空白位置
    //await agent.aiAction("选中YF文件夹A，拖拽至桌面中间空白处");
    await agent.aiDrag("YF文件夹A", "桌面空白处")
    await agent.aiAssert("YF文件夹A自动显示在最后一个位置，并未显示在拖动停留处的空白区域位置");


  }, { timeout: 600000, tags: ["1808385", "level2", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/YF文件夹A && rm -rf ~/Desktop/YF文件夹B && rm -rf ~/Desktop/YF文件夹C');
    //清理回收站
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //关闭自动排列--恢复默认
    await agent.aiTap("桌面空白处");
    await device.pressKey("Alt+M");
    await agent.aiWaitFor("显示右键菜单");
    await agent.aiTap("桌面设置");
    await agent.aiTap("自动排列图标后面的开关按钮");
    await device.pressKey("ESC");
  });
}); 