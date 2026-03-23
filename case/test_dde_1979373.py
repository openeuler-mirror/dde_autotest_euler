from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1979373_1(self):
        """启动器打开Elementary Test"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Elementary Test")
        sleep(5)
        self.assert_process_status(True, "elementary_test")

    def test_dde_1979373_2(self):
        """桌面打开Elementary Test"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Elementary Test")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Elementary Test")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("Elementary_Test_icon.png")
        sleep(5)
        self.assert_process_status(True, "elementary_test")
        DdeMethod().kill_process("elementary_test")
        sleep(3)
        euler.dde_dock.right_click_by_img("Elementary_Test_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "elementary_test")

    def test_dde_1979373_3(self):
        """终端打开Elementary Test"""
        Cmd.run_cmd("elementary_test &")
        sleep(5)
        self.assert_process_status(True, "elementary_test")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("elementary_test")
        yield
        DdeMethod().kill_process("elementary_test")
        DdeMethod().click_restore()
        DdeMethod().esc()
