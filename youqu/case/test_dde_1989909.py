from time import sleep
from src import Src
import pytest
import subprocess
from src import CmdCtl as Cmd

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod

def assert_process_status(code, app_name):
    # 执行命令
    result = subprocess.run(f"ps -aux|grep {app_name}|grep -v grep", stdout=subprocess.PIPE,stderr=subprocess.PIPE, shell=True)

    if code != int(result.returncode):
        raise AssertionError(f'断言应用进程状态{app_name}与期望{code}不符')


class TestDdeCase(BaseCase):

    def test_dde_1989909_1(self):
        """启动器打开帮助手册"""
        euler = DdeMethod()
        euler.open_software_by_launcher("bangzhushouce")
        sleep(5)
        assert_process_status(0, "dman")

    def test_dde_1989909_2(self):
        """桌面打开帮助手册"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("bangzhushouce")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("帮助手册")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("bangzhushouce_icon.png")
        sleep(5)
        assert_process_status(0, "dman")
        DdeMethod().kill_process("dman")
        sleep(3)
        euler.dde_dock.right_click_by_img("bangzhushouce_icon.png")
        Src.select_menu(1)
        sleep(5)
        assert_process_status(0, "dman")

    def test_dde_1989909_3(self):
        """终端打开帮助手册"""
        Cmd.run_cmd("dman &")
        sleep(5)
        assert_process_status(0, "dman")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dman")
        yield
        DdeMethod().kill_process("dman")
        DdeMethod().click_restore()
        DdeMethod().esc()
