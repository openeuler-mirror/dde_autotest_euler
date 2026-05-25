#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/02/28
@Author : chengweibin@uniontech.com
"""

from time import sleep

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import CmdCtl as Cmd
from src import Src
from src.ocr_utils import OCRUtils as OCR


class TestDdeCase(BaseCase):

    def test_dde_1979947(self):
        """启动器打开文本编辑器"""
        euler = DdeMethod()
        euler.open_software_by_launcher("wenbenbianjiqi")
        sleep(3)
        res = OCR.ocr(
            "文本编辑器",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang="ch",
            max_match_number=1,
        )
        self.assert_process_status(True, "deepin-editor")
        euler.dde_dock.click_by_img("dde_fonts_menu_icon.png")
        euler.dde_dock.click_by_ocr("主题")
        sleep(2)
        self.assert_ocr_exist("浅色", "深色", "跟随系统")

    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-editor")
        yield
        DdeMethod().kill_process("deepin-editor")
        DdeMethod().click_restore()
        DdeMethod().esc()
        DdeMethod().esc()
