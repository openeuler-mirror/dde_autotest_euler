/**
 * 用例 PMSID: 1939469
 * 用例标题: 【复制文件地址】复制回收站的文件地址
 * 生成时间: 2026-05-20 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const testPassword = process.env.TEST_PASSWORD;
const userName = process.env.TEST_USERNAME;

// 定义长文件名（255个中文字符）
const longFileName255 = '长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地址长文件名功能复制地11.txt';
// 定义各类测试文件名称
const testFiles = {
  txtFile: '1939469.txt',
  pictureFile: '1939469.png',
  videoFile: '1939469.mp4',
  downloadFile: '1939469.sh',
  musicFile: '1939469.mid',
  longName255: longFileName255
};

// 定义回收站路径
//const trashPath = '/home/uos/.local/share/Trash/files';
const trashPath = 'trash://';

describe('1939469-【复制文件地址】复制回收站的文件地址', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件，配置长文件名并创建回收站测试文件');
    await uos.showDesktop();

  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理环境
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 回到桌面
    await uos.showDesktop();
  });

  test('1939469-【复制文件地址】复制回收站的文件地址', async ({ device, system, agent, uos }) => {
    await uos.openApp("文件管理器", 3000, 20000, true);

    // 前置条件1：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 前置条件2&3：创建各类文件并删除到回收站
    console.log('===== 创建测试文件并删除到回收站 =====');
    // 桌面上创建文本文档并删除
    await system.exec(`echo "桌面测试文件" >> /home/${userName}/Desktop/${testFiles.txtFile}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的桌面");
    await agent.aiTap(`桌面上的${testFiles.txtFile}文件图标`);
    await device.pressKey('Delete');
    
    // 创建图片文件并删除
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1939469/${testFiles.pictureFile} /home/${userName}/Pictures/`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的图片");
    await agent.aiRightClick(`图片目录上的${testFiles.pictureFile}`);
    await agent.aiTap("删除");
    
    // 创建视频文件并删除
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1939469/${testFiles.videoFile} /home/${userName}/Videos/`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的视频");
    await agent.aiTap(`视频目录上的${testFiles.videoFile}文件图标`);
    await device.pressKey('Delete');
    
    // 创建下载文件并删除
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1939469/${testFiles.downloadFile} /home/${userName}/Downloads/`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的下载");
    await agent.aiTap(`下载目录上的${testFiles.downloadFile}文件图标`);
    await device.pressKey('Delete');
    
    // 创建音乐文件并删除
    await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1939469/${testFiles.musicFile} /home/${userName}/Music/`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的音乐");
    await agent.aiTap(`音乐目录上的${testFiles.musicFile}文件图标`);
    await device.pressKey('Delete');
    
    // 创建255字符长文件名文件并删除
    await system.exec(`echo "255字符长文件" > /home/${userName}/Desktop/${testFiles.longName255}`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiTap("文件管理器左侧栏上的桌面");
    await agent.aiTap(`桌面上的${testFiles.longName255}文件图标`);
    await device.pressKey('Delete');
    
    //关闭文管
    await device.pressKey('Alt+F4');

    // 打开文本编辑器并粘贴
    await agent.aiTap("任务栏上的第一个图标，也就是启动器");
    await agent.aiTap("启动器里的搜索框");
    await device.typeText('文本编辑器');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤1：双击桌面上的回收站图标进入回收站
    console.log('===== 步骤1：进入回收站 =====');
    await agent.aiDoubleClick("桌面上的回收站图标");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("成功进入回收站");

    // 步骤2：选中任意一个文件，按Ctrl+Shift+c复制文件地址，粘贴到文本文件中
    console.log('===== 步骤2：复制单个回收站文件地址 =====');
    // 选中图片文件
    await agent.aiTap(`${testFiles.pictureFile}文件图标`);
    await device.pressKey('Ctrl','Shift','c');
    await device.pressKey('Alt+Tab');
    await agent.aiTap("文本编辑器内空白处");
    await device.pressKey('Enter');
    await device.pressKey('Ctrl','V');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 预期结果2：文件地址粘贴成功，且路径正确
    const expectedPicPath = `${trashPath}/${testFiles.pictureFile}`;
    await agent.aiAssert(`文本编辑器里看到路径：${expectedPicPath}`);
    
    // 关闭文本编辑器（不保存）
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");

    // 步骤3：选中多个不同类型文件，按Ctrl+Shift+c复制文件地址，粘贴到word文档中
    console.log('===== 步骤3&4：复制多个回收站文件地址到Word =====');
    // 全选回收站中的普通类型文件
    await agent.aiTap("回收站窗口空白处");
    await device.pressKey('Ctrl','A');   
    await device.pressKey('Ctrl','Shift','C');
    
    // 打开WPS新建Word文档
    await device.pressKey('Win','D');
    await agent.aiDoubleClick("桌面上的WPS文字图标");
    
    // 处理WPS启动弹窗
    try {
      await agent.aiWaitFor("许可协议窗口", { timeoutMs: 3000 });
      await agent.aiTap("许可协议窗口中已阅读的复选框");
      await agent.aiTap("许可协议窗口的确定按钮");
    } catch (err) {
      console.log('===== 未检测到WPS许可协议弹窗，跳过处理 =====');
    }
    
    try {
      await agent.aiWaitFor("授权已到期弹窗", { timeoutMs: 3000 });
      await agent.aiTap("授权已到期弹窗右上角的x按钮");
    } catch (err) {
      console.log('===== 未检测到WPS授权已到期弹窗，跳过处理 =====');
    }
    
    await agent.aiWaitFor("WPS打开成功", { timeoutMs: 6000 });
    await agent.aiTap("新建");
    await agent.aiTap("文字");
    await agent.aiTap("空白文档");
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 粘贴并验证
    await agent.aiTap("Word编辑区域空白处");
    await device.pressKey('Ctrl','V');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 预期结果3：文件地址粘贴成功，且路径正确，多个路径之间用换行分隔
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.txtFile}`);
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.pictureFile}`);
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.videoFile}`);
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.downloadFile}`);
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.musicFile}`);
    await agent.aiAssert(`文本编辑器里看到路径：${trashPath}/${testFiles.longName255}`);
    await agent.aiAssert("多个路径之间用换行分隔");
  
    // 关闭Word（不保存）
    await device.pressKey('Ctrl','W');
    await agent.aiTap("不保存按钮");
    await agent.aiRightClick("任务栏上的WPS图标");
    await agent.aiTap("关闭所有");

    // 步骤5：粘贴到文管地址栏中，检查是否可打开文件
    console.log('===== 步骤5：验证回收站文件地址可打开 =====');
    // 切回回收站窗口
    await device.pressKey('Alt','Tab');
    // 复制图片文件地址
    await agent.aiTap(`${testFiles.pictureFile}文件图标`);
    await device.pressKey('Ctrl','Shift','C');
    
    // 打开文件管理器地址栏粘贴
    await device.pressKey('Ctrl','L');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');
    await device.pressKey('Ctrl','V');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // 预期结果5：可打开文件
    await agent.aiAssert(`成功打开${testFiles.pictureFile}`);
    
    // 关闭文件
    await device.pressKey('Ctrl','W');

  }, { timeout: 1800000, tags: ['1939469','level3','remote','2500u1','copy_file_address','DITT','lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');

  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试环境');
    // 清理回收站测试文件
    await system.exec(`rm -rf ${trashPath}/1939469* ${trashPath}/${longFileName255}`);
    // 关闭所有测试相关进程
    await system.exec(`ps aux |grep -E 'wps|dde-file-manager|deepin-editor' | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
});