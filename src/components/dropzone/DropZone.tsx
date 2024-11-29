'use client';

import type { FC } from 'react';
import type { DropEvent, FileRejection } from 'react-dropzone';
import type { IDropZone, IDocumentWrapper } from 'src/lib/interface/dropzone.type';

import { useCallback } from 'react';
import Dropzone from 'react-dropzone';

import { Box, Paper, Typography } from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { DocumentUploadError } from './DocumentUploadError';
import { DocumentUploadProgress } from './DocumentUploadProgress';

export const DropZone: FC<IDropZone> = (props) => {
  const {
    name,
    maxSize,
    multiple = false,
    files,
    setFiles,
    minSize = 1,
    maxFiles = 1,
    autoFocus = false,
    disabled = false,
    noClick = false,
    noKeyboard = false,
    noDrag = false,
    noDragEventsBubbling = false,
    useFsAccessApi = false,
    reference,
    hideProgressBar,
    acceptedImageTypes = [],
    acceptedAudioTypes = [],
    acceptedVideoTypes = [],
    acceptedTextTypes = [],
    classes = '',
  } = props;

  const handleOnDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[], event: DropEvent): void => {},
    []
  );
  const handleOnDropAccepted = useCallback(
    (acceptedFiles: File[], _: DropEvent): void => {
      const acceptedFilesMap = acceptedFiles.map((acceptedFile) => ({
        file: acceptedFile,
        errors: [],
      }));

      setFiles((currentFiles: IDocumentWrapper[]) => [...currentFiles, ...acceptedFilesMap]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );
  const handleOnDropRejected = useCallback(
    (rejectedFiles: FileRejection[], _: DropEvent): void => {
      setFiles((currentFiles: IDocumentWrapper[]) => [...currentFiles, ...rejectedFiles]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const onUpload = (file: File, meta: any) => {
    setFiles((documentWrappers: IDocumentWrapper[]) =>
      documentWrappers.map((documentWrapper: IDocumentWrapper) => {
        if (documentWrapper.file === file) {
          return {
            ...documentWrapper,
            meta: { ...meta, reference },
          };
        }
        return documentWrapper;
      })
    );
  };
  const onDelete = (file: File) => {
    setFiles((documentWrappers: IDocumentWrapper[]) =>
      documentWrappers.filter((documentWrapper: IDocumentWrapper) => documentWrapper.file !== file)
    );
  };
  const handleDialogOpen = (): void => {};
  const handleDialogCancel = (): void => {};
  const handleOnError = (error: Error): void => {};

  return (
    <>
      <Dropzone
        multiple={multiple}
        minSize={minSize}
        maxSize={maxSize}
        maxFiles={maxFiles}
        noClick={noClick}
        noKeyboard={noKeyboard}
        noDrag={noDrag}
        noDragEventsBubbling={noDragEventsBubbling}
        disabled={disabled}
        onDropAccepted={handleOnDropAccepted}
        onDropRejected={handleOnDropRejected}
        onDrop={handleOnDrop}
        onFileDialogOpen={handleDialogOpen}
        onFileDialogCancel={handleDialogCancel}
        onError={handleOnError}
        useFsAccessApi={useFsAccessApi}
        autoFocus={autoFocus}
        accept={{
          'image/*': acceptedImageTypes,
          'audio/*': acceptedAudioTypes,
          'video/*': acceptedVideoTypes,
          'text/*': acceptedTextTypes,
          // "application/*": [],
        }}
        // preventDropOnDocument
        // getFilesFromEvent
        // validator
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <Paper
            {...getRootProps()}
            elevation={2}
            sx={{
              p: 3,
              textAlign: 'center',
              backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
              border: '2px dashed',
              borderColor: isDragActive ? 'primary.main' : 'divider',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main',
              },
            }}
          >
            <input {...getInputProps()} />
            <Box sx={{ mb: 2 }}>
              <Iconify
                icon="ic:round-cloud-upload"
                sx={{ fontSize: 48, color: 'primary.main', mb: 1 }}
              />
              <Typography variant="h6" color="textSecondary">
                Click here to choose or drag and drop {name}
              </Typography>
            </Box>
          </Paper>
        )}
      </Dropzone>

      {files.map((documentWrapper: IDocumentWrapper, index: number) =>
        documentWrapper.errors.length ? (
          <DocumentUploadError
            key={`progress_${index}`}
            file={documentWrapper.file}
            onDelete={onDelete}
            errors={documentWrapper.errors}
          />
        ) : (
          <DocumentUploadProgress
            key={`progress_${index}`}
            file={documentWrapper.file}
            hideProgressBar={hideProgressBar}
            onDelete={onDelete}
            onUpload={onUpload}
          />
        )
      )}
    </>
  );
};
