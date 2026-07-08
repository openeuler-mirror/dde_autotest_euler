/**
 * 用例 PMSID: 1808249
 * 用例标题: 桌面刷新优化-快捷键-按F5刷新桌面
 * 生成时间: 2026-01-20 20:51:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1808249-桌面刷新优化-快捷键-按F5刷新桌', () => {

  let isLaptop = false; // 用于保存设备类型检测结果

  // 前置：初始化+清理旧数据
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    //检查该测试机器是笔记本或台式机
    const result = await system.exec("ls /sys/class/power_supply/");
    //打印出上面命令执行的结果：结果执行存在BAT 则表示是笔记本，否则是台式机
    console.log('电源设备列表:', result);

    // system.exec 返回的是一个对象，需要检查 stdout 或 stderr 属性
    const output = result.stdout || result.stderr || '';
    if (output.includes('BAT')) {
      console.log('检测到笔记本设备（存在电池BAT）');
      isLaptop = true;
    } else {
      console.log('检测到台式机设备（无电池）');
      isLaptop = false;
    }
  });

  // 每个测试前的准备（空实现，预留扩展）
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808249-桌面刷新优化-快捷键-按F5刷新桌面', async ({ device, agent, uos, system, env }) => {

    // 复制文件到桌面
    await system.exec('mkdir -p ~/Desktop/test  && touch ~/Desktop/test.txt');

    //步骤1：在桌面按F5 ,检查刷新响应，如果是笔记本则执行 Fn+F5 ,否则执行F5
    if (isLaptop) {
      console.log('检测到笔记本，执行 Fn+F5');
     // await system.exec(`xdotool key Fn+F5`);
      await device.pressKey('Fn+F5');
    } else {
      console.log('检测到台式机，执行 F5');
      //await system.exec(`xdotool key F5`);
      await device.pressKey('F5');
    }
    await agent.aiAssert("按F5的过程中桌面图标出现过一次闪烁");

    //步骤2： 桌面选中一个文件夹
    await agent.aiTap('test');
    if (isLaptop) {
      //await system.exec(`xdotool key Fn+F5`);
      await device.pressKey('Fn+F5');
    } else {
      //await system.exec(`xdotool key F5`);
      await device.pressKey('F5');
    }
    await agent.aiAssert("按F5的过程中，test文件未选中，桌面图标出现过一次闪烁");

    await agent.aiTap('test.txt');
    if (isLaptop) {
      //await system.exec(`xdotool key Fn+F5`);
      await device.pressKey('Fn+F5');
    } else {
      //await system.exec(`xdotool key F5`);
      await device.pressKey('F5');
    }
    await agent.aiAssert("按F5的过程中，test.txt文件未选中，桌面图标出现过一次闪烁");

    //步骤3： 多次按F5，检查界面显示
    //获取桌面的图标以及数量
    // 获取当前桌面下的文件数量和图标信息
    
    // 首先获取初始桌面状态
    const initialDesktopState = await system.exec('ls -1 ~/Desktop/ | grep -v "^$" | wc -l');
    const initialFileCount = parseInt(initialDesktopState.stdout ? initialDesktopState.stdout.trim() : '0');
    console.log(`初始桌面文件数量: ${initialFileCount}`);
    
    // 获取初始文件列表用于对比
    const initialFileList = await system.exec('ls -1 ~/Desktop/');
    let initialFiles = [];
    if (initialFileList.stdout) {
      initialFiles = initialFileList.stdout.trim().split('\n').filter(f => f);
    }
    console.log('初始桌面文件列表:', initialFiles);
    
    for (let i = 0; i < 5; i++) {
      if (isLaptop) {
        //await system.exec(`xdotool key Fn+F5`);
        await device.pressKey('Fn+F5');
      } else {
        //await system.exec(`xdotool key F5`);
        await device.pressKey('F5');
      }
      
      // 每次刷新后检查桌面状态
      const currentDesktopState = await system.exec('ls -1 ~/Desktop/ | grep -v "^$" | wc -l');
      const currentFileCount = parseInt(currentDesktopState.stdout ? currentDesktopState.stdout.trim() : '0');
      
      // 获取当前文件列表
      const currentFileList = await system.exec('ls -1 ~/Desktop/');
      let currentFiles = [];
      if (currentFileList.stdout) {
        currentFiles = currentFileList.stdout.trim().split('\n').filter(f => f);
      }
      
      console.log(`第${i + 1}次刷新后 - 文件数量: ${currentFileCount}`);
      console.log('当前文件列表:', currentFiles);
      
      // 检查文件数量和列表是否发生变化
      if (currentFileCount !== initialFileCount) {
        throw new Error(`文件数量发生变化: 初始${initialFileCount}个，当前${currentFileCount}个`);
      }
      
      // 检查文件列表是否一致
      const filesChanged = initialFiles.length !== currentFiles.length || 
                          initialFiles.some((file, index) => file !== currentFiles[index]);
      if (filesChanged) {
        throw new Error('桌面文件列表发生变化');
      }
      
      await agent.aiAssert("桌面除了test文件夹和test.txt文件之外，文件数量、图标等未发生变化");
    }

  }, { timeout: 600000, tags: ["1808249", "level3", "file_manager", "yefei"] });
  // 延长超时（4张图片需更多时间）

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent }) => {
    console.log('3. afterAll: 清理测试残留');
    // 删除桌面的测试目录
    await system.exec(`rm -rf ~/Desktop/test && rm -rf ~/Desktop/test.txt `);
  });
}); 
