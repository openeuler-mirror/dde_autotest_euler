#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/08/20
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1918663(self):
        """【任务栏】任务栏启动器图标hover下tips提示 """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏启动器图标上
        dock.move_to_element_in_dock_by_attr("Btn_launcheritem")
        sleep(2)
        #【断言】:2.tips显示"启动器"
        self.assert_ocr_exist("启动器")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1918663(self):
        """前置和后置"""
        yield
        #【后置】:1.移动鼠标,取消hover
        dock = DdeDockPublicWidget()
        dock.move_to(960,540)
