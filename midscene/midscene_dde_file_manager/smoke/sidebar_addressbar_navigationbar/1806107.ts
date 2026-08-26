/**
 * 用例 PMSID: 1806107
 * 用例标题: 侧边栏固定目录，文本文件，双击打开
 * 生成时间: 2025-12-16 09:00:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806107-侧边栏固定目录，文本文件，双击打开', () => {
  const work_dir = "~/Videos/";
  const work_dir_name = "视频";
  const new_file_name = "新建文本";
  const modified_file_name = "测试文本";
  const suffix = ".txt";
  const bak_dir = "~/bak_1806121";

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 备份可能存在的文件
    console.log('准备步骤: 备份可能存在的文件');
    await system.exec(`find ${work_dir}/ -mindepth 1 -print -quit | grep -q . && mkdir -p ${bak_dir} && mv ${work_dir}* ${bak_dir} || true`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806107-侧边栏固定目录选择和文件删除', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器
    console.log('步骤 1: 打开文件管理器');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');

    // 步骤 2: 在侧边栏选择${work_dir_name}目录
    console.log(`步骤 2: 在侧边栏选择${work_dir_name}目录`);
    await agent.aiTap(`侧边栏中的${work_dir_name}目录`, { deepThink: true });
    await agent.aiWaitFor(`文件管理器跳转到${work_dir_name}目录`);
    
    // 预期 2: 验证页面已跳转到${work_dir_name}目录
    console.log(`预期 2: 验证页面已跳转到${work_dir_name}目录`);
    await agent.aiAssert(`当前目录为${work_dir_name}目录`);

    // 步骤 3: 在右侧内容区域新建文本文件
    console.log('步骤 3: 在右侧内容区域新建文本文件');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiHover('新建文档');
    await agent.aiWaitFor('新建文档菜单已展开');
    await agent.aiTap('文本文档');
    
    // 步骤 4: 修改文件名
    console.log('步骤 4: 修改文件名');
    await device.typeText(modified_file_name, false);
    await agent.aiTap('右侧内容区域空白处');
    await agent.aiWaitFor(`界面存在${modified_file_name}${suffix}文件`);
    
    // 预期 4: 验证文件创建成功
    console.log('预期 4: 验证文件创建成功');
    await agent.aiAssert(`界面存在${modified_file_name}${suffix}文件`);

    await system.exec(`yes "Hello World!!!" | head -n 10 > ${work_dir}/${modified_file_name}${suffix}`);

    // 步骤 5: 双击打开文件
    console.log('步骤 5: 双击打开文件');
    await agent.aiDoubleClick(`${modified_file_name}${suffix}文件图标`);

    // 预期 5: 验证文件已被打开
    console.log('预期 5: 验证文件已被打开');
    await agent.aiWaitFor('文本编辑器界面已打开');
    await agent.aiAssert('文本编辑器已打开测试文件');

  }, { timeout: 600000, tags: ['1806107', 'level1', 'smoke', 'youwei', 'sidebar', 'file-manager', 'delete'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭文本编辑器
    console.log('清理步骤: 关闭文本编辑器');
    await system.exec(`ps aux | grep ${modified_file_name}${suffix} | grep -v grep | awk '{print $2}' | xargs -r kill -15`);
    await system.exec(`ps aux | grep ${new_file_name}${suffix} | grep -v grep | awk '{print $2}' | xargs -r kill -15`);
    await system.exec('killall deepin-unioncode');
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs -r kill -15");
    await agent.aiWaitFor('所有文本编辑器窗口已关闭');

    // 清理步骤: 清理测试文件
    console.log('清理步骤: 清理测试文件');
    await system.exec(`test -f ${work_dir}${new_file_name}${suffix} && rm -rf ${work_dir}${new_file_name}${suffix} || true`);
    await system.exec(`test -f ${work_dir}${modified_file_name}${suffix} && rm -rf ${work_dir}${modified_file_name}${suffix} || true`);
    await system.exec('gio trash --empty');

    // 清理步骤: 删除设置并关闭文件管理器
    console.log('清理步骤: 删除设置并关闭文件管理器');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 恢复可能保存的文件
    console.log('清理步骤: 恢复可能保存的文件');
    await system.exec(`test -d ${bak_dir} && cp -rf ${bak_dir}/* ${work_dir} && rm -rf ${bak_dir} || true`);
  });
});
