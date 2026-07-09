/**
 * 用例 PMSID: 1959177
 * 用例标题: 【home目录支持长文件名】在home目录下创建长文件名文件 
 * 生成时间: 2026-05-29 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

// 生成长文件名
const longFolderName = "一二三四五六七八九十人口手足耳目头心山水火土日月风云雨雪田石花草树木叶果鸟鱼虫羊牛马犬鸡鸭河江湖海波光影天地上下左右前后里外中旁高低长短大小多少远近明暗冷暖开关来去走跑飞立坐卧看听说读写吃喝玩乐笑哭想家父母爸妈哥姐弟妹爷奶友师学校书本纸笔尺门窗房屋床桌椅灯碗筷饭菜油盐米面刀绳布衣鞋帽路桥车船旗铃钟笛春夏秋冬晨昏朝晚今昨明年岁时分秒轻重厚薄圆方直弯静闹强弱好坏善恶真假美丑甜苦酸辣香臭勤懒忙闲敢怕爱恨恩情义力气声色味魂神道理法规城乡村岗坡沟泉沙尘霜雾雷电虹霞枝根苗藤蜂蝶虾蟹鸽燕耕种收割挑扛扶牵追寻盼祝愿归逢走";
const longDocName = "兆丛令乏半卉乎册冉凹凸乍尔弗丙斥丕旦札末本术未刃刈分兮共兴兰并兑兄克免兔冰冻凉凄冽凝净洁淳清渊泉津液沫汽泡浪潮汐汛沛汪汇池沟渠湾港滨滩洼洪滔漫溢滋润添淋洒泼洗沐浴沙泥尘埃垢灰烬烟焰炊烤烘烧炸炒炖煮熬蒸烹熟生旺烈炎灿烂煌辉耀晴旭昏暇暇晖映昭晚夜宵幕晨曦光芒晖影昏暗夕朝季节序律候气温湿燥干枯荣茂盛繁茂芽苞蕊瓣茎秆穗芒刺丛蔓柔嫩娇芳菲芬馨郁艳丽姿容貌妆扮姿态神情性格魂魄志愿意念思忆怀惜怜惜慕敬恭谦诚信忠义勇敢刚毅坚强韧柔和顺良慈善仁德礼仪智慧聪明愚钝拙巧灵敏捷缓慢迟速迅猛疾奔驰行步移动游荡巡访迎送接遇";
const longXlsName = "今凡凶凡冬冬勿匀勾历区匹午升卞斗冗尺引办予劝功加召叮叽叹叶号另司只叨右可台史句古叼叭吉合名各向君吾否含吟吹呜呢吧吼吵啼唤唯听呵呼吸吐吃吞含饮启君吾余佘佘余住何佐佑位伴伺伏仰伐休仿伍份伯侄姑婆婴童郎徒仪佳佳佳佼佼使例侍供依仗侵休仿优仲伦仰仆仞仇仁介元公允仓亏乡丫久也及亏亍互亓井亢今介仁仍仆仞仂仇仉以予元允内冈凶分切勿勾化匹午升卞斗户心戈文方火毛爪父片牙玄玉瓜瓦甘生由甲申电白皮皿目矛矢石示禾穴立竹米耳肉臣自至舌舟艮色行衣西见角言谷豆贝赤走足身车辛辰邑酉釆里金长门阜雨青非面革音页风飞食首香马骨高斤今今";
const longPptName = "荷菊兰莓桃耙铲钻钉桶勺壶盆袋衫裙帕巾笛铃旗船车桥路鞋帽布衣绳刀布米面油盐菜桌椅床屋门窗尺纸本书笔师学友奶爷妹弟姐哥爸妈父母家想哭笑玩乐喝吃读写听看卧坐立飞跑走去关开暖冷明暗近远少大多小短长长低高旁中里外前后右左下地天光影波湖江海河湖鸡鸭牛马羊虫鱼鸟果叶树木草花雨雪风云月日头心目耳足手口人十拘执持握捡拾挪摆抖挥抛投接递推拉扯按压扶托攀登跨跃奔逃追躲停站蹲迎送陪伴邀请分合单双独偶偏全主次本末始末始终朝夕昼夜晨昏四季寒深浅宽窄曲直凹凸偏斜正斜方圆尖扁粗细大小整碎新旧盈亏多少增减快慢缓急先后主次内外远近";
const longTxtName = "邀请警训教启迪悟懂知识忆忘记思谋虑决断取舍得本末始末始终朝夕昼夜晨昏四季寒暑干湿软疏密稀密虚实表里深浅宽窄曲直凹凸偏斜正斜方圆尖扁粗细大小整碎新旧盈亏多少增减快慢缓急先后主次内外远近高低上下左右中间旁侧边缘角落方圆平陡险稳安危祸福吉凶利弊得失公私贫富贵贱强弱尊卑雅俗拙巧庸能智愚贤愚善恶正邪真伪虚实动静行止起居作息眠醒梦醉醒酣倦劳累休憩安逸愁苦欢乐喜怒哀惧惊恐畏惧怜惜疼爱慕敬恭谦和诚恳忠实信义仁爱慈惠德恩仇怨喜怒哀乐悲欢离合聚散往来行止言谈呼喊问答啼鸣吃喝品尝咀嚼吞咽吮吸浇灌浸泡洗涤擦拭清扫涂抹堆积";

describe("1959177-【home目录支持长文件名】在home目录下创建长文件名文件", () => {
    beforeAll(async ({ device, agent, uos, system }) => {
        console.log("1. beforeAll: 初始化测试套件，开启长文件名功能");
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log("2. beforeEach: 每个测试前的准备");
        // 清理环境（避免其他干扰）
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        // 清理桌面测试文件
        await system.exec(`rm -rf /home/${userName}/Desktop/*.docx /home/${userName}/Desktop/*.xlsx /home/${userName}/Desktop/*.pptx`);  
        await system.exec(`pkill wpp;pkill et;pkill wps`);
    });

    test("1959177-【home目录支持长文件名】在home目录下创建长文件名文件", async ({ device, system, agent, uos }) => {
        // 前置条件1：开启长文件名功能
        const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await enableLongFileName(device, agent, system);
        
        // ==================== 步骤1：在用户home目录中创建255个中文字符的文件夹 ====================
        // 打开文件管理器并进入home目录
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏的主目录");
        // 创建文件夹
        await agent.aiRightClick("主目录内空白处");
        await new Promise(resolve => setTimeout(resolve, 3000));
        await agent.aiTap("新建文件夹");        
        // 输入长文件名
        await device.typeText(longFolderName);
        await device.pressKey("Enter");
        await agent.aiTap("文件夹内空白处");   
        // 预期结果1：创建成功，名称显示为长文件名
        await agent.aiAssert(`主目录中能看到如下文字：一二三、…、归逢走`);

        // ====== 步骤2：在创建的长文件名文件夹中，新建255个字符的办公文件、表格文档、演示文档、文本文档 ======
        console.log("===== 步骤2：在长文件名文件夹中创建办公文档、表格文档、演示文档、文本文档 =====");
        // 进入刚创建的长文件名文件夹
        await agent.aiDoubleClick(`${longFolderName}文件夹的图标`);
        // 创建Word文档 (.docx, 总长255)
        await agent.aiRightClick(`${longFolderName}文件夹内空白处`);
        await new Promise(resolve => setTimeout(resolve, 4000));
        await agent.aiTap("新建文档");
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("办公文档");
        await device.typeText(longDocName);
        await device.pressKey("Enter");

        // 创建Excel文档 (.xlsx, 总长255)
        await agent.aiRightClick(`${longFolderName}文件夹内空白处`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("新建文档");
        await agent.aiTap("电子表格");
        await device.typeText(longXlsName);
        await device.pressKey("Enter");        

        // 创建PPT文档 (.pptx, 总长255)
        await agent.aiRightClick(`${longFolderName}文件夹内空白处`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("新建文档");
        await agent.aiTap("演示文档");
        await device.typeText(longPptName);
        await device.pressKey("Enter");

        // 创建文本文档 (.txt, 总长255)
        await agent.aiRightClick(`${longFolderName}文件夹内空白处`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText(longTxtName);
        await device.pressKey("Enter");
        await agent.aiTap("文件夹内空白处");
        // 预期结果2：创建成功，名称显示为长文件名
/*
        await agent.aiAssert(`在当前目录中能看到${longDocName}.docx的长文件名文件名称的头和尾，中间用...表示`);
        await agent.aiAssert(`在当前目录中能看到${longXlsName}.xlsx的长文件名文件名称的头和尾，中间用...表示`);
        await agent.aiAssert(`在当前目录中能看到${longPptName}.pptx的长文件名文件名称的头和尾，中间用...表示`);
        await agent.aiAssert(`在当前目录中能看到${longTxtName}.txt的长文件名文件名称的头和尾，中间用...表示`);
*/
        await agent.aiAssert(`在当前目录中能看到如下文字：兆丛、遇.docx`);
        await agent.aiAssert(`在当前目录中能看到如下文字：今凡、今.xlsx`);
        await agent.aiAssert(`在当前目录中能看到如下文字：荷菊、近.pptx`);
        await agent.aiAssert(`在当前目录中能看到如下文字：邀请、积.txt`);
        // ==================== 步骤3：右键点击任意1个长文件名文件，查看文件属性 ====================
        console.log("===== 步骤3：右键点击长文件名文件，查看文件属性 =====");
        // 选择第一个文件（Word文档）进行测试
        await agent.aiRightClick(`${longDocName}文件的图标`);
        await agent.aiTap("属性");
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 预期结果3：属性窗口中，名称显示部分名称，中间以...显示
        await agent.aiAssert("属性窗口中，文件名称字段显示为省略了中间部分的长文件名，格式如“开头部分...结尾部分”");

        // ==================== 步骤4：点击属性中名称右侧的笔状图标 ====================
        console.log("===== 步骤4：点击属性中名称右侧的笔状图标 =====");
        await agent.aiTap("名称右侧的笔状图标（编辑按钮）");
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 预期结果4：进入名称编辑模式，同时显示完整长文件名
        await agent.aiAssert("名称字段变为可编辑状态，并且能看到如下文字：移动游荡巡访迎送接遇.docx");

        // 关闭属性窗口（不保存修改）
        await agent.aiTap("属性窗口右上角的关闭按钮");

        // 关闭文件管理器
        await device.pressKey("Alt+F4");

    }, { timeout: 1800000, tags: ["1959177", "level1", "remote", "smoke", "2500u1", "DITT", "lanyanling"] });

    afterEach(async ({ device, agent, system }) => {
        console.log("4. afterEach: 清理进程");
    });

    afterAll(async ({ device, system, agent }) => {
        console.log("5. afterAll: 清理测试创建的长文件名文件夹及文件");
        // 删除所有创建的测试文件和文件夹
        await system.exec(`rm -rf /home/${userName}/${longFolderName}`);
        await system.exec(`rm -rf /home/${userName}/${longDocName}.docx`);
        await system.exec(`rm -rf /home/${userName}/${longXlsName}.xlsx`);
        await system.exec(`rm -rf /home/${userName}/${longPptName}.pptx`);
        await system.exec(`rm -rf /home/${userName}/${longTxtName}.txt`);

        // 关闭所有测试相关进程
        await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
});