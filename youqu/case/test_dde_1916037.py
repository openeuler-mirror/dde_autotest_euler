from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep
from src import Src


class TestDdeCase(BaseCase):
    def test_dde_1916037(self):
        """控制中心-时间日期-页面内容展示"""
        euler = DdeMethod()
        euler.dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        euler.dde_dock.click_by_ocr("时间日期")
        sleep(6)
        self.assert_ocr_exist('24小时制', '时区列表', '时间设置')
        euler.dde_dock.click_by_ocr("时间设置")
        sleep(6)
        self.assert_ocr_exist('自动同步配置', '服务器')
        euler.dde_dock.click_by_ocr("格式设置")
        sleep(6)
        self.assert_ocr_exist('时间格式设置', '货币格式', '数字格式')

    def teardown_method(self):
        """关闭控制中心"""
        DdeMethod().dde_control_center.kill_dde_control_center()
