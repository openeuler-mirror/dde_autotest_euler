from time import sleep

from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeDeviceManagerMethod(BaseMethod):
    def dde_device_manager_method_click_by_attr(self, path):
        """在设备管理器中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-devicemanager/{path}").click()
