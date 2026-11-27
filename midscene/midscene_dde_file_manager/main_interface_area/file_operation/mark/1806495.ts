/**
 * 用例 PMSID: 1806495
 * 用例标题: 角标设置-设置超长名称文件/图片
 * 生成时间: 2026-08-05 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806495-角标设置-设置超长名称文件/图片', () => {
  const CASEDIR = process.env.TESTCASE_DIR;
  const USERNAME = process.env.TEST_USERNAME;

  const pic_url = `${CASEDIR}midscene_dde_file_manager/resources/test_res/20150826145233628.jpg`;
  const test_long_file = '长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地11.txt';
  const test_file = 'testfile_1806495.txt'

  // 角标图片路径
  const test_pic = `/home/${USERNAME}/Desktop/test.png`;
  const test_long_pic = `/home/${USERNAME}/Desktop/长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地址长文件名图片复制地11.png`;


  // 测试目录
  const work_dir = `/home/${USERNAME}/Documents/`;
  const work_dir_name = '文档';

  // 测试文件路径
  const test_file_path = `${work_dir}${test_file}`;
  const test_long_file_path = `${work_dir}${test_long_file}`;

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
    await system.exec(`cp ${pic_url} ${test_long_pic}`);

    // 准备步骤: 创建测试文件
    console.log('准备步骤：创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_long_file_path} && rm ${test_long_file_path} || true`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`yes "Hello World" | head -n 10 > ${test_long_file_path}`);
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
    await system.exec(`gio set ${test_long_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${test_long_file_path} && rm ${test_long_file_path} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 清理角标图片
    console.log('清理步骤：清理角标图片');
    await system.exec(`test -f ${test_pic} && rm ${test_pic} || true`);
    await system.exec(`test -f ${test_long_pic} && rm ${test_long_pic} || true`);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1806495-角标设置-设置超长名称文件/图片', async ({ device, agent, uos, system }) => {

    // 步骤 1: 长文件名文件+短文件名图片设置文件角标
    console.log('步骤 2：设置文件角标');
    await system.exec(`gio set ${test_long_file_path} -t stringv metadata::emblems "${test_pic};ru"`);

    // 预期 1: 测试文件${test_long_file}左上有缩小的角标
    console.log(`预期 1：测试文件${test_long_file}左上有缩小的角标`);
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`测试文件${test_long_file}角标设置成功, 文件${test_long_file}右上角有缩小的龙猫图片, 文件名可能换行和省略显示`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 短文件名文件+长文件名图片设置文件角标
    console.log('步骤 2：设置文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_long_pic};ru"`);

    // 预期 2: 测试文件${test_file}左上有缩小的角标
    console.log(`预期 2：测试文件${test_file}左上有缩小的角标`);
    // await system.exec(`dde-file-manager ${work_dir}`);
    // await device.pressKey('Super', 'Down');
    // await device.pressKey('Super', 'Up');
    // await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`测试文件${test_file}角标设置成功, 文件${test_file}右上角有缩小的龙猫图片`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 3: 长文件名文件+长文件名图片设置文件角标
    console.log('步骤 3：设置文件角标');
    await system.exec(`gio set ${test_long_file_path} -t stringv metadata::emblems "${test_long_pic};"`);

    // 预期 3: 测试文件${test_long_file}左上有缩小的角标
    console.log(`预期 3：测试文件${test_long_file}左上有缩小的角标`);
    // await system.exec(`dde-file-manager ${work_dir}`);
    // await device.pressKey('Super', 'Down');
    // await device.pressKey('Super', 'Up');
    // await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);
    await device.pressKey('F5');
    await agent.aiWaitFor(`测试文件${test_long_file}角标设置成功, 文件${test_long_file}右上角有缩小的龙猫图片, 文件名可能换行和省略显示`,
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 600000, tags: ['1806495', 'level3', 'remote', 'DITT', 'youwei', 'long file name', 'file', 'emblems'] });
});
