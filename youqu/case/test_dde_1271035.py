from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271035(self):
        """在控制中心中新建标准账户"""
        DdeMethod().add_common_account_by_control_center()
        self.assert_image_exist_in_dde("test_dde_1271035_1.png")

    def teardown_method(self):
        """删除新增账户并且关闭控制中心"""
        DdeMethod().delete_test_account_by_control_center()
        DdeMethod().dde_control_center.kill_dde_control_center()
