import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDeepinTerminalCase(BaseCase):


    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271251(self):
        """前置和后置"""
        Src.ctrl_alt_t()
        sleep(2)
        DdeMethod().deepin_terminal.click_option_by_attr()
        sleep(5)
        for _ in range(4):
            Src.down()
        Src.enter()
        sleep(3)

        yield
        Src.kill_process("deepin-terminal")

    def test_dde_1271251_1(self):
        """终端——设置界面显示"""
        # 1. 打开终端，右键/菜单栏选择设置，检查设置界面显示
        # 1. 和设计图显示一致，左边标题列表，右边显示具体参数设置（基础设置中不显示主题；终端设置界面去除关于；
        # 高级设置下：光标闪烁中新增：选中文字时复制到剪贴板（默认关闭）；
        # 滚动设置中去除回滚行数；窗口设置中新增分屏、丢失焦点后隐藏雷神窗口（默认关闭）
        self.assert_ocr_not_exist("主题", max_match_number=1)
        self.assert_ocr_not_exist("关于", max_match_number=1)

    def test_dde_1271251_2(self):
        """终端——设置界面显示"""
        # 1. 打开终端，右键/菜单栏选择设置，检查设置界面显示
        # 高级设置下：光标闪烁中新增：选中文字时复制到剪贴板（默认关闭）；
        euler = DdeMethod()
        euler.click(*euler.ocr("高级设置"))
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271251_1.png", rate=0.9)

    def test_dde_1271251_3(self):
        """终端——设置界面显示"""
        # 1. 打开终端，右键/菜单栏选择设置，检查设置界面显示
        # 滚动设置中去除回滚行数；窗口设置中新增分屏、丢失焦点后隐藏雷神窗口（默认关闭）
        euler = DdeMethod()
        euler.click(*euler.ocr("高级设置"))
        sleep(3)
        self.assert_ocr_not_exist("回滚行数", max_match_number=1)
        euler.deepin_terminal.click_option_dialog_center_by_image()
        sleep(3)
        Src.mouse_scroll(-2)
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271251_2.png", rate=0.9)

    def test_dde_1271251_4(self):
        """终端——设置界面显示"""
        # 2. 点击左边标题，检查右边内容显示
        # 2. 被选择的标题自动切换到最上方
        euler = DdeMethod()
        euler.click(*euler.ocr("高级设置"))
        sleep(3)
        self.assert_ocr_exist("光标风格")

    def test_dde_1271251_5(self):
        """终端——设置界面显示"""
        # 3. 鼠标移动到右边进行滚动
        # 3. 可以上下滚动查看
        euler = DdeMethod()
        euler.deepin_terminal.click_option_dialog_center_by_image()
        sleep(3)
        Src.mouse_scroll(-30)
        self.assert_ocr_not_exist("字体大小", max_match_number=1)
        sleep(5)
        Src.mouse_scroll(30)
        self.assert_ocr_exist("字体大小")
