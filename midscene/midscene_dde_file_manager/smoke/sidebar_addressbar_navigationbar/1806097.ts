/**
 * 用例 PMSID: 1806097
 * 用例标题: 侧边栏固定目录，排序方式 - 大小_
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

const file_size = ['1K', '10K', '100K', '1M', '10M'];
const file_type = ['doc', 'jpg', 'mp4', 'mp3']; // 去除部分类型文件, 避免右键坐标错误
const count = 1; // 减少文件数量过多, 避免右击空白位置错误

describe('1806097-侧边栏固定目录, 列表视图, 按大小排序', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 备份文件管理器视图和排序配置文件
    await system.exec("cp ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json ~/.config/deepin/dde-file-manager/dde-file-manager.obtusely.json.bak");
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    for (let i = 0; i < count; i++) {
      for (let type of file_type) {
        for (let size of file_size) {
          await system.exec(`fallocate -l ${size} ~/Videos/file${i}_${size}.${type}`);
        }
      }
    }

  });

  test('1806097-侧边栏固定目录, 列表视图, 按大小排序', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文件管理器
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择视频目录
    await agent.aiTap('侧边栏中的视频目录', { deepThink: true });
    await agent.aiWaitFor('文件管理器跳转到视频目录');

    // 验证页面已跳转到视频目录
    await agent.aiAssert('当前目录为视频目录');

    // 步骤 3: 在右侧内容区域修改显示方式为“列表”
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('右键菜单已弹出, 右键菜单中有显示方式选项');
    await agent.aiHover('显示方式');
    await agent.aiWaitFor('显示方式子菜单已展开');
    await agent.aiTap('显示方式子菜单中的列表选项');
    await agent.aiAssert('右侧内容区域以列表模式显示');

    // 步骤 4: 点击“类型”列头进行排序
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiHover('排序方式');
    await agent.aiWaitFor('排序方式子菜单已展开');
    await agent.aiTap('排序方式子菜单中的大小选项');
    // 验证文件已按大小排序
    await agent.aiAssert('忽略表头中箭头位置, 文件按大小排序显示');

  }, { timeout: 600000, tags: ['1806097', 'level2', 'smoke', 'youwei', 'sidebar', 'file-manager', 'view','sort'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    for (let i = 0; i < count; i++) {
      for (let type of file_type) {
        for (let size of file_size) {
          system.exec(`rm ~/Videos/file${i}_${size}.${type}`);
        }
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
