#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/02/13
@Author : chengweibin@uniontech.com
"""

from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1978831(self):
        """启动器打开系统监视器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("xitongjianshiqi")
        sleep(3)
        res = OCR.ocr(
            "系统监视器",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang='ch',
            max_match_number=1
        )
        self.assert_process_status(True, "deepin-system-monitor")
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        euler.dde_dock.click_by_ocr("主题")
        sleep(2)
        self.assert_ocr_exist("浅色", "深色", "跟随系统")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-system-monitor")
        yield
        DdeMethod().kill_process("deepin-system-monitor")
        DdeMethod().click_restore()
        DdeMethod().esc()
