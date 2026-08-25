/**
 * 用例 PMSID: 1850197
 * 用例标题: 桌面名称排序、修改时间排序、大小排序、类型排序
 * 生成时间: 2026-03-12 19:30:00
 * 用例编写人: UT000159（游伟）
 */


describe('1850197-桌面名称排序、修改时间排序、大小排序、类型排序', () => {
  const config_file = "/home/uos/.config/deepin/dde-desktop/dde-desktop.conf";
  const config_file_bak = "/home/uos/.config/deepin/dde-desktop/dde-desktop.conf.bak";
  const test_dir = "~/Desktop/";
  const bak_dir = "~/bak/";

  const test_file_flag = "test"

  const desktop_files = [
    "dde-computer.desktop",
    "deepin-tooltips.desktop",
    "uos-service-support.desktop",
    "dde-trash.desktop",
    "dde-home.desktop",
  ];

  async function order_by_right_click_menu( order_selection , agent ) {
    await agent.aiRightClick('桌面任意空白区域');
    await agent.aiWaitFor('右键菜单出现',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiHover('右键菜单中的排序方式');
    await agent.aiWaitFor('右键菜单中的排序方式菜单已展开',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap(`右键菜单中的排序方式菜单中的${order_selection}`);
    await agent.aiWaitFor('右键菜单消失',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
  };

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 备份桌面设置
    console.log('准备步骤: 备份桌面设置');
    await system.exec(`cp ${config_file} ${config_file_bak}`);

    // 准备步骤: 隐藏桌面图标
    console.log('准备步骤: 隐藏桌面图标');
    await system.exec(`mkdir -pv ${bak_dir}`);
    for (let i = 0; i < desktop_files.length; i++) {
      let file = desktop_files[i];
      await system.exec(`test -f ~/Desktop/${file} && mv ~/Desktop/${file} ${bak_dir}/${file}`);
    };

    // 准备步骤: 备份桌面其它文件
    console.log('准备步骤: 备份桌面其它文件');
    await system.exec(`mv ~/Desktop/* ${bak_dir}`);
    await agent.aiWaitFor('桌面上没有文件或者文件夹');
  });

  beforeEach(async ({ device, uos, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 删除桌面配置, 排除环境影响(需要配合清除桌面文件使用)
    console.log('准备步骤: 删除桌面配置, 排除环境影响');
    await system.exec(`echo > ${config_file}`);
    await system.exec("systemctl --user daemon-reload && systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`find ${test_dir} -mindepth 1 -name "*${test_file_flag}*" -type f -print -quit | grep -q . && rm -v ${test_dir}/*${test_file_flag}* || true`);
    // await system.exec(`rm ${test_dir}/*${test_file_flag}*`);
    await agent.aiWaitFor('桌面文件已清空');

    // 清理步骤: 点击桌面空白处, 关闭可能未关闭的右键菜单
    console.log('清理步骤: 点击桌面空白处, 关闭可能未关闭的右键菜单');
    await agent.aiTap('桌面任意空白区域');
    await agent.aiWaitFor('右键菜单已关闭');

    // 清理步骤: 删除桌面配置, 排除环境影响(需要配合清除桌面文件使用)
    console.log('清理步骤: 删除桌面配置, 排除环境影响');
    await system.exec(`echo > ${config_file}`);
    await system.exec("systemctl --user daemon-reload && systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 恢复桌面
    await uos.showDesktop();

    // 清理步骤: 重置桌面排序方式
    console.log('清理步骤: 重置桌面排序方式');
    await system.exec(`mv ${config_file_bak} ${config_file}`);
    await system.exec("systemctl --user daemon-reload && systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");

    // 恢复测试前隐藏的文件
    console.log('恢复测试前隐藏的文件');
    for (const file of desktop_files) {
      await system.exec(`mv ${bak_dir}/${file} ~/Desktop/${file}`);
    };
    // 恢复其它文件
    await system.exec(`mv ${bak_dir}/* ~/Desktop/`)
    await system.exec(`rmdir ${bak_dir}`);
  });

  test('1850197-桌面名称排序、修改时间排序、大小排序、类型排序-名称', async ({ device, agent, uos, system }) => {
    let lowercase = 'abcde'; // 小写字母字符串
    let number = '23456'; // 数字字符串
    let hans = '四五六七八';
    let other = '+=';
    let file_names = lowercase + number + hans + other;
    let count = 2;

    // 步骤 1: 创建测试文件
    console.log('步骤 1: 创建测试文件');
    for (let j = 0; j < file_names.length; j++) {
      let file_name = file_names[j];
      for (let i = 0; i < count; i++) {
        await system.exec(`echo ${file_name} > ${test_dir}/${file_name}_${test_file_flag}_${i}.txt`);
      }
    }
    await agent.aiWaitFor(`桌面上有多个文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 右击选中按名称排序
    console.log('步骤 2: 右击选中按名称排序');
    await order_by_right_click_menu('名称', agent);

    // 预期 2: 文件按名称数字, 字母, 汉字, 其它的顺序显示, 表示按名称正序显示(默认情况, 省略步骤1)
    console.log('预期 2: 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序显示, 表示按名称正序显示(默认情况, 省略步骤1)');
    await agent.aiAssert('先按列再按行查看文件排序, 文件按名称符号(包括+, =等常见符号), 数字, 汉字, 小写字母, 大写字母, 其它符号的顺序或者反序显示');

  }, { timeout: 600000, tags: ['1850197', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'desktop', 'name'] });

  test('1850197-桌面名称排序、修改时间排序、大小排序、类型排序-大小', async ({ device, agent, uos, system }) => {
    let file_size = ['1K', '2K', '5K', '10K', '100K', '1M', '10M'];
    let file_type = ['txt', 'doc', 'pdf', 'png', 'jpg', 'mp4', 'mp3'];
    let count = 1;

    // 步骤 1: 创建测试文件
    console.log('步骤 1: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let type of file_type) {
        for (let size of file_size) {
          await system.exec(`fallocate -l ${size} ${test_dir}/${i}_${size}_${test_file_flag}.${type}`);
        }
      }
    }
    await agent.aiWaitFor(`桌面上有多个文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 右击选中按大小排序
    console.log('步骤 2: 右击选中按大小排序');
    await order_by_right_click_menu('大小', agent);

    // 预期 2: 文件按大小正序显示
    console.log('预期 2: 文件按大小正序显示');
    await agent.aiAssert('先按列再按行查看文件排序, 文件文件按大小正序或者反序显示');

  }, { timeout: 600000, tags: ['1850197', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'desktop', 'size'] });

  test('1850197-桌面名称排序、修改时间排序、大小排序、类型排序-类型', async ({ device, agent, uos, system }) => {
    let file_size = ['1K', '10K', '100K'];
    let file_type = ['txt', 'doc', 'png', 'jpg', 'gif', 'bmp', 'mp4', 'mp3', 'zip'];
    let count = 2;

    // 步骤 1: 创建测试文件
    console.log('步骤 1: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let type of file_type) {
        for (let size of file_size) {
          await system.exec(`fallocate -l ${size} ${test_dir}/${i}_${size}_${test_file_flag}.${type}`);
        }
      }
    }
    await agent.aiWaitFor(`桌面上有多个文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 右击选中按类型排序
    console.log('步骤 2: 右击选中按类型排序');
    await order_by_right_click_menu('类型', agent);

    // 预期 2: 文件按类型类型视频(比如mp4文件), 文本文件(比如txt文件), 图片(比如png, jpg, gif, bmp文件), 音频(比如mp3文件), 压缩文件(比如zip文件), 文档(比如doc文件)排列
    console.log('预期 2: 文件按类型类型视频(比如mp4文件), 文本文件(比如txt文件), 图片(比如png, jpg, gif, bmp文件), 音频(比如mp3文件), 压缩文件(比如zip文件), 文档(比如doc文件)排列');
    await agent.aiAssert('先按列再按行查看文件排序, 文件按类型文件视频(比如mp4文件), 文本文件(比如txt文件), 图片(比如png, jpg, gif, bmp文件), 音频(比如mp3文件), 压缩文件(比如zip文件), 文档(比如doc文件)的顺序或者反序排列');

  }, { timeout: 600000, tags: ['1850197', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'desktop', 'type'] });

  test('1850197-桌面名称排序、修改时间排序、大小排序、类型排序-修改时间', async ({ device, agent, uos, system }) => {
    let file_time = ['hours ago', 'days ago', 'weeks ago', 'months ago', 'years ago'];
    let count = 20;

    // 步骤 1: 创建测试文件
    console.log('步骤 1: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let edit_time of file_time) {
        await system.exec(`touch -d "${i} ${edit_time}" ${test_dir}/${i}_${edit_time.replace(' ', '_')}_${test_file_flag}.txt`);
      }
    }
    await agent.aiWaitFor(`桌面上有多个文件`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 步骤 2: 右击选中按修改时间排序
    console.log('步骤 2: 右击选中按修改时间排序');
    await order_by_right_click_menu('修改时间', agent);

    // 预期 2: 文件按修改时间正序显示
    console.log('预期 2: 文件按修改时间正序显示');
    await agent.aiAssert('先按列再按行查看文件排序, 文件按修改时间的正序或者反序显示');

  }, { timeout: 600000, tags: ['1850197', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'sort', 'desktop', 'time'] });
});

