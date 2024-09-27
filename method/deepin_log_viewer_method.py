from time import sleep

from funnylog2.config import config as funnylog2_config

funnylog2_config.CLASS_NAME_ENDSWITH = ["Method"]
import pylinuxauto
from method.base_method import BaseMethod


class DeepinLogViewerMethod(BaseMethod):
    def deepin_log_viewer_method_click_by_attr(self, path):
        """
        在日志收集工具中通过元素点击
        侧边栏模块属性名称：Boot Log,Xorg Log,Application Log,Boot-Shutdown Event
        """
        pylinuxauto.find_element_by_attr_path(f"/deepin-log-viewer/{path}").click()

    def deepin_log_viewer_method_click_export_btn_by_attr(self):
        """在日志收集工具中通过元素点击导出按钮"""
        self.deepin_log_viewer_method_click_by_attr("导 出")

    def deepin_log_viewer_input_root_password(self):
        """在日志收集工具弹出鉴权窗口后输入管理员密码"""
        sleep(2)
        pylinuxauto.find_element_by_attr_path(
            "/dde-polkit-agent/EditableText_passwordinput"
        ).click()
        pylinuxauto.input_message(BaseMethod.account_message)
        sleep(3)
        pylinuxauto.enter()
        sleep(2)
