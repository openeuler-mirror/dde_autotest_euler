#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/02/26
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1979383(self):
        """【文档查看器】【Tooltips】在任务栏显示tips """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏文档查看器图标上
        dock.move_to_element_in_dock_by_attr("Btn_文档查看器")
        sleep(3)
        #【断言】:2.tips显示"文档查看器"
        self.assert_ocr_exist("文档查看器")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1979383(self):
        """前置和后置"""
        # 文档查看器：在任务栏驻留，且未打开
        dock = DdeDockPublicWidget()
        dock.kill_process("deepin-reader")
        dock.send_link_to_dock("文档查看器")
        yield
        #【后置】:1.移动鼠标,取消hover
        dock.move_to(960,540)
        #【后置】:2.从任务栏移除驻留
        dock.remove_link_from_dock("deepin-reader")
