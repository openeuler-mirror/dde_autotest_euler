/**
 * 用例 PMSID: 1809929
 * 用例标题: 【桌面整理】单次生效，新建文件不自动整理
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809929-【桌面整理】单次生效，新建文件不自动整理', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809929-【桌面整理】单次生效，新建文件不自动整理', async ({ device, agent, uos , system}) => {
    // 步骤 1: 创建文件
    await system.exec(`touch /home/$USER/Desktop/1809929.txt`)
    await system.exec(`touch /home/$USER/Desktop/1809929.png`)
    await system.exec(`touch /home/$USER/Desktop/1809929.mp4`)
    await system.exec(`touch /home/$USER/Desktop/1809929.mp3`)
    await system.exec(`mkdir /home/$USER/Desktop/1809929`)
    await system.exec(`touch /home/$USER/Desktop/1809929.xmind`)

    // 步骤 2: 开启桌面整理，显示5个合集
    await agent.aiRightClick("桌面空白处",{timeoutMS:200});
    await agent.aiTap("整理桌面");
    await agent.aiAssert("桌面显示5个合集框");

    // 步骤 3: 新建文件夹后再次整理桌面
    await system.exec(`mkdir /home/$USER/Desktop/1809929-2`,{timeoutMS:500})
    await agent.aiRightClick("桌面空白处",{timeoutMS:200});
    await agent.aiTap("整理桌面");
    await agent.aiAssert("1809929-2和1809929文件在同一个集合框内");

    // 步骤 4: 取消桌面整理
    await agent.aiRightClick("桌面空白处",{timeoutMS:200});
    await agent.aiTap("桌面设置");	
    await agent.aiTap("启动整理桌面右侧开关");
    await agent.aiTap("启动整理桌面右侧开关");
    await agent.aiTap("桌面设置窗口右上角关闭按钮:X");	

    // 步骤 5: 重命名文件再桌面整理
    await system.exec(`mv /home/$USER/Desktop/1809929.txt /home/$USER/Desktop/1809929-rename.txt`)
    await agent.aiRightClick("桌面空白处",{timeoutMS:200});
    await agent.aiTap("整理桌面");
    await agent.aiAssert("1809929-rename.txt正常显示在集合框内");
  

  }, { timeout: 600000, tags: ['1809929', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/$USER/Desktop/1809929*`)
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});