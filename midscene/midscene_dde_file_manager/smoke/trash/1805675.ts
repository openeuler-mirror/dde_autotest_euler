/**
 * 优化后的测试脚本
 * 用例 PMSID: 1805675
 * 用例标题: [094]页面检查-回收站有内容时
 * 生成时间: 2026-02-02
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1805675-[094]页面检查-回收站有内容时', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
  });

  test('1805675-[094]页面检查-回收站有内容时', async ({ device, agent, uos, system }) => {

    // 步骤1: 使用命令创建超长文件夹名称和文件名称，并删除到回收站
    console.log('步骤1: 创建超长文件夹和文件名称，并删除到回收站');
    const longFolderName = '这是一个非常长的文件夹名称用于测试回收站显示效果和tooltip提示功能';
    const longFileName = '这是一个非常长的文件名称用于测试回收站显示效果和tooltip提示功能.txt';
    
    // 创建文件夹和文件
    await system.exec(`mkdir -p ~/Desktop/"${longFolderName}"`);
    await system.exec(`touch ~/Desktop/"${longFileName}"`);
    
    // 删除到回收站
    await system.exec(`gio trash ~/Desktop/"${longFolderName}"`);
    await system.exec(`gio trash ~/Desktop/"${longFileName}"`);

    // 步骤2: 双击桌面回收站图标，进入回收站窗口，断言窗口内存在已删除的文件/文件夹对应名称，且右上角有显示清空按钮
    console.log('步骤2: 双击桌面回收站图标，验证回收站窗口和内容');
    await agent.aiDoubleClick("桌面回收站图标");
    await agent.aiWaitFor("回收站窗口已显示", { timeout: 3000 });
    
    // 断言回收站窗口内存在已删除的文件和文件夹
    await agent.aiAssert(`回收站窗口中存在删除的'文件夹''文件',文件夹显示在文件前`);
    
    // 断言右上角显示清空按钮
    await agent.aiAssert("回收站窗口右上角有显示'清空'按钮");

    // 步骤3: 鼠标hover至长文件名称上，断言有tips显示，且显示文件名与创建名称一致
    console.log('步骤3: 鼠标hover长文件名称，验证tips显示');
    await agent.aiHover(`回收站窗口文件名'这是一个非…功能.txt'`);
    await agent.aiWaitFor("窗口显示tooltip提示框", { timeout: 3000 });
    await agent.aiAssert(`tooltip提示框中显示"${longFileName}"`);
    
    // 验证文件夹的tooltip
    await agent.aiTap("回收站窗口空白处");
    await agent.aiHover(`回收站窗口中的文件夹名'这是一个非…提示功能'`);
    await agent.aiWaitFor("窗口显示tooltip提示框", { timeout: 3000 });
    await agent.aiAssert(`tooltip提示框中显示"${longFolderName}"`);

  }, { timeout: 600000, tags: ['1805675', 'level2', 'smoke', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('测试用例清理');
    await uos.closeCurrentWindow();
    console.log('回收站窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理应用进程（增加容错，无进程时不报错）
    await system.exec("ps -ef | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/dde-file-manager/config.conf", 5000);
    //清理回收站内容
    await system.exec(`rm -rf ~/.local/share/Trash/files/* ~/.local/share/Trash/info/*`);
    await uos.showDesktop();
  });
});