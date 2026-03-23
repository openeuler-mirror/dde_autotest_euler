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

    def test_dde_1979339_1(self):
        """启动器打开FFADO Mixer"""
        euler = DdeMethod()
        euler.open_software_by_launcher("FFADO Mixer")
        sleep(5)
        assert_process_status(0, "ffado-mixer")

    def test_dde_1979339_2(self):
        """桌面打开FFADO Mixer"""
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        euler.dde_launcher.click_search_box_by_attr()
        Src.input("FFADO Mixer")
        sleep(3)
        euler.dde_launcher.right_click_by_attr("FFADO Mixer")
        Src.select_menu(2)
        sleep(1)
        Src.esc()
        euler.click_restore()
        sleep(1)
        euler.dde_dock.double_click_by_img("FFADO_Mixer_icon.png")
        sleep(5)
        assert_process_status(0, "ffado-mixer")
        DdeMethod().kill_process("ffado-mixer")
        sleep(3)
        euler.dde_dock.right_click_by_img("FFADO_Mixer_icon.png")
        Src.select_menu(1)
        sleep(5)
        assert_process_status(0, "ffado-mixer")

    def test_dde_1979339_3(self):
        """终端打开FFADO Mixer"""
        Cmd.run_cmd("ffado-mixer &")
        sleep(5)
        assert_process_status(0, "ffado-mixer")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("ffado-mixer")
        yield
        DdeMethod().kill_process("ffado-mixer")
        DdeMethod().click_restore()
        DdeMethod().esc()
