from time import sleep

from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DeepinSystemMonitorMethod(BaseMethod):
    def deepin_system_monitor_method_click_by_attr(self, path):
        """ "在系统监视器中根据元素点击"""
        pylinuxauto.find_element_by_attr_path(f"/deepin-system-monitor/{path}").click()

    def deepin_system_monitor_method_click_program_process_btn_by_attr(self):
        """在系统监听器中点击左上角 进程服务 按钮"""
        self.deepin_system_monitor_method_click_by_attr("程序进程")

    def deepin_system_monitor_method_click_system_services_btn_by_attr(self):
        """在系统监听器中点击左上角 系统服务 按钮"""
        self.deepin_system_monitor_method_click_by_attr("系统服务")

    def deepin_system_monitor_method_click_first_service_in_system_services(self):
        """在系统监听器的系统服务界面鼠标左键点击第一个服务"""
        pylinuxauto.click(500, 290)

    def deepin_system_monitor_method_right_click_first_service_in_system_services(self):
        """在系统监听器的系统服务界面鼠标右键点击第一个服务"""
        pylinuxauto.right_click(500, 290)

    def deepin_system_monitor_method_search_process_or_service(self, message):
        """在系统监听器上方的搜索框中搜索进程或是服务"""
        self.deepin_system_monitor_method_click_by_attr("DSearchEditIconButton")
        pylinuxauto.input_message(message)
        sleep(3)
        pylinuxauto.enter()
        sleep(1)


if __name__ == "__main__":
    sleep(3)
    DeepinSystemMonitorMethod().deepin_system_monitor_method_right_click_first_service_in_system_services()
