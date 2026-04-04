import * as yup from 'yup'

yup.setLocale({
  mixed: {
    required: 'errors.required',
    notOneOf: 'errors.duplicate',
  },
  string: {
    url: 'errors.invalid',
  },
})

const buildSchema = exUrls => (
  yup.string()
    .required()
    .url()
    .notOneOf(exUrls)
)

export default buildSchema
