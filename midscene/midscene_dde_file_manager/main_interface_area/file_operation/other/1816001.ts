/**
 * 用例 PMSID: 1816001
 * 用例标题: 长文件名功能 - 字符限制规则
 * 生成时间: 2026-08-06
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

// 定义各步骤的长文件名常量
const fileName1 = "中";
const folderName2 = "长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则结结束";
const folderName3 = "长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则长文件名功能字符限制规则结已超过";
const fileName4 = "s";
const fileName5 = "smbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbend";
const fileName6 = "7smbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbsmbend";
const fileName7 = "中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文end";
const fileName8 = "8smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文smb中文中文end";
const folderName9 = "smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文!@#,.smb中文";

describe('1816001-长文件名功能 - 字符限制规则', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('清理步骤：删除文档目录下的测试文件和文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName1}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName2}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName3}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName4}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName5}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/7smb*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName7}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/8smb*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName9}"`, 500);

    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');

    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1816001-长文件名功能 - 字符限制规则', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：空白处右键创建名为"中"的文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName1);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');
    await agent.aiAssert(`名为${fileName1}的文件已创建`);

    console.log('步骤2：空白处右键创建长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName2);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');
    // await agent.aiAssert(`名为${folderName2}的文件夹已创建`);

    console.log('断言：长文件创建成功');
    await agent.aiAssert(`以"长文"开头" 结结束"结尾的文件夹存在`);
    console.log('断言通过：长文件名文件夹2创建成功');

    console.log('步骤3：空白处右键创建长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName3);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');
    await agent.aiAssert(`名为${folderName3}的文件夹已创建`);

    console.log('断言：文件夹创建成功，"长文"开头"已超"结束的文件夹');
    await agent.aiAssert(`以"长文"开头"已超"结尾的文件夹存在`);
    console.log('断言通过：长文件名文件夹3创建成功');

    console.log('步骤4：空白处右键创建"s"开头的文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName4);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');
    await agent.aiAssert(`名为${fileName4}的文件已创建`);

    console.log('断言：文件创建成功');
    await agent.aiAssert(`名为${fileName4}的文件存在`);
    console.log('断言通过：文件4创建成功');

    console.log('步骤5：空白处右键创建长文件名文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName5);
    await device.pressKey('Enter');
    await agent.aiWaitFor('文件创建成功');

    console.log('断言："smb"开头"nd"结束的文件创建成功');
    await agent.aiAssert(`以"smb"开头"end"结尾的文件存在`);
    console.log('断言通过：文件5创建成功');

    console.log('步骤6：空白处右键创建长文件名文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName6);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件6创建成功（UI显示截断，通过命令行验证）');
    const file6Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "^7smb.*mben$"`);
    console.log(file6Check.stdout);
    if (file6Check.stdout) {
      console.log('断言通过：文件6创建成功');
    } else {
      console.log('断言失败：文件6未创建');
      throw new Error('文件6未创建');
    }

    console.log('步骤7：空白处右键创建带中文的长文件名文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName7);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件7创建成功（UI显示截断，通过命令行验证）');
    const file7Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "^中文smb.*end$"`);
    if (file7Check.stdout) {
      console.log('断言通过：文件7创建成功');
    } else {
      console.log('断言失败：文件7未创建');
      throw new Error('文件7未创建');
    }

    console.log('步骤8：空白处右键创建带中文的长文件名文件');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件');
    await device.typeText(fileName8);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件8创建成功（UI显示截断，通过命令行验证）');
    const file8Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "^8smb.*中文en$"`);
    if (file8Check.stdout) {
      console.log('断言通过：文件8创建成功');
    } else {
      console.log('断言失败：文件8未创建');
      throw new Error('文件8未创建');
    }

    console.log('步骤9：空白处右键创建带特殊字符的长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName9);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件夹9创建成功（UI显示截断，通过命令行验证）');
    const folder9Check = await system.exec(`ls -d /home/${process.env.TEST_USERNAME}/Documents/smb中文*`);
    if (folder9Check.stdout) {
      console.log('断言通过：文件夹9创建成功');
    } else {
      console.log('断言失败：文件夹9未创建');
      throw new Error('文件夹9未创建');
    }

  }, { timeout: 600000, tags: ['1816001', 'level2', 'longfilename', 'remote', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：删除所有测试文件和文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName1}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName2}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName3}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName4}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName5}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/7smb*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${fileName7}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/8smb*`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName9}"`, 500);

    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall dde-file-manager');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
