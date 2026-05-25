#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/08/08
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1916665(self):
        """【任务栏】【菜单】点击任务栏设置"""
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标在任务栏右键菜单点击：任务栏设置
        dock.click_right_menu_dock_set()
        #【断言】:1.控制中心打开
        sleep(3)
        self.assert_process_status(True,"dde-control-center")
        #【断言】:2.进入个性化菜单
        sleep(1)
        self.assert_ocr_exist("个性化")
        #【断言】:3.进入任务栏菜单
        sleep(1)
        self.assert_ocr_exist("任务栏")

    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1916665(self):
        """前置和后置"""
        yield
        #【后置】:1.关闭控制中心
        dock = DdeDockPublicWidget()
        dock.close_app("控制中心")
        sleep(3)
        #【断言】:1.控制中心关闭
        self.assert_process_status(False,"dde-control-center")
