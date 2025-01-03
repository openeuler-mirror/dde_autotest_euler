from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.deepin_font_manager_method import DeepinFontManagerMethod
from apps.dde_autotest_euler.method.vender.dde_file_manager_method import DdeFileManagerMethod
from src import sleep


class TestFontAddCase(BaseCase):

    def test_dde_1271211_1(self):
        """字体管理器-导入一个字体"""
        DdeMethod().open_software_by_launcher("zitiguanli")
        sleep(6)
        DeepinFontManagerMethod().method_click_menu_by_image()
        DeepinFontManagerMethod().method_click_add_font_by_ocr()
        DeepinFontManagerMethod().method_search_fonts_by_image("dde_autotest_euler/method/static_res/fonts/fangzheng")
        DeepinFontManagerMethod().method_import_one_fonts_by_ocr()
        self.assert_ocr_exist("吕建德字体")
        DeepinFontManagerMethod().method_del_font_by_image()
        sleep(3)

    def test_dde_1271211_2(self):
        """字体管理器-导入多个字体"""
        DdeMethod().open_software_by_launcher("zitiguanli")
        sleep(6)
        DeepinFontManagerMethod().method_click_menu_by_image()
        DeepinFontManagerMethod().method_click_add_font_by_ocr()
        DeepinFontManagerMethod().method_search_fonts_by_image("dde_autotest_euler/method/static_res/fonts/fangzheng")
        DeepinFontManagerMethod().method_import_many_fonts_by_ocr()
        self.assert_ocr_exist("吕建德字体")
        self.assert_ocr_exist("真广标简体")
        DeepinFontManagerMethod().method_del_font_by_image()
        sleep(2)

    def teardown_method(self):
        """关闭字体管理器"""
        DdeMethod().kill_process("deepin-font-manager")
