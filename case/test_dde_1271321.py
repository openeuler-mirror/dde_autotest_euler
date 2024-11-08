from src import sleep
from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1271321(self):
        """任务栏-系统时间"""
        euler = DdeMethod()
        euler.dde_dock.click_datetime_icon_by_attr()
        sleep(2)
        self.assert_ocr_exist("日历")
        sleep(1)
        DdeMethod().kill_process("dde-calendar")
        sleep(1)
        euler.dde_dock.right_click_datetime_icon_by_attr()
        Src.select_menu(1)
        sleep(1)
        self.assert_ocr_exist("午")
        euler.dde_dock.right_click_datetime_icon_by_attr()
        Src.select_menu(1)
        self.assert_ocr_not_exist("午")
        sleep(1)
        euler.dde_dock.right_click_datetime_icon_by_attr()
        Src.select_menu(2)
        sleep(2)
        self.assert_ocr_exist("时间日期")

    def teardown_method(self):
        """通过命令关闭控制中心窗口"""
        DdeMethod().kill_process("dde-calendar")
