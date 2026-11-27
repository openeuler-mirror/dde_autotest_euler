/**
 * 用例 PMSID: 1815999
 * 用例标题: 长文件名功能 - 卸载后，字符限制规则
 * 生成时间: 2026-08-06
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;

// 定义各步骤的长文件名常量
const folderName1 = "卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符限制规则卸载后字符";
const folderName2 = "smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!end";
const folderName3 = "2smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!smb123456,.!end";

describe('1815999-长文件名功能 - 卸载后，字符限制规则', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    console.log('清理步骤：删除文档目录下的测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName1}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName2}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName3}"`, 500);

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

  test('1815999-长文件名功能 - 卸载后，字符限制规则', async ({ device, agent, uos, system }) => {
    console.log('步骤1：打开文件管理器');
    await uos.openApp('文件管理器', 2000, 100000);
    await uos.maximizeWindow();
    await agent.aiWaitFor('文管窗口显示');

    console.log('步骤1：点击左侧栏的文档');
    await agent.aiTap('左侧栏的文档');
    await agent.aiWaitFor('文档目录已打开');

    console.log('步骤1：空白处右键创建长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName1);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件夹1创建成功（UI显示截断，通过命令行验证）');
    const folder1Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "卸载后.*字符"`);
    console.log('folder1Check.stdout:', folder1Check.stdout);
    if (folder1Check.stdout) {
      console.log('断言通过：文件夹1创建成功');
    } else {
      console.log('断言失败：文件夹1未创建');
      throw new Error('文件夹1未创建');
    }

    console.log('步骤2：空白处右键创建带特殊字符的长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName2);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件夹2创建成功（UI显示截断，通过命令行验证）');
    const folder2Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "smb123.*end"`);
    console.log('folder2Check.stdout:', folder2Check.stdout);
    if (folder2Check.stdout) {
      console.log('断言通过：文件夹2创建成功');
    } else {
      console.log('断言失败：文件夹2未创建');
      throw new Error('文件夹2未创建');
    }

    console.log('步骤3：空白处右键创建带特殊字符的长文件名文件夹');
    await agent.aiRightClick('空白区域');
    await agent.aiTap('新建文件夹');
    await device.typeText(folderName3);
    await device.pressKey('Enter');
    await agent.aiTap('空白区域');

    console.log('断言：文件夹3创建成功（UI显示截断，通过命令行验证）');
    const folder3Check = await system.exec(`ls /home/${process.env.TEST_USERNAME}/Documents/ | grep "2smb123456.*en"`);
    console.log('folder3Check.stdout:', folder3Check.stdout);
    if (folder3Check.stdout) {
      console.log('断言通过：文件夹3创建成功');
    } else {
      console.log('断言失败：文件夹3未创建');
      throw new Error('文件夹3未创建');
    }

  }, { timeout: 600000, tags: ['1815999', 'level2', 'longfilename', 'remote','DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    console.log('清理步骤：删除所有测试文件夹');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName1}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName2}"`, 500);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/"${folderName3}"`, 500);

    console.log('清理步骤：关闭文件管理器');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
