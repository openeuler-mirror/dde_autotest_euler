// @ts-nocheck
/**
 * 用例 PMSID: 2033385
 * 用例标题: 文件名按照unicode排序：先拉丁字符后中文字符
 * 生成时间: 2026-11-10
 * 用例编写人: UT002899(胡诗敏)
 */

describe('2033385-文件名按照unicode排序：先拉丁字符后中文字符', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/Documents/test`)
    await system.exec(`cd ~/Documents/test && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/2033385.zip && unzip 2033385.zip  && rm 2033385.zip`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('2033385-文件名按照unicode排序：先拉丁字符后中文字符', async ({ device, agent, uos, system }) => {
    // 步骤 1：打开文管，进入test目录，切换到列表视图
    console.log('步骤 1：打开文管，进入test目录，切换到列表视图');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiWaitFor('文件管理器窗口已打开');
    await agent.aiTap('文件管理器左侧导航栏的"文档"目录');
    await agent.aiDoubleClick('文件列表中的"test"文件夹');
    await agent.aiAssert('文件管理器中当前目录是"文档/test"，目录内共有 24 个文件');

    //切换为列表试图
    await agent.aiTap('地址栏右侧三个视图切换图标中的第2个（"列表视图"按钮，图标为多条横线）');
    let isListView = await agent.aiBoolean('当前是列表视图：界面中能看到"名称、修改时间、大小、类型"这几个列标题');
    if (!isListView) {
      console.log('第1次切换列表视图未生效，使用备用提示重试');
      await agent.aiTap('文件管理器工具栏右侧的"列表视图"切换按钮');
      isListView = await agent.aiBoolean('当前是列表视图：界面中能看到"名称、修改时间、大小、类型"这几个列标题');
    }
    console.log(`列表视图切换结果: ${isListView}`);
    await agent.aiAssert('文件管理器当前为列表视图，界面中能看到"名称、修改时间、大小、类型"这几个列标题');

    // 步骤 2：检查文件名按 unicode 升序排列
    console.log('步骤 2：检查文件名按 unicode 升序排列');
    const firstIsAsc = await agent.aiBoolean('列表视图中最上面第一行的文件名是 "_op.txt"');
    if (!firstIsAsc) {
      console.log('当前不是升序，点击"名称"列标题切换为升序');
      await agent.aiTap('列表视图表头中最左侧的"名称"列标题（文字为"名称"，位于"修改时间"的左边）');
    }
    await agent.aiAssert(`列表从上到下依次显示为：_op.txt、@#.txt、1.txt、09op.zip、FreeFileSync_14.4_Linux.tar.gz、Python-3.8.18.tgz、smb 内存泄漏.txt、ssrfmap-request.txt、test_dde_dconfig.py、txt.txt、udisks.log、uos-top 资源占用监控.zip、UTK-8 编码格式.txt、V25 回归 bug 模板（副本）.txt、V25-new - 回归 bug 模板.txt、vfat.txt、web 安全调研.docx、wh-vpn-linux-tcp.conf、ຮູບພາບ_ເລືອກພື້ນທີ່_20251020180929.png、办公文档.uof、办公云盘.png、截图_选择区域_20260511160510.png、匿名访问修改文本.mp4、显示 255 个字符不带空格符号.png`);

    // 步骤 3：点击名称按降序排序，检查顺序刚好与步骤2相反
    console.log('=步骤 3：点击名称按降序排序，检查顺序刚好与步骤2相反');
    await agent.aiTap('列表视图中的"名称"列标题');
    await agent.aiAssert(`列表从上到下依次显示为：显示 255 个字符不带空格符号.png、匿名访问修改文本.mp4、截图_选择区域_20260511160510.png、办公云盘.png、办公文档.uof、ຮູບພາບ_ເລືອກພື້ນທີ່_20251020180929.png、wh-vpn-linux-tcp.conf、web 安全调研.docx、vfat.txt、V25-new - 回归 bug 模板.txt、V25 回归 bug 模板（副本）.txt、UTK-8 编码格式.txt、uos-top 资源占用监控.zip、udisks.log、txt.txt、test_dde_dconfig.py、ssrfmap-request.txt、smb 内存泄漏.txt、Python-3.8.18.tgz、FreeFileSync_14.4_Linux.tar.gz、09op.zip、1.txt、@#.txt、_op.txt`);
  }, { timeout: 900000, tags: ['2033385', 'level3', 'other', 'DITT', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //环境清理：切换试图为图标视图
    await agent.aiTap('地址栏右侧三个视图切换图标中的第1个（"图标视图"按钮，图标为4个小方块）');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Documents/test')
    await uos.showDesktop();
  });
});
