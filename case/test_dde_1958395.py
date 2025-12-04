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

    def test_dde_1958395_1(self):
        """启动器打开Onboard设置"""
        euler = DdeMethod()
        euler.open_software_by_launcher("Onboardshezhi")
        sleep(5)
        assert_process_status(0, "/usr/bin/onboard-settings")

    def test_dde_1958395_2(self):
        """终端打开Onboard设置"""
        Cmd.run_cmd("/usr/bin/onboard-settings &")
        sleep(5)
        assert_process_status(0, "/usr/bin/python3 -s /usr/bin/onboard-settings")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("/usr/bin/onboard-settings")
        yield
        DdeMethod().kill_process("/usr/bin/onboard-settings")
        DdeMethod().click_restore()
        DdeMethod().esc()
