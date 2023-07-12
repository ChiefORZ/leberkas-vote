/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';

import { Dialog, Transition } from '@headlessui/react';
import {
  ExclamationCircleIcon,
  PhotoIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { NexusGenFieldTypes } from 'generated/nexus-typegen';
import { gql, request } from 'graphql-request';
import Image from 'next/image';
import { useS3Upload } from 'next-s3-upload';
import { Fragment, useCallback, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import { Spinner } from '@/components/Spinner';
import { classNames } from '@/utils/index';
import { trackEvent } from '@/utils/splitbee';

type TUser = NexusGenFieldTypes['User'];

function Input({
  className = '',
  name,
  label,
  type = 'text',
  validation,
  ...props
}: {
  className?: string;
  name: string;
  label: string;
  type?: string;
  validation?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange && props.onChange(e);
  };

  return (
    <div
      className={classNames(
        'rounded-md px-3 pb-1.5 pt-2.5 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-brand-400',
        validation ? 'ring-red-300  focus-within:ring-red-500' : undefined
      )}
    >
      <label className="block text-xs font-medium text-gray-900" htmlFor={name}>
        {label}
      </label>
      <div className="relative">
        <input
          className={classNames(
            'block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6',
            validation
              ? 'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500'
              : undefined,
            className
          )}
          id={name}
          name={name}
          onChange={handleChange}
          type={type}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {validation ? (
            <ExclamationCircleIcon
              aria-hidden="true"
              className="h-5 w-5 text-red-500"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

const UploadImageMutation = gql`
  mutation uploadItem(
    $imagePlaceholder: String!
    $imageUrl: String!
    $title: String!
  ) {
    uploadItem(
      imagePlaceholder: $imagePlaceholder
      imageUrl: $imageUrl
      title: $title
    ) {
      id
    }
  }
`;

function UploadItemDialog({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: TUser;
}) {
  const displaySuccessMessage = (success: string) => {
    toast.success(success);
  };
  const displayError = (error: string) => {
    toast.error(error);
  };
  const [title, setTitle] = useState({
    error: null,
    value: '',
  });
  const [imageUrl, setImageUrl] = useState({
    error: null,
    value: '',
  });
  const { FileInput, openFileDialog, uploadToS3, resetFiles } = useS3Upload();

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = useCallback(
    async (file) => {
      setIsUploading(true);
      // dont allow files larger than 5MB
      if (file.size > 5 * 1024 * 1024) {
        setImageUrl((prevImageUrl) => ({
          ...prevImageUrl,
          error: 'Datei ist zu groß',
        }));
        setIsUploading(false);
        return;
      }
      // only allow png, jpg, jpeg, gif, webm, tiff, bmp, svg
      if (
        ![
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
          'image/tiff',
          'image/bmp',
          'image/svg+xml',
        ].includes(file.type)
      ) {
        setImageUrl((prevImageUrl) => ({
          ...prevImageUrl,
          error: 'Datei ist kein Bild',
        }));
        setIsUploading(false);
        return;
      }

      try {
        const { url } = await uploadToS3(file);
        setImageUrl({ error: null, value: url });
      } catch (err) {
        displayError('Oje, beim file upload is was schief glaufen!');
        console.error(err);
      }
      setIsUploading(false);
    },
    [uploadToS3]
  );

  const handleClose = useCallback(() => {
    if (isUploading) return;
    setIsUploading(false);
    setTitle({ error: null, value: '' });
    setImageUrl({ error: null, value: '' });
    setIsOpen(false);
    resetFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  const handleSubmitForm = useCallback(
    async (e) => {
      if (isUploading || imageUrl.error || title.error) {
        return;
      }
      if (!title.value) {
        setTitle((prevTitle) => ({
          ...prevTitle,
          error: 'Bitte Namen eingeben',
        }));
      }
      if (!imageUrl.value) {
        setImageUrl((prevImageUrl) => ({
          ...prevImageUrl,
          error: 'Bitte ein Bild hochladen',
        }));
      }
      if (!title.value || !imageUrl.value) {
        return;
      }
      setIsUploading(true);
      try {
        const placeholder = await (
          await fetch(`/api/plaiceholder?imageUrl=${imageUrl.value}`)
        ).json();

        await request('/api', UploadImageMutation, {
          imagePlaceholder: placeholder.base64,
          imageUrl: imageUrl.value,
          title: title.value,
        });
        trackEvent('Submit Entry', {
          userId: user.id,
        });
        displaySuccessMessage('Danke für den Input!');
      } catch (err) {
        displayError('Oje, beim speichern is was schief glaufen!');
        console.error(err);
      }
      handleClose();
    },
    [isUploading, imageUrl, title, handleClose, user]
  );

  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog as="div" className="relative z-40" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={classNames(
                  'relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'
                )}
              >
                <div>
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                      onClick={handleClose}
                      type="button"
                    >
                      <span className="sr-only">Schließen</span>
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 sm:mx-0 sm:h-10 sm:w-10">
                      <PhotoIcon
                        aria-hidden="true"
                        className="h-6 w-6 text-brand-600"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:min-w-[350px] sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Lieblingsgericht hinzufügen
                      </Dialog.Title>
                      <div className="mt-4 grid grid-cols-my-grid gap-4 overflow-y-auto p-4">
                        <div
                          // @ts-ignore
                          className={classNames(
                            'relative flex justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300',
                            imageUrl.error
                              ? 'ring-2 ring-red-500 ring-offset-2'
                              : undefined
                          )}
                          // @ts-ignore - aspect-ratio is a custom variable
                          style={{ '--aspect-ratio': 4 / 3 }}
                        >
                          {imageUrl.value ? (
                            <Image
                              alt="New Image"
                              className="block w-full select-none object-cover"
                              fill
                              src={imageUrl.value}
                            />
                          ) : isUploading ? (
                            <div className="flex w-full select-none flex-col items-center justify-center pb-12 text-gray-400">
                              <Spinner />
                            </div>
                          ) : (
                            <button
                              className="peer flex w-full select-none flex-col items-center justify-center pb-12 focus:bg-brand-100/10 focus:outline-none"
                              onClick={openFileDialog}
                              role="button"
                            >
                              <PhotoIcon
                                aria-hidden="true"
                                className="mx-auto h-14 w-14 text-gray-400"
                              />
                            </button>
                          )}

                          <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
                            <Input
                              aria-autocomplete="none"
                              aria-label="Name"
                              autoComplete="off"
                              className="bg-transparent"
                              label="Name"
                              name="name"
                              onChange={(evt) => {
                                evt.stopPropagation();
                                setTitle({
                                  error: null,
                                  value: evt.target.value,
                                });
                              }}
                              onClick={(evt) => evt.stopPropagation()}
                              placeholder="Leberkas"
                              validation={title.error}
                              value={title.value}
                            />
                          </div>
                        </div>
                        <input
                          name="imageUrl"
                          readOnly
                          style={{ display: 'none' }}
                          type="text"
                          value={imageUrl.value}
                        />
                        <FileInput
                          onChange={handleFileChange}
                          style={{ display: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      className={classNames(
                        'inline-flex w-full justify-center rounded-md bg-brand-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-300 sm:ml-3 sm:w-auto',
                        isUploading || imageUrl.error || title.error
                          ? 'cursor-not-allowed opacity-50'
                          : undefined
                      )}
                      onClick={handleSubmitForm}
                      type="submit"
                    >
                      Abschicken
                    </button>
                    <button
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleClose}
                      type="button"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function UploadItemGridItem({
  user,
  onClick,
}: {
  user?: TUser;
  onClick?: () => Promise<boolean>;
}) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const handleToggleDialog = useCallback(
    async (nextIsOpen) => {
      if (onClick && (await onClick()) === false) return;
      if (nextIsOpen) {
        trackEvent('Toggle Submit Entry Modal', {
          userId: user.id,
        });
      }
      setDialogIsOpen(nextIsOpen);
    },
    [onClick, user]
  );
  return (
    <>
      <div
        className="relative flex cursor-pointer justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
        key="upload-item"
        onClick={() => handleToggleDialog(true)}
        // @ts-ignore - aspect-ratio is a custom variable
        style={{ '--aspect-ratio': 4 / 3 }}
      >
        <div className="flex w-full select-none flex-col items-center justify-center">
          <PhotoIcon
            aria-hidden="true"
            className="mx-auto h-14 w-14 text-gray-400"
          />
          <div>Heast, des hast vergessen!</div>
        </div>
      </div>
      <UploadItemDialog
        isOpen={dialogIsOpen}
        setIsOpen={handleToggleDialog}
        user={user}
      />
      <Toaster />
    </>
  );
}
