from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1979909(self):
        """启动器打开日历管理-通用设置-时间制的选项进行切换"""
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
        euler.dde_dock.click_by_img("calendar_manage.png")
        euler.dde_dock.click_by_ocr("管理")
        sleep(1)
        euler.dde_dock.click_by_ocr("每星期开始于")
        sleep(1)
        Src.mouse_scroll(-30)
        res = OCR.ocr(
            "24小时制",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang='ch',
            max_match_number=1
        )
        if isinstance(res, tuple):
            euler.dde_dock.click_by_ocr("24小时制")
            sleep(1)
            euler.dde_dock.click_by_ocr("12小时制")
            self.assert_ocr_exist("12小时制")
            # 还原
            euler.dde_dock.click_by_ocr("12小时制")
            sleep(1)
            euler.dde_dock.click_by_ocr("24小时制")
        else:
            euler.dde_dock.click_by_ocr("12小时制")
            sleep(1)
            euler.dde_dock.click_by_ocr("24小时制")
            self.assert_ocr_exist("24小时制")
            # 还原
            euler.dde_dock.click_by_ocr("24小时制")
            sleep(1)
            euler.dde_dock.click_by_ocr("12小时制")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("dde-calendar")
        yield
        DdeMethod().kill_process("dde-calendar")
        DdeMethod().click_restore()
        DdeMethod().esc()
