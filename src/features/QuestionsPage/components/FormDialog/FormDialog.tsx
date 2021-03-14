import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { get } from 'lodash';
import useQualifications from './FormDialog.useQualifications';
import { capitalizeFirstLetter } from './helpers';
import { QuestionInput, Question, Maybe, Answer } from 'libs/graphql/types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  MenuItem,
  TextField,
  TextFieldProps,
} from '@material-ui/core';
import ImagePreview from './ImagePreview';

const ANSWERS = Object.values(Answer);

export interface FormDialogProps extends Pick<DialogProps, 'open'> {
  question?: Maybe<Question>;
  onClose: () => void;
  onSubmit: (input: QuestionInput) => Promise<boolean> | boolean;
}

type Images = Pick<
  QuestionInput,
  | 'deleteImage'
  | 'deleteAnswerAImage'
  | 'deleteAnswerBImage'
  | 'deleteAnswerCImage'
  | 'deleteAnswerDImage'
> & {
  image?: FileList;
  answerAImage?: FileList;
  answerBImage?: FileList;
  answerCImage?: FileList;
  answerDImage?: FileList;
};

const FormDialog = ({ open, onClose, question, onSubmit }: FormDialogProps) => {
  const editMode = Boolean(question);
  const {
    register,
    handleSubmit,
    errors,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
  } = useForm<QuestionInput>({});
  const images: Images = watch([
    'image',
    'deleteImage',
    'answerAImage',
    'deleteAnswerAImage',
    'answerBImage',
    'deleteAnswerBImage',
    'answerCImage',
    'deleteAnswerCImage',
    'answerDImage',
    'deleteAnswerDImage',
  ]);
  const {
    qualifications,
    loading: loadingQualifications,
  } = useQualifications();
  const classes = useStyles();

  useEffect(() => {
    [
      'deleteImage',
      'deleteAnswerAImage',
      'deleteAnswerBImage',
      'deleteAnswerCImage',
      'deleteAnswerDImage',
    ].forEach(key => {
      register(key);
    });
  }, [register]);

  const _onSubmit = async (data: QuestionInput) => {
    console.log(data);
    const success = await onSubmit({
      ...data,
      image: data.image?.item(0),
      answerAImage: data.answerAImage?.item(0),
      answerBImage: data.answerBImage?.item(0),
      answerCImage: data.answerCImage?.item(0),
      answerDImage: data.answerDImage?.item(0),
    });
    if (success) {
      onClose();
    }
  };

  const renderImagePreview = (key: keyof Images) => {
    const deleteKey = ('delete' + capitalizeFirstLetter(key)) as keyof Images;
    const uploadedImage = images[key] as FileList | undefined;

    if (
      (uploadedImage && uploadedImage.length > 0) ||
      (question && get(question, key) && !get(images, deleteKey))
    ) {
      let src = get(question, key, '');
      if (src && question) {
        src += `?` + new Date(question.updatedAt).getTime();
      }
      return (
        <ImagePreview
          file={uploadedImage?.item(0)}
          src={src}
          onDelete={() => {
            setValue(key, undefined);
            setValue(deleteKey, true);
          }}
        />
      );
    }

    return null;
  };

  const defaultFileInputProps: TextFieldProps = {
    type: 'file',
    InputLabelProps: {
      shrink: true,
    },
    inputProps: {
      accept: ['image/*'],
      multiple: false,
    },
  };
  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <form onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          {editMode ? 'Edycja pytania' : 'Tworzenie pytania'}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {renderImagePreview('image')}
          <TextField
            fullWidth
            label="Obrazek"
            name="image"
            {...defaultFileInputProps}
            inputRef={register}
            error={!!errors.image}
            helperText={errors.image?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Treść pytania"
            name="content"
            multiline
            defaultValue={question?.content}
            inputRef={register({
              required: 'Te pole jest wymagane.',
            })}
            error={!!errors.content}
            helperText={errors.content?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Z"
            name="from"
            defaultValue={question?.from}
            inputRef={register({
              required: 'Te pole jest wymagane.',
            })}
            error={!!errors.from}
            helperText={errors.from?.message ?? ''}
          />
          <TextField
            fullWidth
            label="Wyjaśnienie"
            name="explanation"
            multiline
            defaultValue={question?.explanation}
            inputRef={register}
            error={!!errors.explanation}
            helperText={errors.explanation?.message ?? ''}
          />
          <Controller
            name="correctAnswer"
            defaultValue={question?.correctAnswer ?? ANSWERS[0]}
            control={control}
            as={
              <TextField select fullWidth label="Poprawna odpowiedź">
                {ANSWERS.map(answer => (
                  <MenuItem key={answer} value={answer}>
                    {answer}
                  </MenuItem>
                ))}
              </TextField>
            }
          />
          {ANSWERS.map(answer => {
            const upper = answer.toUpperCase();
            const key = `answer${upper}` as keyof QuestionInput;
            const imageKey = `${key}Image` as keyof Images;
            return (
              <div key={upper} className={classes.dialogContent}>
                {renderImagePreview(imageKey)}
                <TextField
                  fullWidth
                  label={`Odpowiedź ${upper} obrazek`}
                  name={imageKey}
                  {...defaultFileInputProps}
                  inputRef={register}
                  error={!!errors[imageKey]}
                  helperText={errors[imageKey]?.message ?? ''}
                />
                <TextField
                  fullWidth
                  label={`Odpowiedź ${upper}`}
                  name={key}
                  multiline
                  defaultValue={question ? question[key as keyof Question] : ''}
                  inputRef={register({
                    required: 'Te pole jest wymagane.',
                  })}
                  error={!!errors[key]}
                  helperText={errors[key]?.message ?? ''}
                />
              </div>
            );
          })}
          {!loadingQualifications && (
            <Controller
              name="qualificationID"
              defaultValue={
                question?.qualification?.id ?? qualifications[0]?.id
              }
              control={control}
              rules={{
                valueAsNumber: true,
                required: 'Musisz wybrać kwalifikację.',
              }}
              as={
                <TextField select fullWidth label="Kwalifikacja">
                  {qualifications.map(qualification => (
                    <MenuItem key={qualification.id} value={qualification.id}>
                      {qualification.name} ({qualification.code})
                    </MenuItem>
                  ))}
                </TextField>
              }
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            type="button"
            variant="contained"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {editMode ? 'Zapisz' : 'Utwórz'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const useStyles = makeStyles(theme => ({
  dialogContent: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
}));

export default FormDialog;
