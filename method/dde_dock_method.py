from time import sleep
from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DdeDockMethod(BaseMethod):
    def dde_dock_method_click_by_attr(self, path):
        """在任务栏中通过元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/dde-dock/{path}").click()

    def dde_dock_method_right_click_by_attr(self, path):
        """在任务栏中通过元素右键点击"""
        pylinuxauto.find_element_by_attr_path(f"/dde-dock/{path}").right_click()

    def dde_dock_method_click_dde_file_manager_by_attr(self):
        """在任务栏点击文件管理器"""
        self.dde_dock_method_click_by_attr("Btn_文件管理器")

    def dde_dock_method_click_launcher_btn_by_attr(self):
        """在任务栏点击启动器"""
        self.dde_dock_method_click_by_attr("Btn_launcheritem")

    def dde_dock_method_click_control_center_btn_by_attr(self):
        """在任务栏点击控制中心"""
        self.dde_dock_method_click_by_attr("Btn_控制中心")

    def dde_dock_method_click_network_connection_icon_by_attr(self):
        """在任务栏点击网络连接图标"""
        self.dde_dock_method_click_by_attr("Btn_network-item-key")

    def dde_dock_method_click_network_connection_switch_btn_by_attr(self):
        """在任务栏点击网络连接图标唤起的窗口中点击转换网络连接的按钮"""
        self.dde_dock_method_click_by_attr("Btn_dswitchbutton")

    def dde_dock_method_right_click_network_connection_icon_by_attr(self):
        """在任务栏中通过元素右键点击网络连接图标"""
        self.dde_dock_method_right_click_by_attr("Btn_network-item-key")

    def dde_dock_method_right_click_datetime_icon_by_attr(self):
        """在任务栏中通过元素右键点击右下角时间区域图标"""
        self.dde_dock_method_right_click_by_attr("Btn_datetime")

    def dde_dock_method_click_datetime_icon_by_attr(self):
        """在任务栏中通过元素点击右下角时间区域"""
        self.dde_dock_method_click_by_attr("Btn_datetime")


if __name__ == "__main__":
    DdeDockMethod().dde_dock_method_click_datetime_icon_by_attr()
