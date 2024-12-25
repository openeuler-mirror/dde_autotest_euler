import pytest

from src import Src
from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271049_1(self):
        """截图录屏—图片不同格式-PNG"""
        euler = DdeMethod()
        euler.open_software_by_launcher("jietuluping")
        sleep(3)
        self.assert_process_status(True, "deepin-screen-recorder")
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        euler.deepin_screen_recorder.method_click_option_by_ocr("图片")
        sleep(3)
        euler.deepin_screen_recorder.method_click_option_by_ocr("PNG")
        sleep(1)
        euler.deepin_screen_recorder.method_click_screen_btn_by_image()
        self.assert_file_endwith_exist("Pictures/Screenshots", "png")

    def test_dde_1271049_2(self):
        """截图录屏—图片不同格式-JPG"""
        euler = DdeMethod()
        euler.open_software_by_launcher("jietuluping")
        sleep(3)
        self.assert_process_status(True, "deepin-screen-recorder")
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        euler.deepin_screen_recorder.method_click_option_by_ocr("图片")
        sleep(3)
        euler.deepin_screen_recorder.method_click_option_by_ocr("JPG")
        sleep(1)
        euler.deepin_screen_recorder.method_click_screen_btn_by_image()
        self.assert_file_endwith_exist("Pictures/Screenshots", "jpg")

    def test_dde_1271049_3(self):
        """截图录屏—图片不同格式-BMP"""
        euler = DdeMethod()
        euler.open_software_by_launcher("jietuluping")
        sleep(3)
        self.assert_process_status(True, "deepin-screen-recorder")
        Src.mouse_down(500, 500)
        Src.drag_to(600, 600, 1, 1)
        euler.deepin_screen_recorder.method_click_option_by_ocr("图片")
        sleep(3)
        euler.deepin_screen_recorder.method_click_option_by_ocr("BMP")
        sleep(1)
        euler.deepin_screen_recorder.method_click_screen_btn_by_image()
        self.assert_file_endwith_exist("Pictures/Screenshots", "bmp")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271049(self):
        """前置和后置"""
        yield
        Src.kill_process("deepin-screen-recorder")
        Src.run_cmd("rm -rf ~/Pictures/Screenshots/*")
        sleep(3)
