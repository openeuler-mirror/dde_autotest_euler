from pylinuxauto import sleep
import pylinuxauto
from case.base_case import BaseCase
from method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271321(self):
        """任务栏-系统时间"""
        euler = DdeMethod()
        euler.dde_dock_method_click_datetime_icon_by_attr()
        sleep(2)
        self.assert_ocr_exist("日历")
        sleep(1)
        euler.dde_method_close_window()
        sleep(1)
        euler.dde_dock_method_right_click_datetime_icon_by_attr()
        pylinuxauto.select_menu(1)
        sleep(1)
        self.assert_ocr_exist("午")
        euler.dde_dock_method_right_click_datetime_icon_by_attr()
        pylinuxauto.select_menu(1)
        self.assert_ocr_not_exist("午")
        sleep(1)
        euler.dde_dock_method_right_click_datetime_icon_by_attr()
        pylinuxauto.select_menu(2)
        sleep(2)
        self.assert_ocr_exist("时间日期")

    def teardown_method(self):
        """通过命令关闭控制中心窗口"""
        DdeMethod().dde_method_close_window()
