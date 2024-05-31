import { compare } from 'bcrypt'

import { fetchUserByEmail } from '../services/user.service.mjs'

// security.controller.mjs
async function handleLogin(req, res) {
    const { app, method } = req
    const db = app.get('g:db')

    if(req.session.user) { return res.redirect('/notes/read') }
    if(method == 'GET') { return res.render('login') }

    const { email, password } = req.body

    const user = await fetchUserByEmail(db, email)

    if(user) {
        const ok = await compare(password, user.password)
        if(ok) {
            req.session.user = user
            return res.redirect('/notes/read')
        }
    }

    res.redirect('/login')
}

async function handleLogout(req, res) {
    req.session.user = null
    res.redirect('/')
}

export function loadSecurityController(app) {
    app.all('/login', handleLogin)
    app.get('/logout', handleLogout)
}
