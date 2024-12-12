from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.method.vender.deepin_font_manager_method import DeepinFontManagerMethod
from apps.dde_autotest_euler.method.vender.dde_file_manager_method import DdeFileManagerMethod
from src import sleep


class TestFontForbiddenCase(BaseCase):

    def test_dde_1271207_1(self):
        """字体管理器-启用禁用字体"""
        DdeMethod().open_software_by_launcher("zitiguanli")
        sleep(6)
        font = DeepinFontManagerMethod()
        font.method_click_menu_by_image()
        font.method_click_add_font_by_ocr()
        font.method_search_fonts("dde_autotest_euler/method/static_res/fonts/NotoSansLinearB")
        font.method_import_one_fonts_by_ocr("NotoSansLinearB-Regular")
        sleep(3)

        font.method_click_activated_by_ocr()
        sleep(2)
        DdeMethod().search_font_in_font_manager("Noto Sans Linear")
        font.method_forbidden_font_by_ocr("Noto Sans Linear B-Regular")
        sleep(2)

        self.assert_ocr_not_exist("Noto Sans Linear B-Regular")

        font.method_click_user_fonts_by_ocr()
        sleep(2)
        font.method_active_font_by_ocr("Noto Sans Linear B-Regular")

        font.method_click_activated_by_ocr()
        sleep(2)

        self.assert_ocr_exist("Noto Sans Linear B-Regular")

        font.method_click_font_by_ocr("Noto Sans Linear B-Regular")
        DeepinFontManagerMethod().method_del_font()
        # sleep(3)

    def teardown_method(self):
        """关闭字体管理器"""
        DdeMethod().kill_process("deepin-font-manager")
