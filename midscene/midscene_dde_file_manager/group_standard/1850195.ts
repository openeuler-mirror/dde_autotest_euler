/**
 * 用例 PMSID: 1850195
 * 用例标题: 支持右键选单创建文件夹、新建纯文本
 * 生成时间: 2026-04-17 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1850195-支持右键选单创建文件夹、新建纯文本', () => {
  const work_dir = "~/Desktop/";
  const new_folder = "新建文件夹";
  const new_file = "新建文本.txt";

  async function clean(system, device, uos) {
    // 清理新建文件夹和新建文本
    await system.exec(`test -d ${work_dir}${new_folder} && rm -rf ${work_dir}${new_folder} || true`);
    await system.exec(`test -f ${work_dir}${new_file} && rm -v ${work_dir}${new_file} || true`);

    // 按esc键退出可能的右键菜单
    await device.pressKey('Esc');

    // 杀死文件管理器进程, 防止干扰后续测试
    await system.exec('killall deepin-file-manager');

    // 显示桌面, 避免干扰测试
    await uos.showDesktop();
  }

  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 清理新建文件夹和新建文本, 避免干扰测试
    console.log('准备步骤: 清理新建文件夹和新建文本, 避免干扰测试');
    await clean(system, device, uos);
  });

  afterEach(async ({ device, agent, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 清理新建文件夹和新建文本
    console.log('清理步骤: 清理新建文件夹和新建文本');
    await clean(system, device, uos);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });

  test('1850195-支持右键选单创建文件夹、新建纯文本_新建文件夹', async ({ device, system, agent, uos }) => {
    // 步骤 1: 进入桌面-任意空白处右键-点击新建文件夹-查看桌面显示
    console.log('步骤 1: 右击桌面空白处, 新建文件夹');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiTap('新建文件夹');

    // 预期 1: 成功创建${new_folder}（重命名状态）
    console.log(`预期 1: 成功创建${new_folder}（重命名状态）`);
    await agent.aiWaitFor(`桌面上新增${new_folder}文件夹`);
    await agent.aiAssert(`字符${new_folder}被选中, 且显示在选中框内`);

    // 步骤 2: 点击桌面空白处
    console.log('步骤 2: 点击桌面空白处');
    await agent.aiTap('桌面任意空白处');
    await agent.aiWaitFor(`${new_folder}创建完成`);

    // 预期 2: 验证新建文件夹创建成功
    console.log(`预期 1: 桌面上出现${new_folder}文件夹图标`);
    await agent.aiAssert(`桌面上有${new_folder}文件夹图标`);
    
  }, { timeout: 600000, tags: ['1850195', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'new folder', 'right click'] });

  test('1850195-支持右键选单创建文件夹、新建纯文本_新建纯文本', async ({ device, system, agent, uos }) => {
    // 步骤 1: 进入桌面-任意空白处右键-点击新建文档-查看桌面显示
    console.log('步骤 1: 右击桌面空白处, 新建文档');
    await agent.aiRightClick('桌面空白处');
    await agent.aiWaitFor('右键菜单出现');
    await agent.aiHover('新建文档');
    await agent.aiWaitFor('新建文档菜单展开完成, 有办公文档, 电子表格, 演示文档, 文本文档');
    await agent.aiTap('文本文档');

    // 预期 1: 成功创建"新建文本.txt"（重命名状态）
    console.log('预期 1: 成功创建"新建文本.txt"（重命名状态）');
    await agent.aiWaitFor('桌面上新增"新建文本.txt"文件');
    await agent.aiAssert('字符新建文本被选中, 且显示在选中框内');
    
    // 步骤 2: 点击桌面空白处
    console.log('步骤 2: 点击桌面空白处');
    await agent.aiTap('桌面任意空白处');
    await agent.aiWaitFor(`${new_file}创建完成`);
    
    // 预期 2: 验证文件${new_file}创建成功
    console.log(`预期 2: 验证${new_file}创建成功`);
    await agent.aiAssert(`桌面存在${new_file}`);
    
  }, { timeout: 600000, tags: ['1850195', 'level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'new file', 'txt', 'right click'] });

});
