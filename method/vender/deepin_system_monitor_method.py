from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinSystemMonitorMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-system-monitor")
    def deepin_system_monitor_method_click_by_attr(self, path):
        """ "在系统监视器中根据元素点击"""
        self.dog.element_click(path)

    def deepin_system_monitor_method_click_program_process_btn_by_attr(self):
        """在系统监听器中点击左上角 进程服务 按钮"""
        self.deepin_system_monitor_method_click_by_attr("程序进程")

    def deepin_system_monitor_method_click_system_services_btn_by_attr(self):
        """在系统监听器中点击左上角 系统服务 按钮"""
        self.deepin_system_monitor_method_click_by_attr("系统服务")

    def deepin_system_monitor_method_click_first_service_in_system_services(self):
        """在系统监听器的系统服务界面鼠标左键点击第一个服务"""
        self.click(500, 290)

    def deepin_system_monitor_method_right_click_first_service_in_system_services(self):
        """在系统监听器的系统服务界面鼠标右键点击第一个服务"""
        self.right_click(500, 290)

    def deepin_system_monitor_method_search_process_or_service(self, message):
        """在系统监听器上方的搜索框中搜索进程或是服务"""
        self.deepin_system_monitor_method_click_by_attr("DSearchEditIconButton")
        self.input_message(message)
        sleep(3)
        self.enter()
        sleep(1)


if __name__ == "__main__":
    sleep(3)
    DeepinSystemMonitorMethod().deepin_system_monitor_method_right_click_first_service_in_system_services()
