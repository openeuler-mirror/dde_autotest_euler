from case.base_case import BaseCase
from pylinuxauto import sleep
from method.dde_method import DdeMethod
from method.dde_control_center_method import DdeControlCenterMethod


class TestDdeCase(BaseCase):
    def test_dde_1271299(self):
        """添加系统语言"""
        DdeMethod().dde_method_add_english_system_language_in_control_center()
        self.assert_element_exist("/dde-control-center/American English - 美国英语")

    def teardown_method(self):
        """清理环境，将新增的系统语言删除"""
        sleep(2)
        DdeMethod().dde_method_delete_system_language_by_img()
        DdeMethod().dde_method_close_window()
