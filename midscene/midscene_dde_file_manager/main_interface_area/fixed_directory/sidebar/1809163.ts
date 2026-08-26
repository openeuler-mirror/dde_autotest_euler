// @ts-nocheck

/**
 * 用例 PMSID: 1809163
 * 用例标题: 【侧边栏目录显示优化】拖拽文件到侧边栏目录，检查背景色
 * 生成时间: 2026-04-08
 * 用例编写人: UT000686(李双双)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1809163-拖拽文件到侧边栏目录，检查背景色', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      // 清理所有可能目录中的残留测试资源（Documents/Desktop/主目录）
      await system.exec('rm -rf ~/Documents/1809163-1 ~/Desktop/1809163-1 ~/1809163-1');
      await system.exec('rm -rf ~/Documents/1809163-2 ~/Desktop/1809163-2 ~/1809163-2');
      await system.exec('rm -f ~/Documents/1809163.txt ~/Desktop/1809163.txt ~/1809163.txt');
      await system.exec('killall dde-file-manager');
      await uos.showDesktop();
      // 前置条件：在终端的文档目录创建1809163文件夹和1809163.txt文件
      await system.exec('mkdir -p ~/Documents/1809163-1');
      await system.exec('mkdir -p ~/Documents/1809163-2');
      await system.exec('touch ~/Documents/1809163.txt');
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      await system.exec('killall dde-file-manager');
    });
  
    test('1809163-拖拽文件到侧边栏目录，检查背景色', async ({ device, agent, uos, env, system }) => {
      await agent.aiWaitFor("桌面已显示");
  
      // 打开文件管理器，进入文档目录
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiWaitFor("文件管理器主界面已显示");
      await agent.aiTap("文件管理器侧边栏文档目录");
      await agent.aiWaitFor("文档目录内容已显示");
  
      // 步骤1：将1809163文件夹拖拽到侧边栏的桌面目录，鼠标不释放，检查目标目录的背景色
      console.log('步骤1：拖拽1809163-1文件夹到侧边栏桌面目录，检查背景色');
      await agent.aiDrag("1809163-1文件夹", "文件管理器侧边栏桌面目录", { deepThink: true });
      // 断言：侧边栏桌面目录拖拽悬停时背景色为灰色
      await agent.aiAssert("文件管理器侧边栏桌面目录背景颜色为灰色");
  
      // 步骤2：选中1809163-2文件夹和1809163.txt文件，拖拽到侧边栏的主目录，鼠标不释放，检查目标目录的背景色
      console.log('步骤2：选中1809163-2文件夹和1809163.txt，拖拽到侧边栏主目录，检查背景色');
      await agent.aiTap("文件管理器侧边栏文档目录");
      await agent.aiWaitFor("文档目录内容已显示");
      // 选中1809163文件夹
      // await device.keyDown("1809163-2文件夹");
      // // 按住Ctrl键多选1809163.txt文件
      // await device.pressKey("1809163.txt文件");
      //点击快捷键全选文件和文件夹
      await agent.aiTap("1809163-2文件夹")
      await device.pressKey("Ctrl+A");
      await agent.aiAssert("1809163-2文件夹和1809163.txt文件均已选中");
      // 拖拽选中的文件到侧边栏主目录，鼠标不释放
      await agent.aiDrag("1809162-2文件夹和1809163.txt文件", "文件管理器侧边栏主目录", { deepThink: true });
      // 断言：侧边栏主目录拖拽悬停时背景色为灰色
      await agent.aiAssert("文件管理器侧边栏主目录背景颜色为灰色");
  
    }, { timeout: 600000, tags: ['1809163', 'level3', 'main_interface_area', 'fixed_directory', 'sidebar', 'DITT', 'lishuangshuang'] });
  
    afterEach(async ({ device, agent, uos }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 清理所有可能目录中的测试资源（Documents/Desktop/主目录）
      await system.exec('rm -rf ~/Documents/1809163-1 ~/Desktop/1809163-1 ~/1809163-1');
      await system.exec('rm -rf ~/Documents/1809163-2 ~/Desktop/1809163-2 ~/1809163-2');
      await system.exec('rm -f ~/Documents/1809163.txt ~/Desktop/1809163.txt ~/1809163.txt');
      await system.exec('killall dde-file-manager');
    });
  });
