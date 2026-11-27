/**
 * 用例 PMSID: 1806515
 * 用例标题: 角标设置-使用不同格式图片设置角标
 * 生成时间: 2026-08-25 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806515-角标设置-使用不同格式图片设置角标', () => {

  const USERNAME = process.env.TEST_USERNAME;
  const CASEDIR = process.env.TESTCASE_DIR;

  const pic_res_basepath = `${CASEDIR}midscene_dde_file_manager/resources/1806515/`

  const test_file = "testfile_1806515.txt"
  const auxiliary_file = "auxiliary_file.txt"

  const work_dir = `/home/${USERNAME}/Desktop/`;
  const test_file_path = `${work_dir}/${test_file}`;
  const auxiliary_file_path = `${work_dir}/${auxiliary_file}`;

  const zoom_count = 3;

  let pic_file = ""

  async function setEmblems(system, device, agent, pic_file) {
    // 步骤 1:  准备测试图片
    console.log(`步骤 1:  准备测试图片`);
    const test_pic_path = `${work_dir}/${pic_file}`;
    const test_pic_res = `${pic_res_basepath}/${pic_file}`;
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    await system.exec(`cp ${test_pic_res} ${test_pic_path}`);

    // 步骤 2: 给文件设置角标
    console.log(`步骤 2:  给文件设置角标`);
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems "${test_pic_path};ru"`);

    // 预期 2: 文件角标设置成功， 文件右上角有缩小的龙猫图片
    console.log(`预期 2:  文件角标设置成功， 文件右上角有缩小的图片`);
    await device.pressKey('F5');
    await agent.aiAssert(
      `桌面上${test_file}右上角有缩小的图片,
      [匹配规则]
        1. 先定位桌面上${test_file}的文件图标
        2. 在定位桌面上${auxiliary_file}的文件图标
        3. 对比桌面上${test_file}的文件图标和桌面上${auxiliary_file}的文件图标, ${test_file}的文件图标右上角有缩小的图片
      [容错规则]
        * 图标右上角只要有缩小的图片即可, 忽略内容和样式
    `,);
  }

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);

    await system.exec(`yes "Hello World" | head -n 10 > ${test_file_path}`);
    await system.exec(`yes "Hello World!" | head -n 10 > ${auxiliary_file_path}`);

    // 准备步骤: 设置桌面缩放比例
    console.log('主播步骤: 设置桌面缩放比例')
    await agent.aiTap('桌面任意空白位置');
    for (let i = 0; i < zoom_count; i++) {
      await device.pressKey('Ctrl', '=');
    }

    // 准备步骤: 显示桌面
    console.log('准备步骤: 显示桌面');
    await uos.showDesktop();
  });

  test('1806515-角标设置-使用不同格式图片设置角标_png', async ({ device, agent, uos, system }) => {
    pic_file = 'test.png';
    await setEmblems(system, device, agent, pic_file);
  }, { timeout: 600000, tags: ['1806515', 'level3', 'DITT', 'youwei', 'emblems', 'png'] });

  test('1806515-角标设置-使用不同格式图片设置角标_svg', async ({ device, agent, uos, system }) => {
    pic_file = 'test.svg';
    await setEmblems(system, device, agent, pic_file);
  }, { timeout: 600000, tags: ['1806515', 'level3', 'DITT', 'youwei', 'emblems', 'svg'] });

  test('1806515-角标设置-使用不同格式图片设置角标_gif', async ({ device, agent, uos, system }) => {
    pic_file = 'test.gif';
    await setEmblems(system, device, agent, pic_file);
  }, { timeout: 600000, tags: ['1806515', 'level3', 'DITT', 'youwei', 'emblems', 'gif'] });

  test('1806515-角标设置-使用不同格式图片设置角标_jpg', async ({ device, agent, uos, system }) => {
    pic_file = 'test.jpg';
    await setEmblems(system, device, agent, pic_file);
  }, { timeout: 600000, tags: ['1806515', 'level3', 'DITT', 'youwei', 'emblems', 'jpg'] });

  test('1806515-角标设置-使用不同格式图片设置角标_bmp', async ({ device, agent, uos, system }) => {
    pic_file = 'test.bmp';
    await setEmblems(system, device, agent, pic_file);
  }, { timeout: 600000, tags: ['1806515', 'level3', 'DITT', 'youwei', 'emblems', 'bmp'] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 恢复缩放
    console.log('清理步骤: 恢复缩放');
    await system.exec("rm -rf ~/.config/deepin/dde-desktop");
    await system.exec('systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service');

    // 清理步骤: 取消文件角标
    console.log('清理步骤: 取消文件角标');
    await system.exec(`gio set ${test_file_path} -t stringv metadata::emblems ""`);

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${test_file_path} && rm ${test_file_path} || true`);
    await system.exec(`test -f ${auxiliary_file_path} && rm ${auxiliary_file_path} || true`);
    const test_pic_path = `${work_dir}/${pic_file}`;
    await system.exec(`test -f ${test_pic_path} && rm ${test_pic_path} || true`);
    pic_file = "";

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤: 关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 清理步骤: 返回桌面
    console.log('清理步骤: 返回桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
