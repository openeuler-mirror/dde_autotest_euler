/**
 * 用例 PMSID: 1806101
 * 用例标题: 侧边栏固定目录，排序方式 - 修改时间_
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806101-侧边栏固定目录，排序方式 - 修改时间_', () => {
  let file_time = ['hours ago', 'days ago', 'weeks ago', 'months ago', 'years ago'];
  let count = 2;
  let test_dir_name = '下载';
  let test_dir = '~/Downloads';

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 备份文件管理器视图和排序配置文件
    await system.exec("cp ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 清理测试文件以避免误判
    console.log('准备步骤: 清理测试文件以避免误判');
    for (let i = 0; i < count; i++) {
      for (let edit_time of file_time) {
        await system.exec(`test -f ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt && rm ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt || true`);
      }
    }
  });

  test('1806101-侧边栏固定目录全选', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择${test_dir_name}目录
    await agent.aiTap(`侧边栏中的${test_dir_name}目录`, { deepThink: true });
    await agent.aiWaitFor(`文件管理器跳转到${test_dir_name}目录`);

    // 验证页面已跳转到${test_dir_name}目录
    await agent.aiAssert(`当前目录为${test_dir_name}目录`);

    // 步骤 3: 创建测试文件
    console.log('步骤 3: 创建测试文件');
    for (let i = 0; i < count; i++) {
      for (let edit_time of file_time) {
        await system.exec(`touch -d "${edit_time}" ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt`);
      }
    }
    await agent.aiWaitFor('文件管理器窗口内容区域文件稳定显示');
    await agent.aiWaitFor(`${file_time.length * count} 个文件已创建`);

    // 步骤 3: 在右侧内容区域修改显示模式为“列表”
    // await agent.aiRightClick('右侧内容区域空白处');
    // await agent.aiWaitFor('右键菜单已弹出, 右键菜单中有显示方式选项');
    // await agent.aiHover('显示方式');
    // await agent.aiWaitFor('显示模式子菜单已展开');
    // await agent.aiTap('显示模式子菜单中的列表选项');
    // await agent.aiAssert('右侧内容区域以列表模式显示');
    // 下载目录默认为列表模式

    // 步骤 4: 点击“修改时间”列头进行排序
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiHover('排序方式');
    await agent.aiWaitFor('排序方式子菜单已展开');
    await agent.aiTap('排序方式子菜单中的修改时间选项');

    // 验证文件已按修改时间排序
    await agent.aiAssert('文件按修改时间排序显示');

  }, { timeout: 600000, tags: ['1806101', 'level2', 'smoke' ,'sidebar', 'file-manager', 'view','sort'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    for (let i = 0; i < count; i++) {
      for (let edit_time of file_time) {
        await system.exec(`test -f ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt && rm ${test_dir}/file${i}_${edit_time.replace(' ', '_')}.txt || true`);
      }
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('Super', 'Down'); // 关闭前先恢复窗口模式
    // await agent.aiTap('窗口右上角关闭按钮:X');
    await system.exec('pkill dde-file-manager'); // 换用更稳定的命令方式关闭窗口
    // 恢复文件管理器视图和排序配置文件
    await system.exec("mv ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("pkill dde-file-manage");
  });
});
