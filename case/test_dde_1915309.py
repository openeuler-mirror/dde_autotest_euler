#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1915309(self):
        """启动器-系统监视器"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        
        # 验证启动器已打开
        self.assert_ocr_exist("搜索")
        
        # 2. 点击系统监视器图标
        euler.dde_dock.click_by_img("launcher_system_monitor.png")
        sleep(3)
        
        self.assert_process_status(True, "deepin-system-monitor")
        self.assert_ocr_exist("系统监视器")
        self.assert_ocr_exist("程序进程")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("deepin-system-monitor")
        DdeMethod().click_restore()
        sleep(2)
