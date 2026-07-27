/**
 * 用例 PMSID: 1808425
 * 用例标题: [056]快捷键-按ctrl+h显示隐藏文件/文件夹
 * 生成时间: 2026-02-4 16:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808425-[056]快捷键-按ctrl+h显示隐藏文件/文件夹', () => {
  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec("mkdir -p ~/Desktop/HideYF && touch ~/Desktop/1808425.txt");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //桌面是否显示.hidden文件等隐藏，若显示则执行Ctrl+H,否则不执行
    try {
      // 1. AI查询桌面是否存在.开头的隐藏文件
       const hasHiddenFile = await agent.aiBoolean(`桌面上是否显示以 . 开头的隐藏文件？`);
      // 2. 健壮判断AI返回结果（兼容大小写/多余空格）
      if (hasHiddenFile) {
        // 检测到隐藏文件：执行Ctrl+H隐藏
        console.log('检测到桌面显示隐藏文件，执行Ctrl+H隐藏该文件');
        await device.pressKey("Ctrl+H");
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒生效
      } else {
        // 未检测到隐藏文件：仅输出日志
        console.log('未检测到桌面显示隐藏文件，无需执行Ctrl+H');
      }

      // 3. 无论是否检测到，最终删除桌面的.hidden文件
      console.log('开始删除桌面的.hidden文件');
      await system.exec("rm -rf ~/Desktop/.hidden");
      console.log('.hidden文件删除完成（若存在则删除，不存在则无操作）');

    } catch (error) {
      // 捕获所有异常（AI查询/快捷键/系统命令失败）
      console.error('操作过程中发生错误：', error.message);
    }
  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808425-[056]快捷键-按ctrl+h显示隐藏文件/文件夹', async ({ device, agent, uos, system, env }) => {

    //步骤1：桌面选择文件，设置隐藏
    await agent.aiRightClick("HideYF");
    await agent.aiWaitFor("右键菜单");
    await agent.aiTap("属性");
    await agent.aiTap("隐藏此文件前面的复选框");
    await device.pressKey("ESC");
    await agent.aiAssert("桌面上HideYF文件不显示");

    //测试文件
    await agent.aiRightClick("1808425.txt");
    await agent.aiWaitFor("右键菜单");
    await agent.aiTap("属性");
    await agent.aiTap("隐藏此文件前面的复选框");
    await device.pressKey("ESC");
    await agent.aiAssert("1808425.txt文件不显示");

    //步骤2：按快捷键Ctrl+H 显示隐藏文件

    await device.pressKey("Ctrl+H");
    await agent.aiAssert("桌面上显示：HideYF、1808425.txt");

  }, { timeout: 600000, tags: ["1808425", "level4", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await system.exec('rm -rf ~/Desktop/HideYF');
    await system.exec('rm -rf ~/Desktop/1808425.txt');
    //桌面是否显示.hidden文件等隐藏，若显示则执行Ctrl+H,否则不执行
    try {
      // 1. AI查询桌面是否存在.开头的隐藏文件
        const hasHiddenFile = await agent.aiBoolean(`桌面上是否显示以 . 开头的隐藏文件？`);

      // 2. 健壮判断AI返回结果（兼容大小写/多余空格）
      if (hasHiddenFile) {
        // 检测到隐藏文件：执行Ctrl+H隐藏
        console.log('检测到桌面显示隐藏文件，执行Ctrl+H隐藏该文件');
        await device.pressKey("Ctrl+H");
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒生效
      } else {
        // 未检测到隐藏文件：仅输出日志
        console.log('未检测到桌面显示隐藏文件，无需执行Ctrl+H');
      }

      // 3. 无论是否检测到，最终删除桌面的.hidden文件
      console.log('开始删除桌面的.hidden文件');
      await system.exec("rm -rf ~/Desktop/.hidden");
      console.log('.hidden文件删除完成（若存在则删除，不存在则无操作）');

    } catch (error) {
      // 捕获所有异常（AI查询/快捷键/系统命令失败）
      console.error('操作过程中发生错误：', error.message);
    }
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 