#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1937701(self):
        """启动器-点击设备管理器，打开设备管理器"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        
        # 验证启动器已打开
        self.assert_ocr_exist("搜索")
        
        euler.open_software_by_launcher("shebeiguanliqi")
        sleep(5)
        
        self.assert_process_status(True, "deepin-devicemanager")
        self.assert_ocr_exist("设备管理器")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("deepin-devicemanager")
        DdeMethod().click_restore()
        sleep(2)
