/**
 * 用例 PMSID: 1811389
 * 用例标题: 保险箱操作多层级文件夹
 * 生成时间: 2026-05-12 19:30:00
 * 用例编写人: UT000159（游伟）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811389-保险箱操作多层级文件夹', () => {
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  // const encryption_key = 'Uos123!!';

  const vault_unlocked = `/home/${username}/.config/Vault/vault_unlocked`;
  const levels = ['测试目录', '一级目录', '二级目录', '三级目录'];

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const { createNoPasswordVault, clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);

    // 准备步骤: 创建保险箱
    console.log('准备步骤: 创建保险箱');
    await createNoPasswordVault(uos, env, agent, device, system);

    // 准备步骤: 创建测试文件夹
    console.log('准备步骤: 创建测试文件夹');
    system.exec(`mkdir -p ${vault_unlocked}/${levels.join('/')}`);
  });

  beforeEach(async ({ uos, env, device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 关闭所有文件管理器窗口
    console.log('准备步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');

    // 准备步骤: 打开文件管理器
    console.log('准备步骤: 打开文件管理器');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiWaitFor("文件管理器窗口已打开");

    // 准备步骤: 打开保险箱
    console.log('准备步骤: 打开保险箱');
    await agent.aiTap('侧边栏中的保险箱');
    await agent.aiWaitFor('左侧边栏显示当前目录为保险箱');
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 释放所有按键
    console.log('清理步骤: 释放所有按键');
    await device.releaseAllKeys();

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1811389-保险箱操作多层级文件夹', async ({ device, agent, uos, env, system }) => {
    // 步骤 1: 双击打开多层级目录路径
    console.log('步骤 1: 双击打开多层级目录路径');
    for (const level of levels) {
      await agent.aiDoubleClick(`文件列表中的${level}文件夹`, { deepThink: true });
      await agent.aiAssert(`文件管理器跳转到${level}目录`);
    }

    // 步骤 2: 在右侧内容区域右击新建文件夹
    console.log('步骤 2: 在右侧内容区域右击新建文件夹');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('新建文件夹');

    // 预期 2: 成功创建"新建文件夹"（重命名状态）
    console.log('预期 2: 成功创建"新建文件夹"（重命名状态）');
    await agent.aiWaitFor('右侧内容区域新增"新建文件夹"文件夹');
    await agent.aiAssert('字符新建文件夹被选中, 且显示在选中框内');

    // 步骤 3: 点击右侧空白处
    console.log('步骤 3: 点击右侧空白处');
    await agent.aiTap('右侧内容区域空白处');
    await agent.aiWaitFor('文件夹创建完成');

    // 预期 3: 验证文件夹创建成功
    console.log('预期 3: 验证文件夹创建成功');
    await agent.aiAssert('界面存在测试文件夹');

    // 步骤 4: 在右侧内容区域右击新建文本文件
    console.log('步骤 4: 在右侧内容区域右击新建文本文件');
    await agent.aiRightClick('右侧内容区域空白处');
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiHover('新建文档');
    await agent.aiWaitFor('新建文档菜单展开完成');
    await agent.aiTap('文本文档');

    // 预期 4: 成功创建"新建文本.txt"（重命名状态）
    console.log('预期 4: 成功创建"新建文本.txt"（重命名状态）');
    await agent.aiWaitFor('右侧窗口新增"新建文本.txt"文件');
    await agent.aiAssert('字符新建文本被选中, 且显示在选中框内');
    
    // 步骤 5: 点击右侧空白处
    console.log('步骤 5: 点击右侧空白处');
    await agent.aiTap('右侧内容区域空白处');
    await agent.aiWaitFor('文本文件创建完成');
    
    // 预期 5: 验证文件创建成功
    console.log('预期 5: 验证文件创建成功');
    await agent.aiAssert('界面存在新建文本.txt');

  }, { timeout: 600000, tags: ['1811389','level3', 'main interface area', 'fixed directory', 'vault', 'DITT', 'youwei', 'file-manager', 'right-click menu', 'new folder', 'new file', 'multiple folders'] });

});