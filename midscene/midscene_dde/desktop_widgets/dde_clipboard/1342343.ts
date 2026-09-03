/**
 * 用例 PMSID: 1342343
 * 用例标题: 【桌面】【剪贴板】复制文本类信息后，可以粘贴到WPS各文档中
 * 生成时间: 2026-01-28 09:59:21
 * 用例编写人：UT000224(何权)
 */

describe("1342343-【桌面】【剪贴板】复制文本类信息后，可以粘贴到WPS各文档中", () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");    
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1342343-复制文本类信息后，可以粘贴到WPS各文档中",
    async ({ device, agent, uos, system }) => {
      // 步骤1: 打开文本编辑器，复制任意多个文本字符
      console.log("步骤1: 打开文本编辑器，复制任意多个文本字符");
      await uos.openApp('文本编辑器');
      await agent.aiWaitFor("文本编辑器界面已显示", {
        timeoutMs: 30000, // 等待 30 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      
      // 输入一些文本
      await device.pressKey("Ctrl", "t");
      const textEditorText = `文本编辑器测试文本_${Date.now()}`;
      await device.typeText(textEditorText);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 选择并复制文本
      await system.exec(`xdotool key Ctrl+a`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec(`xdotool key Ctrl+c`);    
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 打开剪贴板查看记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已显示", {
        timeoutMs: 10000,
        checkIntervalMs: 2000,
      });
      await agent.aiAssert(`剪切板中有"${textEditorText}"文本记录,该记录左上角显示类型是“文本”`);
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      console.log("步骤1验证通过：可以从文本编辑器成功复制文本");

      // 步骤2: 分别粘贴到wps的相关文档excel，word，ppt
      console.log("步骤2: 分别粘贴到wps的相关文档excel，word，ppt");
      
      // 启动WPS Office
      await agent.aiDoubleClick('WPS Office');
      await agent.aiWaitFor("界面存在新建按钮", {
        timeoutMs: 30000, // 等待 30 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      
      // 测试粘贴到Excel
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
      
      // 粘贴文本到Excel
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`电子表格中显示"${textEditorText}"`);
      console.log("Excel中粘贴成功");
      
      // 关闭Excel
      await system.exec(`xdotool key Ctrl+F4`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('不保存');
      await new Promise(resolve => setTimeout(resolve, 1000));

      //打开workd
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('文字');
      await agent.aiTap('空白文档');
      await agent.aiWaitFor('文档界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 粘贴文本到Word
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`文档中显示"${textEditorText}"`);
      
      // 关闭Word
      await system.exec(`xdotool key Ctrl+F4`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('不保存');
      await new Promise(resolve => setTimeout(resolve, 1000));

      //打开PPT
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('演示');
      await agent.aiTap('空白演示文稿');
      await agent.aiWaitFor('演示文稿界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 粘贴文本到PPT
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`文档中显示"${textEditorText}"`);
      
      // 关闭WPS相关应用
      await system.exec("killall et wps wpp pdf wpsoffice");
      console.log("步骤2验证通过：文本可以正常粘贴到WPS的各个文档excel，word，ppt中");

      // 步骤3: 打开浏览器网页，复制任意多个文本字符
      console.log("步骤3: 打开浏览器网页，复制任意多个文本字符");
      system.exec('/usr/bin/browser "pms.uniontech.com"');
      await agent.aiWaitFor("浏览器已打开");
      
      // 等待浏览器窗口获得焦点
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 点击页面确保焦点
      await agent.aiAction("点击浏览器的蓝色背景部分");
      
      // 等待点击操作完成和页面响应
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 执行全选操作
      system.exec('xdotool key --window "browser" "Ctrl+a"');
      
      // 等待全选操作完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 执行复制操作
      await agent.aiRightClick("点击浏览器的蓝色背景部分");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap('点击复制')
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec(`xdotool key Ctrl+F4`);

      // 步骤4: 再分别粘贴到wps的相关文档excel，word，ppt
      console.log("步骤4: 再分别粘贴到wps的相关文档excel，word，ppt");
      
      // 重新启动WPS Office
      // 启动WPS Office
      await agent.aiDoubleClick('WPS Office');
      await agent.aiWaitFor("界面存在新建按钮", {
        timeoutMs: 30000, // 等待 30 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      
      // 测试粘贴到Excel
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
      
      // 粘贴文本到Excel
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`电子表格中显示"统信软件技术有限公司项目管理系统"等内容`);
      console.log("Excel中粘贴成功");
      
      // 关闭Excel
      await system.exec(`xdotool key Ctrl+F4`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('不保存');
      await new Promise(resolve => setTimeout(resolve, 1000));

      //打开workd
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('文字');
      await agent.aiTap('空白文档');
      await agent.aiWaitFor('文档界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 粘贴文本到Word
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`文档中显示"统信软件技术有限公司项目管理系统"等内容`);
      
      // 关闭Word
      await system.exec(`xdotool key Ctrl+F4`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap('不保存');
      await new Promise(resolve => setTimeout(resolve, 1000));

      //打开PPT
      await agent.aiTap('新建');
      await agent.aiWaitFor('出现新建文档选项', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      await agent.aiTap('演示');
      await agent.aiTap('空白演示文稿');
      await agent.aiWaitFor('演示文稿界面已显示', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });
      
      // 粘贴文本到PPT
      await device.pressKey("Ctrl", "v"); // 粘贴
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert(`页面中显示"统信软件技术有限公司项目管理系统"等内容`);
      
      // 关闭WPS相关应用
      await system.exec("killall et wps wpp pdf wpsoffice");
      console.log("步骤2验证通过：文本可以正常粘贴到WPS的各个文档excel，word，ppt中");

      
      // 关闭所有WPS应用
      await system.exec("killall et wps wpp pdf wpsoffice");
      console.log("步骤4验证通过：从浏览器复制的文本可以正常粘贴到WPS的各个文档excel，word，ppt中");
    },
    { timeout: 1200000, tags: ["1342343", "level2", "smoke","module:dde_clipboard"] },
  );

  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    
    // 关闭WPS相关应用
    await system.exec("killall et wps wpp pdf wpsoffice browser deepin-editor");
    
    // 确保剪贴板服务正常
    system.exec(`systemctl --user restart dde-clipboard`);
  });
});