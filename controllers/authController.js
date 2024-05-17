const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../model/User.js');
const { name } = require('ejs');

async function register(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const name = req.body.name;

        const passwordHash = await bcrypt.hash(password, 10);

        // Verificar si el correo electrónico ya está registrado
        const emailExist = await User.findOne({ email: email });

        if (emailExist) {
            console.log('El correo ya está registrado');
            return res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "El correo ya está registrado",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        if (!email || !password || !name) {
            return res.render('register', {
                alert: true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un email, nombre y password",
                alertIcon: 'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'register'
            });
        }

        const user = new User({
            email: email,
            name: name,
            password: passwordHash
        });

        const newUser = await user.save();

        res.redirect('/login');
    } catch (error) {
        console.error(error);
        return res.render('register', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Error al crear el usuario",
            alertIcon: 'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'register'
        });
            
    }
}


async function login(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.render('login',{
                alert:true,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un email y password",
                alertIcon:'info',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            })
        }else{
            const user = await User.findOne({email: email});
            if (!user) {
                res.render('login',{
                    alert:true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Password incorrectas",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                })
            }else{
                const passwordDB = user.password;
                if (bcrypt.compareSync(password, passwordDB)) {
                    const token = jwt.sign({
                        id: user._id,
                        name: user.name
                    }, 'secretkey', {expiresIn: 60 * 60});
                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 6000000),
                        httpOnly: true
                    });
                    //console.log("TOKEN: "+token+" para el user : "+user)
                    console.log(user.name)
                    req.session.username = user.name; // guarda user en la sesión
                    console.log(user._id)
                    req.session.userId = user._id; // guarda userid en la sesión
                    res.redirect('/');
                }else{
                    res.render('login',{
                        alert:true,
                        alertTitle: "Error",
                        alertMessage: "Usuario y/o Password incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'
                    })
                }
            }
        }
    }catch (error) {
        console.error(error);
        res.render('login',{
            alert:true,
            alertTitle: "Error",
            alertMessage: "Error al iniciar sesión",
            alertIcon:'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        })
    }
}

async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }

        const decoded = jwt.verify(token, 'secretkey');
        if (!decoded || !decoded.name) {
            return res.redirect('/login');
        }

        res.locals = res.locals || {}; // Inicializar res.locals si aún no está definido
        res.locals.username = decoded.name;
        res.locals.userId = decoded.id;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        res.redirect('/login');
    }
}



function logout(req, res) {
    res.clearCookie('jwt');
    res.redirect('/');
}

module.exports = { register, login, isAuthenticated, logout }