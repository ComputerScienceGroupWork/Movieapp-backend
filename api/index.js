let router=require('express')()

//router.use('/user',require('./user'))

router.use('/admin', require('./admin'))

router.use('/auth',	require('./auth'))
router.use('/movies', require('./movies'))

module.exports=router
