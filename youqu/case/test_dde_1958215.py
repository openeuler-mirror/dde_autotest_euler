#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/12/05
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1958215(self):
        """【文件管理器】【Tooltips】在任务栏显示tips """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏文件管理器图标上
        dock.move_to_element_in_dock_by_attr("Btn_文件管理器")
        sleep(3)
        #【断言】:2.tips显示"文件管理器"
        self.assert_ocr_exist("文件管理器")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1958215(self):
        """前置和后置"""
        # 控制中心：在任务栏驻留，且未打开
        dock = DdeDockPublicWidget()
        dock.kill_process("dde-file-manager")
        dock.send_link_to_dock("文件管理器")
        yield
        #【后置】:1.移动鼠标,取消hover        
        dock.move_to(960,540)
