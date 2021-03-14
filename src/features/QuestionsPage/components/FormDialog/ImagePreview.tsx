import { useEffect, useState } from 'react';
import buildURL from 'utils/buildURL';

import { Tooltip, IconButton, Box } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

export interface PreviewImageProps {
  file?: File | null;
  src?: string | null;
  onDelete?: () => void;
  disabled?: boolean;
}

const PreviewImage = ({ file, src, onDelete, disabled }: PreviewImageProps) => {
  const [_src, _setSrc] = useState<string>('');

  useEffect(() => {
    if (!file && !src && process.env.NODE_ENV === 'development') {
      console.warn('PreviewImage: you should specify file or src');
    }
    if (!file) return _setSrc(buildURL('cdn', src ?? ''));
    const reader = new FileReader();

    reader.onload = function (e) {
      _setSrc(typeof e.target?.result === 'string' ? e.target.result : '');
    };

    reader.readAsDataURL(file);
  }, [src, file]);

  return (
    <Box textAlign="center">
      <Box position="relative" display="inline-block">
        <Box position="absolute" right="2%" top="2%">
          <Tooltip title="Usuń">
            <IconButton
              disabled={disabled}
              color={'secondary'}
              onClick={onDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <img
          src={_src}
          alt="Podgląd zdjęcia"
          style={{ maxWidth: '100%', maxHeight: '400px' }}
        />
      </Box>
    </Box>
  );
};

export default PreviewImage;
