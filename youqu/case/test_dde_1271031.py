from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271031_1(self):
        """删除普通账户（非当前登录）"""
        euler = DdeMethod()
        euler.add_common_account_by_control_center()
        self.assert_image_exist_in_dde("test_dde_1271035_1.png")
        euler.delete_test_account_by_control_center()
        self.assert_image_not_exist_in_dde("test_dde_1271035_1.png")

    def test_dde_1271031_2(self):
        """删除root账户（非当前登录）"""
        euler = DdeMethod()
        euler.add_root_account_by_control_center()
        self.assert_image_exist_in_dde("test_dde_1271035_2.png")
        euler.delete_test_account_by_control_center()
        self.assert_image_not_exist_in_dde("test_dde_1271035_2.png")

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
