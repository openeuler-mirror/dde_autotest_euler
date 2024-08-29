from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_euler_1271035_1(self):
        """在控制中心中新建标准账户"""
        DdeMethod().dde_method_add_common_account_by_control_center()
        self.assert_image_exist_in_dde("test_euler_1271035_1.png")

    def test_euler_1271035_2(self):
        """在控制中心中新建管理员账户"""
        DdeMethod().dde_method_add_root_account_by_control_center()
        self.assert_image_exist_in_dde("test_euler_1271035_2.png")

    def teardown_method(self):
        """删除新增账户并且关闭控制中心"""
        DdeMethod().dde_method_delete_test_account_by_control_center()
        DdeMethod().dde_method_close_window()
