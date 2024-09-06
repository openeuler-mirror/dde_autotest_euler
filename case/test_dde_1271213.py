from case.base_case import BaseCase
from method.dde_method import DdeMethod
from pylinuxauto import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271213_1(self):
        """在字体管理器中搜索字体名称"""
        DdeMethod().dde_method_open_software_by_launcher("zitiguanli")
        sleep(6)
        DdeMethod().dde_method_search_font_in_font_manager("FreeMono-bold Oblique")
        self.assert_image_exist_in_dde("test_dde_1271213.png")

    def test_dde_1271213_2(self):
        """在字体管理器中搜索非字体名称"""
        DdeMethod().dde_method_open_software_by_launcher("zitiguanli")
        sleep(6)
        DdeMethod().dde_method_search_font_in_font_manager("FreeMono-bold##")
        self.assert_ocr_exist("无搜索结果")

    def teardown_method(self):
        """关闭字体管理器"""
        DdeMethod().dde_method_close_window()
