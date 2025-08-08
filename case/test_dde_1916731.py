#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1916731(self):
        """启动器-点击控制中心图标，打开控制中心"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        
        # 验证启动器已打开
        self.assert_ocr_exist("搜索")
        
        euler.dde_dock.click_by_img("launcher_control_center_icon.png")
        sleep(3)
        
        self.assert_process_status(True, "dde-control-center")
        self.assert_ocr_exist("控制中心", "帐户", "显示", "默认程序")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("dde-control-center")
        DdeMethod().click_restore()
        sleep(2)
