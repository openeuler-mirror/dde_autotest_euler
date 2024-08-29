#!/usr/bin/env python3
# _*_ coding:utf-8 _*_
"""
:Author:uos
:Date  :2024/08/22 13:15:47
"""

from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3.gui import pylinuxauto
from config import config


class BaseMethod:
    dde_control_center_path = "/dde-control-center"
    account_massage = "uostest12#$"

    """应用的方法基类"""

    def dde_method_click_by_ocr(self, text):
        """通过ocr识别点击"""
        pylinuxauto.find_element_by_ocr(text).click()

    def dde_method_click_by_img(self, img_name):
        """通过图像识别点击"""
        pylinuxauto.find_element_by_image(f"{config.IMAGE_RES}/{img_name}").click()
