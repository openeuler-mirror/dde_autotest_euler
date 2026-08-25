/**
 * 用例 PMSID: 1850193
 * 用例标题: 显示文件夹、文本文档、压缩文件图标
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850193-支持桌面图标按照网格式排列', () => {

  // 测试相关变量定义
  const work_dir = "~/Desktop/";
  const test_file_count = 3
  const test_file_prefix = "testfile_1850193";
  const auxiliary_file_prefix = "auxiliary1850193_";
  const auxiliary_count = 150;

  const test_file = test_file_prefix + ".txt";
  // 需要覆盖文件类型应用程序.视频.音频.图片.压缩文件.文档.可执行文件
  const app_file = "/usr/share/applications/dde-file-manager.desktop";
  const video_file = "/usr/share/dde-introduction/uos/1-DDE.mp4";
  const audio_file = "/usr/share/music/bensound-sunny.mp3";
  const image_file = "/usr/share/wallpapers/deepin/desktop.jpg";
  const document_file = "/usr/share/dde-file-manager/templates/newDoc.docx";
  const compress_file = "/usr/share/dde-file-manager/templates/newDoc.docx";
  const executable_file = "/usr/bin/dde-file-manager";

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 测试前清理桌面文件, 避免之前测试影响
    // 准备步骤: 删除测试${work_dir}下所有${test_file_prefix}开头的文件
    console.log(`准备步骤 : 清理测试${work_dir}下所有${test_file_prefix}文件`);
    await system.exec(`rm -v ${work_dir}${test_file_prefix}* | true`);

    // 准备步骤: 删除辅助文件
    console.log(`准备步骤 : 清理测试${work_dir}下所有${auxiliary_file_prefix}文件`);
    for (let i = 0; i < auxiliary_count; i++) {
      await system.exec(`test -f ${work_dir}${auxiliary_file_prefix}${i}.txt && rm -v ${work_dir}${auxiliary_file_prefix}${i}.txt || true`);
    }
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除测试${work_dir}下所有${test_file_prefix}开头的文件
    console.log(`清理步骤 : 清理测试${work_dir}下所有${test_file_prefix}文件`);
    await system.exec(`rm -v ${work_dir}${test_file_prefix}* || true`);

    // 清理步骤: 删除辅助文件
    console.log(`清理步骤 : 清理测试${work_dir}下所有${auxiliary_file_prefix}文件`);
    for (let i = 0; i < auxiliary_count; i++) {
      await system.exec(`test -f ${work_dir}${auxiliary_file_prefix}${i}.txt && rm -v ${work_dir}${auxiliary_file_prefix}${i}.txt || true`);
    }

    // 清理步骤: 关闭所有文件管理器窗口
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

  test('1850193-支持桌面图标按照网格式排列', async ({ device, system, agent, uos }) => {
    // 步骤 1: 创建测试文件
    console.log(`步骤 1: 创建测试文件`);
    for (let i = 0; i < test_file_count; i++) {
      // 创建应用程序文件
      await system.exec(`cp ${app_file} ${work_dir}${test_file_prefix}${i}.desktop`);
      // 创建视频文件
      await system.exec(`cp ${video_file} ${work_dir}${test_file_prefix}${i}.mp4`);
      // 创建音频文件
      await system.exec(`cp ${audio_file} ${work_dir}${test_file_prefix}${i}.mp3`);
      // 创建图片文件
      await system.exec(`cp ${image_file} ${work_dir}${test_file_prefix}${i}.jpg`);
      // 创建文档文件
      await system.exec(`cp ${document_file} ${work_dir}${test_file_prefix}${i}.docx`);
      // 创建压缩文件
      await system.exec(`cp ${compress_file} ${work_dir}${test_file_prefix}${i}.zip`);
      // 创建可执行文件
      await system.exec(`cp ${executable_file} ${work_dir}${test_file_prefix}${i}.exe`);
    }
    await system.exec(`yes "Hello World" | head -n 10 > ${work_dir}${test_file}`);

    // 预期 1: 桌面图标按照网格对齐排列
    console.log('预期 1: 桌面图标按照网格对齐排列');
    await agent.aiAssert('桌面图标按照网格对齐排列');

    // 步骤 2: 拖动${test_file}到桌面右边空白处
    console.log(`步骤 2: 拖动${test_file}到桌面右边空白处`);
    await agent.aiDrag(test_file, '桌面右边空白处');

    // 步骤 3: 创建辅助文件
    console.log(`步骤 3: 创建辅助文件`);
    for (let i = 0; i < auxiliary_count; i++) {
      await system.exec(`yes "Hello World" | head -n 10 > ${work_dir}${auxiliary_file_prefix}${i}.txt`);
    }

    // 预期 3: ${test_file}仍然是按照网格对齐的
    console.log(`预期 2: ${test_file}是按照网格对齐的`);
    await agent.aiAssert(`桌面图标位置是按照网格对齐排列`);

  }, { timeout: 600000, tags: ['1850193', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'gird view'] });

});
