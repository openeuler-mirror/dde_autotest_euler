#!/usr/bin/env python3
# _*_ coding:utf-8 _*_

import pytest

from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep, filectl


class TestDdeCase(BaseCase):

    def test_dde_1912185_1(self):
        """启动器-点击计算机图标"""
        euler = DdeMethod()
        
        # 1. 打开启动器
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        
        # 验证启动器已打开
        self.assert_ocr_exist("搜索")
        
        # 2. 点击计算机图标
        euler.dde_dock.click_by_img("launcher_computer_icon.png")
        sleep(3)
        
        # 验证计算机应用已启动（文件管理器应该打开）
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("我的目录")
        self.assert_ocr_exist("磁盘")

    def test_dde_1912185_2(self):
        """启动器-点击文档图标"""
        filectl.FileCtl.creat_files("Documents/", "testdoc")
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_dock.click_by_img("launcher_document_icon.png")
        sleep(3)

        self.assert_process_status(True, "dde-file-manager ")
        self.assert_ocr_exist("testdoc")

    def test_dde_1912185_3(self):
        """启动器-点击图片图标"""
        filectl.FileCtl.creat_files("Pictures/", "testpic")
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_dock.click_by_img("launcher_picture_icon.png")
        sleep(3)

        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("testpic")

    def test_dde_1912185_4(self):
        """启动器-点击音乐图标"""
        filectl.FileCtl.creat_files("Music/", "testmus")
        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_dock.click_by_img("launcher_music_icon.png")
        sleep(3)

        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("testmus")

    def test_dde_1912185_5(self):
        """启动器-点击视频图标"""
        filectl.FileCtl.creat_files("Videos/", "testvid")

        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_dock.click_by_img("launcher_video_icon.png")
        sleep(3)

        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("testvid")


    def test_dde_1912185_6(self):
        """启动器-点击下载图标"""
        filectl.FileCtl.creat_files("Downloads/", "testdow")

        euler = DdeMethod()
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)

        euler.dde_dock.click_by_img("launcher_download_icon.png")
        sleep(3)

        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("testdow")


    @pytest.fixture(autouse=True)
    def setup_teardown(self):
        yield
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().click_restore()
        sleep(2)
