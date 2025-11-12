from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1952393(self):
        """启动器打开日历"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rili")
        sleep(3)
        self.assert_ocr_exist("搜索日程")
        euler.dde_dock.click_by_ocr("搜索日程")
        sleep(2)
        Src.input_message("xxx")
        Src.enter()
        self.assert_ocr_exist("无搜索结果")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-calendar")
        yield
        DdeMethod().kill_process("dde-calendar")
        DdeMethod().click_restore()
        DdeMethod().esc()
