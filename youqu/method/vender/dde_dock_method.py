from apps.dde_autotest_euler.method.base_method import BaseMethod


class DdeDockMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-dock")

    def click_by_attr(self, path):
        """在任务栏中通过元素点击"""
        self.dog.element_click(path)

    def right_click_by_attr(self, path):
        """在任务栏中通过元素右键点击"""
        self.dog.element_click(path, button=3)

    def click_dde_file_manager_by_attr(self):
        """在任务栏点击文件管理器"""
        self.click_by_attr("Btn_文件管理器")

    def click_launcher_btn_by_attr(self):
        """在任务栏点击启动器"""
        self.click_by_attr("Btn_launcheritem")

    def click_control_center_btn_by_attr(self):
        """在任务栏点击控制中心"""
        self.click_by_attr("Btn_控制中心")

    def click_network_connection_icon_by_attr(self):
        """在任务栏点击网络连接图标"""
        self.click_by_attr("Btn_network-item-key")

    def click_network_connection_switch_btn_by_attr(self):
        """在任务栏点击网络连接图标唤起的窗口中点击转换网络连接的按钮"""
        self.click_by_attr("Btn_dswitchbutton")

    def right_click_network_connection_icon_by_attr(self):
        """在任务栏中通过元素右键点击网络连接图标"""
        self.right_click_by_attr("Btn_network-item-key")

    def right_click_datetime_icon_by_attr(self):
        """在任务栏中通过元素右键点击右下角时间区域图标"""
        self.right_click_by_attr("Btn_datetime")

    def click_datetime_icon_by_attr(self):
        """在任务栏中通过元素点击右下角时间区域"""
        self.click_by_attr("Btn_datetime")

    def right_click_trash_icon_by_attr(self):
        """在任务栏中通过元素点击右下角回收站"""
        self.right_click_by_attr("Btn_trash")

    def get_x_y_terminal_icon_by_attr(self):
        """在任务栏中，鼠标移动到终端图标"""
        return self.dog.element_center("Btn_终端")

    def right_click_terminal_icon_by_attr(self):
        """在任务栏中，右键终端图标"""
        self.right_click_by_attr("Btn_终端")