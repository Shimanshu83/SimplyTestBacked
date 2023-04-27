const { body } = require('express-validator');


const cuisineValidator = [
    body('name').not().isEmpty(),
    body('code').not().isEmpty(),
    body('status').isBoolean()
]


module.exports = {
    cuisineValidator
}