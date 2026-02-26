#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/02/25
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget
from apps.dde_autotest_euler.module.dde_dock.dde_dock_dbus import DockDbus


class TestDdeCase(BaseCase):
    def test_dde_1979381(self):
        """【浏览器】【Tooltips】在任务栏显示tips """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏Firefox图标上
        dock.move_to_element_in_dock_by_attr("Btn_firefox")
        sleep(3)
        #【断言】:2.tips显示"Firefox"
        self.assert_ocr_exist("Firefox")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1979381(self):
        """前置和后置"""
        # Firefox：在任务栏驻留，且未打开
        dock = DdeDockPublicWidget()
        dock.kill_process("firefox")
        euler = DockDbus()
        euler.request_dock("firefox", 0)
        yield
        #【后置】:1.移动鼠标,取消hover
        dock.move_to(960,540)
        #【后置】:2.从任务栏移除驻留
        dock.remove_link_from_dock("firefox")
