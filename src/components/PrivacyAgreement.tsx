import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X } from 'lucide-react';

interface PrivacyModalProps {
  onAccept: () => void;
  onDecline: () => void;
  onOpenAgreement: () => void;
  onOpenPrivacy: () => void;
}

/**
 * 首次启动时的隐私政策同意弹窗
 */
export function PrivacyModal({ onAccept, onDecline, onOpenAgreement, onOpenPrivacy }: PrivacyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-zinc-900 w-full max-w-sm shadow-2xl max-h-[80vh] overflow-y-auto rounded-2xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-6 text-center">
            用户协议与隐私政策
          </h3>
          <div className="mb-6 space-y-3">
            <p className="text-sm text-gray-700 dark:text-zinc-300 leading-relaxed">
              欢迎使用「速行清单」。为了更好地为您提供服务，请您仔细阅读并同意以下协议：
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              (1)《隐私政策》中关于个人设备用户信息的收集和使用的说明。
            </p>
            <p className="text-sm text-gray-600 dark:text-zinc-400">
              (2)《隐私政策》中与第三方SDK类服务商数据共享、相关信息收集和使用说明。
            </p>
          </div>
          <div className="mb-6">
            <p className="text-xs text-gray-500 dark:text-zinc-500 mb-2">用户协议和隐私政策说明：</p>
            <p className="text-sm text-gray-700 dark:text-zinc-300">
              阅读完整的
              <span
                onClick={onOpenAgreement}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
              >
                《用户服务协议》
              </span>
              和
              <span
                onClick={onOpenPrivacy}
                className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium"
              >
                《隐私政策》
              </span>
              了解详细内容。
            </p>
          </div>
        </div>
        <div className="flex border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={onDecline}
            className="flex-1 py-4 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 rounded-bl-2xl hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
          >
            不同意
          </button>
          <button
            onClick={onAccept}
            className="flex-1 py-4 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 rounded-br-2xl transition-colors"
          >
            同意并继续
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface AgreementModalProps {
  onClose: () => void;
  title: string;
  content: React.ReactNode;
  show: boolean;
}

/**
 * 展示协议详情的弹窗容器
 */
export function AgreementModal({ onClose, title, content, show }: AgreementModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl h-[85vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <ShieldCheck size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100">{title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 active:scale-90 transition-transform hover:bg-gray-200 dark:hover:bg-zinc-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-950 p-6">
              {content}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

interface DeclineConfirmModalProps {
  show: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/**
 * 拒绝隐私政策时的二次确认弹窗
 */
export function DeclineConfirmModal({ show, onCancel, onConfirm }: DeclineConfirmModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-[110]">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-200 dark:border-zinc-800 flex flex-col"
          >
            <div className="flex-1 p-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-4 text-center">
                确认拒绝
              </h2>
              <p className="text-gray-600 dark:text-zinc-400 text-center mb-6">
                您确定要拒绝隐私政策吗？拒绝后将无法使用我们的服务。
              </p>
            </div>
            <div className="flex border-t border-gray-200 dark:border-zinc-800">
              <button
                onClick={onCancel}
                className="flex-1 py-4 text-center text-gray-600 dark:text-zinc-400 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                取消
              </button>
              <div className="w-px bg-gray-200 dark:bg-zinc-800"></div>
              <button
                onClick={onConfirm}
                className="flex-1 py-4 text-center text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                确定
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}