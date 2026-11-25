/**
 * 用例 PMSID: 1806429
 * 用例标题: 文管选择窗-WPS调用_
 * 生成时间: 2026-10-28 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const usbFlash = process.env.USB_FLASH || 'uos';
const testPassword = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

describe('1806429-文管选择窗-WPS调用_', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 前置条件：确保WPS已安装
    const hasWPS = await system.exec(`dpkg -l | grep cn.wps.wps-office-pro | grep ii | wc -l`);
    if (parseInt(hasWPS.stdout.trim(), 10) === 0) {
      const { installDeb } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await installDeb(system, 'cn.wps.wps-office-pro');
    } else {
      console.log('wps已安装，不需要再安装');
    }

    // 确保桌面上有WPS文字图标
    const desktopHasWPS = await agent.aiBoolean('桌面上是否有WPS文字图标');
    if (!desktopHasWPS) {
      console.log('桌面上没有WPS文字图标，尝试添加');
      await agent.aiTap('任务栏上的第一个图标，也就是启动器');
      await agent.aiHover('影院');
      await agent.aiScroll('影院', { direction: 'down', distance: 2000 });
      await agent.aiRightClick('启动器里的WPS文字');
      await agent.aiTap('发送到桌面');
    } else {
      console.log('桌面上已有WPS文字图标');
      await agent.aiTap('任务栏空白处');
    }

    // 前置条件：准备桌面测试文档
    const desktopDir = `/home/${userName}/Desktop`;
    const docPath = `${desktopDir}/1806429.doc`;
    console.log(`===== 准备桌面测试文档: ${docPath} =====`);
    // 先复制测试资源到桌面（若资源目录中存在），否则用系统命令生成一个简单doc
    await system.exec(`cp -f ${caseDir}midscene_dde_file_manager/resources/1806429/1806429.doc /home/${userName}/Desktop/ 2>/dev/null || true`);

    // 确保目标目录 ~/Documents/test 存在
    await system.exec(`mkdir -p /home/${userName}/Documents/test`);
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment} = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 清理可能残留的另存文件
    await system.exec(`rm -f /home/${userName}/Documents/test/*.docx /home/${userName}/Documents/test/*.doc 2>/dev/null || true`);
    await system.exec(`rm -f /home/${userName}/*.docx /home/${userName}/*.doc 2>/dev/null || true`);
  });

  test('1806429-文管选择窗-WPS调用_', async ({ device, system, agent, uos, env }) => {
    const desktopDir = `/home/${userName}/Desktop`;

    // 获取U盘挂载路径（用于另存为到U盘）
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (!usbPath) {
      throw new Error(`未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
    }

    // 公共函数：处理WPS启动时的各类弹窗
    async function handleWpsPopups() {
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
        console.log("需要关闭授权已到期弹窗");
        await agent.aiTap("授权已到期弹窗右上角的x按钮");
      } else {
        console.log("不需要关闭授权已到期弹窗");
      }

      const isConform = await agent.aiBoolean("是否看到WPS告警窗口");
      if (isConform) {        
        await agent.aiTap("确定按钮");
      } else {
        console.log("wps兼容，不需要额外设置");
      }

      // 新增：处理WPS试用提示弹窗
      const isTry = await agent.aiBoolean("是否看到试用弹窗");
      if (isTry) {
        console.log("需要关闭试用弹窗");
        await agent.aiTap("试用弹窗右上角的x按钮", { deepThink: true });
      } else {
        console.log("不需要关闭试用弹窗");
      } 

    }

    // ==================== 步骤1：打开WPS文字，文件-打开-打开桌面上的1806429.doc ====================
    console.log('===== 步骤1：打开WPS文字并通过“文件-打开”打开桌面上的1806429.doc =====');
    await device.pressKey('Win', 'D');
    await agent.aiDoubleClick('WPS文字');
    await new Promise(resolve => setTimeout(resolve, 5000));
    await handleWpsPopups();
    await agent.aiWaitFor('WPS打开成功', { timeoutMs: 10000 });

    // 文件-打开
    await agent.aiTap('打开按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 在打开对话框中输入完整路径并打开
    await agent.aiTap("文件选择对话框中左侧的'桌面'");
    await agent.aiTap("1806429.doc文件的图标");
    await agent.aiTap("打开按钮");

    // 预期结果1：能够打开成功
    await agent.aiAssert('WPS文字中成功打开了1806429.doc文档，且文档处于编辑状态');
    console.log('===== 步骤1验证通过：文档打开成功 =====');

    // ==================== 步骤2：新建文档，另存为到不同目录 ====================
    console.log('===== 步骤2：新建1个文档，选择另存为到不同目录 =====');
    // 新建空白文档
    await agent.aiTap("WPS左上角的'文件'");
    await agent.aiTap('新建(N)');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('WPS新建文档打开成功', { timeoutMs: 10000 });

    // 定义需要另存为的目标目录
    const saveTargets = [
      {
        name: '~/Documents/test',
        dirPath: `/home/${userName}/Documents/test`,
        fileName: '1806429_save_docstest.docx',
        dirNavDesc: 'Documents目录下的test文件夹的图标',
      },
      {
        name: '主目录',
        dirPath: `/home/${userName}`,
        fileName: '1806429_save_home.docx',
        dirNavDesc: '文件管理器左侧栏的主目录',
      },
      {
        name: 'U盘',
        dirPath: usbPath,
        fileName: '1806429_save_usb.docx',
        dirNavDesc: `文件管理器左侧栏的浏览`,
      },
    ];

    for (const target of saveTargets) {
      console.log(`===== 另存为到${target.name} =====`);

      // 触发另存为
      await agent.aiTap("WPS左上角的'文件'");
      await agent.aiTap('另存为');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("文件对话框中的'主目录'");
      await agent.aiDoubleClick("文件对话框中的'文档'");

      // 导航到目标目录
      await agent.aiTap(target.dirNavDesc);

      // 若目标为 ~/Documents/test，还需要进入 test 文件夹
      if (target.name === '~/Documents/test') {
        await agent.aiDoubleClick('test文件夹');
      }

      // 若目标为 U盘，还需要进入 U盘
      if (target.name === 'U盘') {
        await agent.aiDoubleClick("文件保存对话框中的'UOS'");
      }

      // 在文件名输入框中填写文件名
      await agent.aiTap('另存为对话框中的文件名输入框');
      await device.pressKey('Ctrl', 'A');
      await device.pressKey('Delete');
      await agent.aiInput(target.fileName, '另存为对话框中的文件名输入框');
      await agent.aiTap('保存按钮');

      // 若出现“文件已存在，是否替换”提示，选择替换
      const isReplace = await agent.aiBoolean('是否出现文件已存在是否替换的提示');
      if (isReplace) {
        await agent.aiTap('替换按钮');
      }

      // 若出现格式兼容提示，选择“使用 Word 格式”
      const isFormatWarn = await agent.aiBoolean("是否出现'另存为新格式'确认弹窗");
      if (isFormatWarn) {
        await agent.aiTap('保存新格式按钮');
      }

      // 预期结果2：文件保存到不同目录都成功（文件系统层面校验）
      if (target.dirPath) {
        const exists = await system.exec(`ls "${target.dirPath}/${target.fileName}" 2>/dev/null | wc -l`);
        const existsCount = parseInt(exists.stdout.trim(), 10);
        if (existsCount === 0) {
          throw new Error(`另存为到${target.name}失败，未找到文件：${target.dirPath}/${target.fileName}`);
        }
        console.log(`===== 另存为到${target.name}成功：${target.dirPath}/${target.fileName} =====`);
      } 
    }

    // 关闭当前文档
    await device.pressKey('Ctrl', 'W');
      // 若出现“不保存”提示，选择不保存
      const isSave = await agent.aiBoolean('是否出现保存文档提示窗口');
      if (isSave) {
        await agent.aiTap('不保存按钮');
      }    
    await agent.aiRightClick('任务栏上的WPS图标');
    await agent.aiTap('关闭所有');

  }, { timeout: 1800000, tags: ['1806429', 'level3', 'main_interface_area', 'external_service', 'file_selection_dialog','DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec(`ps aux |grep -E 'wps|dde-file-manager' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async ({ device, system, agent, uos }) => {
    console.log('5. afterAll: 清理测试文件');

    // 清理另存为产生的测试文件
    await system.exec(`rm -f /home/${userName}/Documents/test/1806429_save_docstest.docx 2>/dev/null || true`);
    await system.exec(`rm -f /home/${userName}/1806429_save_home.docx 2>/dev/null || true`);
    await system.exec(`rm -f /home/${userName}/Desktop/1806429.doc 2>/dev/null || true`);

    // 清理U盘上的测试文件
    const usbPathResult = await system.exec(`df -h | grep ${usbFlash} | awk '{print $6}'`);
    const usbPath = usbPathResult.stdout.trim();
    if (usbPath) {
      await system.exec(`rm -f "${usbPath}"/1806429_save_usb.docx 2>/dev/null || true`);
    }

    // 清理文件管理器进程
    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});