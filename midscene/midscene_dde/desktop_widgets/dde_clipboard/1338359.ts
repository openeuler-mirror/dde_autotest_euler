/**
 * 用例 PMSID: 1338359
 * 用例标题: 【桌面】【剪贴板】多次复制文件生成剪贴板记录展示
 * 生成时间: 2025-12-23 11:16:00
 * 用例编写人：UT000224(何权)
 */

describe("1338359-【桌面】【剪贴板】多次复制文件生成剪贴板记录展示", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`); 
    // 清理桌面上的测试文件
    system.exec(`rm -f ~/Desktop/test_file_*`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1338359-【桌面】【剪贴板】多次复制文件生成剪贴板记录展示",
    async ({ device, agent, system}) => {
      // 步骤1: 对同一文件多次点击复制，重复三次复制，查看剪贴板保持一条剪贴板记录
      
      // 通过命令行在桌面创建测试文件，文件名称作为变量
      const testFileName = "test_file_1";
      const testFilePath = `~/Desktop/${testFileName}`;
      system.exec(`echo "测试文件内容" > ${testFilePath}`);
      
      // 等待文件创建完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 打开文件管理器到桌面
      system.exec(`dde-file-manager ~/Desktop`);
      system.exec(`xdotool key Super+Up`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第一次复制文件
      await agent.aiTap(`"${testFileName}"文件`);
      await agent.aiRightClick(`"${testFileName}"文件`);
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第二次复制同一文件
      await agent.aiRightClick(`"${testFileName}"文件`);
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三次复制同一文件
      await agent.aiRightClick(`"${testFileName}"文件`);
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证只有一条记录，已缩略图在右侧剪贴板窗口中展示
      await agent.aiAssert("右侧的剪贴板窗口中只有1条文件记录");
      await agent.aiAssert(`右侧的剪贴板窗口中的文件记录为"${testFileName}"`);
      await agent.aiAssert("右侧的剪贴板窗口中的文件记录以图标形式展示");
      
      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 步骤2: 多次复制不同的多个文件，每次都生成不同的剪贴板记录
      
      // 创建多个不同的测试文件
      const timestamp = Date.now().toString().slice(-2);
      const testFileName2 = "test_file_2";
      const testFileName3 = "test_file_3";
      const testFilePath2 = `~/Desktop/${testFileName2}`;
      const testFilePath3 = `~/Desktop/${testFileName3}`;
      
      system.exec(`echo "测试文件内容2" > ${testFilePath2}`);
      system.exec(`echo "测试文件内容3" > ${testFilePath3}`);
      
      // 等待文件创建完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 复制第二个文件
      await agent.aiTap(`"${testFileName2}"文件`);      
      await agent.aiRightClick(`"${testFileName2}"文件`);
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 复制第三个文件
      await agent.aiTap(`"${testFileName3}"文件`);         
      await agent.aiRightClick(`"${testFileName3}"文件`);
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证有3条不同的文件记录，都已缩略图形式展示
      await agent.aiAssert("右侧的剪贴板窗口中有3条文件记录");
      await agent.aiAssert(`右侧的剪贴板窗口中包含文件记录"${testFileName}"`);
      await agent.aiAssert(`右侧的剪贴板窗口中包含文件记录"${testFileName2}"`);
      await agent.aiAssert(`右侧的剪贴板窗口中包含文件记录"${testFileName3}"`);
      await agent.aiAssert("右侧的剪贴板窗口中的所有文件记录都以图标形式展示");
    },
    { timeout: 1200000, tags: ["1338359", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 确保清理所有测试文件
    system.exec(`dde-file-manager ~/Desktop`);
    system.exec(`xdotool key Super+Down`);
    system.exec(`systemctl --user restart dde-clipboard`);
    system.exec("killall dde-file-manager");
    
    // 清理测试文件
    system.exec(`rm -f ~/Desktop/test_file_*`);
  });
});