/**
 * 用例 PMSID: 1806503
 * 用例标题: 角标设置-文件复制/替换
 * 生成时间: 2026-08-06 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806503-角标设置-文件复制/替换', () => {
  const CASEDIR = process.env.TESTCASE_DIR;
  const USERNAME = process.env.TEST_USERNAME;

  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = "tc503.txt"
  const test_file_copy = "tc503（副本）.txt"
  const test_dir = "td503";


  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;
  const test_dir_path = `${work_dir}/${test_dir}`;
  const test_same_file_path = `${test_dir_path}/${test_file}`;
  const test_file_copy_path = `${work_dir}/${test_file_copy}`;
  const test_pic = "test.png";
  const test_pic_path = `${work_dir}/${test_pic}`;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_file_copy_path} && rm ${test_file_copy_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);

    await system.exec(`touch ${test_file_path}`);
    await system.exec(`mkdir -p ${test_dir_path}`);
    await system.exec(`touch ${test_same_file_path}`);

    // 准备步骤: 准备测试图片
    console.log('准备步骤: 准备测试图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
    await system.exec(`cp ${pic_url} ${test_pic_path}`);
    // await system.exec(`head -c 1024 ${test_pic} > ${test_pic}`); // 截取图片的前1024个字节创建损坏的图片

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    let isDesktop = await agent.aiBoolean('当前窗口是否是桌面');
    if (!isDesktop) {
      await uos.showDesktop();
    }

    // 准备步骤: 给文件设置角标
    console.log('准备步骤: 给文件设置角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);
    await device.pressKey('F5');
    await agent.aiWaitFor(
      `桌面上${test_file}文件${test_file}右上角有缩小的龙猫图片
      [匹配规则]
        1. 先在桌面上找到并定位${test_file}文件
        2. 然后定位${test_file}文件图标右上角
        3. 判断右上角是否有缩小的龙猫图片
      [容错规则]
        1. 忽略因为图标太小而无法识别右上角图片不是龙猫的情况
    `);
  });

  test('1806503-角标设置-文件复制/替换_同名文件替换', async ({ device, agent, uos, system }) => {
    // 步骤 1: 复制同名文件
    console.log('步骤 1: 复制同名文件');
    await system.exec(`cp ${test_file_path} ${test_same_file_path}`);

    // 预期 1: 文件角标仍然存在
    console.log('预期 1: 文件角标仍然存在');
    await device.pressKey('F5');
    await agent.aiAssert(`
      [校验目标] 桌面上${test_file}文件${test_file}右上角有缩小的龙猫图片
      [文件名匹配规则]
          1. 提取该项中可见的文件名文本（去除首尾空格、零宽字符 \u200b）
          2. 如果文件名中有换行符或者显示为多行，去除文件名文本中的换行符, 将多行字符拼接到一起作为识别到的文件名
      [匹配规则]
        1. 先在桌面上找到并定位${test_file}文件
        2. 然后定位${test_file}文件图标右上角
        3. 判断右上角是否有缩小的龙猫图片
      [容错规则]
        * 忽略因为图标太小而无法识别右上角图片不是龙猫的情况
        * 识别到的文件名恰好等于 [预期的文件名]
        * 识别到的文件名为 [预期的文件名] 的前缀且后面紧跟省略号(···), 最后字符是 [预期的文件名] 的后缀
        * 识别到的文件名缺失.xxx的后缀
    `);
  }, { timeout: 600000, tags: ['1806503', 'level3', 'DITT', 'youwei', 'emblems', 'replace', 'same name'] });

  test('1806503-角标设置-文件复制/替换_同目录复制', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中测试文件
    console.log('步骤 1: 复制测试文件');
    await agent.aiTap('桌面任意空白处');
    await agent.aiTap(`桌面上${test_file}文件图标`);
    await agent.aiWaitFor(`桌面上${test_file}文件被选中`);

    // 步骤 2: 复制文件
    console.log('步骤 2: 复制文件');
    await device.pressKey('Ctrl', 'C');
    await device.pressKey('Ctrl', 'V');

    // 预期 2-1: 文件复制成功
    console.log('预期 2-1: 文件复制成功');
    await device.pressKey('F5');
    await agent.aiWaitFor(
      `
        [校验目标]桌面上有  [预期的文件名](${test_file_copy}) 文件,
        [文件名匹配规则]
          1. 提取该项中可见的文件名文本（去除首尾空格、零宽字符 \u200b）
          2. 如果文件名中有换行符或者显示为多行，去除文件名文本中的换行符, 将多行字符拼接到一起作为识别到的文件名
        [容错规则]
          * 识别到的文件名恰好等于 [预期的文件名]
          * 识别到的文件名为 [预期的文件名] 的前缀且后面紧跟省略号(···), 最后字符是 [预期的文件名] 的后缀
          * 识别到的文件名缺失.xxx的后缀
      `,
      {
        timeoutMs: 60000,
        checkIntervalMs: 2000
      }
    );

    // 预期 2-2: 副本文件没有角标
    console.log('预期 2-2: 副本文件没有角标');
    await device.pressKey('F5');
    await agent.aiAssert(
      `桌面上 [预期的文件名](${test_file_copy}) 右上角没有缩小的龙猫图片
      [文件名匹配规则]
        1. 提取该项中可见的文件名文本（去除首尾空格、零宽字符 \u200b）
        2. 如果文件名中有换行符或者显示为多行，去除文件名文本中的换行符, 将多行字符拼接到一起作为识别到的文件名
        3. 允许以下情况视为匹配:
          * 识别到的文件名恰好等于 [预期的文件名]
          * 识别到的文件名为 [预期的文件名] 的前缀且后面紧跟省略号(···)
          * 识别到的文件名没有缺失后缀
      [匹配规则]
        1. 先在桌面上找到并定位 [预期的文件名] 文件
        2. 然后定位 [预期的文件名] 文件图标右上角
        3. 判断右上角是否有缩小的龙猫图片
      [容错规则]
        * 右上角没有图片也视为匹配
    `);
  }, { timeout: 600000, tags: ['1806503', 'level3', 'DITT', 'youwei', 'emblems', 'copy', 'same dir'] });

  test('1806503-角标设置-文件复制/替换_其它目录复制', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中测试文件
    console.log('步骤 1: 复制测试文件');
    await agent.aiTap('桌面任意空白处');
    await agent.aiTap(`桌面上${test_file}文件图标`);
    await agent.aiWaitFor(`桌面上${test_file}文件被选中`);

    // 步骤 2: 复制文件
    console.log('步骤 2: 复制文件');
    await device.pressKey('Ctrl', 'C');

    // 步骤 3: 打开测试文件夹, 粘贴文件
    console.log('步骤 3: 打开测试文件夹, 粘贴文件');
    await system.exec(`test -f ${test_same_file_path} && rm -rf ${test_same_file_path} || true`);
    await system.exec(`dde-file-manager ${test_dir_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${test_dir}打开成功`);
    await agent.aiWaitFor(`文件管理器右侧内容区域没有${test_file}文件图标`);
    await device.pressKey('Ctrl', 'V');
    await agent.aiWaitFor(`文件管理器右侧内容区域有[预期文件名] ${test_file} 文件图标,
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

    // 预期 3: 文件没有角标
    console.log('预期 3: 文件没有角标');
    await device.pressKey('F5');
    await agent.aiAssert(`文件管理器右侧内容区域文件${test_file}右上角没有缩小的龙猫图片`);
  }, { timeout: 600000, tags: ['1806503', 'level3', 'DITT', 'youwei', 'emblems', 'copy', 'different dir'] });

  test('1806503-角标设置-文件复制/替换_其它目录移动', async ({ device, agent, uos, system }) => {
    // 步骤 1: 选中测试文件
    console.log('步骤 1: 复制测试文件');
    await agent.aiTap('桌面任意空白处');
    await agent.aiTap(`桌面上${test_file}文件图标`);
    await agent.aiWaitFor(`桌面上${test_file}文件被选中`);

    // 步骤 2: 剪切文件
    console.log('步骤 2: 剪切文件');
    await device.pressKey('Ctrl', 'X');

    // 步骤 3: 打开测试文件夹, 粘贴文件
    console.log('步骤 3: 打开测试文件夹, 粘贴文件');
    await system.exec(`test -f ${test_same_file_path} && rm -rf ${test_same_file_path} || true`);
    await system.exec(`dde-file-manager ${test_dir_path}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${test_dir}打开成功`);
    await agent.aiWaitFor(`文件管理器右侧内容区域没有${test_file}文件图标`);
    await device.pressKey('Ctrl', 'V');
    await agent.aiWaitFor(
      `文件管理器右侧内容区域有[预期文件名] ${test_file} 文件图标,
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

    // 预期 3: 文件没有角标
    console.log('预期 3: 文件没有角标');
    await device.pressKey('F5');
    await agent.aiAssert(`文件管理器右侧内容区域文件${test_file}右上角没有缩小的龙猫图片`);
  }, { timeout: 600000, tags: ['1806503', 'level3', 'DITT', 'youwei', 'emblems', 'cut', 'different dir'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_same_file_path} && rm ${test_same_file_path} || true`);
    await system.exec(`test -f ${test_file_copy_path} && rm ${test_file_copy_path} || true`);
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
