from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeTerminalMethod(BaseMethod):
    def dde_terminal_method__right_click_by_xy(self):
        """通过右键点击【在终端中打开】"""
        pylinuxauto.right_click(960, 540)
        self.base_method_click_by_ocr("在终端中打开")