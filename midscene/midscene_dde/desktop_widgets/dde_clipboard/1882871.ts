/**
 * 用例 PMSID: 1882871
 * 用例标题: 【稳定性】【桌面】【剪贴板】复制大于10M的纯文本数据，不支持生成剪贴板记录
 * 生成时间: 2026-01-23 16:26:45
 * 用例编写人：UT000224(何权)
 */

describe('1882871-【稳定性】【桌面】【剪贴板】复制大于10M的纯文本数据，不支持生成剪贴板记录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    system.exec(`systemctl --user restart dde-clipboard`);
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1882871-【稳定性】【桌面】【剪贴板】复制大于10M的纯文本数据，不支持生成剪贴板记录', async ({ device, agent, uos, system }) => {
    // 步骤1: 创建测试文件，打开纯文本文件，进行全选后复制，再打开剪贴板
    await system.exec(`tr -dc 'A-Za-z0-9 \n' < /dev/urandom | head -c 15000000 > /home/$USER/Desktop/large_text_file.txt`);
    await new Promise(resolve => setTimeout(resolve, 12000));
    // 打开文本文件（使用文本编辑器）
    await system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor /home/$USER/Desktop/large_text_file.txt');
    await agent.aiWaitFor("large_text_file.txt在deepin-editor中打开");
    
    // 全选文本内容
    await system.exec('xdotool key ctrl+a');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待全选完成
    
    // 复制文本内容
    await system.exec('xdotool key ctrl+c');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待复制完成
    
    // 打开剪贴板
    await system.exec('xdotool key Super+v');
    await agent.aiWaitFor("剪贴板界面已显示");
    
    // 验证复制成功，但不会生成剪贴板文本记录，能正常打开剪贴板，系统或进程不卡顿
    await agent.aiAssert("右侧剪贴板列表中为空，没有生成大于10M的文本记录");
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 步骤2: 打开新的文本文件，直接进行粘贴
    console.log('步骤2: 打开新的文本文件，直接进行粘贴');
    
    // 创建一个新文件用于粘贴测试
    await system.exec('touch /home/$USER/Desktop/new_text_file.txt');
    await system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor /home/$USER/Desktop/new_text_file.txt');
    await agent.aiWaitFor("new_text_file.txt在deepin-editor中打开");
    
    // 在新文件中粘贴
    await system.exec('xdotool key ctrl+v');
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待粘贴完成
    
    // 验证粘贴成功，与之前复制的数据一致
    await agent.aiAssert("可以粘贴成功，文本编辑器下方显示字数 15000000", { deepThink: true });    
  }, { timeout: 1200000, tags: ['1882871', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    
    // 删除测试文件
    await system.exec('killall deepin-editor');
    await system.exec('rm -rf /home/$USER/Desktop/large_text_file.txt');
    await system.exec('rm -rf /home/$USER/Desktop/new_text_file.txt');

  });
});