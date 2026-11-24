/**
 * 用例 PMSID: 1815807
 * 用例标题:  埋点，右键菜单项点击分布-属性
 * 生成时间: 2026-07-31 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

async function openProperties(uos, agent, device, system) {
  // 定义需要测试的文件类型及其在日志中对应的类型名称
  const fileTypes = [
      { name: 'maidian', type: '文件夹', logKeyword: 'inode/directory' },
      { name: 'maidian.txt', type: '文档', logKeyword: 'text/plain' },
      { name: 'maidian.png', type: '图片', logKeyword: 'image/png' },
      { name: 'maidian.mp4', type: '影片', logKeyword: 'video/mp4' },
      { name: 'maidian.wma', type: '音乐', logKeyword: 'audio' },
      { name: 'maidian.zip', type: '压缩文件', logKeyword: 'zip' },
      { name: 'maidian-desktop', type: '应用程序', logKeyword: 'desktop' },
      { name: 'maidian.sh', type: '可执行文件', logKeyword: 'x-shellscript' },
      { name: 'maidian.fig', type: '其他类型文件', logKeyword: 'application/x' }
  ];

  // 对每种文件类型执行右键属性操作
  for (const fileType of fileTypes) {
      console.log(`步骤: 对"${fileType.type}"右键点击【属性】`);
      // 在终端中执行日志监控命令
      console.log('在终端中执行日志监控命令');
      await agent.aiTap("终端窗口的标题栏");
      await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");

      for (let i = 0; i < 4; i++) {
          await device.pressKey('Enter');
      }            
      // 点击文件管理器窗口激活
      await agent.aiTap("文件管理器窗口的标题栏");      

      // 右键点击对应的文件
      if (fileType.type === '文件夹') {            
          await agent.aiRightClick(`${fileType.name}文件夹的图标`);
          await new Promise(resolve => setTimeout(resolve, 1000));                  
      } else if (fileType.type === '图片') {
          await agent.aiRightClick("76.2KB", { deepThink: true });
      } else {
          await agent.aiRightClick(`${fileType.name}文件的图标`);
      }

      // 点击【属性】菜单项
      await agent.aiTap("属性");      
      // 关闭属性窗口
      await agent.aiTap("属性窗口的关闭按钮");
      
      // 验证预期结果：触发上报事件
      console.log(`验证预期结果: 触发上报事件，文件类型: ${fileType.type}`);
      
      // 将终端窗口置顶以便查看
      await agent.aiTap("终端窗口的标题栏");
      
      // 根据文件类型使用不同的日志关键词进行断言
      if (fileType.type === '文件夹') {            
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);                   
      } else if (fileType.type === '文档') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '图片') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '影片') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '音乐') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '压缩文件') {          
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '应用程序') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '可执行文件') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '其他类型文件') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'属性'和${fileType.logKeyword}关键词`);
      }
      // 停止日志监控（Ctrl+C）
      console.log('停止日志监控');
      await agent.aiTap("终端窗口");
      await device.pressKey("Ctrl+C");
      await device.typeText("clear");
      await device.pressKey("Enter");
  }
}

describe('1815807-埋点，右键菜单项点击分布-属性', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        await system.exec("ps -ef | grep deepin-movie | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");     
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        // 准备测试素材
        console.log('===== 准备测试素材 =====');
        await system.exec(`mkdir -p /home/${userName}/Desktop/1815807`); 
        await system.exec(`mkdir -p /home/${userName}/Desktop/1815807/maidian`); 
        await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1816003/* /home/${userName}/Desktop/1815807`);        

    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

    });

    test('1815807-埋点，右键菜单项点击分布-属性', async ({ device, agent, uos, env, system }) => {

        // ========== 第一部分：在桌面直接操作 ==========
        console.log('========== 第一部分：在桌面直接操作 ==========');
        
        // 进入桌面上的1815807文件夹图标
        await agent.aiDoubleClick("桌面上的1815807文件夹的图标");
        await device.pressKey("Ctrl+2");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        await openProperties(uos, agent, device, system);

    }, { timeout: 1800000, tags: ['1815807', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    test('1815807-埋点，右键菜单项点击分布-属性-文管操作', async ({ device, agent, uos, env, system }) => {
        // ========== 第二部分：在文件管理器中操作 ==========
        console.log('========== 第二部分：在文件管理器中操作 ==========');
        
        // 关闭当前文件管理器，重新打开
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        
        // 重新打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏中的'桌面'");
        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
     
        // 双击进入1815807文件夹
        console.log('双击进入1815807文件夹');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiDoubleClick("桌面上的'1815807'文件夹的图标");
        await device.pressKey("Ctrl+2");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("终端窗口的标题栏");
        // 对每种文件类型执行右键属性操作（在文件夹内）
        await openProperties(uos, agent, device, system);

    }, { timeout: 1800000, tags: ['1815807', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试文件夹及其所有文件
        console.log("清理: 删除1815807文件夹");
        await system.exec(`rm -rf /home/${userName}/Desktop/1815807`);
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});