#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
【启动器】检查启动器快捷访问功能
用例编号：1979709
步骤1：检查左侧文件管理器快捷访问选项 -> 选项入口包括：计算机、文档、图片、音乐、视频、下载
步骤2：遍历点击上述所有选项 -> 都能正常进入对应的文件管理器目录
"""

import pytest

from src import sleep
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod


class TestDdeCase(BaseCase):
    """【启动器】检查启动器快捷访问功能"""

    def test_dde_1979709(self):
        """【启动器】检查启动器快捷访问功能 - 左侧入口齐全且均可进入对应目录"""
        euler = DdeMethod()

        # ========== 步骤1：检查左侧文件管理器快捷访问选项 ==========
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(3)
        self.assert_ocr_exist("搜索")

        # ========== 步骤2：遍历点击上述所有选项，验证进入对应目录 ==========
        # 计算机
        euler.dde_dock.click_by_img("launcher_computer_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("我的目录", "磁盘", mode="any")
        DdeMethod().kill_process("dde-file-manager")
        sleep(1)

        # 文档
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_dock.click_by_img("launcher_document_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("文档", mode="any")
        DdeMethod().kill_process("dde-file-manager")
        sleep(1)

        # 图片
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_dock.click_by_img("launcher_picture_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("图片", mode="any")
        DdeMethod().kill_process("dde-file-manager")
        sleep(1)

        # 音乐
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_dock.click_by_img("launcher_music_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("音乐", mode="any")
        DdeMethod().kill_process("dde-file-manager")
        sleep(1)

        # 视频
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_dock.click_by_img("launcher_video_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("视频", mode="any")
        DdeMethod().kill_process("dde-file-manager")
        sleep(1)

        # 下载
        euler.dde_dock.click_launcher_btn_by_attr()
        sleep(2)
        euler.dde_dock.click_by_img("launcher_download_icon.png")
        sleep(3)
        self.assert_process_status(True, "dde-file-manager")
        self.assert_ocr_exist("下载", mode="any")

    @pytest.fixture(scope="function", autouse=True)
    def setup_teardown_1979709(self):
        """后置：关闭文件管理器并恢复桌面"""
        yield
        DdeMethod().kill_process("dde-file-manager")
        DdeMethod().click_restore()
        sleep(2)
