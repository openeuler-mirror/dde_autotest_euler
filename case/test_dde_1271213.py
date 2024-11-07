from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271213_1(self):
        """在字体管理器中搜索字体名称"""
        DdeMethod().open_software_by_launcher("zitiguanli")
        sleep(6)
        DdeMethod().search_font_in_font_manager("FreeMono-bold Oblique")
        self.assert_ocr_exist("FreeMono")

    def test_dde_1271213_2(self):
        """在字体管理器中搜索非字体名称"""
        DdeMethod().open_software_by_launcher("zitiguanli")
        sleep(6)
        DdeMethod().search_font_in_font_manager("FreeMono-bold##")
        self.assert_ocr_exist("无搜索结果")

    def teardown_method(self):
        """关闭字体管理器"""
        DdeMethod().kill_process("deepin-font-manager")
