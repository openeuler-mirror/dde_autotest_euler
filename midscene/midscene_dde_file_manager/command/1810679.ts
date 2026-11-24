/**
 * 用例 PMSID: 1810679
 * 用例标题: 长文件名功能 - 添加单个角标
 * 生成时间: 2026-07-06 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1810679-长文件名功能 - 添加单个角标', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_file = '长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地11.txt';

  const test_folder = '长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件夹名地址测试长文件';


  // 角标图片路径
  let test_pic = `/home/${USERNAME}/Desktop/test.png`;

  // 测试文件/文件夹路径, 各个用例自行初始化, 需要各个用例自行初始化;
  let test_file_path = '';

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 开启长文件名功能
    console.log('准备步骤：开启长文件名功能');
    const { enableLongFileName } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();

    // 准备步骤: 下载角标图片
    console.log('准备步骤：下载角标图片');
    await system.exec(`cp ${pic_url} ${test_pic}`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 取消文件/文件夹角标
    console.log('清理步骤: 取消文件/文件夹角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -d ${test_file_path} && rmdir ${test_file_path} || true`);
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    test_file_path = ""; // 重置test_file_path变量
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 清理角标图片
    console.log('清理步骤：清理角标图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1810679-长文件名功能 - 添加单个角标_库目录', async ({ device, agent, uos, system }) => {
    // 测试目录
    const work_dir = `/home/${USERNAME}/Documents/`;
    const work_dir_name = '文档';

    // 测试文件路径
    test_file_path = `${work_dir}${test_file}`;

    // 可能需要的返回值
    let result = null;

    // 预期 0: 有角标图片
    console.log('预期 0：有角标图片');
    result = await system.exec(`test -f ${test_pic}`);
    assertTrue(result.success, `角标图片${test_pic}不存在`);

    // 步骤 1: 创建测试文件
    console.log('步骤 1：创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);

    // 预期 1: 桌面上有测试文件
    console.log('预期 1：桌面上有测试文件');
    result = await system.exec(`test -f ${test_file_path}`);
    assertTrue(result.success, `测试文件创建失败, 测试文件${test_file_path}不存在`);

    // 步骤 2: 设置文件角标
    console.log('步骤 2：设置文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic};lu"`);


    // 预期 2: 测试文件${test_file}左上有缩小的角标
    console.log('预期 2：测试文件${test_file}左上有缩小的角标');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`测试文件${test_file}角标设置成功, 文件${test_file}左上角有缩小的龙猫图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 600000, tags: ['1810679', 'level3', 'remote', 'DITT', 'youwei', 'command', 'long name', 'file', 'emblems', 'Libraries'] });

  test('1810679-长文件名功能 - 添加单个角标_桌面', async ({ device, agent, uos, system }) => {
    // 测试目录
    const work_dir = `/home/${USERNAME}/Desktop/`;

    // 测试文件路径
    test_file_path = `${work_dir}${test_folder}`;

    // 可能需要的返回值
    let result = null;

    // 预期 0: 有角标图片
    console.log('预期 0：有角标图片');
    result = await system.exec(`test -f ${test_pic}`);
    assertTrue(result.success, `角标图片${test_pic}不存在`);

    // 步骤 1: 创建测试文件夹
    console.log('步骤 1：创建测试文件夹');
    await system.exec(`test -d ${test_file_path} && rm -rf ${test_file_path} || true`);
    await system.exec(`mkdir ${test_file_path}`);

    // 预期 1: 桌面上有测试文件夹
    console.log('预期 1：桌面上有测试文件夹');
    result = await system.exec(`test -d ${test_file_path}`);
    console.log(result.stdout);
    console.log(result.stderr);
    assertTrue(result.success, `测试文件夹创建失败, 测试文件夹${test_file_path}不存在`);

    // 步骤 2: 设置文件角标
    console.log('步骤 2：设置文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic};lu"`);

    // 预期 2: 测试文件夹${test_folder}左上角有缩小的角标
    console.log('预期 2：测试文件${test_folder}左上角有缩小的角标');
    await device.pressKey('F5');
    await agent.aiWaitFor(`
        [校验目标] [预期文件夹] ${test_folder} 角标设置成功, [目标文件夹] 左上角有缩小的图片,
        [匹配规则]
          1. 先定位 [目标文件夹]
          2. 在定位 [目标文件夹] 图标左上角
          3. 检查 [目标文件夹] 图标左上角有缩小的图片
        [文件夹名匹配规则]
          1. 提取该项中可见的文件夹名文本（去除首尾空格、零宽字符 \u200b）
          2. 如果文件名中有换行符或者显示为多行，去除文件夹名文本中的换行符, 将多行字符拼接到一起作为识别到的文件夹名
          3. 允许以下情况视为匹配:
            * 识别到的文件夹名恰好等于 [预期文件夹]
            * 识别到的文件夹名为 [预期文件夹] 的前缀且后面紧跟省略号(···)
        [容错规则]
          * 允许文件名前后出现 0–1 个空格；
          * 忽略由 UI 渲染产生的零宽字符（\u200b、\ufeff）；
          * 仅在右侧内容窗口内的选中项进行判断，左侧导航栏、顶部工具栏、底部状态栏中的同名文件不参与校验
          * 部分相似字符如1, I, l; O, 0, o; 5, S, s; 等视为相同
          * [预期文件夹] 图标左上角只要图片即可, 忽略图片内容和样式
      `,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 600000, tags: ['1810679', 'level3', 'remote', 'DITT', 'youwei', 'command', 'long name', 'folder', 'emblems', 'Desktop'] });
});
