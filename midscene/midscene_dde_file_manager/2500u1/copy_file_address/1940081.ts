/**
 * 用例 PMSID: 1940081
 * 用例标题: 【复制文件地址】复制最近使用目录中的文件地址
 * 生成时间: 2026-05-21 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const testPassword = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

// 定义长文件名（255个中文字符）
const longFileName = '一十一二三四五六七八九十百千万元大小多少上下左右来回东西南北前后内外出进开合有无好坏长短高低明美丑真假生熟冷热暖凉饱饿胖瘦老少病弱男女童牛马羊鱼虫鸟兽花草树木叶果根茎皮豆米面饭菜汤酒水火光烟云雾雨雪冰霜土石沙尘山川河海浪风雷电星月日天田地家户门窗桌椅床柜衣帽鞋袜手脸口目耳鼻舌牙发汗血泪米布纸笔墨书文字号话音诗词语句问答笑哭喊叫走跑跳飞看听吃喝咬吹打摔推拉抱捆找拾藏带买卖借还送赠收发放画写读背唱睡梦病治找见念忘记起思虑怕爱恨谢让帮请喊救命忙闲早前先向后跟离陪同独自共各并联合分半整双单零两几数只条匹块.txt';
// 定义特殊字符文件名
const specialCharFileName2 = '搜索专项！2$%……{【“.,.a.b.c.txt';
// 定义各类测试文件名称
const testFiles = {
  image: '1940081.png',
  video: '1940081.mp4',
  music: '1940081.wma',
  text: '1940081.txt',
  download: '1940081.sh',
  longName: longFileName,
  special2: specialCharFileName2
};


describe('1940081-【复制文件地址】复制最近使用目录中的文件地址', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log("1. beforeAll: 初始化测试套件，配置长文件名并创建各目录测试文件");
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

  });

  test('1940081-【复制文件地址】复制最近使用目录中的文件地址', async ({ device, system, agent, uos }) => {
    // 前置条件1：开启长文件名功能
    const { enableLongFileName,closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    //关闭所有已打开的文本文档
    await uos.openApp("文本编辑器", 3000);
    await device.pressKey("Win+Up");
    await closeAllTxt(agent, device); 

    // 前置条件：确保WPS已安装
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);  
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, "cn.wps.wps-office-pro");
    } else {
      console.log("wps已安装，不需要再安装");
    }

    const desktopHasWPS = await agent.aiBoolean("桌面上看到WPS文字图标");
    if (!desktopHasWPS) {
      await agent.aiTap("任务栏上的第一个图标，也就是启动器");
      await agent.aiHover("画板");
      await agent.aiScroll('画板', { direction: 'down', distance: 2000 });
      await agent.aiRightClick("启动器里的wps文字");
      const hasSendToDesktop = await agent.aiBoolean("是否看到发送到桌面选项");
      if (hasSendToDesktop) {
        console.log("检测到发送到桌面选项，点击发送到桌面");
        await agent.aiTap("发送到桌面");
      } else {
        console.log("未检测到发送到桌面选项，点击任务栏空白处");
        await agent.aiTap("任务栏空白处");
      }
    }    
    // 前置条件2：访问各类文件，使得最近使用目录中有这些文件
    console.log("===== 创建并访问各目录测试文件 =====");
    
    // 创建桌面文件并访问
    await system.exec(`echo "桌面测试内容" > /home/${userName}/Desktop/${testFiles.text}`);    
    // 创建图片目录文件并访问
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940081/${testFiles.image} /home/${userName}/Pictures/`);    
    // 创建视频目录文件并访问
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940081/${testFiles.video} /home/${userName}/Videos/`);    
    // 创建下载目录文件并访问
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940081/${testFiles.download} /home/${userName}/Downloads/`);    
    // 创建音乐目录文件并访问
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940081/${testFiles.music} /home/${userName}/Music/`);    
    // 创建长文件名文件并访问
    await system.exec(`echo "255字符长文件" >> /home/${userName}/Desktop/${testFiles.longName}`);    
    // 创建特殊字符文件并访问
    await system.exec(`echo "特殊字符文件2内容" >> /home/${userName}/Desktop/${testFiles.special2}`);    
    // 等待文件创建完成
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 访问各个文件，使其出现在最近使用目录中
    await uos.openApp("文件管理器", 3000, 20000, true);
   //先移除最近使用里所有文件
    await agent.aiTap("文件管理器左侧栏上的最近使用");    
    const isFolderEmpty = await agent.aiBoolean("是否看到文件夹为空提示");
    if (!isFolderEmpty) {
        console.log("文件夹不为空，执行清空操作");
        await device.pressKey('Ctrl+A');
        await device.pressKey('Delete');
        await agent.aiTap("移除按钮");
    } else {
        console.log("文件夹已为空，跳过清空操作");
    }
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 依次打开各个文件所在目录并打开文件
    console.log("===== 访问桌面文件 =====");
    await agent.aiTap("文件管理器左侧栏上的桌面");
    await agent.aiTap("文管右上角三个小正方形和三条横线的列表视图按钮");
    await agent.aiDoubleClick(`${testFiles.text}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Ctrl+W');
    await agent.aiTap("桌面空白处");
    await agent.aiDoubleClick(`${testFiles.longName}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Ctrl+W');
    
    // 访问图片目录
    console.log("===== 访问图片文件 =====");
    await agent.aiTap("文件管理器左侧栏上的图片");
    await agent.aiDoubleClick(`${testFiles.image}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await device.pressKey('Alt+F4');
    
    // 访问视频目录
    console.log("===== 访问视频文件 =====");
    await agent.aiTap("文件管理器左侧栏上的视频");
    await agent.aiDoubleClick(`${testFiles.video}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('Alt+F4');
    
    // 访问下载目录
    console.log("===== 访问下载文件 =====");
    await agent.aiTap("文件管理器左侧栏上的下载");
    await agent.aiDoubleClick(`${testFiles.download}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 出现显示就点击显示按钮
    const isOpen = await agent.aiBoolean("是否看到显示按钮");
    if (isOpen) {
      await agent.aiTap("显示");
      await new Promise(resolve => setTimeout(resolve, 2000)); 
    } else {
      console.log("不需要点击显示按钮");
    }   
    await device.pressKey('Ctrl+W');
    
    // 访问音乐目录
    console.log("===== 访问音乐文件 =====");
    await agent.aiTap("文件管理器左侧栏上的音乐");
    await agent.aiDoubleClick(`${testFiles.music}文件的图标`);
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('Alt+F4');
    const isExit = await agent.aiBoolean("是否看到退出文字");
    if (isExit) {
        console.log("关闭音乐");
        await agent.aiTap("退出");
        await agent.aiTap("确定按钮");
    } else {
        console.log("已退出音乐");
    }

    // 访问特殊字符文件
    console.log("===== 访问特殊字符文件 =====");
    await agent.aiTap("文件管理器左侧栏上的桌面");    
    await agent.aiDoubleClick(`${testFiles.special2}文件的图标`);
    await device.pressKey('Ctrl+W');

    // 打开文本编辑器
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('Alt', 'Tab');

    // 步骤1：进入文件管理器左侧栏的最近使用目录
    console.log("===== 步骤1：进入最近使用目录 =====");
    await agent.aiTap("文件管理器左侧栏上的最近使用");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤2：选中任意一个文件，按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
    console.log("===== 步骤2：复制单个最近使用文件地址 =====");
    // 选中一个文件（选择文本文件）
    await agent.aiTap(`${testFiles.text}文件的图标`);
    await device.pressKey('Ctrl', 'Shift', 'c');
    
    // 切换到文本编辑器粘贴
    await device.pressKey('Alt', 'Tab');
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Enter');
    await device.pressKey('Ctrl', 'V');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 预期结果2：文件地址粘贴成功，且路径正确
    const expectedTextPath = `/home/${userName}/Desktop/${testFiles.text}`;
    await agent.aiAssert(`文本编辑器里看到路径：${expectedTextPath}`);    
    // 关闭文本编辑器内容
    await device.pressKey('Ctrl+W');
    await agent.aiTap("不保存");


    // 步骤3：将复制的文件地址粘贴到文管地址栏中，检查是否可打开文件
    console.log("===== 步骤3：地址栏粘贴路径验证文件可打开 =====");
    // 复制另一个文件地址（使用图片文件）
    await agent.aiTap(`${testFiles.image}文件的图标`);
    await device.pressKey('Ctrl', 'Shift', 'c');
    
    // 在地址栏粘贴并回车
    await device.pressKey('Ctrl', 'L');
    await device.pressKey('Ctrl', 'A');
    await device.pressKey('Delete');
    await device.pressKey('Ctrl', 'V');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));    
    // 预期结果3：正常打开文件
    await agent.aiAssert(`成功打开${testFiles.image}`);    
    // 关闭打开的文件
    await device.pressKey('Alt+F4');

    // 步骤4&5&6：选中多个不同类型文件，按Ctrl+Shift+c复制文件地址，粘贴到word文档中
    console.log("===== 步骤4&5&6：选中多个不同类型文件，按Ctrl+Shift+c复制文件地址，粘贴到word文档中 =====");
    // 清空当前选择，选中多个不同类型文件
    await agent.aiTap("最近使用目录空白处");
    await device.pressKey('Ctrl', 'A');  
    await device.pressKey('Ctrl', 'Shift', 'c');
    
    // 打开WPS新建Word文档
    await device.pressKey('Win', 'D');
    await agent.aiDoubleClick("桌面上的WPS文字图标");
    
    // 处理WPS启动弹窗   
    const isAgreement = await agent.aiBoolean("是否看到许可协议窗口");
    if (isAgreement) {
        console.log("走同意协议流程打开wps");
        await agent.aiTap("许可协议窗口中已阅读的复选框");
        await agent.aiTap("许可协议窗口的确定按钮");
    } else {
        console.log("打开wps不需要走同意协议流程");
    }

    const isAuthorize = await agent.aiBoolean("是否看到授权已到期弹窗");
    if (isAuthorize) {
        console.log("闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
    } else {
        console.log("不需要关闭授权已到期弹窗");
    }

    await agent.aiWaitFor("WPS打开成功", { timeoutMs: 6000 });
    await agent.aiTap("新建");
    await agent.aiTap("文字");
    await agent.aiTap("空白文档");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 粘贴并验证
    await agent.aiTap("Word编辑区域空白处");
    await device.pressKey('Ctrl', 'V');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 预期结果4&5&6：文件地址粘贴成功，多个路径之间用换行分隔
    await agent.aiAssert(`Word文档里看到路径：/home/${userName}/Desktop/${testFiles.text}`);
    await agent.aiAssert(`Word文档里看到路径：/home/${userName}/Videos/${testFiles.video}`);
    await agent.aiAssert(`Word文档里看到路径：/home/${userName}/Music/${testFiles.music}`);
    await agent.aiAssert(`Word文档里看到路径：/home/${userName}/Desktop/${testFiles.longName}`);
    await agent.aiAssert(`Word文档里看到路径：/home/${userName}/Desktop/${testFiles.special2}`);
    await agent.aiAssert("多个路径之间用换行分隔");

  }, { timeout: 1800000, tags: ['1940081', 'level3', 'remote', '2500u1', 'copy_file_address', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 清理进程");

  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log("5. afterAll: 清理测试环境");
    // 删除所有创建的测试文件
    await system.exec(`rm -rf /home/${userName}/Desktop/${testFiles.text} /home/${userName}/Desktop/${testFiles.image} /home/${userName}/Desktop/${testFiles.longName} 2>/dev/null`);
    await system.exec(`rm -rf /home/${userName}/Desktop/${testFiles.special2}`);
    await system.exec(`rm -rf /home/${userName}/Pictures/${testFiles.image} /home/${userName}/Videos/${testFiles.video} 2>/dev/null`);
    await system.exec(`rm -rf /home/${userName}/Downloads/${testFiles.download} /home/${userName}/Music/${testFiles.music} 2>/dev/null`);
     // 关闭Word（不保存）
    await device.pressKey('Ctrl', 'W');
    await agent.aiTap("不保存按钮");
    await agent.aiRightClick("任务栏上的WPS图标");
    await agent.aiTap("关闭所有");    
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏上的桌面");
    await device.pressKey('Ctrl+1');
    await device.pressKey('Alt+F4');
    // 关闭所有相关进程
    await system.exec(`ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
});