from apps.dde_autotest_euler.method.base_method import BaseMethod
from src import sleep


class DeepinLogViewerMethod(BaseMethod):

    def __init__(self):
        super().__init__("deepin-log-viewer")

    def deepin_log_viewer_method_click_by_attr(self, path):
        """
        在日志收集工具中通过元素点击
        侧边栏模块属性名称：Boot Log,Xorg Log,Application Log,Boot-Shutdown Event
        """
        self.dog.element_click(path)

    def deepin_log_viewer_method_click_export_btn_by_attr(self):
        """在日志收集工具中通过元素点击导出按钮"""
        self.deepin_log_viewer_method_click_by_attr("导 出")

    def deepin_log_viewer_input_root_password(self):
        """在日志收集工具弹出鉴权窗口后输入管理员密码"""
        sleep(2)
        self.deepin_log_viewer_method_click_by_attr("EditableText_passwordinput")
        self.input_message(BaseMethod.account_message)
        sleep(3)
        self.enter()
        sleep(2)
