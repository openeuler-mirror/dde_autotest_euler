#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/11/26
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from public.dde_dock_public_widget import DdeDockPublicWidget
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    def test_dde_1956757(self):
        """【任务栏】个性化任务栏设置模式切换 """
        dock = DdeDockPublicWidget()
        #【步骤】:1.鼠标在任务栏右键菜单点击：任务栏设置
        dock.click_right_menu_dock_set()
        sleep(3)
        #【断言】:1.控制中心打开
        self.assert_process_status(True,"dde-control-center")
        #【断言】:2.进入个性化菜单
        sleep(1)
        self.assert_ocr_exist("个性化")
        #【断言】:3.进入任务栏菜单
        sleep(1)
        self.assert_ocr_exist("任务栏")
        #【断言】:4.进入高效模式
        sleep(1)
        self.assert_ocr_exist("高效模式")
        # 点击切换成时尚模式
        euler=DdeMethod()
        euler.dde_dock.click_by_ocr("高效模式")
        sleep(1)
        euler.dde_dock.click_by_ocr("时尚模式")
        sleep(1)
        #【断言】:5.进入时尚模式
        self.assert_dock_mode(0)
        # 点击切换成高效模式
        euler.dde_dock.click_by_ocr("时尚模式")
        sleep(1)
        euler.dde_dock.click_by_ocr("高效模式")
        sleep(1)
        #【断言】:6.进入高效模式
        self.assert_dock_mode(1)

    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1956757(self):
        """前置和后置"""
        yield
        #【后置】:1.关闭控制中心
        dock = DdeDockPublicWidget()
        dock.close_app("控制中心")
        sleep(3)
        #【断言】:1.控制中心关闭
        self.assert_process_status(False,"dde-control-center")
