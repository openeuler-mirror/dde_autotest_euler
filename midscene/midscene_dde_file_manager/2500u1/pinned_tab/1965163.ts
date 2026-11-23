/**
 * 用例 PMSID: 1965163
 * 用例标题: 【标签页支持右键固定】固定深层级目录
 * 生成时间: 2026-07-23 16:40:33
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1965163-【标签页支持右键固定】固定深层级目录', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Music/我是第1层级长文件名/我是第2层级长文件名/我是第3层级长文件名/我是第4层级长文件名/我是第5层级长文件名/我是第6层级长文件名/我是第7层级长文件名/我是第8层级长文件名/我是第9层级长文件名/我是第10层级长文件名/我是第11层级长文件名/我是第12层级长文件名/我是第13层级长文件名/我是第14层级长文件名/我是第15层级长文件名');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1965163-固定深层级目录', async ({ uos, agent, device, system }) => {

    // 步骤 1：进入第15层级长文件名文件夹，然后固定标签
    console.log('步骤 1：进入第15层级长文件名文件夹，然后固定标签');
    await uos.openApp('文件管理器');
    await agent.aiTap('窗口左侧边栏的音乐');
    await agent.aiTap('当前窗口的地址栏靠右侧的空白处');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');
    await device.typeText( '~/Music/我是第1层级长文件名/我是第2层级长文件名/我是第3层级长文件名/我是第4层级长文件名/我是第5层级长文件名/我是第6层级长文件名/我是第7层级长文件名/我是第8层级长文件名/我是第9层级长文件名/我是第10层级长文件名/我是第11层级长文件名/我是第12层级长文件名/我是第13层级长文件名/我是第14层级长文件名/我是第15层级长文件名', true);
    await agent.aiRightClick('标签栏的我是第15层级长文件名标签页');
    await agent.aiTap('固定标签');
    await agent.aiTap('右上角关闭按钮');

    // 步骤 2：打开新文管窗口，检查是否显示步骤1设置的固定标签
    console.log('步骤 2：打开新文管窗口，检查是否显示步骤1设置的固定标签')
    await uos.openApp('文件管理器');
    await agent.aiAssert('标签栏存在我是第15层级长文件名的固定标签');

    // 步骤 3：在该固定标签中创建、编辑、删除文件
    console.log('步骤 3：在该固定标签中创建、编辑、删除文件');
    await agent.aiTap('标签栏的我是第15层级长文件名的固定标签页');
    await agent.aiRightClick('当前窗口空白处')
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await device.typeText('test', true);
    await agent.aiWaitFor('当前文件夹新增test.txt文件')
    await agent.aiDoubleClick('test.txt文件的中间位置');
    await device.typeText('测试文本');
    await device.pressKey('Ctrl','S');
    await agent.aiTap('文本编辑器右上角关闭按钮');
    await agent.aiRightClick('test.txt');
    await agent.aiTap('删除');
    await agent.aiAssert('当前文件夹中不存在test.txt');

  }, { timeout: 600000, tags: ['1965163', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('7. afterEach: 每个测试后的清理');
    // 删除回收站内容
    await agent.aiTap('窗口左侧边栏的回收站')
    await agent.aiTap('清空按钮')
    await agent.aiTap('弹窗的清空按钮',{ deepThink: true})
    await agent.aiAssert('回收站显示为空');
  });

  afterAll(async ({ uos, system }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Music/我是第1层级长文件名');
    await uos.showDesktop();
  });
});
