/**
 * 用例 PMSID: 1816115
 * 用例标题: 长文件名功能 - 压缩文件预览 
 * 生成时间: 2026-07-20 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1816115-长文件名功能 - 压缩文件预览', () => {

  const test_files = [
    '一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一.txt',
    '二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二.txt',
  ];

  const test_folder = '一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五';

  const omitted_foldername = "一二三四五···二三四五";

  const test_zipfile = "一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零一二三四五六七八九零.zip";

  const username = process.env.TEST_USERNAME;
  const caseDir = process.env.TESTCASE_DIR;

  const work_dir = `/home/${username}/Desktop/`;
  const work_dir_name = "桌面";
  const test_dir_path = `${work_dir}/${test_folder}`;
  const test_zipfile_path = `${work_dir}/${test_zipfile}`;

  async function switchZipPreview(agent, device, system, status = true) {
    // 打开文件管理器
    await system.exec('dde-file-manager');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器打开成功');

    // 打开文件管理器设置
    await agent.aiTap('右上角有3条横线的图标', { deepThink: true });
    await agent.aiTap('下拉菜单中的设置', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已打开');

    // 设置侧边栏的缩略图预览
    await agent.aiTap('侧边栏中的缩略图预览');
    let isSelected = await agent.aiBoolean('缩略图预览中压缩文件预览被选中');
    if ( isSelected !== status ) {
      await agent.aiTap('缩略图预览中压缩文件预览项左边的复选框');
    }

    await agent.aiAssert(`缩略图预览中压缩文件预览项${status ? '被选中' : '没有被选中'}`);

    // 关闭文件管理器设置
    await agent.aiTap('文件管理器设置界面右上角的关闭按钮:X', { deepThink: true });
    await agent.aiWaitFor('文件管理器设置界面已关闭');
  }

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 开启长文件名功能
    console.log('准备步骤：开启长文件名功能');
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤: 开启压缩文件预览
    console.log('准备步骤：开启压缩文件预览');
    await switchZipPreview(agent, device, system, true);

    // 准备步骤: 关闭所有文管窗口
    console.log('准备步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');;

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 清理可能存在的测试文件夹和文件, 防止干扰测试
    console.log('准备步骤：清理可能存在的测试文件夹和文件');
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_zipfile_path} && rm ${test_zipfile_path} || true`);

    // 准备步骤: 创建测试文件夹和测试文件
    console.log('准备步骤：创建测试文件夹和测试文件');
    await system.exec(`mkdir -pv ${test_dir_path}/${test_folder}`);
    for (let test_file of test_files) {
        await system.exec(`yes "Hello World" | head -n 10 > ${test_dir_path}/${test_folder}/${test_file}`, 5000);
    }

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤：关闭所有文件管理器窗口');
    await system.exec('killall -15 dde-file-manager');;

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -d ${test_dir_path} && rm -rf ${test_dir_path} || true`);
    await system.exec(`test -f ${test_zipfile_path} && rm ${test_zipfile_path} || true`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭压缩文件预览
    console.log('清理步骤：关闭压缩文件预览');
    await switchZipPreview(agent, device, system, false);

    // 清理步骤: 关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
  });

  test('1816115-1816115-长文件名功能 - 压缩文件预览', async ({ device, agent, uos, system }) => {
    // 步骤 1: 压缩测试目录
    console.log('步骤 1：压缩测试目录');
    await agent.aiRightClick(`桌面上的文件名可能省略部分文件夹名的${test_folder}文件夹图标`);
    await agent.aiWaitFor('右键菜单加载完成');

    // 步骤 2: 点击右键菜单中的 添加到"${test_folder.slice(0, 1)}...xx.zip"选项中
    console.log('步骤 2：点击右键菜单中的 添加到"${test_folder.slice(0, 1)}...xx.zip"选项中');
    await agent.aiTap(`右键菜单中的 添加到"${test_folder.slice(0, 1)}...xx.zip"选项中, 中间可能部分差异`);

    // 预期 2: 成功生成压缩文件
    console.log('预期 2：成功生成压缩文件');
    await agent.aiTap('桌面任意空白处');
    await agent.aiWaitFor(`桌面上有以${test_folder.slice(0, 5)}开头的zip文件图标`);
    let result = await system.exec(`ls -l ${work_dir} | grep ${test_zipfile}`);
    assertTrue(result.success, `压缩失败或者生成的压缩文件名不符合预期`);

    // 步骤 3: 打开桌面目录
    console.log('步骤 3：打开桌面目录');
    await system.exec(`dde-file-manager ${work_dir}`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor(`文件夹${work_dir_name}打开成功`);

    // 步骤 4: 双击${work_dir_name}文件夹中的${test_zipfile}文件
    console.log(`步骤 4：双击${work_dir_name}文件夹中的${test_zipfile}文件`);
    await agent.aiDoubleClick(`${work_dir_name}文件夹中的${test_zipfile}文件图标`);

    // 预期 4: 跳转到${test_zipfile}文件预览界面
    console.log(`预期 4：跳转到${test_zipfile}文件预览界面`);
    await agent.aiWaitFor(`打开了${test_zipfile}文件管理器窗口`);
    await agent.aiAssert(`文件管理器窗口右侧内容区域有${omitted_foldername}文件夹`); // 修改为省略效果的文件夹名

  }, { timeout: 600000, tags: ['1816115', 'level3', 'remote', 'DITT', 'youwei', 'preview', 'compress preview'] });
});
