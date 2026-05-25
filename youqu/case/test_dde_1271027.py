import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import CmdCtl as Cmd


class TestDdeCase(BaseCase):

    def test_dde_1271027(self):
        """控制中心中修改非当前用户密码"""
        DdeMethod().add_common_account_by_control_center()
        sleep(6)
        a = Cmd.sudo_run_cmd("grep '^test:' /etc/shadow")
        DdeMethod().change_other_account_password_by_control()
        sleep(3)
        b = Cmd.sudo_run_cmd("grep '^test:' /etc/shadow")
        self.assert_not_equal(a, b)

    def teardown_method(self):
        """关闭控制中心窗口"""
        DdeMethod().dde_control_center.click_by_attr("test")
        DdeMethod().delete_test_account_by_control_center()
        DdeMethod().dde_control_center.kill_dde_control_center()
