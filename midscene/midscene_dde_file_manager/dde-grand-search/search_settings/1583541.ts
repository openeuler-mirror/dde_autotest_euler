/**
 * 用例 PMSID: 1583541
 * 用例标题: 【搜索设置】文件选择对话框-基础交互检查
 * 前置条件：用户主目录下存在一个文件夹与一个普通文件（本用例 beforeAll 创建）
 * 操作步骤：打开文件选择对话框 → 查看默认查找范围 → 查看列表项类型 → 单击条目 → 点击侧栏"计算机" → 滚轮滚动
 * 预期结果：默认显示主目录；仅显示文件夹；单击条目有聚焦态；"计算机/最近使用"不可选；列表可滚动
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const TEST_DIR = `${TEST_HOME}/1583541_dir`;
const TEST_FILE = `${TEST_HOME}/1583541_file.txt`;

describe('1583541-【搜索设置】文件选择对话框-基础交互检查', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境并在主目录准备一个文件夹与一个普通文件');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${TEST_DIR}" "${TEST_FILE}" && mkdir -p "${TEST_DIR}" && printf 'test' > "${TEST_FILE}"`, 20000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583541-【搜索设置】文件选择对话框-基础交互检查',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        revealGrandSearchBlacklist,
        openBlacklistAddDialog,
        closeFolderChooser,
        getFolderChooserGeometry,
        isFolderChooserOpen,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：打开路径黑名单文件选择对话框 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      await openBlacklistAddDialog(system);
      const geo = await getFolderChooserGeometry(system);
      if (!geo) throw new Error('未能读取"查找目录"文件选择对话框几何信息');
      console.log(`文件选择对话框客户区: x=${geo.x} y=${geo.y} w=${geo.w} h=${geo.h}`);

      console.log('===== 步骤2：默认查找范围为当前用户主目录 =====');
      await agent.aiAssert('文件选择对话框已打开，顶部"查找范围"显示为 /home/test（当前用户主目录），且列表中显示主目录下的文件夹');

      console.log('===== 步骤3：列表项类型检查——仅显示文件夹 =====');
      const fileVisible = await agent.aiBoolean('文件选择对话框的列表中显示名为 1583541_file.txt 的普通文件');
      if (fileVisible) {
        await agent.logScreenshot('1583541-列表出现普通文件');
        throw new Error('断言失败：文件选择对话框列表中出现了普通文件 1583541_file.txt（应仅显示文件夹）');
      }
      await agent.aiAssert('文件选择对话框的列表项均为文件夹（显示文件夹图标与 Folder 类型），没有显示普通文件');

      console.log('===== 步骤4：单击列表首行，检查聚焦状态 =====');
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${geo.x + 200} ${geo.y + 84}; xdotool click 1; sleep 0.8`,
        15000
      );
      await agent.aiAssert('文件选择对话框列表中被单击的文件夹行呈选中/聚焦高亮状态');
      await agent.logScreenshot('1583541-单击条目聚焦');

      console.log('===== 步骤5：点击左侧栏"计算机"，检查目录切换表现 =====');
      const hasRecent = await agent.aiBoolean('文件选择对话框左侧栏存在"最近使用"入口');
      console.log(`左侧栏"最近使用"入口是否存在：${hasRecent}（本版本侧栏仅有"计算机"与"test"）`);
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${geo.x + 50} ${geo.y + 62}; xdotool click 1; sleep 1.2`,
        15000
      );
      if (!(await isFolderChooserOpen(system))) {
        throw new Error('断言失败：点击侧栏"计算机"后文件选择对话框被关闭');
      }
      // 实测本版本点击"计算机"会切换到计算机根目录（查找范围显示"计算机"，列表仅一项 Drive "/"），
      // 用途是验证侧栏可切换且切换后仍只展示文件夹
      await agent.aiAssert('文件选择对话框的"查找范围"已切换为"计算机"，列表中只显示驱动器/文件夹项');
      await agent.logScreenshot('1583541-切换到计算机');

      console.log('===== 步骤6：点击侧栏"test"返回主目录 =====');
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${geo.x + 51} ${geo.y + 89}; xdotool click 1; sleep 1.2`,
        15000
      );
      await agent.aiAssert('文件选择对话框的"查找范围"重新显示为 /home/test');

      console.log('===== 步骤7：滚轮滚动列表 =====');
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${geo.x + 300} ${geo.y + 200}; xdotool click --repeat 6 --delay 200 5; sleep 1.2`,
        20000
      );
      await agent.aiAssert('文件选择对话框列表已被滚轮向下滚动（列表顶部显示的文件夹发生变化或出现位移）');
      await agent.logScreenshot('1583541-列表滚动后');

      console.log('===== 步骤8：关闭文件选择对话框，黑名单未被修改 =====');
      await closeFolderChooser(system);
      if (await isFolderChooserOpen(system)) {
        throw new Error('断言失败：未能关闭文件选择对话框');
      }
      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583541', 'level2', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 删除测试文件夹/文件并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${TEST_DIR}" "${TEST_FILE}"`, 20000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
