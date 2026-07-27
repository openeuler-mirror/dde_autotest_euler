/**
 * 用例 PMSID: 1809171
 * 用例标题: 快捷方式添加快捷访问，该路径里面进行文件操作
 * 生成时间: 2026-03-10 11:20:16 
 * 用例编写人：UT000686（李双双）
 */

describe('1809171-快捷方式添加快捷访问，该路径里面进行文件操作', () => {

  // 前置：初始化+创建测试数据
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，创建测试数据');
    await uos.showDesktop();
    await system.exec('killall dde-file-manager', 500);
    await system.exec('rm -rf ~/Documents/1809171*');
    await system.exec('rm -rf ~/Desktop/1809171*');
    await system.exec('rm -rf ~/Downloads/1809171*');
    await system.exec('rm -rf ~/Pictures/1809171*');
    await system.exec('rm -rf ~/Pictures/1809171*');
    // 创建测试文件夹和文件
    await system.exec('mkdir -p ~/Documents/1809171');
    await system.exec('touch ~/Documents/1809171/1809171.txt');
    await system.exec('touch ~/Documents/1809171/1809171_drag.txt');
  });

  // 每个测试前的准备（空实现，预留扩展）
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809171-快捷方式添加快捷访问，该路径里面进行文件操作', async ({ device, agent, uos, system, env }) => {

    // 步骤1：启动器-打开文件管理器，点击文件管理器页面的左侧目录的“文档”
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的文档");

    // 步骤2：选中1809171文件，右键，鼠标悬停在“发送到”，点击“发送到桌面”
    await agent.aiRightClick("1809171文件夹");
    await agent.aiTap("发送到");
    await agent.aiTap("发送到桌面");

    // 步骤3：点击左侧栏的“桌面”，右键“1809171 快捷方式”，点击“添加到快捷访问”
    await agent.aiTap("文件管理器左侧栏的桌面");
    await agent.aiRightClick("1809171 快捷方式");
    await agent.aiTap("添加到快捷访问",{ deepThink: true });
    await agent.aiAssert("文件管理器左侧边栏有1809171 快捷方式");

    // 步骤4：点击“1809171 快捷方式”，右键“1809171.txt”，点击“删除”
    await agent.aiTap("文件管理器左侧边栏的1809171 快捷方式");
    await agent.aiRightClick("1809171.txt");
    await agent.aiTap("删除",{ deepThink: true });

    // 步骤5：在页面中间空白处，右键，点击“新建文件夹”
    await agent.aiRightClick("页面中间空白处");
    await agent.aiTap("新建文件夹",{ deepThink: true });
    await agent.aiAssert("新建文件夹新建成功");
    await agent.aiTap('页面空白处')

    // 步骤6：右键“新建文件夹”，点击“重命名”，输入“1809171new”，点击“enter”
    await agent.aiRightClick("新建文件夹");
    await agent.aiTap("重命名",{ deepThink: true });
    await device.typeText("1809171new", true);

    // 步骤7：右键“1809171new”，点击复制
    await agent.aiRightClick("1809171new");
    await agent.aiTap("复制");

    // 步骤8：点击左侧栏的“下载”，点击“ctrl+v”，文件粘贴成功
    await agent.aiTap("文件管理器左侧栏的下载");
    await device.pressKey("Ctrl", "V");
    await agent.aiAssert("1809171new文件夹粘贴成功");

    // 步骤9：点击“1809171 快捷方式”，右键“1809171new”，点击剪切
    await agent.aiTap("1809171 快捷方式");
    await agent.aiRightClick("1809171new");
    await agent.aiTap("剪切");

    // 步骤10：点击左侧栏的“图片”，点击“ctrl+v”，文件粘贴成功
    await agent.aiTap("文件管理器左侧栏的图片");
    await device.pressKey("Ctrl", "V");
    await agent.aiAssert("1809171new文件夹粘贴成功");

    // 步骤11：点击“1809171 快捷方式”，拖拽1809171_drag.txt文件到左侧栏的图片
    await agent.aiTap("1809171 快捷方式");
    // 这里使用aiDrag可能需要调整，具体取决于应用的实现
    await agent.aiDrag("1809171_drag.txt", "文件管理器左侧栏的图片");

    // 步骤12：点击左侧栏的“图片”，断言页面存在1809171_drag.txt文件
    await agent.aiTap("文件管理器左侧栏的图片");
    await agent.aiAssert("页面存在1809171_drag.txt文件");

  }, { timeout: 600000, tags: ["1809171", "level3", "fixed_directory","sidebar",  'DITT',"lishuangshuang"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent }) => {
    console.log('3. afterAll: 清理测试残留');
    // 从快捷访问移除
    await uos.openApp("文件管理器", 3000, 20000, true);
    try {
      await agent.aiRightClick("1809171 快捷方式");
      await agent.aiTap("从快捷访问移除");
    } catch (error) {
      console.log("快捷访问中未找到1809171 快捷方式，可能已被移除");
    }
    // 清理测试文件
    await system.exec('rm -rf ~/Documents/1809171*');
    await system.exec('rm -rf ~/Desktop/1809171*');
    await system.exec('rm -rf ~/Downloads/1809171*');
    await system.exec('rm -rf ~/Pictures/1809171*');
    await system.exec('rm -rf ~/Pictures/1809171*');
    // 清理回收站
    await system.exec('rm -rf ~/.local/share/Trash/files/*');
    await system.exec('rm -rf ~/.local/share/Trash/info/*');
    await system.exec('killall dde-file-manager', 500);
  });
});