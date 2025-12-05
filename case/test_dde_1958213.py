#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/12/04
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1958213(self):
        """【控制中心】【Tooltips】在任务栏显示tips """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏控制中心图标上
        dock.move_to_element_in_dock_by_attr("Btn_控制中心")
        sleep(3)
        #【断言】:2.tips显示"控制中心"
        self.assert_ocr_exist("控制中心")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1958213(self):
        """前置和后置"""
        # 控制中心：在任务栏驻留，且未打开
        dock = DdeDockPublicWidget()
        dock.kill_process("dde-control-center")
        dock.send_link_to_dock("控制中心")
        yield
        #【后置】:1.移动鼠标,取消hover        
        dock.move_to(960,540)
