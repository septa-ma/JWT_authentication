module.exports = {
    validate: (items) => {
        return async (req, res, next) => {
            for (const item in req.body) {
                if (!items.includes(item)) {
                    delete req.body[item] ;
                    return res.status(400).json('پارامترهای ورودی صحیح نمی باشد')
                }
            }
            next();
        }
   }
}
