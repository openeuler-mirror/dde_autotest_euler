#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2026/02/24
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1978841(self):
        """【字体管理器】【Tooltips】在任务栏显示tips """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标hover到任务栏字体管理器图标上
        dock.move_to_element_in_dock_by_attr("Btn_字体管理器")
        sleep(3)
        #【断言】:2.tips显示"字体管理器"
        self.assert_ocr_exist("字体管理器")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1978841(self):
        """前置和后置"""
        # 字体管理器：在任务栏驻留，且未打开
        dock = DdeDockPublicWidget()
        dock.kill_process("deepin-font-manager")
        dock.send_link_to_dock("字体管理器")
        yield
        #【后置】:1.移动鼠标,取消hover
        dock.move_to(960,540)
        #【后置】:2.从任务栏移除驻留
        dock.remove_link_from_dock("deepin-font-manager")
