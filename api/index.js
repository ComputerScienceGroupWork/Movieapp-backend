let router=require('express')()

// router.use('/user',require('./user'))

router.use('/admin', require('./admin'))

router.use('/auth',	require('./auth'))


module.exports=router
