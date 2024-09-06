from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep
import pylinuxauto


class TestDdeCase(BaseCase):
    def test_dde_1270985(self):
        """控制中心中修改时区"""
        euler = DdeMethod()
        euler.dde_dock_method_click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_method_change_time_area_by_control_center()
        self.assert_ocr_exist("New_York")
        self.assert_ocr_exist("今天")

    def teardown_method(self):
        """将时区重新设置为北京时间，并且关闭控制中心"""
        DdeMethod().dde_control_center_method_delete_other_time_area_by_control_center()
        DdeMethod().dde_control_center_method_click_by_attr("Btn_修改系统时区")
        sleep(2)
        DdeMethod().dde_control_center_method_click_by_attr("Editable_qlineedit")
        pylinuxauto.input_message("Beijing")
        sleep(2)
        pylinuxauto.enter()
        DdeMethod().dde_control_center_method_click_by_attr("Btn_确定")
        sleep(2)
        DdeMethod().dde_control_center_method_delete_other_time_area_by_control_center()
        DdeMethod().dde_method_close_window()
