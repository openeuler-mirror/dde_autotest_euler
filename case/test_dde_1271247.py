from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep
import pylinuxauto


class TestDdeCase(BaseCase):
    def test_dde_1271247(self):
        """终端关闭"""
        app_name = "deepin-terminal"
        DdeMethod().base_method_kill_process_by_cmd(app_name)
        pylinuxauto.ctrl_alt_t()
        sleep(6)
        DdeMethod().dde_terminal_method_click_option_by_attr()
        sleep(1)
        DdeMethod().base_method_click_by_ocr("远程管理")
        sleep(1)
        x, y = pylinuxauto.find_element_by_ocr("未添加").result
        pylinuxauto.click(x - 150, y)
        self.assert_ocr_not_exist("未添加")

        pylinuxauto.alt_f4()
        sleep(1)
        self.assert_process_status(False, app_name)

    def teardown_method(self):
        pylinuxauto.alt_f4()
