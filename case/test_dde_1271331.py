import time

from apps.dde_autotest_euler.method.vender.deepin_terminal_method import DeepinTerminalMethod
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271331(self):
        """桌面-右键菜单-在终端中打开"""
        Src.hot_key("win", "d")
        time.sleep(2)
        euler = DdeMethod()
        euler.dde_desktop.right_click_by_xy()
        time.sleep(2)
        self.assert_process_status(True, "deepin-terminal")

    def teardown_method(self):
        """关闭窗口"""
        DdeMethod().kill_process("deepin-terminal")
        time.sleep(2)
