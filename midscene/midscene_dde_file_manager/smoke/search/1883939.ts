/**
 * 用例 PMSID: 1883939
 * 用例标题: 【搜索专项优化-v1.1】文管搜索结果高亮显示关键词
 * 生成时间: 2026-04-24
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1883939-【搜索专项优化-v1.1】文管搜索结果高亮显示关键词', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);

    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    // 打开设置菜单
    await agent.aiTap("文件管理器右上角菜单按钮");
    await agent.aiTap("设置");
    await agent.aiWaitFor("设置界面已打开", { timeout: 10000 });

    // 进入 搜索 设置项
    await agent.aiTap("搜索");

    // ✅ 使用 aiBoolean 判断 全文搜索 是否已经勾选
    const isFullTextChecked = await agent.aiBoolean("全文搜索选项已勾选", { timeout: 5000 });

    if (!isFullTextChecked) {
      // 未勾选 → 点击勾选
      await agent.aiTap("全文搜索勾选框");
      await agent.aiWaitFor("全文搜索选项已勾选", { timeout: 5000 });
      console.log("已成功勾选 全文搜索 选项");
    } else {
      // 已勾选 → 不操作
      console.log("全文搜索选项已勾选，无需操作");
    }

    // 关闭设置窗口
    await agent.aiTap("设置窗口关闭按钮");
  });

  test('1883939-文管搜索结果高亮显示关键词', async ({ device, agent, uos, system }) => {
    console.log('===== 前置条件准备：创建测试文件 =====');

    // 步骤1：在桌面上创建3张图片，3个文本文件，3个文件夹，3个xmind文件，3个pdf文件，名称均含有：搜索专项测试
    // 创建3个文本文件
    await system.exec('touch ~/Desktop/搜索专项测试-文档1.txt');
    await system.exec('touch ~/Desktop/搜索专项测试-文档2.txt');
    await system.exec('touch ~/Desktop/搜索专项测试-仅文件名.txt');

    // 创建3个文件夹
    await system.exec('mkdir -p ~/Desktop/搜索专项测试-文件夹1');
    await system.exec('mkdir -p ~/Desktop/搜索专项测试-文件夹2');
    await system.exec('mkdir -p ~/Desktop/搜索专项测试-文件夹3');

    // 创建3个图片文件（使用touch模拟）
    await system.exec('touch ~/Desktop/搜索专项测试-图片1.png');
    await system.exec('touch ~/Desktop/搜索专项测试-图片2.jpg');
    await system.exec('touch ~/Desktop/搜索专项测试-图片3.jpeg');

    // 创建3个PDF文件
    await system.exec('touch ~/Desktop/搜索专项测试-文档1.pdf');
    await system.exec('touch ~/Desktop/搜索专项测试-文档2.pdf');
    await system.exec('touch ~/Desktop/搜索专项测试-文档3.pdf');

    // 创建3个xmind文件
    await system.exec('touch ~/Desktop/搜索专项测试-导图1.xmind');
    await system.exec('touch ~/Desktop/搜索专项测试-导图2.xmind');
    await system.exec('touch ~/Desktop/搜索专项测试-导图3.xmind');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("F5");

    // 步骤2：下载附件文本文档放到视频目录（这里模拟创建）
    await system.exec('mkdir -p ~/Videos');
    //在视频目录创建2个带内容的文件
    await system.exec('touch ~/Videos/搜索专项测试含文件内容.txt');
    await system.exec('echo "我是搜索专项测试文件，全文检索开关已打开：打开文管，点击右上角的三横杠-设置-高级设置-全文搜索，打开全文检索。我是搜索专项@测试文件，全文检索开关已打开：打开文管，点击右上角的三横杠-设置-高级设置-全文搜索，打开全文检索。我是搜索专项测试文件，全文检索开关已打开：打开文管，点击右上角的三横杠-设置-高级设置-全文搜索，打开全文检索。我是搜索专项测试文件，全文检索开关已打开：打开文管，全文结束，这是多余的内容。" > ~/Videos/搜索专项测试含文件内容.txt');
    await system.exec('touch ~/Videos/搜索专项测试-仅文件名.txt');
    // 用 printf 写入多行内容，避免 heredoc 的引号问题
    await system.exec('echo "this is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\nthis is a test file.用dd命令将 / 分区写数据,直到剩余空间小于100M。\n" > ~/Videos/搜索专项测试-仅文件名.txt');

    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey("F5");

    console.log('===== 步骤1: 执行搜索 =====');
    // 点击任务栏上的文管，在右上角搜索框中输入：搜索专项测试
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("搜索专项测试", "右上角有放大镜的搜索输入框");

    await device.pressKey("Enter");
    await agent.aiWaitFor("显示文件名包含搜索专项测试的文件", { timeout: 30000, deepThink: true });

    // 断言：能搜索出前置条件步骤1和步骤2准备的文件
    await agent.aiAssert("搜索结果包含搜索专项测试相关的文件");

    console.log('===== 步骤2: 检查关键词高亮显示 =====');
    // 检查搜索结果中所有关键词（搜索专项测试）是否都高亮显示
    const isHighlighted = await agent.aiBoolean("搜索结果中的文件名关键词'搜索专项测试'都是蓝色字体显示", { deepThink: true });
    if (!isHighlighted) {
      throw new Error('关键词高亮显示失败：并非所有关键词都高亮显示');
    }
    console.log('✅ 关键词高亮显示验证通过');

    console.log('===== 步骤3: 搜索专项测试含文件内容文档召回内容字符字数 =====');
    // 检查搜索结果中的：搜索专项测试含文件内容.txt 文档，召回的内容字符字数最多显示200个字符
    // 点击文件查看内容预览
    await agent.aiWaitFor("在'搜索专项测试含文件内容.txt'文件名下方显示了一段文件内容文字'", { timeout: 10000, deepThink: true });
    await agent.aiWaitFor("'搜索专项测试-仅文件名.txt'文件名下方未显示文件内容'", { timeout: 10000, deepThink: true });

    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });  

  }, { timeout: 600000, tags: ['1883939', 'level1', 'smoke', 'search', 'highlight', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件
    try {
      await system.exec('rm -f ~/Desktop/搜索专项测试*.txt');
      await system.exec('rm -f ~/Desktop/搜索专项测试*.png');
      await system.exec('rm -f ~/Desktop/搜索专项测试*.jpg');
      await system.exec('rm -f ~/Desktop/搜索专项测试*.jpeg');
      await system.exec('rm -f ~/Desktop/搜索专项测试*.pdf');
      await system.exec('rm -f ~/Desktop/搜索专项测试*.xmind');
      await system.exec('rm -rf ~/Desktop/搜索专项测试*');
      await system.exec('rm -f ~/Videos/搜索专项测试*.txt');
    } catch (err) {
      console.warn('删除测试文件失败:', err.message);
    }

    // 关闭文件管理器窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});