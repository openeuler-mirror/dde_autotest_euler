#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from config import config
from nocmd import Cmd


class BaseMethod:
    dde_control_center_path = "/dde-control-center"
    account_message = "uostest12#$"
    change_password = "testpass12#$"

    """应用的方法基类"""

    def dde_method_click_by_ocr(self, text):
        """通过ocr识别点击"""
        pylinuxauto.find_element_by_ocr(text).click()

    def dde_method_double_click_by_ocr(self, text):
        """通过ocr识别双击"""
        pylinuxauto.find_element_by_ocr(text).double_click()

    def dde_method_click_by_img(self, img_name):
        """通过图像识别点击"""
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").click()

    def dde_method_right_click_by_ocr(self, text):
        """通过ocr识别右键点击"""
        pylinuxauto.find_element_by_ocr(text).right_click()

    def dde_method_create_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下创建文件"""
        Cmd.run(f"touch ~/Documents/{filename}")
        Cmd.run(f"echo 'This is test message' >> ~/Documents/{filename}")

    def dde_method_delete_file_in_documents_by_cmd(self, filename):
        """通过给定名称在 文档 目录下删除文件"""
        Cmd.run(f"rm ~/Documents/{filename}")
