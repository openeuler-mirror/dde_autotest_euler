/**
 * 用例 PMSID: 1808467
 * 用例标题: 桌面-文件名优化-不同字体下检查文件/文件夹名称显示_
 * 生成时间: 2026-03-20 15:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808467-桌面-文件名优化-不同字体下检查文件/文件夹名称显示_', () => {

  // 前置：初始化+设置前置条件
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //释放所有按键
    await device.releaseAllKeys();

    //创建18个汉字的测试文件和测试文件夹
    await system.exec("mkdir -p ~/Desktop/月落星沉沧海桑田几度春秋轮回");
    await system.exec("touch  ~/Desktop/云卷云舒花开花谢岁月静好如初.txt");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //显示桌面
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    //设置桌面图标大小为极小
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("图标大小");
    await agent.aiTap("图标大小刻度条最左侧第一个刻度值上面的进刻度条");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("ESC");

  });

  // 每个测试前的准备
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808467-桌面-文件名优化-不同字体下检查文件/文件夹名称显示_', async ({ device, agent, uos, system, env }) => {

    //步骤1：控制中心设置字体11号
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("字体和字号可见");
    await agent.aiTap("字体和字号");
    await agent.aiWaitFor("字号进度条显示");
    await agent.aiTap("11正上方的进度条");

    //显示桌面
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //检查11号字体，测试文件和文件夹名称显示
    await agent.aiAssert("桌面存在文件夹：月落星沉 …秋轮回； 忽视文件夹名字换行和空格");
    await agent.aiAssert("桌面存在文件：云卷云舒 …初.txt；忽视文件名字换行和空格");

    //步骤2：修改图标大小为小、中，大、极大，检查文件夹和文件名称显示
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("图标大小");
    await agent.aiTap("刻度条右侧的白色图标");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒   
    //图标大小为小
    await agent.aiAssert("桌面存在文件夹名称为：月落星沉沧海 …度春秋轮回； 忽视文件名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云舒花开…静好如初.txt； 忽视文件名空格和换行");
    //图标大小为中
   await agent.aiTap("刻度条右侧的白色图标");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒   
    await agent.aiAssert("桌面存在文件夹名称为：月落星沉沧海桑田几 度春秋轮回； 忽视文件名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云舒花开花谢岁 月静好如初.txt； 忽视文件名空格和换行");

    //图标大小为大
   await agent.aiTap("刻度条右侧的白色图标");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒   

    await agent.aiAssert("桌面存在文件夹名称为：月落星沉沧海桑田几度春秋轮回； 忽视文件名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云舒花开花谢岁月静好如 初.txt； 忽视文件名空格和换行");
    //图标大小为极大
    await agent.aiTap("刻度条右侧的白色图标");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒  
    await device.pressKey("ESC");
    await agent.aiAssert("桌面存在文件夹名称为：月落星沉沧海桑田几度春秋轮回； 忽视文件名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云舒花开花谢岁月静好如初.txt； 忽视文件名空格和换行");

    //步骤3：控制中心字体设置20号
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("字体和字号");
    await agent.aiTap("字体和字号");
    await agent.aiWaitFor("字号进度条显示");
    await agent.aiTap("20正上方的进度条");
    //显示桌面
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    //检查20号字体，测试文件和文件夹名称显示
    await agent.aiAssert("桌面存在文件夹名称为：月落星沉沧海桑田几度 春秋轮回；忽视文件夹名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云舒花开花谢岁月 静好如初.txt； 忽视文件名空格和换行");

    //步骤4：修改桌面图标大小：
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("图标大小");
     await agent.aiTap("刻度条左侧第二个刻度正上面的进度条");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面存在文件夹名称为：月落星 …轮回； 忽视文件名空格和换行");
    await agent.aiAssert("桌面存在txt文件名称为：云卷云 …初.txt； 忽视文件名空格和换行");

  }, { timeout: 600000, tags: ["1808467", "level4", "file_manager", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, device, env }) => {
    console.log('3. afterAll: 清理测试残留');
    await device.pressKey("ESC");
    await system.exec('rm -rf ~/Desktop/月落星沉沧海桑田几度春秋轮回');
    await system.exec('rm -rf ~/Desktop/云卷云舒花开花谢岁月静好如初.txt');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    //恢复字体
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("字体和字号");
    await agent.aiTap("字体和字号");
    await agent.aiWaitFor("字号进度条显示");
    await agent.aiTap("14正上方的进度条");
    await system.exec("killall dde-control-center");
    //恢复桌面图标大小
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("桌面设置");
    await agent.aiWaitFor("图标大小");
    await agent.aiTap("图标大小刻度条左侧第二个刻度正上方的进度条");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("ESC");

  });
}); 