
/**
 * 用例 PMSID: 1940099
 * 用例标题:  【复制文件地址】复制U盘里的文件地址
 * 生成时间: 2026-05-18 10:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */
const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';
const testPassword = process.env.TEST_PASSWORD;
const testResourceDir = `${caseDir}midscene_dde_file_manager/resources/1940099`;
describe('1940099-【复制文件地址】复制U盘里的文件地址', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，安装WPS');
    await uos.showDesktop();
    
    // 前置条件2：安装cn.wps.wps-office-pro
    const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    try {
      console.log('===== 开始安装WPS Office Pro =====');
      await installDeb(system, 'cn.wps.wps-office-pro');
      console.log('WPS Office Pro安装完成');
    } catch (installError) {
      console.error('===== WPS安装失败 =====', installError.message);
      throw installError;
    }
  });
  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);  
  });
  test('1940099-【复制文件地址】复制U盘里的文件地址', async ({ device, system, agent, uos }) => {
      const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 确保文本编辑器没有缓存的打开的文件
    await uos.openApp("文本编辑器", 3000);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await closeAllTxt(agent, device); 

      // 获取U盘挂载路径
      const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
      const usbPath = usbPathResult.stdout.trim();
      if (!usbPath) {
        throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
      }
      
      // 复制1940099目录下所有文件到U盘（包含各类文件+特殊字符文件/文件夹）
      console.log('===== 复制测试资源文件到U盘 =====');
      await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1940099 ${usbPath}`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      // 步骤1：打开文件管理器并进入U盘
      console.log('===== 步骤1：进入U盘 =====');
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap(`文件管理器左侧栏的${usbFlash}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      // 预期结果1：成功进入u盘目录
      await agent.aiAssert(`成功进入名称为${usbFlash}的u盘目录`);
      
      // 步骤2：选中任意一个文件，Ctrl+Shift+C复制地址，粘贴到文本文件
      console.log('=====  步骤2：复制单个文件地址并验证 =====');
      await agent.aiDoubleClick("1940099文件夹");
      await agent.aiTap("左侧文件管理器窗口右上角同时有三个小正方形和三条横线的列表视图按钮");
      await agent.aiTap("搜索专项！2$%……{【“.,、 .a.b.c.txt文件图标");
      await device.pressKey('Ctrl','Shift','C');    
      
      // 粘贴到文本编辑器
      await agent.aiDoubleClick("1940099.txt文件图标");
      await device.pressKey('Win','Up');
      //await agent.aiTap("文本编辑器内空白处");
      await device.pressKey('Enter');
      await device.pressKey('Ctrl','V');
      // 预期结果2：路径正确
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert(`文本编辑器里看到路径：${usbPath}/1940099/搜索专项！2$%……{【“.,、 .a.b.c.txt`);
      
      // 关闭文本编辑器
      await device.pressKey('Ctrl','W');
      await agent.aiTap("不保存按钮");
      // 步骤3：将复制的文件地址粘贴到文管地址栏中，检查是否可打开文件
      console.log('===== 步骤3：地址栏粘贴路径并打开文件 =====');
      await device.pressKey('Ctrl','L');
      await device.pressKey('Ctrl','A');
      await device.pressKey('Delete');
      await device.pressKey('Ctrl','v');
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 4000));
      // 预期结果3：正常打开文件
      await device.pressKey('Win','Up');
      await agent.aiAssert("看到文字：点点滴滴多多多");
      await device.pressKey('Ctrl','W');
      //await agent.aiTap("任务栏上的文件管理器");      
      // 步骤4：选中多个不同类型文件，按Ctrl+Shift+c复制文件地址，粘贴到word文档中
      console.log('===== 步骤4：复制多文件地址到Word =====');
      //await agent.aiTap("<后退键");
      //await agent.aiAssert(`进入${usbFlash}目录`);
      await agent.aiTap("1940099.sh文件图标");
      await device.pressKey('Ctrl','A');
      await device.pressKey('Ctrl','Shift','C');
      
      // 打开WPS新建Word
      await device.pressKey('Win','D');
      await agent.aiDoubleClick("桌面上的WPS文字图标");
      // 新增：处理WPS启动时的许可协议弹窗

      const isAgreement = await agent.aiBoolean("是否看到许可协议窗口");
      if (isAgreement) {
        console.log("走同意协议流程打开wps");
        await agent.aiTap("许可协议窗口中已阅读的复选框");
        await agent.aiTap("许可协议窗口的确定按钮");
      } else {
        console.log("打开wps不需要走同意协议流程");
      }
      
      // 新增：处理WPS授权已到期弹窗
      const isAuthorize = await agent.aiBoolean("是否看到授权已到期弹窗");
      if (isAuthorize) {
        console.log("需要关闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
      } else {
        console.log("不需要关闭授权已到期弹窗");
      }
      
      // 原有WPS打开等待逻辑
      await agent.aiWaitFor("WPS打开成功", { timeoutMs: 6000 });
      await agent.aiTap("新建");
      await agent.aiTap("文字");
      await agent.aiTap("空白文档");
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // 粘贴验证
      await agent.aiTap("Word编辑区域空白处");
      await device.pressKey('Ctrl','V');
      // 预期结果4：路径正确+换行分隔
      await agent.aiAssert(`看到如下路径：${usbPath}/1940099/1940099.mp4、${usbPath}/1940099/1940099.png、${usbPath}/1940099/1940099.sh、${usbPath}/1940099/1940099.txt、${usbPath}/1940099/情非得已.mid、${usbPath}/1940099/搜索专项！2$%……{【“.,、 .a.b.c.txt、${usbPath}/1940099/有特殊字符+—）（）&……%￥@！RC!@$%^&()_+}{L （副本）.txt，且每个路径之间使用换行分隔`);
      // 步骤5：特殊字符文件/文件夹复制地址粘贴到Word
      console.log('===== 步骤5：复制特殊字符文件地址到Word =====');
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("u盘目录空白处");
      await agent.aiTap("有特殊字符+—）（）&……%￥@！RC!@$%^&()_+}{L （副本）.txt文件的图标");
      await device.pressKey('Ctrl','Shift','c');
      
      // 新建Word粘贴
      await agent.aiTap("任务栏上的WPS图标");
      await device.pressKey('End');
      await device.pressKey('Enter');
      await device.pressKey('Ctrl','V');
      
      // 预期结果5：路径正确+换行分隔
      await agent.aiAssert(`看到2个如下路径：${usbPath}/1940099/有特殊字符+—）（）&……%￥@！RC!@$%^&()_+}{L （副本）.txt`);      
      await device.pressKey('Ctrl','W');
      await agent.aiTap("不保存按钮");
      await agent.aiRightClick("任务栏上的WPS图标");
      await agent.aiTap("关闭所有");
  }, { timeout: 1800000, tags: ['1940099','level2','smoke','2500u1','DITT','lanyanling'] });
  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    // 关闭所有测试相关进程
    await system.exec(`ps aux |grep -E 'wps|dde-file-manager|deepin-editor' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
  afterAll(async ({ device, system, agent,uos }) => {
    console.log('5. afterAll: 清理U盘测试文件');
    // 获取U盘路径并删除所有测试文件
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -rf "${usbPath}"/1940099 2>/dev/null`);
    }
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap(`文件管理器左侧栏的${usbFlash}`);
    await device.pressKey('Ctrl+1');
    await device.pressKey('Alt+F4');
  });
});