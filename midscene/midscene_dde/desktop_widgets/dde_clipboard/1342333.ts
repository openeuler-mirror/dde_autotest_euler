/**
 * 用例 PMSID: 1342333
 * 用例标题: 【桌面】【剪贴板】从WPS各文档中复制文本后，可生成剪贴板文本记录
 * 生成时间: 2026-01-26 17:22:58
 * 用例编写人：UT000224(何权)
 */

describe("1342333-【桌面】【剪贴板】从WPS各文档中复制文本后，可生成剪贴板文本记录", () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");    
    // 确保剪贴板服务重启
    await system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    await system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1342333-从WPS各文档中复制文本后，可生成剪贴板文本记录",
    async ({ device, agent, uos, system }) => {
      //由于框架问题，先判断WPS是否安装
      await agent.aiWaitFor('桌面出现"WPS Office"图标', {
        timeoutMs: 1800000, // 查询 30分钟
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      console.log('修改配置文件');
      const modifyCmd = `sed -i '/\\[kdcsdk\\]/i\\common\\\\AcceptedEULA=true' ~/.config/Kingsoft/Office.conf`;
      await system.exec(modifyCmd);
      console.log('前置执行完成');
      // 步骤1: 在Excel文档中复制任意文本字符         
      // 启动WPS Office
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiDoubleClick('WPS Office');
      await agent.aiWaitFor("界面存在新建按钮", {
      timeoutMs: 30000, // 等待 30 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      console.log("步骤1: 在Excel文档中复制任意文本字符");
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('表格');
      await new Promise(resolve => setTimeout(resolve, 2000));

      await agent.aiTap('空白表格');
      await agent.aiWaitFor('电子表格界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 在Excel中输入文本
      const excelText1 = `Excel测试文本_${Date.now()}`;
      await device.typeText(excelText1);
      await agent.aiWaitFor(`电子表格中显示"${excelText1}"`, {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      
      // 复制Excel中的文本
      await agent.aiDoubleClick(`左上角A1单元格"${excelText1}"`);
      await device.pressKey("Ctrl", "a"); // 全选
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Ctrl", "c"); // 复制
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已显示", {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      await agent.aiAssert(`剪切板中有"${excelText1}"文本记录,该记录左上角显示类型是“文本”`);
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      console.log("步骤1验证通过：Excel中复制文本成功，生成了一条剪贴板记录");
      // 关闭Excel文档
      await system.exec("killall et wps wpp pdf wpsoffice");

      // 步骤3: 在Word文档中复制任意文本字符
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiDoubleClick('WPS Office');
      console.log("步骤3: 在Word文档中复制任意文本字符");
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('文字');
      await new Promise(resolve => setTimeout(resolve, 2000));

      await agent.aiTap('空白文档');
      await agent.aiWaitFor('文档界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 在Word中输入文本
      const wordText1 = `Word测试文本_${Date.now()}`;
      await device.typeText(wordText1);
      await agent.aiWaitFor(`文字处理中显示"${wordText1}"`, {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      
      // 复制Word中的文本
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已显示", {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      await agent.aiAssert(`剪切板中有"${wordText1}"文本记录`);
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      console.log("步骤3验证通过：Word中复制文本成功，生成了一条剪贴板记录");

      // 关闭Word文档 
      await system.exec("killall et wps wpp pdf wpsoffice");

      // 步骤5: 在PPT文档中复制任意文本字符
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiDoubleClick('WPS Office');      
      console.log("步骤5: 在PPT文档中复制任意文本字符");
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('演示');
      await agent.aiWaitFor('演示文稿模板界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
 
      await agent.aiTap('空白演示文稿');
      await agent.aiWaitFor('单击此处添加标题', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });

      // 在PPT中输入文本
      const pptText1 = `PPT测试文本_${Date.now()}`;
      await device.typeText(pptText1);
      await agent.aiWaitFor(`演示文稿中显示"${pptText1}"`, {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      
      // 复制PPT中的文本
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已显示", {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      await agent.aiAssert(`剪切板中有"${pptText1}"文本记录`);
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      console.log("步骤5验证通过：PPT中复制文本成功，生成了一条剪贴板记录");

      // 关闭PPT文档
      await system.exec("killall et wps wpp pdf wpsoffice");

      // 步骤7: 在PDF文档中复制任意文本字符
      console.log("步骤7: 在PDF文档中复制任意文本字符");      
      // 打开一个已有的PDF文件
      await system.exec(`wpspdf /usr/share/deepin-manual/manual-assets/application/dde-printer/打印机使用FAQ文档.pdf`);
      await agent.aiWaitFor('PDF文档已打开', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 选择并复制PDF中的文本
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已显示", {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      await agent.aiAssert(`剪贴板中有已打印机常见问题处理手册开头的文本记录`);
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      console.log("步骤7验证通过：PDF中复制文本成功，生成了一条剪贴板记录");
    },
    { timeout: 1800000, tags: ["1342333", "level2", "smoke","module:dde_clipboard"] },
  );

  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");    
    // 关闭WPS相关应用
    await system.exec("killall et wps wpp pdf wpsoffice  deepin-editor");    
    // 确保剪贴板服务正常
    system.exec(`systemctl --user restart dde-clipboard`);
  });
});