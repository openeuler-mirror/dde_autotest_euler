from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1952375(self):
        """启动器打开日历"""
        euler = DdeMethod()
        euler.open_software_by_launcher("rili")
        sleep(3)
        res = OCR.ocr(
            "日程类型",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang='ch',
            max_match_number=1
        )
        if isinstance(res, tuple):
            # 存在日程类型，点击切换模式
            euler.dde_dock.click_by_img("calendar_style_change.png")
            sleep(2)
            self.assert_ocr_not_exist("日程类型", max_match_number=1)
        else:
            euler.dde_dock.click_by_img("calendar_style_change.png")
            sleep(2)
            self.assert_ocr_exist("日程类型")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-calendar")
        yield
        DdeMethod().kill_process("dde-calendar")
        DdeMethod().click_restore()
        DdeMethod().esc()
