from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1958399_1(self):
        """启动器打开Qt4 Config"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Qt4 Config")
        sleep(5)
        self.assert_process_status(True, "qtconfig-qt4")

    def test_dde_1958399_2(self):
        """桌面打开Qt4 Config"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Qt4 Config")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Qt4 Config")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("qt4_config_icon.png")
        sleep(5)
        self.assert_process_status(True, "qtconfig-qt4")
        DdeMethod().kill_process("qtconfig-qt4")
        sleep(3)
        euler.dde_dock.right_click_by_img("qt4_config_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "qtconfig-qt4")

    def test_dde_1958399_3(self):
        """终端打开Qt4 Config"""
        Cmd.run_cmd("qtconfig-qt4 &")
        sleep(5)
        self.assert_process_status(True, "qtconfig-qt4")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("qtconfig-qt4")
        yield
        DdeMethod().kill_process("qtconfig-qt4")
        DdeMethod().click_restore()
        DdeMethod().esc()
