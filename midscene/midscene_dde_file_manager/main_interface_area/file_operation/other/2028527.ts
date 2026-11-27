// @ts-nocheck
/**
 * 用例 PMSID: 2028527
 * 用例标题: unicode排序：符号>Emoji 与兜底机制>数字>英文>中文
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('2028527-unicode排序：符号>Emoji 与兜底机制>数字>英文>中文', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/Documents/test`)
    await system.exec(`cd ~/Documents/test && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/2028527.zip && unzip 2028527.zip  && rm 2028527.zip`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2028527-unicode排序：符号>Emoji 与兜底机制>数字>英文>中文', async ({ device, agent, uos, system }) => {
    // ===== 步骤1：打开文件管理器，进入 图片/special_char_test =====
    console.log('===== 步骤1：打开文件管理器并进入 图片/special_char_test =====');
    await uos.openApp('文件管理器', 3000, 30000);
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('文件管理器左侧导航栏的"文档"目录');
    await agent.aiDoubleClick('文件列表中的"test"文件夹');
    await agent.aiAssert('文件管理器中当前目录是"文档/test"，目录内共有 5 个文件');

    // 切换到列表视图，便于逐行核对名称顺序
    await agent.aiTap('地址栏右侧三个视图切换图标中的第2个（"列表视图"按钮，图标为多条横线）');
    let isListView = await agent.aiBoolean('当前是列表视图：界面中能看到"名称、修改时间、大小、类型"这几个列标题');
    if (!isListView) {
      console.log('第1次切换列表视图未生效，使用备用提示重试');
      await agent.aiTap('文件管理器工具栏右侧的"列表视图"切换按钮');
      isListView = await agent.aiBoolean('当前是列表视图：界面中能看到"名称、修改时间、大小、类型"这几个列标题');
    }
    console.log(`列表视图切换结果: ${isListView}`);
    await agent.aiAssert('文件管理器当前为列表视图，界面中能看到"名称、修改时间、大小、类型"这几个列标题');

    // ===== 步骤2：点击名称按升序排序（默认已是升序则无需再点） =====
    console.log('===== 步骤2：点击名称列按升序排序，检查符号排序 =====');
     const firstIsAsc = await agent.aiBoolean('列表视图中最上面第一行的文件名是 "_a.txt"');
    if (!firstIsAsc) {
      console.log('当前不是升序，点击"名称"列标题切换为升序');
      await agent.aiTap('列表视图表头中最左侧的"名称"列标题（文字为"名称"，位于"修改时间"的左边）');
    }
    await agent.aiAssert(`文件列表从上到下依次显示为：_a.txt、.txt(.txt前面有类似乱码的符号)、1.txt、A.txt、阿.txt`);

  }, { timeout: 600000, tags: ['2028527', 'level3', 'other', 'DITT', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //环境清理：切换试图为图标视图
    await agent.aiTap('地址栏右侧三个视图切换图标中的第1个（"图标视图"按钮，图标为4个小方块）');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, device, system }) => {
    console.log('5. afterAll: 清理本次用例数据与窗口');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Documents/test')
    await uos.showDesktop();
  });
});
