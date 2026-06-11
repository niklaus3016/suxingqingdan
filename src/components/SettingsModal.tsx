import React, { useState, useEffect } from 'react';
import { Category, TodoItem } from '../types';
import { getStorageSizeWithLabel } from '../utils/storage';
import { X, Trash2, AlertTriangle, ChevronLeft, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { AgreementModal } from './PrivacyAgreement';
import { PrivacyPolicyContent } from './AgreementContent';

interface SettingsModalProps {
  onClose: () => void;
  onClearCompleted: () => void;
  onResetAll: () => void;
  onImportSuccess: (categories: Category[], items: TodoItem[]) => void;
}

export default function SettingsModal({
  onClose,
  onClearCompleted,
  onResetAll,
  onImportSuccess,
}: SettingsModalProps) {
  const [dbSize, setDbSize] = useState('0.00 KB');
  const [showDangerReset, setShowDangerReset] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    setDbSize(getStorageSizeWithLabel());
  }, []);

  // Unused handlers removed as requested to keep UI clean and minimalist

  const executeReset = () => {
    onResetAll();
    setShowDangerReset(false);
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-white dark:bg-zinc-900 z-50 flex flex-col h-full overflow-hidden animate-slide-in-right">
      
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 select-none">
        <button
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg focus:outline-none hover:bg-gray-100 dark:hover:bg-zinc-850 flex items-center gap-1 transition-all touch-target"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">返回</span>
        </button>

        <h2 className="text-base font-bold text-gray-900 dark:text-zinc-50 flex items-center gap-1.5">
          <span>⚙️</span> 系统设置
        </h2>

        {/* Symmetry spacer to balance layout */}
        <div className="w-16 h-8 opacity-0 pointer-events-none" />
      </div>

      {/* Configurations content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-12">
          


          {/* About APP Intro Section */}
          <div className="space-y-3 animate-fade-in">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              关于速行清单
            </h3>
            
            <div className="bg-gray-50/80 dark:bg-zinc-950/60 border border-gray-200/50 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/10">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-zinc-100 font-display">速行清单</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[9px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">V1.0</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed font-sans font-medium">
                这是一款专为移动设备与高频记忆场景打造的备忘工具。采用轻羽级的极简交互，致力于在没有任何干扰、多余云同步的情境下，提供闪电般的清单管理体验。
              </p>

              <div className="space-y-3.5 border-t border-gray-200/50 dark:border-zinc-800/80 pt-4">
                <div className="flex items-start gap-2.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">极简专注，拒绝臃肿</span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-normal">
                      剔除不常用的繁复流程，回归待办录入的基本面，只为高能的您减负。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <span className="text-sm shrink-0">📱</span>
                  <div>
                    <span className="font-bold text-gray-900 dark:text-zinc-100">原生级移动端设计</span>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400 mt-0.5 leading-normal">
                      优化单手操作触控范围，去除容易遮挡的多余 hover 提示，手机无缝使用。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Policy section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              数据隐私
            </h3>
            <button
              onClick={() => setShowPrivacyModal(true)}
              className="w-full py-2.5 px-3 border border-gray-200 hover:border-blue-500 dark:border-zinc-800 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/10 rounded-lg text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between transition-all outline-none"
            >
              <span>🛡️ 查看隐私政策条款</span>
              <span className="text-[10px] text-gray-400 font-medium">100% 隐私保密 &gt;</span>
            </button>
          </div>

          {/* Quick Clear Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
              数据清空
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClearCompleted();
                  setDbSize(getStorageSizeWithLabel());
                }}
                className="w-full py-2.5 px-3 border border-gray-200 hover:border-red-500 dark:border-zinc-800 dark:hover:border-red-900/50 hover:bg-red-50/50 dark:hover:bg-red-950/10 rounded-lg text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-between transition-all outline-none"
              >
                <span>🧹 清空所有已完成事项</span>
                <span className="text-[10px] text-gray-400">一键减负</span>
              </button>

              <button
                onClick={() => setShowDangerReset(true)}
                className="w-full py-2.5 px-3 border border-red-200 dark:border-red-900/30 bg-red-50/20 hover:bg-red-50/50 dark:bg-red-950/5 dark:hover:bg-red-900/10 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center justify-between transition-all outline-none"
              >
                <span>💥 重置应用全部数据</span>
                <span className="text-[10px] font-mono text-red-500">高危操作</span>
              </button>
            </div>
          </div>

        </div>

        {/* Dangerous reset overlay modal */}
        {showDangerReset && (
          <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-2xl z-50 p-6 flex flex-col justify-between animate-scale-in">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-zinc-100 text-center">系统重置警告</h4>
              <p className="text-sm text-gray-500 dark:text-zinc-400 text-center leading-relaxed">
                你正在彻底重置本应用！您的所有自定义文件夹目录以及记录的事项代办将被
                <strong className="text-rose-600">永久移除、永久物理清除（不可挽回）</strong>。
              </p>
              
              <div className="bg-red-50 dark:bg-red-950/10 p-3.5 rounded-lg text-xs leading-normal text-rose-800 dark:text-rose-400 border border-red-100 dark:border-red-950/30 text-center">
                ⚠️ 此操作无法撤销，确定要重置全部数据吗？
              </div>
            </div>

            <div className="flex gap-2.5 mt-6">
              <button
                onClick={() => {
                  setShowDangerReset(false);
                }}
                className="flex-1 py-2.5 px-4 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 text-center dark:text-zinc-300 outline-none"
              >
                取消
              </button>
              
              <button
                _id="danger-hard-reset-btn"
                onClick={executeReset}
                className="flex-1 py-2.5 px-4 rounded-lg text-xs font-bold text-center text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all outline-none"
              >
                立即重置
              </button>
            </div>
          </div>
        )}

        {/* Privacy Policy overlay modal - using unified AgreementModal */}
        <AgreementModal
          show={showPrivacyModal}
          onClose={() => setShowPrivacyModal(false)}
          title="隐私政策"
          content={<PrivacyPolicyContent />}
        />

      </div>
    );
  }
