

exports.index = (req, res) => {
    if (!req.session.user){
        return res.redirect('/usuarios/iniciar-sessao')
    }
    res.render('social/index', {user: req.session.user})
}

