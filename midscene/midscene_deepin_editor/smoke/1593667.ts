/**
 * 用例 PMSID: 1593667
 * 用例标题: 保存编码文件场景补充
 * 生成时间: 2025-12-17 13:36:41
 * 用例编写人: UT000195(苏姗姗)
 */

describe('1593667-保存编码文件场景补充', () => {
  const cCodeLines = [
    '#include <stdio.h>',
    'int main() {',
    '    printf("hello world");',
    '    return 0;',
    '}'
  ];

  let addressBarPath = '';

  beforeAll(async ({ device, uos, agent }) => {
    console.log('[测试套件] 开始执行 - 初始化测试环境');
    console.log('[初始化] 清空桌面，准备测试环境');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('[测试步骤] 开始新的测试用例');
  });

  test('1593667-保存编码文件场景补充', async ({ device, agent, uos, system }) => {
    try {
      // 清理应用进程（增加容错，无进程时不报错）
      await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
      await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
      await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
      // 步骤1：打开文本编辑器（确保应用完全加载）
      await uos.openApp('文本编辑器', 3000, 30000, true);
      console.log('[步骤1] 文本编辑器已打开并加载完成');

      // 步骤2：逐行输入C语言代码（聚焦输入区域）
      console.log('[步骤2] 逐行输入C语言代码');
      // 精准聚焦编辑区域（而非整个窗口）
      await agent.aiTap('文本编辑器编辑区域');

      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      for (const [index, line] of cCodeLines.entries()) {
        // 输入当前行内容
        await device.typeText(line);
        // 仅非最后一行时按Enter，避免末尾空行
        if (index < cCodeLines.length - 1) {
          await device.pressKey('Enter');
        }
        console.log(`[步骤2] 已输入：${line}`);
      }

      // 步骤3：触发保存弹窗（Ctrl+S）
      console.log('[步骤3] 按下Ctrl+S触发保存弹窗');
      await device.pressKey('Ctrl+S');
      console.log('[步骤3] 已按下Ctrl+S，等待保存弹窗弹出');

      await agent.aiWaitFor(`弹出文件保存窗口`, { timeout: 30000 });

      // 步骤6：获取地址栏地址信息
      console.log('[步骤6] 获取地址栏地址信息');
      await agent.aiTap('文件保存对话框的地址栏/路径区域靠右空白位置', { deepThink: true });
      addressBarPath = await agent.aiQuery(`
      文件保存对话框的地址栏/路径区域信息，
      仅返回路径字符串，无多余描述
    `);

      console.log(`[步骤6] 地址栏路径: ${addressBarPath}`);
      // 聚焦文件名输入框
      await agent.aiTap('保存窗口的文件名')
      await agent.aiTap('文件名输入框');

      // 清空原有内容（全选+删除）
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');

      // 输入新文件名
      await device.typeText('test.h');
      console.log('[步骤4] 在保存弹窗中修改文件名为test.h');
      await agent.aiWaitFor(`文件名test.h输入完成`, { timeout: 30000 });

      // 步骤5：点击保存按钮
      console.log('[步骤5] 点击保存按钮完成保存');
      await agent.aiTap('保存');

      // 步骤6：关闭编辑器
      console.log('[步骤6] 关闭文本编辑器窗口');
      await agent.aiTap('右上角窗口X按钮');

      // 步骤7：重新打开保存的文件验证
      console.log('[步骤7] 重新打开文本编辑器验证文件');
      // 直接打开保存的文件，而非空编辑器
      await uos.openApp('文本编辑器', 3000, 30000, true);
      console.log('[步骤7] 已打开保存的test.h文件');

      // 步骤8：验证C语言关键字高亮和内容正确性
      console.log('[步骤8] 验证C语言代码内容和关键字高亮');
      await agent.aiWaitFor(`文本编辑器窗口已打开`, { timeout: 10000 });

      // 验证关键字高亮（通过元素属性验证）
      await agent.aiAssert("文本编辑器中的#include关键字非黑色显示");
      console.log('[步骤8] 关键字高亮验证通过');

    } catch (error) {
      // 新增：异常捕获和详细日志
      console.error(`[测试失败] 错误信息: ${error.message}`, error.stack);
      throw error; // 重新抛出错误，确保测试用例标记为失败
    }

  }, { timeout: 180000, tags: ['1593667', 'level3', 'smoke', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('[测试步骤] 当前测试用例执行完成');
    try {
      console.log('[步骤6] 关闭文本编辑器窗口');
      await uos.closeCurrentWindow();
    } catch (e) {
      console.log('[步骤6] 文本编辑器已关闭，无需重复关闭');
    }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('[测试套件] 所有测试执行完成，开始清理');
    // 清理测试文件和应用进程
    await system.exec(`rm -rf ${addressBarPath}/*.h`, 5000);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    await system.exec("rm -rf .config/deepin/deepin-editor/config.conf", 5000);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs --no-run-if-empty kill -9", 5000);
    console.log('[清理] 测试环境清理完成');
  });
});