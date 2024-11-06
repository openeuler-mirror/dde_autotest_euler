from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1271247(self):
        """终端关闭"""
        app_name = "deepin-terminal"
        DdeMethod().kill_process_by_cmd(app_name)
        Src.ctrl_alt_t()
        sleep(6)
        DdeMethod().deepin_terminal.click_option_by_attr()
        sleep(1)
        DdeMethod().click_by_ocr("远程管理")
        sleep(1)
        x, y = Src.ocrx("未添加").result
        Src.click(x - 150, y)
        self.assert_ocr_not_exist("未添加")

        Src.alt_f4()
        sleep(1)
        self.assert_process_status(False, app_name)

    def teardown_method(self):
        Src.alt_f4()
