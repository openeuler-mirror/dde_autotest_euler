/**
 * 用例 PMSID: 1972987
 * 用例标题: 正常访问windows创建的gb2312编码格式的文件
 * 生成时间: 2026-11-12 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */
const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const desktopDir = `/home/${userName}/Desktop`;
const testDir = `${desktopDir}/1972987`;
const resourceDir = `${caseDir}midscene_dde_file_manager/resources/1972987`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1972987-正常访问windows创建的gb2312编码格式的文件', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，放置 GB2312 编码压缩包到桌面');
    await uos.showDesktop();
    await system.exec(`rm -rf ${desktopDir}/1972987 ${desktopDir}/1972987.zip`);
    await system.exec(`cp ${resourceDir}/1972987.zip ${desktopDir}/`);
    await sleep(2500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

  test('1972987-正常访问windows创建的gb2312编码格式的文件', async ({ device, system, agent, uos }) => {
    const sh = async (cmd, t = 30000) => {
      const r = await system.exec(cmd, t);
      return (((r && r.stdout) || '') + '').trim();
    };

    // ==================== 步骤1：通过文件管理器解压 GB2312 压缩包 ====================
    console.log('===== 步骤1：通过文件管理器解压 GB2312 压缩包 =====');
    await sh(`kill -15 $(pidof dde-file-manager) 2>/dev/null; true`);
    await sleep(1500);
    await sh(`nohup dde-file-manager ${desktopDir} >/dev/null 2>&1 &`);
    await sleep(6000);
    const winId = await sh(`xdotool search --class dde-file-manager | tail -1`);
    if (winId) await sh(`xdotool windowactivate ${winId}`);
    await sleep(1500);
    await agent.aiAssert('文件管理器窗口已打开，工作区显示桌面目录，其中存在 1972987.zip 压缩包图标');

    await agent.aiRightClick('文件管理器里的 1972987.zip 压缩包图标');
    await sleep(1500);
    await agent.aiTap('右键菜单中的"解压到当前文件夹"');
    await sleep(8000);

    // 硬校验：解压出 1972987 目录且包含 4 个 .rb 文件
    const rbList = await sh(`ls -1 ${testDir}/*.rb 2>/dev/null`);
    const rbFiles = rbList.split('\n').map(s => s.trim()).filter(Boolean);
    if (rbFiles.length !== 4) {
      throw new Error(`解压后 ${testDir} 下应有 4 个 .rb 文件，实际：${rbFiles.length} 个`);
    }
    console.log(`解压成功，共 ${rbFiles.length} 个 .rb 文件（zip 内文件名为双重编码数据形态，属测试数据本身）`);

    // 界面校验：进入解压目录，4 个文件可见可访问
    await sh(`kill -15 $(pidof dde-file-manager) 2>/dev/null; true`);
    await sleep(1200);
    await sh(`nohup dde-file-manager ${testDir} >/dev/null 2>&1 &`);
    await sleep(6000);
    const winId2 = await sh(`xdotool search --class dde-file-manager | tail -1`);
    if (winId2) await sh(`xdotool windowactivate ${winId2}`);
    await sleep(1500);
    const shown = await agent.aiQuery('列出文件管理器窗口中显示的所有文件名，返回字符串数组');
    const shownArr = Array.isArray(shown) ? shown : [];
    if (shownArr.length !== rbFiles.length) {
      throw new Error(`界面显示 ${shownArr.length} 个文件，与实际 ${rbFiles.length} 个不一致`);
    }
    console.log(`预期结果1：压缩包解压成功，4 个 GB2312 文件均可正常访问（界面显示 ${shownArr.length} 个文件）`);

    // ==================== 步骤2：逐个用文本编辑器打开，选择 GB2312 编码查看内容 ====================
    // 注：zip 内文件名为截断显示的乱码形态，靠图标右键选择容易点错文件，
    // 因此用编辑器直接打开已知精确路径（等效于"打开方式→文本编辑器"）。
    console.log('===== 步骤2：用文本编辑器打开4个文件并校验内容正常显示 =====');
    const failed = [];
    for (const filePath of rbFiles) {
      const base = filePath.split('/').pop();
      const stamp = (base.match(/(\d{9})\.rb$/) || [])[1] || base;
      console.log(`----- 打开并检查文件：${stamp} -----`);

      // 直接用文本编辑器打开该文件
      await sh(`kill -15 $(pidof deepin-editor) 2>/dev/null; true`);
      await sleep(1000);
      await sh(`nohup deepin-editor '${filePath}' >/dev/null 2>&1 &`);
      await sleep(5000);
      const editorWin = await sh(`wmctrl -l | grep -ci "文本编辑器\\|deepin-editor" || true`);
      if (parseInt(editorWin, 10) === 0) {
        failed.push(`${stamp}(编辑器未能打开)`);
        continue;
      }
      await device.pressKey('Win', 'Up');
      await sleep(1500);

      // 若编辑器自动识别的编码显示异常，手动切到 GB2312/GB18030
      const garbled = await agent.aiBoolean('文本编辑器正文中的文本是否包含明显的乱码替换字符（如方框、问号、颠倒字符），正常中文和英文不算乱码');
      if (garbled === true) {
        console.log(`[${stamp}] 显示疑似乱码，切换编码为 GB2312/GB18030`);
        await agent.aiTap('文本编辑器右下角显示当前编码格式的文字');
        await sleep(1500);
        await agent.aiTap('编码格式菜单中的 GB2312 或 GB18030 或 简体中文 编码选项');
        await sleep(2500);
      }

      // 硬校验：回读编辑器正文，与 GB2312 解码后的真实内容比对
      const body = await agent.aiQuery('返回文本编辑器正文区域显示的文本内容（尽可能完整），返回字符串');
      const bodyStr = typeof body === 'string' ? body : JSON.stringify(body);
      console.log(`[${stamp}] 编辑器正文片段：${bodyStr.slice(0, 120).replace(/\n/g, ' | ')}`);

      // shell 侧用 GB18030 解码同一文件得到基准内容
      const truth = await sh(`iconv -f GB18030 -t UTF-8 '${filePath}' | head -5`);
      const norm = (s) => String(s || '').replace(/[\s\u3000]+/g, '');
      const truthStr = norm(truth);
      const bodyNorm = norm(bodyStr);
      const hasHeader = bodyNorm.includes('WindEnergyPlan::Jiangxi');
      const truthHasCjk = /[\u4e00-\u9fff]/.test(truthStr);
      const problems = [];
      if (!hasHeader) problems.push('正文缺少 WindEnergyPlan::Jiangxi 头部');
      if (/[\uFFFD]/.test(bodyStr)) problems.push('正文存在乱码替换字符');
      if (truthHasCjk && !/[\u4e00-\u9fff]/.test(bodyStr)) problems.push('正文缺少应有的中文字段');
      // 文件标识校验：文件名中的时间戳应与正文中的 date 一致，保证打开的是正确的文件
      const m = stamp.match(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/);
      if (m) {
        const dateStr = `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
        if (!bodyNorm.includes(norm(dateStr))) {
          problems.push(`正文日期(${dateStr})与打开的文件不一致`);
        }
      }

      // 关闭编辑器（不保存）
      await device.pressKey('Ctrl', 'W');
      await sleep(1500);
      const saveTip = await agent.aiBoolean('是否弹出是否保存的提示窗口');
      if (saveTip === true) {
        await agent.aiTap('不保存按钮');
      }
      await sleep(1000);
      await sh(`kill -15 $(pidof deepin-editor) 2>/dev/null; true`);
      await sleep(800);

      if (problems.length) {
        failed.push(`${stamp}(${problems.join('；')})`);
      } else {
        console.log(`[${stamp}] 内容显示正常（含 GB2312 中文与结构化字段）`);
      }
    }

    if (failed.length) {
      throw new Error(`以下 GB2312 文件访问异常：${failed.join('，')}`);
    }
    console.log('预期结果2：4 个 GB2312 编码文件在文本编辑器中均正常打开并显示内容');

  }, { timeout: 1800000, tags: ['1972987', 'level3', 'interaction-scenario', 'bug_to_case', 'DITT'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec(`kill -15 $(pidof dde-file-manager deepin-editor) 2>/dev/null; true`);
    await sleep(2000);
  });

  afterAll(async ({ device, system }) => {
    console.log('5. afterAll: 清理桌面测试文件');
    await system.exec(`rm -rf ${desktopDir}/1972987 ${desktopDir}/1972987.zip`);
  });
});
