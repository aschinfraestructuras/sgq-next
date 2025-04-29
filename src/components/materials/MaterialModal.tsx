import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import MaterialForm from './MaterialForm';
import type { Material } from '@/types/materials';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Material>) => Promise<void>;
  material?: Partial<Material>;
}

export default function MaterialModal({ isOpen, onClose, onSubmit, material }: MaterialModalProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-0 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="relative border-b border-gray-200 px-6 py-4">
                  <Dialog.Title as="div" className="pr-8">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {material ? t('materials.modal.edit') : t('materials.modal.create')}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {material 
                        ? t('materials.modal.editDescription') 
                        : t('materials.modal.createDescription')
                      }
                    </p>
                  </Dialog.Title>
                  
                  <button
                    type="button"
                    className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors duration-150"
                    onClick={onClose}
                  >
                    <span className="sr-only">{t('common.close')}</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                  <MaterialForm
                    material={material}
                    onSubmit={async (data) => {
                      await onSubmit(data);
                      onClose();
                    }}
                    onCancel={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 