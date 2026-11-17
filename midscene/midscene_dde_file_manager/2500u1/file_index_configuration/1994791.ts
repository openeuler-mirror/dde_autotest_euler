/**
 * 用例 PMSID: 1994791
 * 用例标题: 【文件索引配置】删除后创建同名文件索引
 * 生成时间: 2026-09-01 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const smbName = process.env.SMB_USERNAME;
const smbPwd = process.env.SMB_PASSWORD;

describe('1994791-【文件索引配置】删除后创建同名文件索引', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 关闭所有文件管理器窗口
    await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
    await uos.openApp("文件管理器", 3000, 20000, true);
    // 清理环境（如存在旧的SMB挂载/文件管理器进程）
    const { clearEnvironment, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await clearEnvironment(system);
    await system.exec("kill -TERM $(pidof dde-file-manager) 2>/dev/null || true");
  });

  test('1994791-【文件索引配置】删除后创建同名文件索引', async ({ device, agent, uos, system }) => {
    const { SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    
    // 前置条件1：已开启文件索引
    console.log('===== 前置条件1：确认文件索引已开启 =====');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
    await agent.aiTap("设置");
    await agent.aiTap("默认目录");
    await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
    await agent.aiTap("恢复默认");
    // 关闭设置窗口
    await device.pressKey("Alt+F4");

    // 前置条件2：挂载SMB并确保same-name.txt文件存在
    console.log('===== 前置条件2：挂载SMB并准备测试文件 =====');
     
    // 挂载smb-勾选记住密码
    console.log('===== 挂载SMB =====');
    await device.pressKey('Ctrl', 'l');
    await device.pressKey('Ctrl', 'a');
    await device.typeText(`smb://${smbIp}/${smbDir}`, true);
    await agent.aiWaitFor("出现需要授权来访问文本");
    await device.typeText(`${smbName}`);
    await agent.aiInput(`${smbPwd}`, '密码输入框');
    await agent.aiTap("记住密码文本");
    await agent.aiTap("连接选项");
    await system.exec("sleep 2");
    
    //获取挂载路径
    const result = await system.exec(`df -h | grep smbmounts | awk '{print $6}'`);
    const tmpDir = result.stdout.trim();
    if (!tmpDir) {
      throw new Error('未能获取SMB挂载路径');
    }
    console.log(`SMB挂载路径: ${tmpDir}`);
    
    // 确保测试文件存在（如果不存在则创建）
    await system.exec(`touch "${tmpDir}/same-name.txt" 2>/dev/null || true`);
    await system.exec(`echo "测试内容" >> "${tmpDir}/same-name.txt" 2>/dev/null || true`);
    console.log('测试文件 same-name.txt 准备完成');    

    // 步骤1：删除smb上的same-name.txt
    console.log('===== 步骤1：删除SMB上的same-name.txt =====');
    const mountPath = tmpDir || '';
    if (!mountPath) {
      throw new Error('未获取到SMB挂载路径');
    }
    
    // 确认文件存在
    const fileExists = await system.exec(`test -f "${mountPath}/same-name.txt" && echo "exists" || echo "not_exists"`);
    console.log(`文件存在状态: ${fileExists.stdout.trim()}`);
    
    // 删除文件
    await system.exec(`rm -f "${mountPath}/same-name.txt"`);
    
    // 验证删除成功
    const afterDelete = await system.exec(`test -f "${mountPath}/same-name.txt" && echo "exists" || echo "not_exists"`);
    console.log(`删除后文件状态: ${afterDelete.stdout.trim()}`);
    
    // 预期结果1：删除成功
    if (afterDelete.stdout.trim() !== 'not_exists') {
      throw new Error('文件删除失败，文件仍然存在');
    }
    console.log('✅ 预期结果1：删除成功');
    
    // 步骤2：立即创建同名文件same-name.txt
    console.log('===== 步骤2：立即创建同名文件same-name.txt =====');
    await system.exec(`echo "新创建的文件内容" > "${mountPath}/same-name.txt"`);
    
    // 验证创建成功
    const afterCreate = await system.exec(`test -f "${mountPath}/same-name.txt" && echo "exists" || echo "not_exists"`);
    console.log(`创建后文件状态: ${afterCreate.stdout.trim()}`);
    
    // 预期结果2：创建成功
    if (afterCreate.stdout.trim() !== 'exists') {
      throw new Error('文件创建失败，文件不存在');
    }
    console.log('✅ 预期结果2：创建成功');
    
    // 步骤3：搜索same-name.txt
    console.log('===== 步骤3：搜索same-name.txt =====');
   
    // 点击搜索框并输入搜索内容
    await agent.aiTap(`文件管理器左侧栏的${smbIp}`);
    await agent.aiDoubleClick(`${smbDir}`);
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await device.typeText("same-name.txt");
    
    // 预期结果3：能搜索到文件
    try {
      await agent.aiWaitFor("搜索结果中有same-name.txt文件",
        {
          timeoutMs: 60000,
          checkIntervalMs: 2000
        }
      );
      console.log('✅ 预期结果3：成功搜索到same-name.txt文件');
    } catch (error) {
      // 搜索超时，尝试刷新搜索
      console.log('第一次搜索超时，尝试重新搜索');
      await agent.aiTap("右上角有放大镜的输入框里的x按钮", { deepThink: true });
      await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
      await device.typeText("same-name.txt");
      await agent.aiWaitFor("搜索结果中有same-name.txt文件",
        {
          timeoutMs: 60000,
          checkIntervalMs: 2000
        }
      );
      console.log('✅ 预期结果3：成功搜索到same-name.txt文件');
    }
    
    // 清理：删除测试文件
    console.log('===== 清理测试文件 =====');
    await system.exec(`rm -f "${mountPath}/same-name.txt"`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('测试文件已清理');
    
    // 关闭文件管理器
    await device.pressKey("Alt+F4");
    
  }, { timeout: 1800000, tags: ['1994791', 'level3', '2500u1', 'file_index_configuration', 'DITT', 'lanyanling'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ device, system, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    const { cleanSmbMounts, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await closeFileManager(system);
  });
});