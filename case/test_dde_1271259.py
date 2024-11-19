import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDeepinTerminalCase(BaseCase):


    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271259(self):
        """前置和后置"""
        Src.ctrl_alt_t()
        sleep(2)

        yield
        Src.kill_process("deepin-terminal")

    def test_dde_1271259_1(self):
        """终端——退出"""
        # 1. 点击退出
        # 1. 所有终端都被关闭
        euler = DdeMethod()
        euler.dde_dock.right_click_terminal_icon_by_attr()
        sleep(3)
        euler.click(*euler.ocr("关闭所有"))
        sleep(3)
        process_num = Src.get_daemon_process_num("deepin-terminal")
        self.assert_equal(0, process_num)

    @pytest.mark.parametrize("operate", ["alt_f4", "ctrl_shift_w", "ctrl_d"])
    def test_dde_1271259_2(self, operate):
        """终端——退出"""
        # 2. 打开终端后，按Alt+F4查看软件显示
        # 2. 关闭当前窗口
        # 3. 打开终端后，按Ctrl+Shift+W查看软件显示
        # 3. 关闭当前窗口
        # 4. 打开终端后，按Ctrl+D查看软件显示
        # 4. 关闭当前窗口
        if operate == "alt_f4":
            Src.alt_f4()
        elif operate == "ctrl_shift_w":
            Src.hot_key("ctrl", "shift", "w")
        elif operate == "ctrl_d":
            Src.hot_key("ctrl", "d")
        sleep(3)
        process_num = Src.get_daemon_process_num("deepin-terminal")
        self.assert_equal(0, process_num)
