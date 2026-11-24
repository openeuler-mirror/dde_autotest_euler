	/**
 * 用例 PMSID: 1815813
 * 用例标题:  埋点，右键菜单项点击分布-发送到桌面
 * 生成时间: 2026-07-23 20:30:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

async function sendToDesktop(uos, agent, device, system) {
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

  // 对每种文件类型执行右键发送到桌面操作
  for (const fileType of fileTypes) {

      // 在终端中执行日志监控命令
      console.log('在终端中执行日志监控命令');
      await agent.aiTap("终端窗口的标题栏");
      await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
      await device.pressKey('Enter');

      console.log(`步骤: 对"${fileType.type}"右键点击【发送到桌面】`);
      // 多次回车确保命令执行
      await agent.aiTap("终端窗口的标题栏");
      for (let i = 0; i < 3; i++) {
          await device.pressKey('Enter');
      }            
      // 点击文件管理器窗口激活
      await agent.aiTap("文件管理器窗口的标题栏");
      
      // 右键点击对应的文件
      if (fileType.type === '文件夹') {            
          await agent.aiRightClick(`${fileType.name}文件夹的图标`);                   
      } else if (fileType.type === '图片') {
          await agent.aiRightClick("'76.2'中的6字上");
      } else {
          await agent.aiRightClick(`${fileType.name}文件的图标`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 点击【发送到桌面】菜单项
      await agent.aiTap("右键菜单的'发送到'选项");
      await agent.aiTap("'发送到'子菜单中的'发送到桌面'");
      
      // 验证预期结果：触发上报事件
      console.log(`验证预期结果: 触发上报事件，文件类型: ${fileType.type}`);
      
      // 将终端窗口置顶以便查看
      await agent.aiTap("终端窗口的标题栏");
      
      // 根据文件类型使用不同的日志关键词进行断言
      if (fileType.type === '文件夹') {            
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);                   
      } else if (fileType.type === '文档') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '图片') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '影片') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '音乐') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '压缩文件') {          
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '应用程序') {
          await agent.aiAssert("终端新增一条日志，且内容包含'发送到桌面'关键词");
      } else if (fileType.type === '可执行文件') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      } else if (fileType.type === '其他类型文件') {
          await agent.aiAssert(`终端新增一条日志，且内容包含'发送到桌面'和${fileType.logKeyword}关键词`);
      }
      // 停止日志监控（Ctrl+C）
      console.log('停止日志监控');
      await agent.aiTap("终端窗口");
      await device.pressKey("Ctrl+C");
      await device.typeText("clear");
      await device.pressKey("Enter");
  }
}

describe('1815813-埋点，右键菜单项点击分布-发送到桌面', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 准备测试素材 - 复用 1816003 的资源文件
        console.log('===== 准备测试素材 =====');
        await system.exec(`mkdir -p /home/${userName}/Desktop/1815813`); 
        await system.exec(`mkdir -p /home/${userName}/Desktop/1815813/maidian`);
        await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1816003/* /home/${userName}/Desktop/1815813`);        

    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境 - 清理可能残留的发送到桌面的快捷方式
        await system.exec(`find /home/${userName}/Desktop -maxdepth 1 -name "链接到*" -delete 2>/dev/null || true`);
        await system.exec(`find /home/${userName}/Desktop -maxdepth 1 -name "maidian-desktop.desktop" -delete 2>/dev/null || true`);
        // 清理终端和文件管理器进程
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");  
        await system.exec("ps -ef | grep deepin-movie | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");      
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
    });

    test('1815813-埋点，右键菜单项点击分布-发送到桌面', async ({ device, agent, uos, env, system }) => {

        // ========== 仅文件管理器操作 ==========
        console.log('========== 在文件管理器中操作 ==========');
        
        // 打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏中的'桌面'");
        // 按 Super+Left 将文件管理器窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
     
        // 双击进入1815813文件夹
        console.log('双击进入1815813文件夹');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiDoubleClick("桌面上的'1815813'文件夹");
        await new Promise(resolve => setTimeout(resolve, 1000));
        //await agent.aiTap("文件管理器右上角搜索框左侧第二个图标，也就是列表视图图标");
        await device.pressKey("Ctrl+2");

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        await agent.aiTap("终端窗口的标题栏");

        // 对每种文件类型执行右键发送到桌面操作（在文件夹内）
        await sendToDesktop(uos, agent, device, system);
        await agent.aiTap("终端窗口右上角的x关闭按钮");

    }, { timeout: 1800000, tags: ['1815813', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理发送到桌面的快捷方式
        await system.exec(`find /home/${userName}/Desktop -maxdepth 1 -name "*快捷方式*" -delete 2>/dev/null || true`);
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试文件夹及其所有文件
        console.log("清理: 删除1815813文件夹");
        await system.exec(`rm -rf /home/${userName}/Desktop/1815813`);
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});