#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
@Author:
@Date  :2021/3/10 下午2:27
@Desc  :
"""
import pytest
from apps.dde_autotest_euler.method.vender.dde_file_manager_method import DdeFileManagerMethod
from apps.dde_autotest_euler.method.vender.dde_launcher_method import DdeLauncherMethod
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from apps.dde_autotest_euler.case.base_case import BaseCase
from public import DdeDesktopPublicWidget
from public import DdeDockPublicWidget
from src import Src, sleep


class TestFileManager(BaseCase):
    """文管-窗口测试类"""
    
    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1892483(self):
        """前置和后置"""
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(3)
        yield
        Src.kill_process("dde-file-manager")
        sleep(5)

    def test_dde_1892483(self):
        """打开窗口-在桌面点击文件管理图表，右键点击“文件管理器"""
        dde = DdeFileManagerMethod()
        dde.click_window_min_by_image()
        sleep(1)
        self.assert_ocr_not_exist("系统盘")
        DdeMethod().dde_dock.click_dde_file_manager_by_attr()
        sleep(1)
        self.assert_ocr_exist("系统盘")

