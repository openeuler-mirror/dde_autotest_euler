from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1893167(self):
        """电源右键菜单功能-查看选项"""
        euler = DdeMethod()
        euler.dde_dock.right_click_by_img("launcher_power_btn.png")
        sleep(6)
        self.assert_ocr_exist("关机", "重启", "锁定", "电源设置")


    def teardown_method(self):
        """关闭展示"""
        Src.hot_key("Esc")
