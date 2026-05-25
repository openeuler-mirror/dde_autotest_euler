from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1916917_1(self):
        """启动器打开系统性能分析工具"""
        euler = DdeMethod()
        euler.open_software_by_launcher("sysprof")
        sleep(5)
        self.assert_process_status(True, "sysprof")

    def test_dde_1916917_2(self):
        """终端打开系统性能分析工具"""
        Cmd.run_cmd("sysprof &")
        sleep(5)
        self.assert_process_status(True, "sysprof")

    def test_dde_1916917_3(self):
        """桌面打开系统性能分析工具"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("sysprof")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Sysprof")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("sysprof.png")
        sleep(5)
        self.assert_process_status(True, "sysprof")
        DdeMethod().kill_process("sysprof")
        sleep(3)
        euler.dde_dock.right_click_by_img("sysprof.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "sysprof")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("sysprof")
        yield
        DdeMethod().kill_process("sysprof")
        DdeMethod().click_restore()
        DdeMethod().esc()
