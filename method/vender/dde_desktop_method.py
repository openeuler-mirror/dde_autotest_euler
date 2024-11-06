from apps.dde_autotest_euler.method.base_method import BaseMethod


class DdeDesktopMethod(BaseMethod):

    def __init__(self):
        super().__init__("dde-desktop")

    def click_by_attr(self, path):
        """在启动器中通过元素点击"""
        self.dog.element_click(path)
