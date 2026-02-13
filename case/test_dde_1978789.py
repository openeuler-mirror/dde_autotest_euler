#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
 【任务栏】右键注销
 用例编号：1978789
 步骤1：启动器打开终端 -> 终端打开
 步骤2：点击设置->主题-> 显示主题选项-浅色、深色、跟随系统
"""

from time import sleep
from src import Src
import pytest
from src import CmdCtl as Cmd
from src.ocr_utils import OCRUtils as OCR
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):

    def test_dde_1978789(self):
        """启动器打开终端"""
        euler = DdeMethod()
        euler.open_software_by_launcher("shebeiguanliqi")
        sleep(3)
        res = OCR.ocr(
            "终端",
            picture_abspath=None,
            similarity=0.6,
            return_first=False,
            lang='ch',
            max_match_number=1
        )
        self.assert_process_status(True, "deepin-terminal")
        euler.dde_dock.click_by_img("launcher_all_category_btn.png")
        euler.dde_dock.click_by_ocr("主题")
        sleep(2)
        self.assert_ocr_exist("浅色", "深色", "跟随系统")


    @pytest.fixture(autouse=True)
    def clear(self):
        DdeMethod().kill_process("deepin-terminal")
        yield
        DdeMethod().kill_process("deepin-terminal")
        DdeMethod().click_restore()
        DdeMethod().esc()
