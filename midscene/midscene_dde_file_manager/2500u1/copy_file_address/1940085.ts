/**
 * 用例 PMSID: 1940085
 * 用例标题: 【复制文件地址】复制系统盘&数据盘文件地址
 * 生成时间: 2026-11-17 21:00:00
 * 用例编写人: UT000649(黄甜)
 */

// @ts-nocheck
const userName = process.env.TEST_USERNAME || 'uos';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const TEST_DIR = `/home/${userName}/1940085`;
const SCRATCH = '/tmp/_1940085_clip.txt';
const caseDir = process.env.TESTCASE_DIR;

describe('1940085-【复制文件地址】复制系统盘&数据盘文件地址', () => {

  beforeAll(async ({ uos, system }) => {文件管理器
    
    await system.exec(`killall dde-file-manager deepin-editor 2>/dev/null || true`);
    // 解锁屏幕，防止锁屏影响测试
    await system.exec(`loginctl unlock-session $(loginctl | grep uos | awk '{print $1}') 2>/dev/null || true`);
    // 禁用自动锁屏
    await system.exec(`gsettings set com.deepin.dde.power line-power-lock-delay 0 2>/dev/null || true`);
    await system.exec(`gsettings set com.deepin.dde.power battery-lock-delay 0 2>/dev/null || true`);
    // 清理 deepin-editor 所有配置，防止恢复之前打开的文件
    await system.exec(`rm -rf /home/uos/.config/deepin/deepin-editor/ /home/uos/.local/share/deepin/deepin-editor/ /home/uos/.cache/deepin/deepin-editor/ 2>/dev/null || true`);
    await uos.showDesktop();
  });

  test('1940085-【复制文件地址】复制系统盘&数据盘文件地址', async ({ device, system, agent, uos }) => {

    // ========== 前置条件 ==========
    // 1. 检查WPS，未安装则安装
    const hasWPS = await system.exec(`which wps 2>/dev/null | wc -l`);
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装");
    }

    // 2. 家目录创建1940085文件夹及测试文件
    await system.exec(`mkdir -p ${TEST_DIR}`);
    await system.exec(`echo '1940085' > '${TEST_DIR}/有特殊字符+——）（）&……%￥#@！RC!@#$%^&()_+}{L （副本）.txt'`);
    await system.exec(`echo '1940085' > '${TEST_DIR}/搜索专项！2#$%……{【".,、 .a.b.c.txt'`);
    await system.exec(`echo '1940085' > '${TEST_DIR}/test.mp4'`);
    await system.exec(`echo '1940085' > '${TEST_DIR}/test.mp3'`);
    await system.exec(`echo '1940085' > '${TEST_DIR}/test.jpg'`);
    console.log('✅ 前置文件已创建');

    // ========== 步骤1：系统盘etc搜索os-version，复制地址，粘贴到文本编辑器 ==========
    console.log('===== 步骤1：系统盘文件地址 → 文本编辑器 =====');
    await uos.openApp('文件管理器');
    await sleep(3000);
    await agent.aiTap('文件管理器左侧栏的系统盘');
    await sleep(2000);
    await agent.aiDoubleClick('etc文件夹');
    await sleep(2000);
    // 搜索 os-version
    await device.pressKey('Ctrl', 'F');
    await sleep(500);
    await device.typeText('os-version');
    await sleep(2500);
    await agent.aiTap('搜索结果中的os-version文件');
    await sleep(500);
    // Ctrl+Shift+C 复制文件地址
    await device.pressKey('Ctrl', 'Shift', 'c');
    await sleep(800);
    // 保存剪贴板纯文本
    await system.exec(`sleep 0.3; xclip -selection clipboard -o -t text/plain > ${SCRATCH} 2>/dev/null || true`, 3000);
    // 点击桌面取消文件选中，防止 dde-file-manager 重新提供剪贴板
    await uos.showDesktop();
    await sleep(500);
    // 清空剪贴板
    await system.exec(`echo -n ' ' | xclip -selection clipboard`, 3000);
    // 打开文本编辑器
    await device.pressKey('Super');
    await sleep(1000);
    await device.typeText('文本编辑器');
    await sleep(1000);
    await device.pressKey('Enter');
    await sleep(4000);
    // 新建空白文档
    await device.pressKey('Ctrl', 'N');
    await sleep(800);
    // 点击编辑区域确保焦点
    await agent.aiTap('文本编辑器的编辑区域');
    await sleep(300);
    // 读取复制的路径，用 typeText 输入
    const clip1 = await system.exec(`cat ${SCRATCH}`);
    await device.typeText(clip1.stdout.trim());
    await sleep(1500);
    await agent.aiAssert('文本编辑器中显示路径 /etc/os-version');
    console.log('✅ 预期1：系统盘文件地址粘贴成功，路径正确');
    // 关闭文本编辑器
    await device.pressKey('Ctrl', 'Q');
    await sleep(1000);

    // ========== 步骤2：地址栏粘贴路径，Enter打开文件，断言显示[Version] ==========
    console.log('===== 步骤2：地址栏粘贴 → 打开文件 =====');
    // 关闭编辑器和文管
    await system.exec(`killall deepin-editor dde-file-manager 2>/dev/null || true`);
    await sleep(500);
    // 清理 deepin-editor 配置，防止会话恢复
    await system.exec(`rm -rf /home/uos/.config/deepin/deepin-editor/ /home/uos/.local/share/deepin/deepin-editor/ /home/uos/.cache/deepin/deepin-editor/ 2>/dev/null || true`);
    await sleep(500);
    // 直接打开文管
    await system.exec(`dde-file-manager &`);
    await sleep(4000);
    // 用 xdotool 激活文管窗口并点击中心
    await system.exec(`WM=$(xdotool search --class dde-file-manager | head -1); xdotool windowactivate $WM; sleep 0.5; eval $(xdotool getwindowgeometry --shell $WM); xdotool mousemove $((X+WIDTH/2)) $((Y+HEIGHT/2)) click 1`, 5000);
    await sleep(500);
    // 恢复剪贴板（/etc/os-version，不带换行）
    await system.exec(`printf '%s' "$(cat ${SCRATCH})" | xclip -selection clipboard -t text/plain 2>/dev/null || true`, 3000);
    await sleep(300);
    // 用 xdotool 执行地址栏操作：Ctrl+L → Ctrl+A → Delete → Ctrl+V → Enter
    await system.exec(`xdotool key ctrl+l; sleep 0.5; xdotool key ctrl+a; sleep 0.2; xdotool key Delete; sleep 0.2; xdotool key ctrl+v; sleep 0.5; xdotool key Return`, 8000);
    await sleep(4000);
    await agent.aiAssert('文本编辑器中显示 [Version] 字样');
    console.log('✅ 预期2：粘贴地址后正常打开文件，内容显示[Version]');
    // 关闭文本编辑器
    await device.pressKey('Ctrl', 'Q');
    await sleep(1000);
    // 清理 deepin-editor 配置，防止步骤3恢复打开 os-version
    await system.exec(`rm -rf /home/uos/.config/deepin/deepin-editor/ /home/uos/.local/share/deepin/deepin-editor/ 2>/dev/null || true`);

    // ========== 步骤3：家目录1940085多文件复制地址，粘贴到文本编辑器 ==========
    console.log('===== 步骤3：家目录多文件复制地址 → 文本编辑器 =====');
    await uos.openApp('文件管理器');
    await sleep(3000);
    // 用 xdotool 激活文管窗口并点击中心，确保焦点
    await system.exec(`WM=$(xdotool search --class dde-file-manager | head -1); xdotool windowactivate $WM; sleep 0.5; eval $(xdotool getwindowgeometry --shell $WM); xdotool mousemove $((X+WIDTH/2)) $((Y+HEIGHT/2)) click 1`, 5000);
    await sleep(500);
    // 设置剪贴板为目标路径，用 Ctrl+L → Ctrl+A → Ctrl+V → Enter 导航
    await system.exec(`printf '%s' '${TEST_DIR}' | xclip -selection clipboard -t text/plain 2>/dev/null || true`, 3000);
    await sleep(300);
    await system.exec(`xdotool key ctrl+l; sleep 0.5; xdotool key ctrl+a; sleep 0.2; xdotool key ctrl+v; sleep 0.5; xdotool key Return`, 8000);
    await sleep(3000);
    // 点击文件列表区域，确保焦点在文件列表
    await system.exec(`WM=$(xdotool search --class dde-file-manager | head -1); eval $(xdotool getwindowgeometry --shell $WM); xdotool mousemove $((X+WIDTH/2)) $((Y+HEIGHT/2)) click 1`, 3000);
    await sleep(500);
    await device.pressKey('Ctrl', 'A');
    await sleep(800);
    await device.pressKey('Ctrl', 'Shift', 'c');
    await sleep(800);
    // 保存剪贴板纯文本
    await system.exec(`sleep 0.3; xclip -selection clipboard -o -t text/plain > ${SCRATCH} 2>/dev/null || true`, 3000);
    // 点击桌面取消文件选中，防止 dde-file-manager 重新提供剪贴板
    await uos.showDesktop();
    await sleep(500);
    // 清空剪贴板
    await system.exec(`echo -n ' ' | xclip -selection clipboard`, 3000);
    // 打开文本编辑器
    await device.pressKey('Super');
    await sleep(1000);
    await device.typeText('文本编辑器');
    await sleep(1000);
    await device.pressKey('Enter');
    await sleep(4000);
    // 新建空白文档
    await device.pressKey('Ctrl', 'N');
    await sleep(800);
    // 点击编辑区域确保焦点
    await agent.aiTap('文本编辑器的编辑区域');
    await sleep(300);
    // 读取复制的多文件路径，用 typeText 输入
    const clip3 = await system.exec(`cat ${SCRATCH}`);
    await device.typeText(clip3.stdout);
    await sleep(2000);
    await agent.aiAssert('文本编辑器中显示多个文件路径，每条路径独占一行');
    console.log('✅ 预期3：多文件地址粘贴成功，换行分隔');
    // 关闭文本编辑器
    await device.pressKey('Ctrl', 'Q');
    await sleep(1000);

    console.log('✅ 1940085 测试完成');
  }, { timeout: 1800000, tags: ['1940085', 'level3', '2500u1', 'copy_file_address', 'DITT', 'huangtian'] });

  afterAll(async ({ device, agent, system, uos }) => {
    console.log('===== 清理 =====');
    // 关闭文本编辑器所有页签
    const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeAllTxt(agent, device);
    await system.exec(`rm -rf ${TEST_DIR} ${SCRATCH} 2>/dev/null || true`);
    await system.exec(`killall dde-file-manager deepin-editor 2>/dev/null || true`);    
    await sleep(1000);
    await uos.showDesktop();
  });
});
