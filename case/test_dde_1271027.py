from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep
from nocmd import Cmd


class TestDdeCase(BaseCase):
    def test_dde_1271027(self):
        """控制中心中修改非当前用户密码"""
        DdeMethod().dde_method_add_common_account_by_control_center()
        sleep(6)
        a = Cmd.run("echo uostest12#$ | sudo -S grep '^test:' /etc/shadow")
        DdeMethod().dde_method_change_other_account_password_by_control()
        sleep(3)
        b = Cmd.run("echo uostest12#$ | sudo -S grep '^test:' /etc/shadow")
        self.assert_not_equal(a, b)

    def teardown_method(self):
        """关闭控制中心窗口"""
        DdeMethod().dde_control_center_method_click_by_attr("test")
        DdeMethod().dde_method_reset_other_account_password_from_change_password_by_control_center()
        DdeMethod().dde_method_delete_test_account_by_control_center()
        DdeMethod().dde_method_close_window()
