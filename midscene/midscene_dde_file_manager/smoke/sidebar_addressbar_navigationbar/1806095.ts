/**
 * 用例 PMSID: 1806095
 * 用例标题: 侧边栏固定目录，排序方式 - 名称_
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

const lowercase = Array.from({ length: 6 }, (_, i) => String.fromCharCode(97 + i)).join(''); // 小写字母字符串
const number = Array.from({ length: 5 }, (_, i) => i.toString()).join(''); // 数字字符串
const file_names = lowercase + number;
// 测试文件数量不宜过多, 过多会导致空白位置识别错误, 进而导致测试失败
const count = 2;

describe('1806095-侧边栏固定目录，排序方式 - 名称_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 备份文件管理器视图和排序配置文件
    await system.exec("cp ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    for (let j = 0; j < file_names.length; j++) {
      let file_name = file_names[j];
      for (let i = 0; i < count; i++) {
        system.exec(`echo ${file_name} > ~/Videos/${file_name}_testfile_${i}.txt`);
      }
    }

  });

  test('1806095-侧边栏固定目录，排序方式 - 名称_', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择视频目录
    await agent.aiTap('侧边栏中的视频目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到视频目录');

    // 验证页面已跳转到视频目录
    await agent.aiAssert('当前目录为视频目录');

    // 步骤 3: 在右侧内容区域修改显示模式为“列表”
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiHover('显示模式');
    await agent.aiWaitFor('显示模式子菜单已展开');
    await agent.aiTap('显示模式子菜单中的列表选项');
    await agent.aiAssert('右侧内容区域以列表模式显示');

    // 步骤 4: 点击“名称”列头进行排序
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiHover('排序方式');
    await agent.aiWaitFor('排序方式子菜单已展开');
    await agent.aiTap('排序方式子菜单中的名称选项');
    // 验证文件已按名称排序
    await agent.aiAssert('表头中名称旁边出现箭头, 文件按名称排序显示');

  }, { timeout: 600000, tags: ['1806095', 'level2', 'smoke', 'youwei', 'sidebar', 'file-manager', 'view','sort'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    for (let j = 0; j < file_names.length; j++) {
      let file_name = file_names[j];
      for (let i = 0; i < count; i++) {
        system.exec(`rm ~/Videos/${file_name}_testfile_${i}.txt`);
      }
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('窗口右上角关闭按钮:X');
    // 恢复文件管理器视图和排序配置文件
    await system.exec("mv ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json");
    await system.exec("pkill dde-file-manage");
  });
});
