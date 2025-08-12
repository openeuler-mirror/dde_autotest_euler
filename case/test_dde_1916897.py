from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1916897_1(self):
        """启动器打开浏览器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("firefox")
        sleep(5)
        self.assert_process_status(True, "firefox")

    def test_dde_1916897_2(self):
        """终端打开浏览器"""
        Cmd.run_cmd("firefox &")
        sleep(5)
        self.assert_process_status(True, "firefox")

    def test_dde_1916897_3(self):
        """桌面打开浏览器"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("firefox")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Firefox")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("liulanqi.png")
        sleep(5)
        self.assert_process_status(True, "firefox")
        DdeMethod().kill_process("firefox")
        sleep(3)
        euler.dde_dock.right_click_by_img("liulanqi.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "firefox")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("firefox")
        yield
        DdeMethod().kill_process("firefox")
        DdeMethod().click_restore()
        DdeMethod().esc()
