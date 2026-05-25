#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
@Time   : 2025/6/12
@Author : xianglongfei@uniontech.com
@Desc   : 任务栏dbus接口
"""
import json
import dbus
from src import DbusUtils
from src import CmdCtl


class DockDbus:
    """任务栏接口属性"""
    DBUS_NAME = "com.deepin.dde.daemon.Dock"
    OBJECT_PATH = "/com/deepin/dde/daemon/Dock"
    INTERFACE = "com.deepin.dde.daemon.Dock"

    @classmethod
    def dock_dbus_object(cls):
        """初始化DockDbus,并继承DbusUtils类基础方法"""
        return DbusUtils(
            DockDbus.DBUS_NAME, DockDbus.OBJECT_PATH, DockDbus.INTERFACE
        )

    @staticmethod
    def _dbus_string_format(dbus_array):
        """格式化dbus.Array | dbus.String返回值
        :Param dbus_Array: <list> dbus原始数据列表
        :Return: <list> desktop_files格式化后的数据列表
        """
        desktop_files = []
        for i in range(len(dbus_array)):
            desktop_file = dbus_array[i].split(',')[0]
            desktop_files.append(desktop_file)
        return list(desktop_files)

    @classmethod
    def get_plugin_settings(cls, name, value):
        """获取插件在任务栏是否设置
        :Param name: <str> 插件名称
                        AiAssistant (桌面智能助手)
                        datetime （时间)
                        multitasking (多任务视图)
                        notifications（通知中心）
                        onboard（屏幕键盘
                        show-desktop (显示桌面)
                        shutdown (电源)
                        trash (回收站)
                        tray (托盘区域)
        :Param value: <str> 属性
                        enable (可用)
                        Use24HourFormat (24小时制) ---对应datetime使用
                        fashion-tray-expanded (托盘区域展开) ---对应tray使用
        :Return: <bool> True 或 False
        """
        try:
            json_v = cls.dock_dbus_object().session_object_methods().GetPluginSettings()
            b_v = json.loads(json_v).get(name).get(value)
            if b_v is None:
                b_v = True
            return bool(b_v)
        except (AttributeError, ValueError, TypeError):
            raise Exception("key:%s 或 value:%s 没有发现" % (name, value))

    @classmethod
    def is_docked(cls, desktop):
        """图标是否驻留在dock上
        :Param desktop: <str> desktop文件名，不带后缀名
        :Return: <bool> True 或 False
        """
        desktop = f"/usr/share/applications/{desktop}.desktop"
        b_v = cls.dock_dbus_object().session_object_methods().IsDocked(desktop)
        return bool(b_v)

    @classmethod
    def is_on_dock(cls, desktop):
        """图标是否显示在dock上
        :Param desktop: <str> desktop文件名，不带后缀名
        :Return: <bool> True 或 False
        """
        desktop = f"/usr/share/applications/{desktop}.desktop"
        b_v = cls.dock_dbus_object().session_object_methods().IsOnDock(desktop)
        return bool(b_v)

    @classmethod
    def request_dock(cls, desktop, index):
        """图标发送到dock上，index是位置，从0开始，对应dock位置是1
        :Param desktop: <str> desktop文件名，不带后缀名
        :Param index: <int> dock中间区域的位置（从0开始，对应位置为1）
        :Return: <bool> True 或 False
        """
        desktop = f"/usr/share/applications/{desktop}.desktop"
        b_v = cls.dock_dbus_object().session_object_methods().RequestDock(desktop, int(index))
        return bool(b_v)

    @classmethod
    def request_undock(cls, desktop):
        """图标从dock移除
        :Param desktop: <str> desktop文件名，不带后缀名
        :Return: <bool> True 或 False
        """
        desktop = f"/usr/share/applications/{desktop}.desktop"
        b_v = cls.dock_dbus_object().session_object_methods().RequestUndock(desktop)
        return bool(b_v)

    @classmethod
    def get_docked_apps_desktop_files(cls):
        """获取dock上应用的Desktop文件位置列表
        :Return: <list> Desktop文件位置列表
            如：'/usr/share/applications/google-chrome.desktop'
        """
        l_v = cls.dock_dbus_object().session_object_methods().GetDockedAppsDesktopFiles()
        l_v = cls._dbus_string_format(l_v)
        return list(l_v)

    @classmethod
    def get_dock_app_index(cls, app_name):
        """获取dock上应用驻留的索引index, 从0开始，对应dock位置是1
        :Param app_name: <str> desktop文件名，不带后缀名
        :Return: <int> 应用驻留在任务栏的索引index
        """
        app_list = cls.dock_dbus_object().session_object_methods().GetDockedAppsDesktopFiles()
        desktop_file = '/usr/share/applications/' + app_name + '.desktop'
        try:
            return app_list.index(desktop_file)
        except ValueError:
            raise Exception(f"{app_name}:任务栏未驻留")

    @classmethod
    def get_entry_ids(cls):
        """获取dock上应用名称列表
        :Return: <list> AppID列表（Desktop文件列表)，不带后缀名
            如：'google-chrome'
        """
        l_v = cls.dock_dbus_object().session_object_methods().GetEntryIDs()
        l_v = cls._dbus_string_format(l_v)
        return list(l_v)

    @classmethod
    def get_frontend_window_rect(cls):
        """获取当前dock坐标范围大小 (x,y,width,height)
        :Return: <list> 坐标范围大小(x,y,width,height)
            如：(10,1030,1900,40)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('FrontendWindowRect')
        return list(s_v)

    @classmethod
    def get_display_mode(cls):
        """获取dock当前模式设置:1高效,0时尚
        :Return: <int> dock当前模式(1高效,0时尚)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('DisplayMode')
        return int(s_v)

    @classmethod
    def get_hide_mode(cls):
        """获取dock当前状态设置：0一直显示,1一直隐藏,3智能隐藏
        :Return: <int> dock当前状态设置(0一直显示,1一直隐藏,3智能隐藏)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('HideMode')
        return int(s_v)

    @classmethod
    def get_hide_state(cls):
        """获取dock当前显示状态：1显示,2隐藏
        :Return: <int> dock当前显示状态(1显示,2隐藏)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('HideState')
        return int(s_v)

    @classmethod
    def get_position(cls):
        """获取dock当前位置设置：0上,1右,2下,3左
        :Return: <int> dock当前位置(0上,1右,2下,3左)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('Position')
        return int(s_v)

    @classmethod
    def get_window_size_efficient(cls):
        """获取高效模式dock当前大小
        :Return: <int> 高效模式dock当前大小(如：40)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('WindowSizeEfficient')
        return int(s_v)

    @classmethod
    def set_window_size_efficient(cls, efficient_size):
        """设置高效模式dock大小
        :Param efficient_size: <int> 高效模式dock大小
        :Return: None
        """
        cls.dock_dbus_object().set_session_properties_value(
            'WindowSizeEfficient', dbus.UInt32(efficient_size))

    @classmethod
    def get_window_size_fashion(cls):
        """获取时尚模式dock当前大小
        :Return: <int> 时尚模式dock当前大小(如：40)
        """
        s_v = cls.dock_dbus_object().get_session_properties_value('WindowSizeFashion')
        return int(s_v)

    @classmethod
    def set_window_size_fashion(cls, fashion_size):
        """设置时尚模式dock大小
        :Param fashion_size: <int> 时尚模式dock大小
        :Return: None
        """
        cls.dock_dbus_object().set_session_properties_value(
            'WindowSizeFashion', dbus.UInt32(fashion_size))
