#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Time   : 2025/08/15
@Author : xianglongfei@uniontech.com
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from public.dde_dock_public_widget import DdeDockPublicWidget


class TestDdeCase(BaseCase):
    def test_dde_1918249(self):
        """【任务栏】【托盘】任务栏有线网络图标hover下tips提示 """
        euler = DdeMethod()
        #【步骤】:1.鼠标hover到任务栏有线网络图标上
        location = euler.dde_dock.get_x_y_by_img("network_icon.png")
        euler.dde_dock.move_to(location[0], location[1])
        sleep(3)      
        #【断言】:2.tips显示"有线网络: IP地址"
        IP = euler.run_cmd("ifconfig| grep inet | awk 'NR==1{print $2}'")
        sleep(2)
        self.assert_ocr_exist(f"有线网络：{IP}")
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1918249(self):
        """前置和后置"""
        yield
        #【后置】:1.关闭控制中心
        dock = DdeDockPublicWidget()
        dock.move_to(960,540)
