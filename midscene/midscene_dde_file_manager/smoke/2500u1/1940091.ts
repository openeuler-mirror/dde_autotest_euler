/**
 * 用例 PMSID: 1940091
 * 用例标题: 【复制文件地址】复制桌面上的文件地址 
 * 生成时间: 2026-05-18 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

// 定义长文件名（255个中文字符）
const longFileName = '长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名1';
// 定义特殊字符文件名
const specialCharFileName1 = '有特殊字符+—） () &......%￥@! RC!@$%^&()_+}{L （副本）.txt';
const specialCharFileName2 = '搜索专项！2$%……{【“.,、 .a.b.c.txt';
// 定义各类测试文件名称
const testFiles = {
  image: '1940091.png',
  video: '1940091.mp4',
  music: '情非得已.mid',
  text: '1940091.txt',
  longName: longFileName,
  special1: specialCharFileName1,
  special2: specialCharFileName2
};

describe('1940091-【复制文件地址】复制桌面上的文件地址 ', () => {
  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，创建测试文件并开启长文件名功能');
    await uos.showDesktop();

    // 前置条件1：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 前置条件2：创建各类测试文件到桌面
    console.log('===== 创建桌面测试文件 =====');
    // 创建长文件名文件
    await system.exec(`mkdir -p /home/${userName}/Desktop/${testFiles.longName}`);
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940091/* /home/${userName}/Desktop/`);

    // 等待文件创建完成
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 回到桌面
    await uos.showDesktop();
  });

  test('1940091-【复制文件地址】复制桌面上的文件地址 ', async ({ device, system, agent, uos }) => {
    const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
   
    // 打开文本编辑器
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("点击启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await closeAllTxt(agent, device); 
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("点击启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Alt','Tab');

    // 步骤1：进入桌面，ctrl + a全选桌面上的文件（包括计算机，应用图标等）
    console.log('===== 步骤1：全选桌面文件 =====');
    await agent.aiTap("桌面空白处"); 
    await device.pressKey('Ctrl','A');
    // 预期结果1：全选成功

    // 步骤2：按Ctrl+Shift+C复制地址，粘贴到文本编辑器
    console.log('===== 步骤2：复制地址并粘贴到文本编辑器 =====');
    await device.pressKey('Ctrl','Shift','C');
    await device.pressKey('Alt','Tab');
    await device.pressKey('Ctrl','V');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 预期结果2：粘贴成功，多个路径之间用换行分隔
    await device.pressKey('Win','Up');
    await agent.aiAssert("文本编辑器里每个路径之间用换行分隔");

    // 步骤3：检查每个地址是否都正确
    console.log('===== 步骤3：验证所有文件路径正确性 =====');
    // 验证长文件名路径
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.longName}`);
    // 验证普通类型文件路径
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.image}`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.video}`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.music}`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.text}`);
    // 验证特殊字符文件路径
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.special1}`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/${testFiles.special2}`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/dde-computer.desktop`);
    await agent.aiAssert(`文本编辑器里看到路径：/home/${userName}/Desktop/dde-trash.desktop`);

    // 关闭文本编辑器（不保存）
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");
    

  }, { timeout: 1800000, tags: ['1940091','level2','smoke','remote','2500u1','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    // 关闭所有测试相关进程
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理桌面测试文件');
    // 删除所有创建的测试文件
    await system.exec(`rm -rf /home/${userName}/Desktop/1940091*  /home/${userName}/Desktop/长文件名功能复制* /home/${userName}/Desktop/*.txt /home/${userName}/Desktop/*.mid`);
    await agent.aiTap("桌面空白处");
  });
});