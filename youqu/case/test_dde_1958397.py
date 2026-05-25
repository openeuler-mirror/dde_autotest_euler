from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1958397_1(self):
        """启动器打开Qt4 Demo"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Qt4 Demo")
        sleep(5)
        self.assert_process_status(True, "qtdemo-qt4")

    def test_dde_1958397_2(self):
        """桌面打开Qt4 Demo"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("Qt4 Demo")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("Qt4 Demo")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("qt4_demo_icon.png")
        sleep(5)
        self.assert_process_status(True, "qtdemo-qt4")
        DdeMethod().kill_process("qtdemo-qt4")
        sleep(3)
        euler.dde_dock.right_click_by_img("qt4_demo_icon.png")
        Src.select_menu(1)
        sleep(5)
        self.assert_process_status(True, "qtdemo-qt4")

    def test_dde_1958397_3(self):
        """终端打开Qt4 Demo"""
        Cmd.run_cmd("qtdemo-qt4 &")
        sleep(5)
        self.assert_process_status(True, "qtdemo-qt4")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("qtdemo-qt4")
        yield
        DdeMethod().kill_process("qtdemo-qt4")
        DdeMethod().click_restore()
        DdeMethod().esc()
