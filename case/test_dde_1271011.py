from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271011(self):
        """控制中心中更改屏幕分辨率后默认选中当前分辨率推荐的刷新率"""
        DdeMethod().dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        DdeMethod().dde_method_change_resolution_by_control_center()
        self.assert_element_exist("/dde-control-center/59.81赫兹")
        self.assert_image_exist_in_dde("test_dde_1271011.png")

    def teardown_method(self):
        """将分辨率重置，关闭控制中心窗口"""
        DdeMethod().dde_method_reset_resolution_by_control_center()
        DdeMethod().dde_method_close_window()
