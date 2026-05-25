from apps.dde_autotest_euler.method.base_method import BaseMethod


class DeepinDeviceManagerMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-devicemanager")

    def click_by_attr(self, path):
        """在设备管理器中通过元素点击"""
        self.dog.element_click(path)

    def right_click_by_attr(self, path):
        """在设备管理器中通过元素点击"""
        self.dog.element_click(path, button=3)
