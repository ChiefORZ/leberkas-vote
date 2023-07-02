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
import styled from 'styled-components';

import { Spinner } from '@/components/Spinner';
import { classNames } from '@/utils/index';

type TUser = NexusGenFieldTypes['User'];

const Tile = styled.div``;
const TileImage = styled(Image)``;
const GridItem = styled.div``;

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
      <label htmlFor={name} className="block text-xs font-medium text-gray-900">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          name={name}
          id={name}
          className={classNames(
            'block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6',
            validation
              ? 'pr-10 text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500'
              : undefined,
            className
          )}
          onChange={handleChange}
          {...props}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {validation ? (
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
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
    value: '',
    error: null,
  });
  const [imageUrl, setImageUrl] = useState({
    value: '',
    error: null,
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
        setImageUrl({ value: url, error: null });
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
    setTitle({ value: '', error: null });
    setImageUrl({ value: '', error: null });
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
          title: title.value,
          imageUrl: imageUrl.value,
          imagePlaceholder: placeholder.base64,
        });
        // @ts-ignore
        window?.splitbee?.track('Submit Entry', {
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
    <Transition.Root show={isOpen} as={Fragment}>
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
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                      onClick={handleClose}
                    >
                      <span className="sr-only">Schließen</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 sm:mx-0 sm:h-10 sm:w-10">
                      <PhotoIcon
                        className="h-6 w-6 text-brand-600"
                        aria-hidden="true"
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
                          style={{ '--aspect-ratio': 4 / 3 }}
                          className={classNames(
                            'relative flex justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300',
                            imageUrl.error
                              ? 'ring-2 ring-red-500 ring-offset-2'
                              : undefined
                          )}
                        >
                          {imageUrl.value ? (
                            <TileImage
                              className="block w-full select-none object-cover"
                              src={imageUrl.value}
                              fill
                            />
                          ) : isUploading ? (
                            <div className="flex w-full select-none flex-col items-center justify-center pb-12 text-gray-400">
                              <Spinner />
                            </div>
                          ) : (
                            <button
                              role="button"
                              onClick={openFileDialog}
                              className="peer flex w-full select-none flex-col items-center justify-center pb-12 focus:bg-brand-100/10 focus:outline-none"
                            >
                              <PhotoIcon
                                className="mx-auto h-14 w-14 text-gray-400"
                                aria-hidden="true"
                              />
                            </button>
                          )}

                          <div className="absolute bottom-0 flex w-full flex-col justify-center bg-[rgba(255,255,255,0.9)] p-2 text-center leading-none">
                            <Input
                              className="bg-transparent"
                              label="Name"
                              name="name"
                              aria-label="Name"
                              aria-autocomplete="none"
                              autoComplete="off"
                              placeholder="Leberkas"
                              validation={title.error}
                              value={title.value}
                              onClick={(evt) => evt.stopPropagation()}
                              onChange={(evt) => {
                                evt.stopPropagation();
                                setTitle({
                                  value: evt.target.value,
                                  error: null,
                                });
                              }}
                            />
                          </div>
                        </div>
                        <input
                          name="imageUrl"
                          type="text"
                          readOnly
                          style={{ display: 'none' }}
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
                      type="submit"
                      className={classNames(
                        'inline-flex w-full justify-center rounded-md bg-brand-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-300 sm:ml-3 sm:w-auto',
                        isUploading || imageUrl.error || title.error
                          ? 'cursor-not-allowed opacity-50'
                          : undefined
                      )}
                      onClick={handleSubmitForm}
                    >
                      Abschicken
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={handleClose}
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
        // @ts-ignore
        window?.splitbee?.track('Toggle Submit Entry Modal', {
          userId: user.id,
        });
      }
      setDialogIsOpen(nextIsOpen);
    },
    [onClick, user]
  );
  return (
    <>
      <GridItem
        key="upload-item"
        style={{ '--aspect-ratio': 4 / 3 }}
        className="relative flex cursor-pointer justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"
        onClick={() => handleToggleDialog(true)}
      >
        <Tile className="flex w-full select-none flex-col items-center justify-center">
          <PhotoIcon
            className="mx-auto h-14 w-14 text-gray-400"
            aria-hidden="true"
          />
          <div>Heast, des hast vergessen!</div>
        </Tile>
      </GridItem>
      <UploadItemDialog
        isOpen={dialogIsOpen}
        setIsOpen={handleToggleDialog}
        user={user}
      />
      <Toaster />
    </>
  );
}
