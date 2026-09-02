/**
 * 用例 PMSID: 1807223
 * 用例标题: [006][core]右侧预览-图片类型信息栏基本信息-1
 * 生成时间: 2025-12-16 10:30:00
 * 用例编写人: UT000211（陈依）
 */


describe('1807223-[006][core]右侧预览-图片类型信息栏基本信息-1', () => {
  beforeAll(async ({ device, uos, agent }) => {
    await uos.openApp('文件管理器', 5000, 100000);
    // 1.打开文件管理器，进入到桌面目录
    await agent.aiTap('文件管理器侧边栏的桌面目录');
    await agent.aiAssert('进入到桌面目录');
    await agent.aiTap('文件管理器最大化');
    await agent.aiWaitFor('文件管理器最大化显示')
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 2.启用预览面板
    const caseDir = process.env.TESTCASE_DIR;
    await system.exec(`cp -r "${caseDir}"/midscene_dde_file_manager/resources/1807223/* ~/Desktop`);
    await agent.aiTap('顶部右边菜单树形视图往右数的正方框中间有三个点的图标',{ deepThink: true });
    await agent.aiWaitFor('视图选项弹框')
    await agent.aiTap('点击显示预览前方方框');
    await agent.aiWaitFor('显示预览前方方框被勾选')
    await agent.aiAssert('预览前方方框被勾选');
    await agent.aiTap('点击桌面空白处');
  });

  test('1807223-[006][core]右侧预览-图片类型信息栏基本信息-1', async ({ uos, agent, env, device, system }) => {
    // 覆盖图片类型：bmp, jpg, png, tif
    // 与test.bmp断言保持一致（包括分辨率）
    const testImages = ['test.bmp', 'test.jpg', 'test.png','test.tif','test.gif' ];
    for (const image of testImages) {
      await agent.aiTap(`${image}文件`);
      await agent.aiWaitFor(`${image}文件被选中`);
      await agent.aiAssert('右侧面板上方展示图片');
      await agent.aiAssert('右侧面板中间展示名称');
      await agent.aiAssert('右侧面版中间展示大小');
      await agent.aiAssert('右侧面版中间展示分辨率');
      await agent.aiAssert('右侧面版中间展示类型为图像');
      await agent.aiAssert('右侧面版中间展示访问时间');
      await agent.aiAssert('右侧面版展示修改时间');
      await agent.aiAssert('右侧面板下方显示标记');
      await agent.aiAssert('右侧面板标记下方框显示为空');
    
    }   
   }, { timeout: 1200000, tags: ["1807223", 'level2', 'smoke', 'DITT', 'chenyi','test1'] });

    


  afterEach(async ({ device, agent,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc"); 
    // 删除复制的文件
    await system.exec("rm -f ~/Desktop/test.bmp ~/Desktop/test.jpg ~/Desktop/test.png ~/Desktop/test.tif ~/Desktop/test.gif ~/Desktop/test.svg  ~/Desktop/test.webp");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('桌面不存在test.bmp,test.jpg,test.png ,test.tif,test.gif, test.svg,test.webp')
});

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap('树形视图和排序中间的正方框中间有三个点的图标');
    await agent.aiTap('点击显示预览前方方框');
    await agent.aiAssert('预览前方方框没有被勾选'); 

    // 关闭文件管理器
    await agent.aiTap("文件管理器窗口右上角向下还原");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await uos.showDesktop();
  });
});
