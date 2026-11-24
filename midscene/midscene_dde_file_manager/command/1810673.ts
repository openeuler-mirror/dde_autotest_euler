/**
 * 用例 PMSID: 1810673
 * 用例标题: 长文件名功能(关闭) - 添加单个角标
 * 生成时间: 2026-07-07 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1810673-长文件名功能(关闭) - 添加单个角标', () => {

  // 因关闭了文件名长度功能, 使用压缩文件解压代替直接创建
  const CASEDIR = process.env.TESTCASE_DIR;
  const test_zip = 'test_1810673.zip';
  const test_zip_resource = `${CASEDIR}midscene_dde_file_manager/resources/1810673/${test_zip}`;

  const test_file_prefix = '长文件名';

  const test_folder_prefix = '长文件夹名';

  const username = process.env.TEST_USERNAME;

  // 角标图片路径
  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_pic = `/home/${username}/Desktop/test.png`;

  const home_dir = `/home/${username}`;

  // 测试文件/文件夹路径, 各个用例自行初始化, 需要各个用例自行初始化;
  let test_file_path = '';
  let test_file_path1 = '';
  // 压缩文件路径, 各个用例自行初始化, 需要各个用例自行初始化;
  let test_zip_path = '';

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤: 清理环境');
    const { clearEnvironment } = await import(`${CASEDIR}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤: 回到桌面
    console.log('准备步骤: 回到桌面');
    await uos.showDesktop();

    // 准备步骤: 下载角标图片
    console.log('准备步骤: 下载角标图片');
    await system.exec(`cp ${pic_url} ${test_pic}`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 取消文件/文件夹角标
    console.log('清理步骤: 取消文件/文件夹角标');
    assertTrue(test_file_path !== '', 'test_file_path变量未初始化');
    await system.exec(`bash -c "gio set ${test_file_path} -t stringv metadata::emblems ''"`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f "${test_file_path}" && rm "${test_file_path}" || true`);
    await system.exec(`test -d "${test_file_path}" && rmdir "${test_file_path}" || true`);
    await system.exec(`test -f "${test_file_path1}" && rm "${test_file_path1}" || true`);
    await system.exec(`test -d "${test_file_path1}" && rmdir "${test_file_path1}" || true`);
    await system.exec(`test -f "${test_zip_path}" && rm "${test_zip_path}" || true`);
    test_file_path = ''; // 重置test_file_path变量
    test_file_path1 = ''; // 重置test_file_path1变量
    test_zip_path = ''; // 重置test_zip_path变量
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 清理角标图片
    console.log('清理步骤: 清理角标图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1810673-长文件名功能 - 添加单个角标_库目录', async ({ device, agent, uos, system }) => {
    // 测试目录
    const work_dir = `/home/${username}/Documents/`;
    const work_dir_name = '文档';

    // 压缩文件路径
    test_zip_path = `${work_dir}${test_zip}`;

    // 可能需要的返回值
    let result = null;

    // 预期 0: 有角标图片
    console.log('预期 0: 有角标图片');
    result = await system.exec(`test -f ${test_pic}`);
    assertTrue(result.success, `角标图片${test_pic}不存在`);

    // 步骤 1: 打开${work_dir}
    console.log(`步骤 1: 打开${work_dir}`);
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);

    // 步骤 2: 获取${test_zip}文件
    console.log(`步骤 2: 获取${test_zip}文件`);
    await system.exec(`cp ${test_zip_resource} ${test_zip_path}`);
    await agent.aiWaitFor(`文件夹右侧内容窗口有${test_zip}文件图标`);

    // 步骤 3: 获取测试文件
    console.log('步骤 3: 获取测试文件');
    // unzip直接解压会因文件名过长失败, 必须使用归档管理器解压
    // 在${work_dir}目录中删除${test_file_prefix}开头的文件
    await system.exec(`find ${work_dir} -type f -name "${test_file_prefix}*.txt" -delete`);

    // await agent.aiRightClick(`文件夹右侧内容窗口中${test_zip}文件图标`);
    // await agent.aiWaitFor('右键菜单出现');
    // await agent.aiTap('右键菜单中的 解压到当前文件夹');
    await system.exec(`cd ${work_dir} && deepin-compressor ${test_zip_path} extract_here`);
    await agent.aiWaitFor(`文件夹右侧内容窗口有以${test_file_prefix}开头的文件图标`);

    // 步骤 4: 设置文件角标
    console.log('步骤 4: 设置文件角标');
    result = await system.exec(`find ${work_dir} -type f -name "${test_file_prefix}*.txt" -print -quit | grep ${test_file_prefix}`);
    assertTrue(result.success, `没有找到以${test_file_prefix}开头的文件`);
    test_file_path = result.stdout.replace('\n', '').trim();
    // console.log(`test_file_path: ${test_file_path}`);
    let test_file = test_file_path.split('/').pop();

    result = await system.exec(`find ${work_dir} -type d -name "${test_folder_prefix}*" -print -quit | grep ${test_folder_prefix}`);
    assertTrue(result.success, `没有找到以${test_folder_prefix}开头的文件夹`);
    test_file_path1 = result.stdout.replace('\n', '').trim();

    await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems "${test_pic};lu"`);


    // 预期 4: 测试文件${test_file}左上有缩小的角标
    console.log(`预期 4: 测试文件${test_file}左上有缩小的角标`);
    
    await device.pressKey('F5');
    await agent.aiWaitFor(`省略换行显示的测试文件${test_file}角标设置成功, 省略换行显示的文件${test_file}左上角有缩小的图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 600000, tags: ['1810673', 'level3', 'remote', 'DITT', 'youwei', 'command', 'emblems', 'Libraries'] });

  test('1810673-长文件名功能(关闭) - 添加单个角标_桌面', async ({ device, agent, uos, system }) => {
    // 测试目录
    const work_dir = `/home/${username}/Desktop/`;

        // 压缩文件路径
    test_zip_path = `${work_dir}${test_zip}`;

    // 可能需要的返回值
    let result = null;

    // 预期 0: 有角标图片
    console.log('预期 0: 有角标图片');
    result = await system.exec(`test -f ${test_pic}`);
    assertTrue(result.success, `角标图片${test_pic}不存在`);

    // 步骤 1: 获取${test_zip}文件
    console.log(`步骤 1: 获取${test_zip}文件`);
    await system.exec(`cp ${test_zip_resource} ${test_zip_path}`);
    await agent.aiWaitFor(`桌面上有${test_zip}文件图标`);

    // 步骤 2: 获取测试文件
    console.log('步骤 2: 获取测试文件');
    // unzip直接解压会因文件名过长失败, 必须使用归档管理器解压
    // 在${work_dir}目录中删除${test_file_prefix}开头的文件
    await system.exec(`find ${work_dir} -type d -name "${test_folder_prefix}*" -exec rm -rf {} \;`);

    // await agent.aiRightClick(`桌面上的${test_zip}文件图标`);
    // await agent.aiWaitFor('右键菜单出现');
    // await agent.aiTap('右键菜单中的 解压到当前文件夹');
    await system.exec(`bash -c "cd ${work_dir} && deepin-compressor ${test_zip_path} extract_here"`);
    await agent.aiWaitFor(`桌面上以${test_folder_prefix}开头的文件夹图标`);

    // 步骤 4: 设置文件夹角标
    console.log('步骤 4: 设置文件夹角标');
    result = await system.exec(`find ${work_dir} -type d -name "${test_folder_prefix}*" -print -quit | grep ${test_folder_prefix}`);
    assertTrue(result.success, `没有找到以${test_file_prefix}开头的文件`);
    test_file_path = result.stdout.replace('\n', '').trim();
    let test_file = test_file_path.split('/').pop();

    result = await system.exec(`find ${work_dir} -type f -name "${test_file_prefix}*.txt" -print -quit | grep ${test_file_prefix}`);
    assertTrue(result.success, `没有找到以${test_file_prefix}开头的文件`);
    test_file_path1 = result.stdout.replace('\n', '').trim();

    await system.exec(`gio set "${test_file_path}" -t stringv metadata::emblems "${test_pic};lu"`);


    // 预期 4: 测试文件夹${test_file}左上有缩小的角标
    console.log(`预期 4: 测试文件夹${test_file}左上有缩小的角标`);
    
    await device.pressKey('F5');
    await agent.aiWaitFor(`省略换行显示的测试文件夹${test_file}角标设置成功, 省略换行显示的文件夹${test_file}左上角有缩小的图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 600000, tags: ['1810673', 'level3', 'remote', 'DITT', 'youwei', 'command', 'emblems', 'Desktop'] });
});
