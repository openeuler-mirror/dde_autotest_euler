
from apps.dde_autotest_euler.case.base_case import BaseCase
from apps.dde_autotest_euler.method.dde_method import DdeMethod

from src import CmdCtl as Cmd
from src import Src, sleep

from apps.dde_autotest_euler.config import config

class TestDdeCase(BaseCase):

    def setup(self):

        self.pic_dir = "/tmp/test_dde_1271071"
        self.formats = ["jpg", "jpeg", "bmp", "png", "gif"]
        Cmd.run_cmd(f"mkdir {self.pic_dir}")
        for fm in self.formats:
            Cmd.run_cmd(f"cp {config.ASSERT_RES}/test_dde_1271071.{fm} {self.pic_dir}")

    def test_dde_1271071(self):

        Cmd.run_cmd("dde-file-manager /tmp/test_dde_1271071 &")

        euler = DdeMethod()

        for fm in self.formats:
            euler.dde_dock.double_click_by_ocr(fm)
            sleep(2)
            self.assert_ocr_exist(f"测试图片{fm.upper()}")
            Src.alt_f4()

    def teardown(self):

        Src.alt_f4()
        DdeMethod().kill_process("dde-file-manager")
        Cmd.run_cmd(f"rm -rf {self.pic_dir}")
        DdeMethod().click_restore()
