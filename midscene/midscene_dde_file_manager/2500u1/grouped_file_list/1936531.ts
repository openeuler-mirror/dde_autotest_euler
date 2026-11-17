/**
 * 用例 PMSID: 1936531
 * 用例标题: 【文件列表支持分组】对网络邻居进行分组
 * 生成时间: 2026-07-14
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;

// 在 beforeAll 中通过 systemctl status avahi-daemon 动态获取
let hostname = '';

describe('1936531-【文件列表支持分组】对网络邻居进行分组', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    console.log('准备步骤: 关闭文管并恢复环境');
    await closeFileManager(system);
    await clearEnvironment(system);

    // 打开文件管理器
    console.log('准备步骤: 打开文件管理器');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 启动 avahi-daemon 和 smbd 服务
    console.log('准备步骤: 启动 avahi-daemon 和 smbd 服务');
    const PASSWD = process.env.TEST_PASSWORD;
    await system.exec(`echo ${PASSWD} | sudo -S systemctl start avahi-daemon smbd`, 3000);

    // 获取 hostname（从 avahi-daemon 状态行中提取，已包含 .local 后缀）
    console.log('准备步骤: 获取本机网络信息');
    const avahiResult = await system.exec(`systemctl status avahi-daemon | grep "running \\\\[" | awk -F'[][]' '{print $2}'`);
    hostname = avahiResult.stdout.trim();
    console.log(`主机名: ${hostname}`);

    // 导航到网络邻居
    console.log('准备步骤: 点击左侧栏网络邻居');
    await agent.aiTap('左侧边栏中的网络邻居文本');
    await agent.aiWaitFor('网络邻居页面已加载', { timeout: 5000 });

    // 鉴权弹窗判断
    console.log('准备步骤: 检查鉴权弹窗');
    const authNeeded = await agent.aiBoolean('页面出现鉴定或授权文本');
    if (authNeeded) {
      console.log('触发鉴权弹窗，输入密码');
      await device.typeText(`${password}`, true);
    } else {
      console.log('未触发鉴权弹窗');
    }

    // 地址栏挂载本机 print$ 共享
    console.log('准备步骤: 通过地址栏挂载本机 print$ 共享');
    await device.pressKey('Ctrl', 'l');
    await agent.aiWaitFor('地址栏已激活');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${hostname}/print$`, true);

    // 输入认证信息
    console.log('准备步骤: 输入 SMB 认证信息');
    await agent.aiWaitFor('出现需要授权来访问文本');
    await device.typeText(`${username}`);
    await agent.aiTap('记住密码');
    await agent.aiInput(`${password}`, '密码输入框');
    await agent.aiTap('连接选项');

    // 等待共享目录加载完成
    await agent.aiWaitFor('共享目录已加载', { timeout: 15000 });
    console.log('print$ 共享目录已挂载');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1936531-【文件列表支持分组】对网络邻居进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤 1：验证初始状态与目录挂载
    // ============================================================
    console.log('===== 步骤1：验证网络邻居首页分组状态 =====');
    await agent.aiTap(`左侧边栏中的网络邻居文本`);
    await agent.aiWaitFor('网络邻居首页已显示', { timeout: 5000 });
    await agent.aiRightClick('网络邻居首页内容区域空白处');
    await agent.aiAssert('网络邻居首页没有分组选项显示');
    console.log('预期1：网络邻居首页的分组选项完全隐藏');

    // 点击进入 print$ 共享目录
    console.log('进入 print$ 共享目录');
     await device.pressKey('Ctrl', 'l');
    await agent.aiWaitFor('地址栏已激活');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${hostname}/print$`, true);
    await agent.aiWaitFor('print$共享目录已打开', { timeout: 10000 });
    await agent.aiAssert('print$共享目录中的文件未分组显示，所有文件平铺展示');
    console.log('预期2：进入共享目录后，默认视图未启用任何分组功能');

    // ============================================================
    // 步骤 2：按名称分组
    // ============================================================
    console.log('===== 步骤2：右键 → 分组方式 → 名称 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('目录内显示年份类型的标题', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期：文件按名称首字母分组');
    await agent.aiAssert('print$共享目录中文件按名称首字母进行了分组');

    // ============================================================
    // 步骤 3：按创建时间分组
    // ============================================================
    console.log('===== 步骤3：右键 → 分组方式 → 创建时间 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的创建时间选项', { deepThink: true });
    await agent.aiWaitFor('目录内显示年份类型的标题', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期：文件按创建时间分组');
    await agent.aiAssert('print$共享目录中文件按创建时间进行了分组');

    // ============================================================
    // 步骤 4：按大小分组
    // ============================================================
    console.log('===== 步骤4：右键 → 分组方式 → 大小 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('文件被分为未知组中', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期：文件按大小分组');
    await agent.aiAssert('print$共享目录中文件文件被分为未知组中');

    // ============================================================
    // 步骤 5：按类型分组
    // ============================================================
    console.log('===== 步骤5：右键 → 分组方式 → 类型 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文件被分到了目录组中', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期：文件按类型分组');
    await agent.aiAssert('print$共享目录中文件文件被分到了目录组中');

    // ============================================================
    // 步骤 6：按修改时间分组
    // ============================================================
    console.log('===== 步骤6：右键 → 分组方式 → 修改时间 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('目录内显示年份类型的标题', { timeout: 10000, checkIntervalMs: 2000 });

    console.log('预期：文件按修改时间分组');
    await agent.aiAssert('print$共享目录中文件按修改时间进行了分组');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 800000, tags: ['1936531', 'level4', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的无选项', { deepThink: true });

    // 释放所有按键
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, uos, agent, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 右键左侧栏中的挂载名，选择取消记住密码并删除
    console.log('清理步骤: 右键左侧栏挂载名，取消记住密码并删除');
    await agent.aiRightClick(`左侧边栏中的${hostname}文本`);
    await agent.aiWaitFor('右键菜单已显示', { timeout: 5000 });
    await agent.aiTap('取消记住密码并卸载');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    await uos.showDesktop();
  });
});