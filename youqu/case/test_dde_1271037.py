from src import Src
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.base_method import BaseMethod
from apps.dde_autotest_euler.method.dde_method import DdeMethod
from src import sleep


class TestDdeCase(BaseCase):
    def test_dde_1271037(self):
        """在控制中心中修改当前账户密码"""
        DdeMethod().dde_dock.click_control_center_btn_by_attr()
        sleep(6)
        DdeMethod().change_current_account_password_by_control_center()
        DdeMethod().dde_control_center.click_automatic_login_btn_by_attr()
        Src.input_message(BaseMethod.change_password)
        sleep(3)
        Src.enter()
        sleep(3)
        self.assert_image_not_exist_in_dde("test_dde_1271037.png")

    def teardown_method(self):
        """将修改的当前账户密码重新设置为之前的密码"""
        DdeMethod().reset_current_account_password_from_change_password_by_control_center()
        DdeMethod().dde_control_center.click_automatic_login_btn_by_attr()
        Src.input_message(BaseMethod.account_message)
        sleep(3)
        Src.enter()
        sleep(3)
        DdeMethod().dde_control_center.kill_dde_control_center()
