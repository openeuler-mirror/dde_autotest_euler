from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1270985(self):
        """控制中心中修改时区"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.change_time_area_by_control_center()
        self.assert_ocr_exist("New_York")
        self.assert_ocr_exist("比本地")

    def teardown_method(self):
        """将时区重新设置为北京时间，并且关闭控制中心"""
        try:
            DdeMethod().delete_other_time_area_by_control_center()
            DdeMethod().dde_control_center.click_by_attr("Btn_修改系统时区")
            sleep(2)
            DdeMethod().dde_control_center.click_by_attr("Editable_qlineedit")
            Src.input_message("Beijing")
            sleep(2)
            Src.enter()
            DdeMethod().dde_control_center.click_by_attr("Btn_确定")
            sleep(2)
            DdeMethod().dde_control_center.delete_other_time_area_by_control_center()
            DdeMethod().close_window()
        except Exception:
            DdeMethod().dde_control_center.kill_dde_control_center()
