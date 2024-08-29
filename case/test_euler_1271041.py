from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_euler_1271041(self):
        """在控制中心中新建账户"""
        DdeMethod().dde_method_add_account_by_control_center()
        self.assert_image_exist_in_dde("new_account.png")

    def teardown_method(self):
        """删除新增账户并且关闭控制中心"""
        DdeMethod().dde_method_delete_test_account_by_control_center()
        DdeMethod().dde_method_close_window()
