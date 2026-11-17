/**
 * 用例 PMSID: 1936529
 * 用例标题: 【文件列表支持分组】对最近使用目录进行分组
 * 生成时间: 2026-08-06
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const recentUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/recently_used/common.ts`;
const musicDir = '~/Music';
const tmpDir = '/tmp';

describe('1936529-【文件列表支持分组】对最近使用目录进行分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 创建测试文件并生成最近使用记录');

    const { clearEnvironment, closeFileManager, createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 调用公共方法在音乐目录创建分组测试文件
    console.log('调用公共方法 createGroupedFileListTestFiles 创建分组测试文件');
    await createGroupedFileListTestFiles(system, musicDir);
    console.log('测试文件创建完成');

    // 在 /tmp 目录创建文件（用于系统盘路径分组验证）
    console.log('在 /tmp 目录创建额外文件');
    await system.exec(`mkdir -p ${tmpDir}`, 500);
    await system.exec(`printf 't1' > ${tmpDir}/tmp_文档.txt`, 500);
    await system.exec(`printf 't2' > ${tmpDir}/tmp_图片.png`, 500);
    console.log('/tmp 目录文件创建完成');

    // 使用 Python 命令将所有文件添加到最近使用记录
    // 通过构造 recently-used.xbel 文件（XBEL XML 格式），并设置不同的 visited 时间戳
    // 这样"最近访问时间"分组能覆盖今天、昨天、过去30天、更早等多个时间段
    console.log('使用 Python 命令伪装最近使用记录');
    const addRecentCmd = `
python3 << 'PYEOF'
import os, glob, urllib.parse
from datetime import datetime, timedelta, timezone

# 定义不同时间段的偏移量，用于模拟不同访问时间
time_ranges = [
    ('today', timedelta(days=0)),
    ('yesterday', timedelta(days=1)),
    ('past_30_days', timedelta(days=7)),
    ('earlier', timedelta(days=365)),
]

home = os.path.expanduser('~')
xbel = '<?xml version="1.0" encoding="UTF-8"?>\\n'
xbel += '<xbel version="1.0" xmlns:bookmark="http://www.freedesktop.org/standards/desktop-bookmarks" xmlns:mime="http://www.freedesktop.org/standards/shared-mime-info">\\n'

# 收集所有文件路径（Music目录全部文件 + tmp目录指定文件）
all_files = []
music_dir = os.path.join(home, 'Music')
for path in glob.glob(os.path.join(music_dir, '*')):
    if os.path.isfile(path) or os.path.isdir(path):
        all_files.append(path)

# tmp目录只添加我们创建的文件，避免目录下其他文件干扰
tmp_dir = '/tmp'
for fname in ['tmp_文档.txt', 'tmp_图片.png']:
    fpath = os.path.join(tmp_dir, fname)
    if os.path.isfile(fpath):
        all_files.append(fpath)

# 按时间范围分配文件，使不同文件有不同的 visited 时间戳
for idx, path in enumerate(all_files):
    # 轮流分配时间范围，确保覆盖所有时间段
    range_name, offset = time_ranges[idx % len(time_ranges)]
    visit_time = datetime.now(timezone.utc) - offset
    ts = visit_time.strftime('%Y-%m-%dT%H:%M:%SZ')

    uri = 'file://' + urllib.parse.quote(os.path.abspath(path))
    name = os.path.basename(path)
    xbel += f'  <bookmark href="{uri}" added="{ts}" modified="{ts}" visited="{ts}">\\n'
    xbel += f'    <title>{name}</title>\\n'
    xbel += '    <info><metadata owner="http://freedesktop.org"><mime:mime-type>application/octet-stream</mime:mime-type><bookmark:applications><bookmark:application name="dde-file-manager" exec="dde-file-manager" timestamp="' + ts + '"/></bookmark:applications></metadata></info>\\n'
    xbel += '  </bookmark>\\n'

xbel += '</xbel>\\n'

recent_file = os.path.join(home, '.local', 'share', 'recently-used.xbel')
os.makedirs(os.path.dirname(recent_file), exist_ok=True)
with open(recent_file, 'w', encoding='utf-8') as f:
    f.write(xbel)
print(f'已添加 {len(all_files)} 个文件到最近使用记录，覆盖不同访问时间段和路径')
PYEOF`;
    await system.exec(addRecentCmd, 5000);
    console.log('最近使用记录伪装完成');
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到最近使用目录
    console.log('准备步骤: 导航到最近使用目录');
    await agent.aiTap('文件管理器左侧的最近使用');
    await agent.aiWaitFor('最近使用目录已打开', { timeout: 5000 });
  });

  test('1936529-【文件列表支持分组】对最近使用目录进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：进入最近使用目录，检查默认是否分组
    // ============================================================
    console.log('===== 步骤1：检查最近使用目录默认是否分组 =====');
    console.log('预期1：默认不分组');
    await agent.aiAssert('最近使用目录中的文件没有分组显示，所有文件平铺展示');

    // ============================================================
    // 步骤2：通过右键设置分组方式为名称，检查按名称正确分组
    // ============================================================
    console.log('===== 步骤2：设置分组方式为名称，检查按名称分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('最近使用目录中的文件按名称分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期2：能够按照名称正确分组');
    await agent.aiAssert('最近使用目录中的文件按名称进行了分组');

    // ============================================================
    // 步骤3：通过右键设置分组方式为大小，检查按大小正确分组
    // ============================================================
    console.log('===== 步骤3：设置分组方式为大小，检查按大小分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('最近使用目录中的文件按大小分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期3：能够按照大小正确分组');
    await agent.aiAssert('最近使用目录中的文件按大小进行了分组');

    // ============================================================
    // 步骤4：通过右键设置分组方式为类型，检查按类型正确分组
    // ============================================================
    console.log('===== 步骤4：设置分组方式为类型，检查按类型分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('最近使用目录中的文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期4：能够按照类型正确分组');
    await agent.aiAssert('最近使用目录中的文件按类型进行了分组');

    // ============================================================
    // 步骤5：通过右键设置分组方式为最近访问时间，检查按最近访问时间正确分组
    // ============================================================
    console.log('===== 步骤5：设置分组方式为最近访问时间，检查按最近访问时间分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的最近访问时间选项', { deepThink: true });   
    await agent.aiWaitFor('最近使用目录中的文件按最近访问时间分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期5：能够按照最近访问时间正确分组');
    await agent.aiAssert('最近使用目录中的文件按最近访问时间进行了分组');

    // ============================================================
    // 步骤6：通过右键设置分组方式为路径，检查按路径正确分组
    // ============================================================
    console.log('===== 步骤6：设置分组方式为路径，检查按路径分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的路径选项', { deepThink: true });
    await agent.aiWaitFor('最近使用目录中的文件按路径分组显示，分为系统盘和数据盘', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期6：能够按照路径正确分组');

    // ============================================================
    // 步骤7：选中所有文件，移除，检查所有分组隐藏
    // ============================================================
    console.log('===== 步骤7：选中所有文件，移除，检查分组隐藏 =====');

    // 全选所有文件
    await device.pressKey('Ctrl', 'A');

    // 按下 Delete 键移除
    await device.pressKey('Delete');
    await agent.aiWaitFor('移除确认弹窗已显示', { timeout: 3000 });
    // 回车确认移除
    await device.pressKey('Enter');
    // 等待移除完成
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 按 F5 刷新
    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('预期7：所有文件移除后，所有分组隐藏');
    await agent.aiAssert('最近使用目录中所有文件已被移除，页面右侧不显示“系统盘”分组标题');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936529', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 关闭文管进程
    console.log('关闭文管进程');
    await system.exec('killall dde-file-manager', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 清理 Music 目录中的测试文件
    console.log('清理 Music 目录中的测试文件');
    await system.exec(
      `rm -rf ${musicDir}/0_测试目录 ${musicDir}/4_子目录 ` +
      `&& rm -f ${musicDir}/A_文档.txt ${musicDir}/I_报告.docx ${musicDir}/a_笔记.txt ${musicDir}/3_文档.pdf ` +
      `&& rm -f ${musicDir}/Q_图片.png ${musicDir}/i_截图.png ${musicDir}/L_壁纸.bmp ${musicDir}/R_封面.png ${musicDir}/S_照片.jpg ` +
      `&& rm -f ${musicDir}/啊_影片.mp4 ${musicDir}/吧_教程.mp4 ${musicDir}/q_演示.avi ${musicDir}/测_演示.avi ` +
      `&& rm -f ${musicDir}/吃_音乐.mp3 ${musicDir}/的_播客.mp3 ${musicDir}/发_采样.wav ${musicDir}/m_铃声.mp3 ` +
      `&& rm -f ${musicDir}/起_压缩.zip ${musicDir}/日_资料.tar.gz ${musicDir}/世_备份.7z ${musicDir}/z_归档.rar ` +
      `&& rm -f ${musicDir}/_应用.desktop ${musicDir}/2_启动器.desktop ` +
      `&& rm -f ${musicDir}/+脚本.sh ${musicDir}/C_部署.sh ${musicDir}/g_安装.sh ` +
      `&& rm -f ${musicDir}/1_思维导图.xmind ${musicDir}/K_脑图.xmind ${musicDir}/B_表格.et ${musicDir}/D_手册.et ${musicDir}/p_数据.et ` +
      `&& rm -f ${musicDir}/J_笔记.txt ${musicDir}/h_草稿.txt`,
      500
    );

    // 清理 /tmp 目录中的测试文件
    console.log('清理 /tmp 目录中的测试文件');
    await system.exec(`rm -f ${tmpDir}/tmp_文档.txt ${tmpDir}/tmp_图片.png`, 500);

    // 清理最近使用记录
    console.log('清理最近使用记录');
    const { clearRecent } = await import(recentUtil);
    await clearRecent(device, system, agent);

    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});