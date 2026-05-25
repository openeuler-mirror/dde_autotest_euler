from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1977533(self):
        """启动器打开字体管理器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("zitiguanliqi")
        sleep(3)
        res = OCR.ocr(
            "字体管理器",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang='ch',
            max_match_number=1
        )
        self.assert_process_status(True, "deepin-font-manager")
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        euler.dde_dock.click_by_ocr("主题")
        sleep(2)
        self.assert_ocr_exist("浅色", "深色", "跟随系统")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-font-manager")
        yield
        DdeMethod().kill_process("deepin-font-manager")
        DdeMethod().click_restore()
        DdeMethod().esc()
