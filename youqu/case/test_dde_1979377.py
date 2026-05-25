from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1979377_1(self):
        """启动器打开Elementary Configuration"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Elementary Configuration")
        sleep(5)
        self.assert_process_status(True, "elementary_config")

    def test_dde_1979377_2(self):
        """桌面打开Elementary Configuration"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Elementary Configuration")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Elementary Configuration")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("Elementary_Config_icon.png")
        sleep(5)
        self.assert_process_status(True, "elementary_config")
        DdeMethod().kill_process("elementary_config")
        sleep(3)
        euler.dde_dock.right_click_by_img("Elementary_Config_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "elementary_config")

    def test_dde_1979377_3(self):
        """终端打开Elementary Configuration"""
        Cmd.run_cmd("elementary_config &")
        sleep(5)
        self.assert_process_status(True, "elementary_config")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("elementary_config")
        yield
        DdeMethod().kill_process("elementary_config")
        DdeMethod().click_restore()
        DdeMethod().esc()
