/**
 * 用例 PMSID: 1808381
 * 用例标题: [138][core]勾选自动排列-删除桌面文件/文件夹
 * 生成时间: 2026-01-28 15:00:00
 * 用例编写人: UT000159（游伟）
 */

const file_count = 20;
const dir_count = 200;
const test_pre = "test_";
const suffix = ".txt";

const bak_dir = "~/bak";

const work_dir = "~/Desktop/";

const desktop_files = [
  "dde-computer.desktop",
  "deepin-tooltips.desktop",
  "uos-service-support.desktop",
  "dde-trash.desktop",
  "dde-home.desktop",
];

describe('1808381-[138][core]勾选自动排列-删除桌面文件/文件夹', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 隐藏桌面图标
    console.log('隐藏桌面图标');
    await system.exec(`mkdir -pv ${bak_dir}`);
    for (let i = 0; i < desktop_files.length; i++) {
      let file = desktop_files[i];
      await system.exec(`mv ~/Desktop/${file} ${bak_dir}/${file}`);
    };
    // 备份桌面其它文件
    await system.exec(`mv ~/Desktop/* ${bak_dir}`);

    // 勾选自动排列
    console.log('勾选自动排列');
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v 1");

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 删除${test_file}文件
    console.log('准备步骤: 删除新建文件');
    await system.exec(`find ${work_dir} -mindepth 1 -name "${test_pre}*${suffix}" -type f -print -quit | grep -q . && rm -v ${work_dir}${test_pre}*${suffix} || true`);
    await agent.aiWaitFor(`桌面上没有文件以${test_pre}开头的txt文件`);

    // 准备步骤: 删除所有新建文件夹
    console.log('准备步骤: 删除所有新建文件夹');
    await system.exec(`find ${work_dir} -mindepth 1 -name "${test_pre}*" -type d -print -quit | grep -q . && rm -rf ${work_dir}${test_pre}* || true`);
    await agent.aiWaitFor(`桌面上没有以${test_pre}开头的文件夹`);
    // 创建测试文件${test_pre}1~${file_count}文件
    console.log('创建测试文件');
    for (let i = 1; i <= file_count; i++) {
      await system.exec(`touch ~/Desktop/${test_pre}${i}${suffix}`);
    }
    await agent.aiWaitFor(`桌面上出现了${file_count}个以${test_pre}开头的txt文件`);
  });

  test('1808381-[138][core]勾选自动排列-删除桌面文件/文件夹-从末尾选中文件/文件夹删除', async ({ device, agent, uos, system }) => {
    let test_file = test_pre + `${file_count}${suffix}`;
    // 步骤 1: 从末尾删除测试文件
    console.log('步骤 1: 从末尾删除测试文件');
    await agent.aiRightClick(`桌面上的${test_file}文件`);
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('删除');
    await agent.aiWaitFor(`桌面上没有${test_file}文件`);

    // 刷新桌面
    console.log("刷新桌面");
    await device.pressKey('F5');
    // await agent.aiRightClick('桌面任意空白处');
    // await agent.aiTap('刷新');

    // 预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态
    console.log("预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态");
    await agent.aiWaitFor(`桌面上的文件对齐网格连续排列`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行已使用aiWaitFor断言
    // await agent.aiAssert(`桌面上的文件对齐网格连续排列`);

  }, { timeout: 600000, tags: ['1808381', 'level2', 'smoke', 'desktop', 'auto-arrange', 'remove', 'tail'] });

  test('1808381-[138][core]勾选自动排列-删除桌面文件/文件夹-桌面最前面的文件/文件夹-右键删除-查看桌面显示', async ({ device, agent, uos, system }) => {
    let test_file = test_pre + `1${suffix}`;
    let assert_files = test_pre + `2${suffix}`;

    // 步骤 1: 从最前面删除文件
    console.log('步骤 1: 从最前面删除文件');
    await system.exec(`rm -v ~/Desktop/${test_file}`);
    await agent.aiWaitFor(`桌面上没有${test_file}文件`);

    // 刷新桌面
    console.log("刷新桌面");
    await agent.aiRightClick('桌面任意空白处');
    await agent.aiTap('刷新');

    // 预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态
    console.log("预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态");
    await agent.aiWaitFor(`桌面上的文件对齐网格连续排列`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiAssert(`桌面左上角第一个文件是${assert_files}`);
    // await agent.aiAssert(`桌面上的文件对齐网格连续排列`);

  }, { timeout: 600000, tags: ['1808381', 'level2', 'smoke', 'desktop', 'auto-arrange', 'remove', 'head'] });

  test('1808381-[138][core]勾选自动排列-删除桌面文件/文件夹-桌面中部位置的文件/文件夹-右键删除-查看桌面显示', async ({ device, agent, uos, system }) => {
    let test_file = test_pre + `3${suffix}`;
    let assert_files = [ test_pre + `1${suffix}`, test_pre + `2${suffix}`, test_pre + `4${suffix}`];

    // 步骤 1: 从中间删除文件
    console.log('步骤 1: 从中间删除文件');
    await system.exec(`rm -v ~/Desktop/${test_file}`);
    await agent.aiWaitFor(`桌面上没有${test_file}文件`);

    // 刷新桌面
    console.log("刷新桌面");
    await agent.aiRightClick('桌面任意空白处');
    await agent.aiTap('刷新');

    // 预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态
    console.log("预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态");
    await agent.aiWaitFor(`桌面上的文件对齐网格连续排列`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiAssert(`桌面最坐边第一列前3个文件依次是${assert_files[0]}, ${assert_files[1]}, ${assert_files[2]}, 这三个文件中间没有空位置`);
    // await agent.aiAssert(`桌面上的文件对齐网格连续排列`);

  }, { timeout: 600000, tags: ['1808381', 'level2', 'smoke', 'desktop', 'auto-arrange', 'remove', 'mid'] });

  test('1808381-[138][core]勾选自动排列-删除桌面文件/文件夹-铺满且堆叠时-删除文件/文件夹', async ({ device, agent, uos, system }) => {
    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    for (let i = 0; i < dir_count; i++) {
      await system.exec(`mkdir -pv ~/Desktop/${test_pre}${i}`);
    }
    await agent.aiWaitFor(`桌面上铺满了以${test_pre}开头的文件和文件夹`);

    // 步骤 1: 删除所有以${test_pre}开头的txt文件
    console.log(`步骤 1: 删除所有以${test_pre}开头的txt文件`);
    await system.exec(`rm -v ~/Desktop/${test_pre}*${suffix}`);
    await agent.aiWaitFor(`桌面上没有以${test_pre}开头的txt文件`);

    // 刷新桌面
    // console.log("刷新桌面");
    // await agent.aiRightClick('桌面任意空白处');
    // await agent.aiTap('刷新');

    // 预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态
    console.log("预期: 后面的自动向前补齐显示，仍保持连续对齐网格状态");
    await agent.aiWaitFor(`桌面上每一行每一列都是以${test_pre}开头的文件夹, 每一行每一列都被填满`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    // await agent.aiAssert(`桌面上都是以${test_pre}开头的文件夹, 中间没有空位置`);
    await agent.aiWaitFor(`桌面上的文件对齐网格连续排列`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过
    // await agent.aiAssert(`桌面上的文件对齐网格连续排列`);

  }, { timeout: 600000, tags: ['1808381', 'level2', 'smoke', 'desktop', 'auto-arrange', 'remove', 'stack'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 删除${test_file}文件
    console.log('清理步骤: 删除新建文件');
    await system.exec(`find ${work_dir} -mindepth 1 -name "${test_pre}*${suffix}" -type f -print -quit | grep -q . && rm -v ${work_dir}${test_pre}*${suffix} || true`);
    await agent.aiWaitFor(`桌面上没有文件以${test_pre}开头的txt文件`);

    // 清理步骤: 删除所有新建文件夹
    console.log('清理步骤: 删除所有新建文件夹');
    await system.exec(`find ${work_dir} -mindepth 1 -name "${test_pre}*" -type d -print -quit | grep -q . && rm -rf ${work_dir}${test_pre}* || true`);
    await agent.aiWaitFor(`桌面上没有以${test_pre}开头的文件夹`);

    // 刷新桌面
    await agent.aiRightClick('桌面任意空白处');
    await agent.aiTap('刷新');

    // 删除设置并关闭文件管理器
    console.log('清理步骤: 删除设置并关闭文件管理器');
     await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复测试前隐藏的文件
    console.log('恢复测试前隐藏的文件');
    for (const file of desktop_files) {
      await system.exec(`mv ${bak_dir}/${file} ~/Desktop/${file}`);
    };
    // 恢复其它文件
    await system.exec(`mv ${bak_dir}/* ~/Desktop/`)
    await system.exec(`rmdir ${bak_dir}`);

    // 取消勾选自动排列
    console.log('取消勾选自动排列');
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.desktop -k autoAlign -v 0");

    // 重启桌面使设置生效
    await system.exec("ps aux |grep desktop | grep -v grep | grep xdg | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('桌面正常显示');

    await uos.showDesktop();
  });
});
