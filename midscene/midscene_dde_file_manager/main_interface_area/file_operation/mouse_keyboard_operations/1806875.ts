/**
 * 用例 PMSID: 1806875
 * 用例标题: 文件操作-文件名快速定位到文件_
 * 生成时间: 2026-07-20 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806875-文件操作-文件名快速定位到文件', () => {

  const caseDir = process.env.TESTCASE_DIR;
  const username = process.env.TEST_USERNAME;

  const work_dir = `/home/${username}/Desktop/test_1806875/`;
  const test_files = [
    'a_1_1806875.txt',
    'a_2_1806875.txt',
    'a_3_1806875.txt',
    'b_1_1806875.txt',
    'b_2_1806875.txt',
    'b_3_1806875.txt',
    'c_1_1806875.txt',
    'c_2_1806875.txt',
    'c_3_1806875.txt',
    'd_1806875.txt',
    'qwer.txt',
  ];

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤：删除测试文件夹以避免干扰
    console.log('准备步骤：删除测试文件夹以避免干扰');
    await system.exec(`test -d ${work_dir} && rm -rf ${work_dir} || true`);

    // 准备步骤：创建测试文件夹
    console.log('准备步骤：创建测试文件夹');
    await system.exec(`mkdir -p ${work_dir}`);

    // 准备步骤: 创建测试文件
    console.log('准备步骤：创建测试文件');
    for (const file of test_files) {
      await system.exec(`yes "Hello World! TC 1806875" | head -n 10 > ${work_dir}${file}`);
    }

    // 准备步骤: 打开测试文件夹
    console.log('准备步骤：打开测试文件夹');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir.split('/').pop()}打开成功`);

    // 准备步骤: 取消所有选中效果
    console.log('准备步骤：取消所有选中效果');
    await agent.aiTap('文件管理器右侧内容窗口任意空白处');

  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 清理测试文件夹
    console.log('清理步骤: 清理测试文件夹');
    await system.exec(`test -d ${work_dir} && rm -rf ${work_dir} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1806875-文件操作-文件名快速定位到文件_单次定位', async ({ device, agent, uos, system }) => {
    // 步骤 1: 按下按键d
    console.log('步骤 2：按下按键d');
    await device.pressKey('D');

    // 预期 1: 文件名快速定位到文件${test_files[test_files.length - 2]}
    console.log(`预期 2：文件名快速定位到文件${test_files[test_files.length - 2]}`);
    await agent.aiAssert(`文件管理器右侧内容窗口中选中文件${test_files[test_files.length - 2]}`);

  }, { timeout: 600000, tags: ['1806875', 'level3', 'DITT', 'youwei', 'locate file', 'keyboard', 'single locate'] });

  test('1806875-文件操作-文件名快速定位到文件_多次循环定位', async ({ device, agent, uos, system }) => {
    // 步骤&预期 1: 连续按下5次按键A, 依次定位到文件a_1_1806875.txt, a_2_1806875.txt, a_3_1806875.txt, a_1_1806875.txt, a_2_1806875.txt
    console.log('步骤&预期 1：连续按下5次按键A, 依次定位到文件a_1_1806875.txt, a_2_1806875.txt, a_3_1806875.txt, a_1_1806875.txt, a_2_1806875.txt');
    const switch_count = 5;
    for (let i = 0; i < switch_count; i++) {
      await device.pressKey('A');
      await agent.aiAssert(`文件管理器右侧内容窗口中选中文件a_${i%3+1}_1806875.txt`);
    }

  }, { timeout: 600000, tags: ['1806875', 'level3', 'DITT', 'youwei', 'locate file', 'keyboard', 'multiple locate'] });

  test('1806875-文件操作-文件名快速定位到文件_完整文件名定位', async ({ device, agent, uos, system }) => {

    // 步骤 1: 依次连续快速按下按键qwer
    console.log('步骤 4：依次连续按下按键qwer');
    await device.pressKey('Q', 'W', 'E', 'R');

    // 预期 1: 文件名快速定位到文件${test_files[test_files.length - 1]}
    console.log(`预期 4：文件名快速定位到文件${test_files[test_files.length - 1]}`);
    await agent.aiAssert(`文件管理器右侧内容窗口中选中文件${test_files[test_files.length - 1]}`);

  }, { timeout: 600000, tags: ['1806875', 'level3', 'DITT', 'youwei', 'locate file', 'keyboard', 'complete file name locate'] });

  test('1806875-文件操作-文件名快速定位到文件_多次慢速定位', async ({ device, agent, uos, system }) => {

    // 步骤 1: 每隔1s依次按下按键A, 按键B和按键C
    console.log('步骤 1：每隔1s依次按下按键A, 按键B');
    await device.pressKey('A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('B');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('C'); 

    // 预期 1: 文件名快速定位到文件c_1_1806875.txt
    console.log(`预期 1：文件名快速定位到文件c_1_1806875.txt`);
    await agent.aiAssert(
      `文件管理器内容区域中选中[预期文件名] c_1_1806875.txt,
      [定位规则]
        1. 先定位内容区域:
          * 文件管理器最左侧是侧边栏, 内容窗口在侧边栏右侧相邻
          * 侧边栏右侧从上到下依次是标签栏, 地址栏, 内容区域和状态栏
          * 内容区域内如果没有任何文件/文件夹, 显示"文件夹为空"
          * 内容区域内如果有文件/文件夹, 则显示文件/文件夹图标以及名称
        2. 定位选中文件/文件夹:
          * 选中的文件/文件夹名称是蓝底白字
      [文件名匹配]
        1. 提取该项中可见的文件名文本（去除首尾空格、零宽字符 \u200b）
        2. 如果文件名中有换行符或者显示为多行，去除文件名文本中的换行符, 将多行字符拼接到一起作为识别到的文件名
        3. 允许以下情况视为匹配:
          * 识别到的文件名恰好等于 [预期的文件名]
          * 识别到的文件名为 [预期的文件名] 的前缀且后面紧跟省略号(···)
          * 识别到的文件名没有缺失后缀
      [容错规则]
        * 允许文件名前后出现 0–1 个空格；
        * 忽略由 UI 渲染产生的零宽字符（\u200b、\ufeff）；
        * 仅在右侧内容窗口内的选中项进行判断，左侧导航栏、顶部工具栏、底部状态栏中的同名文件不参与校验
        * 部分相似字符如1, I, l; O, 0, o; 5, S, s; 等视为相同
    `);

  }, { timeout: 600000, tags: ['1806875', 'level3', 'DITT', 'youwei', 'locate file', 'keyboard', 'multiple slow locate'] });

  test('1806875-文件操作-文件名快速定位到文件_非匹配定位', async ({ device, agent, uos, system }) => {

    // 步骤 1: 按下按键E
    console.log('步骤 1：按下按键E');
    await device.pressKey('E');

    // 预期 1: 没有定位到任何文件
    console.log('预期 1：没有定位到任何文件');
    await agent.aiAssert('文件管理器右侧内容窗口中没有选中任何文件');

  }, { timeout: 600000, tags: ['1806875', 'level3', 'DITT', 'youwei', 'locate file', 'keyboard', 'non-match locate'] });

});
