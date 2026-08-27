/**
 * 用例 PMSID: 1882869
 * 用例标题: 【稳定性】【桌面】【剪贴板】复制10M内大量文本数据，生成剪贴板记录正常
 * 生成时间: 2026-01-28 16:26:45
 * 用例编写人：UT000224(何权)
 */

describe('1882869-【稳定性】【桌面】【剪贴板】复制10M内大量文本数据，生成剪贴板记录正常', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    system.exec(`systemctl --user restart dde-clipboard`);
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1882869-【稳定性】【桌面】【剪贴板】复制10M内大量文本数据，生成剪贴板记录正常', async ({ device, agent, uos, system }) => {
    // 步骤1: 创建测试文件，打开纯文本文件，进行全选后复制，再打开剪贴板
    await system.exec(`tr -dc 'A-Za-z0-9 \n' < /dev/urandom | head -c 10000000 > /home/$USER/Desktop/10M_text_file.txt`);
    await new Promise(resolve => setTimeout(resolve, 12000));
    // 打开文本文件（使用文本编辑器）
    await system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor /home/$USER/Desktop/10M_text_file.txt');
    await agent.aiWaitFor("文本编辑器已打开");
    
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
    await agent.aiAssert("右侧剪贴板列表存在一条文本记录，记录下方显示“10000000个字符");
    
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
    await agent.aiAssert("可以粘贴成功，文本编辑器下方显示字数 10000000");    
  }, { timeout: 1200000, tags: ['1882869', 'level3'] });

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
    await system.exec('rm -rf /home/$USER/Desktop/*_text_file.txt');
    await system.exec('rm -rf /home/$USER/Desktop/new_text_file.txt');
    await system.exec(`systemctl --user restart dde-clipboard`);

  });
});