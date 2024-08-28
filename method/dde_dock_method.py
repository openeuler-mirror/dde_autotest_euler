from time import sleep
from funnylog2.config import config as funnylog2_config
funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
from youqu3 import log
from youqu3.gui import pylinuxauto
from config import config
from method.base_method import BaseMethod

@log
class DdeDockMethod(BaseMethod):


    def dde_dock_method_click_dde_file_manager_by_attr(self):
        """在任务栏点击文件管理器"""
        pylinuxauto.find_element_by_attr_path("/dde-dock/Btn_文件管理器").click()

    def dde_dock_method_click_launcher_btn_by_attr(self):
        """在任务栏点击启动器"""
        pylinuxauto.find_element_by_attr_path(
            "/dde-dock/Btn_launcheritem"
        ).click()

    def dde_dock_method_click_control_center_btn_by_attr(self):
        """在任务栏点击控制中心"""
        pylinuxauto.find_element_by_attr_path("/dde-dock/Btn_控制中心").click()
