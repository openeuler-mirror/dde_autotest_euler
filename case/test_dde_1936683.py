#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):

    def test_dde_1936683(self):
        """启动器-点击计算机，打开计算机"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        
        # 验证启动器已打开
        self.assert_ocr_exist("搜索")
        
        euler.dde_dock.click_by_img("launcher_computer_icon.png")
        sleep(3)
        
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("文件管理器", "我的目录")

    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().click_restore()
        sleep(2)
