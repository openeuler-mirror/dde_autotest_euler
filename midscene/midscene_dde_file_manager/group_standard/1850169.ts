/**
 * 用例 PMSID: 1850169
 * 用例标题: 文件名最大长度不小于255字节
 * 生成时间: 2026-02-10 16:30:00
 * 用例编写人: UT000159（游伟）
 */

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

describe('1850169-文件名最大长度不小于255字节', () => {

  // 测试相关变量定义
  const length = 255;
  const test_file_pre = 'testfile_';
  const test_dir_pre = 'testdir_';
  const zipfile = 'zipfile';
  const suffix = '.txt';
  const work_dir = '~/Videos/testdir';
  const zip_app = 'deepin-compressor';

  // 获取随机文件名和文件夹名
  const test_file = test_file_pre + generateRandomString(length - test_file_pre.length - suffix.length) + suffix;
  const test_dir = test_dir_pre + generateRandomString(length - test_dir_pre.length);
  console.log(`测试文件: ${test_file}`);
  console.log(`测试文件夹: ${test_dir}`);

  beforeAll(async ({ uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 删除可能存在的测试文件夹${test_dir}以及里边的文件, 以免干扰测试
    console.log(`准备步骤: 删除可能存在的测试文件夹${test_dir}以及里边的文件, 以免干扰测试`);
    await system.exec(`test -d ${work_dir}/${test_dir} && rm -rf ${work_dir}/${test_dir}`);

    // 准备步骤: 创建测试文件${test_file}和测试文件夹${test_dir}
    console.log(`准备步骤: 创建测试文件${test_file}和测试文件夹${test_dir}`);
    await system.exec(`mkdir -pv ${work_dir}/${test_dir}`);
    await system.exec(`touch ${work_dir}/${test_file}`);

    // 准备步骤: 创建${zipfile}.zip文件
    console.log(`准备步骤: 创建${zipfile}.zip文件`);
    let result = await system.exec(`bash -c 'pushd ${work_dir} && zip -v ${work_dir}/${zipfile}.zip ./${test_file} ./${test_dir}; popd'`);
    if (result.success) {
      console.log(`创建${zipfile}.zip文件成功`);
    } else {
      console.log(`创建${zipfile}.zip文件失败, 错误信息: ${result.stderr}`);
    }
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤 : 清理测试文件${test_file}和文件夹${test_dir}
    console.log(`清理步骤 : 清理测试文件${test_file}和文件夹${test_dir}`);
    await system.exec(`test -f ${work_dir}/${test_file} && rm -v ${work_dir}/${test_file}`);
    await system.exec(`test -d ${work_dir}/${test_dir} && rm -rf -v ${work_dir}/${test_dir}`);

    // 清理步骤 : 清理压缩文件${zipfile}.zip
    console.log(`清理步骤 : 清理压缩文件${zipfile}.zip`);
    await system.exec(`test -f ${work_dir}/${zipfile}.zip && rm -v ${work_dir}/${zipfile}.zip`);

    // 清理步骤 : 清理解压后的目录${zipfile}和里边的文件
    console.log(`清理步骤 : 清理解压后的目录${zipfile}`);
    await system.exec(`test -d ${work_dir}/${zipfile} && rm -rf -v ${work_dir}/${zipfile}`);

    // 清理步骤 : 清理工作目录${work_dir}
    console.log(`清理步骤 : 清理工作目录${work_dir}`);
    await system.exec(`test -d ${work_dir} && rm -rf -v ${work_dir}`);

    // 清理步骤 : 关闭归档管理器${zip_app}
    console.log(`关闭${zip_app}`);
    let result = await system.exec(`ps aux | grep ${zip_app} | grep -v grep | awk '{print $2}' | xargs kill -15`);
    if (result.success) {
      console.log('关闭归档管理器成功');
    } else {
      console.log(`关闭归档管理器失败, 错误信息: ${result.stderr}`);
    }

    // 清理步骤 : 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
    await system.exec("rm ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850169-文件名最大长度不小于255字节', async ({ device, system, agent, uos }) => {
    // 步骤 1: 使用归档管理器打开${zipfile}.zip文件
    console.log(`步骤  1: 使用归档管理器打开${zipfile}.zip文件`);
    await system.exec(`${zip_app} ${work_dir}/${zipfile}.zip`);
    await agent.aiWaitFor('归档管理器打开');

    // 步骤 2: 点击解压按钮
    console.log('步骤  2: 点击解压按钮');
    await agent.aiTap('解压按钮');
    await agent.aiWaitFor('解压已完成',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期 2: 使用命令检查解压后的文件名长度和文件夹名长度
    console.log('预期 2: 使用命令检查解压后的文件名长度和文件夹名长度');
    let result = await system.exec(`ls ${work_dir}/${zipfile} | grep ${test_file}`);
    await agent.aiAssert(`${result.success}等于true`);

    result = await system.exec(`ls ${work_dir}/${zipfile} | grep ${test_dir}`);
    await agent.aiAssert(`${result.success}等于true`);

    // 步骤 3: 打开解压文件夹${zipfile}并最大化窗口
    console.log(`步骤  3: 打开解压文件夹${zipfile}`);
    await system.exec(`dde-file-manager ${work_dir}/${zipfile}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${zipfile}目录`);
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('桌面上只有任务栏和文件管理器窗口');

    // 步骤 4: 鼠标悬浮到测试文件${test_file}上
    console.log(`步骤  4: 鼠标悬浮到测试文件${test_file}上`);
    await agent.aiHover(`文件管理器窗口中以'${test_file_pre}开头的文件'`);

    // 预期 4: 显示完整的测试文件名${test_file}
    console.log(`预期 4: 显示完整的测试文件名${test_file}`);
    await agent.aiAssert(`文件管理器内容区域中以${test_file_pre}开头的文件旁边有完整的分成多行的${test_file}字符`);

    // 步骤 5: 鼠标悬浮到测试文件夹${test_dir}上
    console.log(`步骤  5: 鼠标悬浮到测试文件夹${test_dir}上`);
    await agent.aiHover(`文件管理器窗口中以${test_dir_pre}开头的文件夹`);

    // 预期 5: 显示完整的测试文件夹名${test_dir}
    console.log(`预期 5: 显示完整的测试文件夹名${test_dir}`);
    await agent.aiAssert(`文件管理器内容区域中以${test_dir_pre}开头的文件夹旁边有完整的分成多行的${test_dir}`);

  }, { timeout: 600000, tags: ['1850169', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'max_length'] });
});
