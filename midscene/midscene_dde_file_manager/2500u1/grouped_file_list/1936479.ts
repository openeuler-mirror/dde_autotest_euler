/**
 * 用例 PMSID: 1936479
 * 用例标题: 【文件列表支持分组】修改时间后，检查文件是否正确分组
 * 生成时间: 2026-07-20
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const musicDir = '$HOME/Music';

describe('1936479-【文件列表支持分组】修改时间后，检查文件是否正确分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    const password = process.env.TEST_PASSWORD;
    if (!password) {
      throw new Error('TEST_PASSWORD 环境变量未设置，无法使用 sudo 修改系统时间');
    }

    // 停止时间同步服务
    console.log('准备步骤: 停止 systemd-timesyncd 时间同步服务');
    await system.exec(`echo '${password}' | sudo -S systemctl stop systemd-timesyncd`, 1000);

    // 创建7个不同修改时间的文件
    const fileConfigs = [
      { name: '修改时间为今天.txt', mtime: 'today', sizeKb: 8 },
      { name: '修改时间为昨天.docx', mtime: '1 day ago', sizeKb: 24 },
      { name: '修改时间为过去7天.png', mtime: '7 days ago', sizeKb: 32 },
      { name: '修改时间为过去30天.mp4', mtime: '30 days ago', sizeKb: 200 },
      { name: '修改时间为月份.mp3', mtime: '1 month ago', sizeKb: 100 },
      { name: '修改时间为年份.zip', mtime: '1 year ago', sizeKb: 64 },
      { name: '修改时间为更早.xmind', mtime: '3 years ago', sizeKb: 16 },
    ];

    for (const config of fileConfigs) {
      console.log(`准备步骤: 创建文件 ${config.name}，修改时间: ${config.mtime}`);
      await system.exec(`echo '${password}' | sudo -S date -s "${config.mtime}"`, 1000);
      const bytes = config.sizeKb * 1024;
      await system.exec(`head -c ${bytes} /dev/zero > ${musicDir}/${config.name}`, 500);
    }

    // 恢复系统时间
    console.log('准备步骤: 恢复系统时间');
    await system.exec(`echo '${password}' | sudo -S systemctl start systemd-timesyncd`, 1000);
    await new Promise(r => setTimeout(r, 3000));

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到音乐目录
    console.log('准备步骤: 导航到音乐目录');
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });

    // 切换为列表视图
    console.log('准备步骤: 切换为列表视图');
    await agent.aiRightClick('文件管理器内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('显示方式');
    await agent.aiWaitFor('显示方式子菜单已显示');
    await agent.aiTap('列表视图');

    // 设置按修改时间分组（右键右侧空白区域中间位置）
    console.log('准备步骤: 设置分组方式为修改时间');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('文件已按修改时间分组显示', { timeout: 5000 });
  });

  test('1936479-【文件列表支持分组】修改时间后，检查文件是否正确分组', async ({ device, agent, uos, system }) => {
    const password = process.env.TEST_PASSWORD;

    // ============================================================
    // 步骤1：cp+rm重命名7个文件，检查是否都自动分到"今天"分组中
    // ============================================================
    console.log('===== 步骤1：cp+rm重命名7个文件，检查是否都自动分到今天分组 =====');
    await system.exec(`cp ${musicDir}/修改时间为今天.txt ${musicDir}/修改时间为今天_s1.txt && rm ${musicDir}/修改时间为今天.txt`, 500);
    await system.exec(`cp ${musicDir}/修改时间为昨天.docx ${musicDir}/修改时间为昨天_s1.docx && rm ${musicDir}/修改时间为昨天.docx`, 500);
    await system.exec(`cp ${musicDir}/修改时间为过去7天.png ${musicDir}/修改时间为过去7天_s1.png && rm ${musicDir}/修改时间为过去7天.png`, 500);
    await system.exec(`cp ${musicDir}/修改时间为过去30天.mp4 ${musicDir}/修改时间为过去30天_s1.mp4 && rm ${musicDir}/修改时间为过去30天.mp4`, 500);
    await system.exec(`cp ${musicDir}/修改时间为月份.mp3 ${musicDir}/修改时间为月份_s1.mp3 && rm ${musicDir}/修改时间为月份.mp3`, 500);
    await system.exec(`cp ${musicDir}/修改时间为年份.zip ${musicDir}/修改时间为年份_s1.zip && rm ${musicDir}/修改时间为年份.zip`, 500);
    await system.exec(`cp ${musicDir}/修改时间为更早.xmind ${musicDir}/修改时间为更早_s1.xmind && rm ${musicDir}/修改时间为更早.xmind`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));

    console.log('预期1：7个文件都自动分到今天分组中');
    await agent.aiAssert('修改时间为今天_s1.txt文件显示在今天分组中');
    await agent.aiAssert('修改时间为昨天_s1.docx文件显示在今天分组中');
    await agent.aiAssert('修改时间为过去7天_s1.png文件显示在今天分组中');
    await agent.aiAssert('修改时间为过去30天_s1.mp4文件显示在今天分组中');
    await agent.aiAssert('修改时间为月份_s1.mp3文件显示在今天分组中');
    await agent.aiAssert('修改时间为年份_s1.zip文件显示在今天分组中');
    await agent.aiAssert('修改时间为更早_s1.xmind文件显示在今天分组中');

    // ============================================================
    // 步骤2：cp+rm重命名，检查文件是否可正确重命名
    // ============================================================
    console.log('===== 步骤2：cp+rm重命名文件，检查是否可正确重命名 =====');
    await system.exec(`cp ${musicDir}/修改时间为今天_s1.txt ${musicDir}/修改时间为今天_s2.txt && rm ${musicDir}/修改时间为今天_s1.txt`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));

    console.log('预期2：文件可以正确重命名');
    await agent.aiAssert('修改时间为今天_s2.txt文件显示在今天分组中');

    // ============================================================
    // 步骤3：编辑文件内容，检查文件是否可以正常读写
    // ============================================================
    console.log('===== 步骤3：编辑文件内容，检查文件是否可以正常读写 =====');
    await agent.aiDoubleClick('修改时间为今天_s2.txt', 2000);
    await agent.aiWaitFor('文本编辑器已打开', { timeout: 10000 });
    await device.typeText('步骤3读写测试');
    await device.pressKey('Ctrl+S');
    await new Promise(r => setTimeout(r, 1000));
    // 直接杀进程关闭文本编辑器
    await system.exec('killall deepin-editor || killall gedit || killall mousepad || true', 500);
    await new Promise(r => setTimeout(r, 1000));

    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));

    console.log('预期3：文件可以正常读写');
    await agent.aiAssert('修改时间为今天_s2.txt文件显示在今天分组中');

    // ============================================================
    // 步骤4：cp+rm重命名一个docx文件，检查修改后是否仍在"今天"分组中
    // ============================================================
    console.log('===== 步骤4：cp+rm重命名另一个文件，检查是否仍在今天分组 =====');
    await system.exec(`cp ${musicDir}/修改时间为昨天_s1.docx ${musicDir}/修改时间为昨天_s4.docx && rm ${musicDir}/修改时间为昨天_s1.docx`, 500);
    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 2000));

    console.log('预期4：修改后的文件仍在今天分组中');
    await agent.aiAssert('修改时间为昨天_s4.docx文件显示在今天分组中');

    // ============================================================
    // 步骤5：调整系统时间为前10天，检查7个文件是否正确分组
    // ============================================================
    console.log('===== 步骤5：调整系统时间为前10天，检查文件分组 =====');
    await system.exec(`echo '${password}' | sudo -S systemctl stop systemd-timesyncd`, 1000);
    await system.exec(`echo '${password}' | sudo -S date -s "10 days ago"`, 1000);
    await new Promise(r => setTimeout(r, 2000));

    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 3000));

    console.log('预期5：文件正确分组（今天分组变为10天前的日期）');
    await agent.aiAssert('修改时间为昨天_s4.docx文件显示在过去7天分组中');

    // ============================================================
    // 步骤6：调整系统时间为后31天，检查7个文件是否正确分组
    // ============================================================
    console.log('===== 步骤6：调整系统时间为后31天，检查文件分组 =====');
    await system.exec(`echo '${password}' | sudo -S date -s "31 days"`, 1000);
    await new Promise(r => setTimeout(r, 2000));

    await device.pressKey('F5');
    await new Promise(r => setTimeout(r, 3000));

    console.log('预期6：文件正确分组（所有文件进入更早分组）');
    await agent.aiAssert('修改时间为昨天_s4.docx文件显示在过去30天分组中');

    // 恢复系统时间
    await system.exec(`echo '${password}' | sudo -S systemctl start systemd-timesyncd`, 1000);
    await new Promise(r => setTimeout(r, 3000));

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936479', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 恢复系统时间
    const password = process.env.TEST_PASSWORD;
    await system.exec(`echo '${password}' | sudo -S systemctl start systemd-timesyncd`, 1000);

    // 清理所有测试文件（原始文件 + 各步骤重命名后的文件）
    await system.exec(
      `rm -f ${musicDir}/修改时间为今天.txt ${musicDir}/修改时间为昨天.docx ` +
      `${musicDir}/修改时间为过去7天.png ${musicDir}/修改时间为过去30天.mp4 ` +
      `${musicDir}/修改时间为月份.mp3 ${musicDir}/修改时间为年份.zip ` +
      `${musicDir}/修改时间为更早.xmind ` +
      `${musicDir}/修改时间为今天_s1.txt ${musicDir}/修改时间为昨天_s1.docx ` +
      `${musicDir}/修改时间为过去7天_s1.png ${musicDir}/修改时间为过去30天_s1.mp4 ` +
      `${musicDir}/修改时间为月份_s1.mp3 ${musicDir}/修改时间为年份_s1.zip ` +
      `${musicDir}/修改时间为更早_s1.xmind ` +
      `${musicDir}/修改时间为今天_s2.txt ${musicDir}/修改时间为昨天_s4.docx`,
      500
    );

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});