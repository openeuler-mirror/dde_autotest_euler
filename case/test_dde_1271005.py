from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271005(self):
        """控制中心-网络-DSL功能测试"""
        euler = DdeMethod()
        euler.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_method_add_network_dsl_by_control_center()
        sleep(3)
        self.assert_image_exist_in_dde("test_dde_1271005.png")

    def teardown_method(self):
        """将新增的DSL删除，关闭控制中心窗口"""
        DdeMethod().dde_method_delete_network_dsl_by_control_center()
        sleep(1)
        DdeMethod().dde_method_close_window()
