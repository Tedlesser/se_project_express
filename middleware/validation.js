const { Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateURL = (value, helpers) => {
    if (validator.isURL(value)){
        return value
    }
    return helpers.error("string.uri");
};

const validateId = celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().alphanum().length(24),
    })
})

const UpdateProfileValidation = celebrate ({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).message({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
        }),
        avatar: Joi.string().required.custom(validateURL).messages({
            "string.url": 'the "imageUrl" field must be a valid url'
        })
    })
})

const ClothingValidation = celebrate({
    body: Joi.object().keys({
        weather: Joi.string().valid("hot","warm","cold").required(), 
        "string.min": 'The minimum length of the "name" field is 2',
        "string.max": 'The maximum length of the "name" field is 30',
        "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    })
})

const UserInfoBodyValidation = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
            "string.min": 'The minimum length of the "name" field is 2',
            "string.max": 'The maximum length of the "name" field is 30',
            "string.empty": 'The "name" field must be filled in',
        }),
        avatar: Joi.string().required().custom(validateURL).messages({
            "string.url": 'the "imageUrl" field must be a valid url',
          }),
        email: Joi.string().required().email().messages({
            "string.empty": "You must enter an email",
          }),
        password: Joi.string().required().messages({
            "string.empty": "You must enter an password",
          }),
    })
})

const AuthenticationBody = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email().messages({
        "string.empty": "You must enter an email",
      }),
      password: Joi.string().required().messages({
        "string.empty": "You must enter an password",
      }),
    }),
  });

module.exports = {
    validateId,
    UpdateProfileValidation, 
    ClothingValidation,
    UserInfoBodyValidation,
    AuthenticationBody
}