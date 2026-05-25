#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/08/14
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1271323(self):
        """任务栏——托盘区域——网络连接"""
        # 关闭网络/启用网络，不适合自动化测试，所以跳过实现 #
        euler = DdeMethod()
        #【步骤】:1.鼠标在任务栏网络图标：右键
        euler.dde_dock.right_click_by_img("network_icon.png")
        sleep(2)
        #【步骤】:2.鼠标在任务栏右键菜单点击：网络设置        
        euler.dde_dock.click_by_ocr("网络设置")
        #【断言】:1.控制中心打开
        sleep(3)
        self.assert_process_status(True,"dde-control-center")
        #【断言】:2.进入网络菜单
        sleep(1)
        self.assert_ocr_exist("网络")
        #【断言】:3.进入有线网络
        sleep(1)
        self.assert_ocr_exist("有线网络")

    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1271323(self):
        """前置和后置"""
        yield
        #【后置】:1.关闭控制中心
        dock = DdeDockPublicWidget()
        dock.close_app("控制中心")
        sleep(3)
        #【断言】:1.控制中心关闭
        self.assert_process_status(False,"dde-control-center")
