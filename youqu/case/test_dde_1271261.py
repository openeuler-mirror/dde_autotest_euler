import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src import sleep


class TestDeepinTerminalCase(BaseCase):


    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271261(self):
        """前置和后置"""
        Src.ctrl_alt_t()
        sleep(2)
        Src.ctrl_alt_t()
        sleep(3)

        yield
        Src.kill_process("deepin-terminal")

    def test_dde_1271261_1(self):
        """终端——关闭"""
        # 1. 打开多个窗口，点击关闭
        # 1. 当前窗口被关闭
        euler = DdeMethod()
        euler.deepin_terminal.click_window_x_by_image()
        sleep(3)
        process_num = Src.get_daemon_process_num("deepin-terminal")
        self.assert_equal(1, process_num)

    def test_dde_1271261_2(self):
        """终端——关闭"""
        # 2. 打开2个窗口，然后最小化，点击dock上图标； 在预览中点击关闭1个窗口
        # 2. 窗口被关闭，剩下一个窗口显示正常
        euler = DdeMethod()
        euler.deepin_terminal.click_window_min_by_image()
        sleep(3)
        x, y = euler.dde_dock.get_x_y_terminal_icon_by_attr()
        Src.move_to(x, y)
        sleep(8)
        euler.dog.move_to(x+20, y-40)
        sleep(3)
        Src.click()
        sleep(3)
        process_num = Src.get_daemon_process_num("deepin-terminal")
        self.assert_equal(1, process_num)
