/**
 * 用例 PMSID: 1967945
 * 用例标题: 【预览侧边栏支持放大预览图片】重命名文件后观察预览区
 * 生成时间: 2026-07-30 13:55:22
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1967945-【预览侧边栏支持放大预览图片】重命名文件后观察预览区', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //准备测试文件
    await system.exec(`cd ~/Music && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1967945.zip && unzip 1967945.zip  && rm 1967945.zip`)
  });

  test('1967945-【预览侧边栏支持放大预览图片】重命名文件后观察预览区', async ({ agent, uos, device }) => {
    // 前置条件 ：打开文管，点击右上角的视图选项，勾选显示预览
    await uos.openApp('文件管理器')
    await agent.aiTap('窗口左侧边栏的视频')
    await agent.aiTap('地址栏右侧，一个正方形方框，里面有三个横着的小点，紧挨着↓↑图标左侧的图标',{deepThink: true})
    const isBoxCheck = await agent.aiBoolean("显示预览是否勾选");
    if (isBoxCheck) {
        console.log("不需要勾选复选框")
    } else {
        console.log("需要勾选复选框");
        await agent.aiTap("显示预览前面的复选框");
    }
    await device.pressKey("ESC")

    // 步骤 1：进入音乐目录，选中图片后，重命名，观察右侧边栏预览区是否正常预览图片
    console.log('步骤 1：进入音乐目录，选中图片后，重命名，观察有侧边栏预览区是否正常预览图片')
    await agent.aiTap('窗口左侧边栏的音乐')
    await agent.aiTap('c.jpg')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示该图片的预览图，名称显示为test.jpg', {deepThink: true})

    // 步骤 2：选中文本文档后，重命名，观察右侧边栏预览区是否正常预览文本文档
    console.log('步骤 2：选中文本文档后，重命名，观察右侧边栏预览区是否正常预览文本文档')
    await agent.aiTap('测试资料.txt')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示预览图，名称显示为test.txt', {deepThink: true})

    // 步骤 3：选中视频文件后，重命名，观察右侧边栏预览区是否正常预览视频文件
    console.log('步骤 3：选中视频文件后，重命名，观察右侧边栏预览区是否正常预览视频文件')
    await agent.aiTap('徐慕言在学习.mp4')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAsyncAssert('右侧边栏显示预览图，名称显示为test.mp4', { initialDelayMS:1000, deepThink: true})

    // 步骤 4：选中deb文件后，重命名，观察右侧边栏预览区是否正常预览deb文件
    console.log('步骤 4：选中deb文件后，重命名，观察右侧边栏预览区是否正常预览deb文件')
    await agent.aiTap('dfeet.deb')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示预览图，名称显示为test.deb', {deepThink: true})

    // 步骤 5：选中zip文件后，重命名，观察右侧边栏预览区是否正常预览zip文件
    console.log('步骤 5：选中zip文件后，重命名，观察右侧边栏预览区是否正常预览zip文件')
    await agent.aiTap('武汉介绍.zip')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示预览图，名称显示为test.zip', {deepThink: true})

    // 步骤 6：选中文件夹后，重命名，观察右侧边栏预览区是否正常预览文件夹
    console.log('步骤 6：选中文件夹后，重命名，观察右侧边栏预览区是否正常预览文件夹')
    await agent.aiTap('测试文件夹')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示预览图，名称显示为test', {deepThink: true})

    // 步骤 7：选中音乐后，重命名，观察右侧边栏预览区是否正常预览音乐文件
    console.log('步骤 7：选中音乐后，重命名，观察右侧边栏预览区是否正常预览音乐文件')
    await agent.aiTap('Havana.mp3')
    await device.pressKey(`F2`)
    await device.typeText('test',true)
    await agent.aiAssert('右侧边栏显示预览图，名称显示为test.mp3', { initialDelayMS:1000, deepThink: true})

  }, { timeout: 1200000, tags: ['1967945', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 关闭文件管理器');
    await agent.aiTap('地址栏右侧，一个正方形方框，里面有三个横着的小点，紧挨着↓↑图标左侧的图标',{deepThink: true})
    const isBoxCheck = await agent.aiBoolean("显示预览是否勾选");
    if (isBoxCheck) {
        console.log("需要取消勾选复选框")
        await agent.aiTap("显示预览前面的复选框");
    } else {
        console.log("不需要取消勾选复选框");
    }
    await device.pressKey("ESC")

  });

  afterAll(async ({ uos, system }) => {
    console.log('5. afterAll: 清理测试数据');
    await system.exec('killall dde-file-manager || true');
    await system.exec(`rm -rf ~/Music/test*`)
    await system.exec(`rm -rf ~/Music/Havana.mp3 ~/Music/dfeet.deb ~/Music/徐慕言在学习.mp4 ~/Music/武汉介绍.zip ~/Music/测试资料.txt ~/Music/c.jpg ~/Music/测试文件夹`)
    await uos.showDesktop();
  });
});
