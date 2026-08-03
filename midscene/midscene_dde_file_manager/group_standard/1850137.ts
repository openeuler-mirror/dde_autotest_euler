/**
 * 用例 PMSID: 1850137
 * 用例标题: 文件名称、文件类型、文件修改时间、文件大小排序
 * 生成时间: 2026-01-23 16:00:00
 * 用例编写人: UT000159（游伟）
 */
const test_dir = "~/Videos/testdir";

describe('1850137-文件名称、文件类型、文件修改时间、文件大小排序', () => {
  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    let files_auxiliary = [
      "testfile_0.txt",
      "testfile_1.txt",
      "testfile_2.txt",
    ];

    // 步骤 1: 打开文件管理器测试目录
    console.log('步骤 2: 打开文件管理器目录');
    await system.exec(`mkdir -pv ${test_dir}`);
    await system.exec(`dde-file-manager ${test_dir}`);
    await agent.aiWaitFor(`文件管理器窗口已打开, 并跳转到${test_dir}目录`);

    // 步骤 2: 最大化文件管理器窗口
    console.log('步骤 2: 最大化文件管理器窗口');
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor('文件管理器窗口已铺满除任务栏外的整个桌面');

    // 步骤 3: 创建辅助文件
    console.log('创建辅助文件');
    for (let i = 0; i < files_auxiliary.length; i++) {
      let file_name = files_auxiliary[i];
      await system.exec(`echo ${file_name} > ${test_dir}/${file_name}`);
    }
    await agent.aiWaitFor(`文件管理器窗口窗口有${files_auxiliary.length}个文件`);

    // 步骤 4: 在文件管理器窗口内容区域修改显示模式为“列表”
    console.log('步骤 3: 在文件管理器窗口内容区域修改显示模式为“列表”');
    await agent.aiRightClick('文件管理器窗口内容区域空白处');
    await agent.aiHover('显示模式');
    await agent.aiWaitFor('显示模式子菜单已展开');
    await agent.aiTap('显示模式子菜单中的列表选项');
    await agent.aiWaitFor('文件管理器窗口内容区域以列表模式显示');

    // 步骤 5: 删除辅助文件
    console.log('步骤 4: 删除辅助文件');
    await system.exec(`rm ${test_dir}/*`);
    await agent.aiWaitFor('文件管理器内容区域已清空');
  });

  beforeEach(async ({ device, uos, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1850137-文件名称、文件类型、文件修改时间、文件大小排序-名称', async ({ device, agent, uos, system }) => {
    let lowercase = 'abcdefghjkmnpqr'; // 小写字母字符串
    let number = '23456789'; // 数字字符串
    let hans = '四五六七八';
    let other = '+=#';
    let file_names = lowercase + number + hans + other;
    let count = 2;

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    for ( let j = 0; j < file_names.length; j++) {
      let file_name = file_names[j];
      if ( file_name === undefined ) {
        break;
      }
      for (let i = 0; i < count; i++) {
        await system.exec(`echo ${file_name} > ${test_dir}/${file_name}_testfile_${i}.txt`);
      }
    }
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');
    await agent.aiWaitFor(`${test_dir}内容区域有40个以上文件`);

    // 预期 1: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 表示按名称正序显示(默认情况, 省略步骤1)
    console.log('预期 1: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 表示按名称正序显示(默认情况, 省略步骤1)');
    await agent.aiAssert('文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 可能缺失数字, 字母, 汉字, 其它(包含符号)的文件中的部分, 比如没有以数字开头的文件');

    // 步骤 2: 滚动到最下面
    console.log('步骤 2: 滚动到最下面');
    await agent.aiScroll('文件管理器窗口内容区域', { direction: 'down', distance: 500 });
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');

    // 预期 2: 文件按名称数字, 字母, 汉字, 其它的顺序显示, 表示按名称正序显示
    console.log('预期 2: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 表示按名称正序显示(默认情况, 省略步骤1)');
    await agent.aiWaitFor('文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 显示的文件可能缺失数字, 字母, 汉字, 其它(包含符号)的文件中的部分, 比如没有以数字开头的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

    // 步骤 3: 点击表头名称
    console.log('步骤 3: 点击表头名称');
    await agent.aiTap('表头中名称');

    // 预期 3: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示
    console.log('预期 3: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示');
    await agent.aiWaitFor('文件按文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示, 显示的文件可能缺失数字, 字母, 汉字, 其它(包含符号)的文件中的部分, 比如没有以数字开头的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

    // 步骤 4: 滚动到最上面
    console.log('步骤 2: 滚动到最上面');
    await agent.aiScroll('文件管理器窗口内容区域', { direction: 'up', distance: 500 });
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');

    // 预期 4: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示
    console.log('预期 4: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示');
    await agent.aiWaitFor('文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号反序显示, 显示的文件可能缺失数字, 字母, 汉字, 其它(包含符号)的文件中的部分, 比如没有以数字开头的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850137', 'level2', 'group standard', 'DITT', 'youwei',  'file-manager', 'sort', 'name'] });

  test('1850137-文件名称、文件类型、文件修改时间、文件大小排序-大小', async ({ device, agent, uos, system }) => {
    let file_size = ['1K', '2K', '5K', '10K', '100K', '1M', '10M'];
    let file_type = ['txt', 'doc', 'pdf', 'png', 'jpg', 'mp4', 'mp3'];
    let count = 1;

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < file_type.length; j++) {
        let type = file_type[j];
        for (let k = 0; k < file_size.length; k++) {
          let size = file_size[k];
          await system.exec(`fallocate -l ${size} ${test_dir}/file${i}_${size}.${type}`);
        }
      }
    }
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');
    await agent.aiWaitFor(`${file_size.length * file_type.length * count} 个文件已创建`);

    // 步骤 1: 点击表头中的大小
    console.log('步骤 1: 点击表头中的大小');
    await agent.aiTap('表头中大小');

    // 预期 1: 文件按大小正序显示
    console.log('预期 1: 文件按大小正序显示');
    await agent.aiAssert('文件按大小正序显示');

    // 步骤 2: 滚动到最下面
    console.log('步骤 2: 滚动到最下面');
    await agent.aiScroll('文件管理器窗口内容区域', { direction: 'down', distance: 500 });
    await agent.aiWaitFor('文件管理器内容区域文件稳定显示');

    // 预期 2: 文件按大小正序显示
    console.log('预期 2: 文件按大小正序显示');
    await agent.aiAssert('文件按大小正序显示');

    // 步骤 3: 再次点击表头中的大小
    console.log('步骤 2: 再次点击表头中的大小');
    await agent.aiTap('表头中大小');

    // 预期 3: 文件按大小倒序显示
    console.log('预期 2: 文件按大小倒序显示');
    await agent.aiAssert('文件按大小倒序显示');

    // 步骤 4: 滚动到最上面
    console.log('步骤 4: 滚动到最上面');
    await agent.aiScroll('文件管理器内容区域', { direction: 'up', distance: 500 });
    await agent.aiWaitFor('文件管理器内容区域文件稳定显示');

    // 预期 4: 文件按大小倒序显示
    console.log('预期 4: 文件按大小倒序显示');
    await agent.aiAssert('文件按大小倒序显示');

  }, { timeout: 600000, tags: ['1850137', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'size'] });

  test('1850137-文件名称、文件类型、文件修改时间、文件大小排序-类型', async ({ device, agent, uos, system }) => {
    let file_size = ['1K', '10K', '100K'];
    let file_type = ['txt', 'doc', 'png', 'jpg', 'gif', 'bmp', 'mp4', 'mp3'];
    let count = 2;

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let j = 0; j < file_type.length; j++) {
        let type = file_type[j];
        for (let k = 0; k < file_size.length; k++) {
          let size = file_size[k];
          await system.exec(`fallocate -l ${size} ${test_dir}/file${i}_${size}.${type}`);
        }
      }
    }
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');
    await agent.aiWaitFor(`${file_size.length * file_type.length * count} 个文件已创建`);

    // 步骤 1: 点击表头中的类型
    console.log('步骤 1: 点击表头中的类型');
    await agent.aiTap('表头中类型');

    // 预期 1: 文件按类型文档, 图片, 视频, 音频显示, 表示正序显示
    console.log('预期 1: 文件按类型文档, 图片, 视频, 音频, 压缩文件显示, 表示正序显示');
    await agent.aiWaitFor('文件按类型文档, 图片, 视频, 音频, 压缩文件显示, 可能缺失一种或多种类型的文件, 比如可能缺失压缩文件类型的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

    // 步骤 2: 滚动到最下面
    console.log('步骤 2: 滚动到最下面');
    await agent.aiScroll('文件管理器内容区域', { direction: 'down', distance: 500 });
    await agent.aiWaitFor('文件管理器内容区域文件稳定显示');

    // 预期 2: 文件按类型文档, 图片, 视频, 音频显示, 表示正序显示
    console.log('预期 2: 文件按类型文档, 图片, 视频, 音频显示, 表示正序显示');
    await agent.aiWaitFor('文件按类型文档, 图片, 视频, 音频, 压缩文件显示, 可能缺失一种或多种类型的文件, 比如可能缺失压缩文件类型的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

    // 步骤 3: 再次点击表头中的类型
    console.log('步骤 3: 再次点击表头中的类型');
    await agent.aiTap('表头中类型');

    // 预期 3: 文件按类型音频, 视频, 图片, 文档显示, 表示倒序显示
    console.log('预期 3: 文件按类型音频, 视频, 图片, 文档显示, 表示倒序显示');
    await agent.aiWaitFor('文件按类型音频, 视频, 图片, 文档, 压缩文件显示, 可能缺失一种或多种类型的文件, 比如可能缺失压缩文件类型的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

    // 步骤 4: 滚动到最上面
    console.log('步骤 4: 滚动到最上面');
    await agent.aiScroll('文件管理器内容区域', { direction: 'up', distance: 500 });
    await agent.aiWaitFor('文件管理器内容区域文件稳定显示');

    // 预期 4: 文件按类型音频, 视频, 图片, 文档显示, 表示倒序显示
    console.log('预期 4: 文件按类型音频, 视频, 图片, 文档显示, 表示倒序显示');
    await agent.aiWaitFor('文件按类型音频, 视频, 图片, 文档, 压缩文件显示, 可能缺失一种或多种类型的文件, 比如可能缺失压缩文件类型的文件',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一句aiWaitFor已断言

  }, { timeout: 600000, tags: ['1850137', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'type'] });

  test('1850137-文件名称、文件类型、文件修改时间、文件大小排序-修改时间', async ({ device, agent, uos, system }) => {
    let file_time = ['hours ago', 'days ago', 'weeks ago', 'months ago', 'years ago'];
    let count = 20;

    // 准备步骤: 创建测试文件
    console.log('准备步骤: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let edit_time of file_time) {
        await system.exec(`touch -d "${edit_time}" ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt`);
      }
    }
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');
    await agent.aiWaitFor(`${file_time.length * count} 个文件已创建`);

    // 步骤 1: 点击表头中的修改时间
    console.log('步骤 1: 点击表头中的修改时间');
    await agent.aiTap('表头中修改时间');

    // 预期 1: 文件按修改时间正序显示
    console.log('预期 1: 文件按修改时间正序显示');
    await agent.aiAssert('文件按修改时间正序显示');

    // 步骤 2: 滚动到最下面
    console.log('步骤 2: 滚动到最下面');
    await agent.aiScroll('文件管理器窗口内容区域', { direction: 'down', distance: 500 });
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');

    // 预期 2: 文件按修改时间正序显示
    console.log('预期 2: 文件按修改时间正序显示');
    await agent.aiAssert('文件按修改时间正序显示');

    // 步骤 3: 再次点击表头中的修改时间
    console.log('步骤 3: 再次点击表头中的修改时间');
    await agent.aiTap('表头中修改时间');

    // 预期 3: 文件按修改时间倒序显示
    console.log('预期 3: 文件按修改时间倒序显示');
    await agent.aiAssert('文件按修改时间倒序显示');

    // 步骤 4: 滚动到最上面
    console.log('步骤 4: 滚动到最上面');
    await agent.aiScroll('文件管理器窗口内容区域', { direction: 'up', distance: 500 });
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');

    // 预期 4: 文件按修改时间倒序显示
    console.log('预期 4: 文件按修改时间倒序显示');
    await agent.aiAssert('文件按修改时间倒序显示');

  }, { timeout: 600000, tags: ['1850137', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'time'] });


  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`rm ${test_dir}/*`);
    await agent.aiWaitFor('文件管理器内容区域已清空');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 删除测试文件夹
    console.log('删除测试文件夹');
    let re = await system.exec(`rmdir -v ${test_dir}`);
    if (re.success) {
      console.log(`测试文件夹 ${test_dir} 已删除`);
    } else {
      console.log(`测试文件夹 ${test_dir} 删除失败`);
    }

    // 关闭所有文件管理器窗口
    console.log('恢复文件管理器视图和排序配置文件, 并关闭所有文管窗口');
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');

    // 清除视图和排序配置
    console.log('清除视图和排序配置');
    re = await system.exec("echo > ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    if (re.success) {
      console.log('清除文件恢复成功');
    } else {
      console.log('清除文件恢复失败');
    }

    // 恢复桌面
    await uos.showDesktop();
  });
});

