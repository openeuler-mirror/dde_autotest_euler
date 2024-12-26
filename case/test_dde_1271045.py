import pytest

from src import Src
from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1271045(self):
        """截图录屏-撤销"""
        euler = DdeMethod()
        euler.open_software_by_launcher("jietuluping")
        sleep(3)
        self.assert_process_status(True, "deepin-screen-recorder")
        Src.mouse_down(300, 300)
        Src.drag_to(600, 600, 1, 1)
        euler.deepin_screen_recorder.method_click_text_btn_by_image()
        Src.click(350, 350)
        Src.input_message("test")
        sleep(1)
        Src.click(450, 450)
        self.assert_image_exist_in_dde("test_dde_1271045_1.png")
        sleep(1)
        Src.right_click(450, 450)
        euler.deepin_screen_recorder.click_by_ocr("撤销")
        self.assert_image_exist_in_dde("test_dde_1271045_2.png")



    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271045(self):
        """前置和后置"""
        yield
        Src.kill_process("deepin-screen-recorder")
        Src.run_cmd("rm -rf ~/Pictures/Screenshots/*")
        Src.run_cmd("rm -rf ~/.config/deepin/deepin-screen-recorder.conf")
        sleep(3)
