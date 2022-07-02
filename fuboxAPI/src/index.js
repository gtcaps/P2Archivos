const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



app.get('/data', (req, res) => {    
    fs.readFile('./src/data.json', 'utf8', (error, data) => {
        if (error) {
            res.json({});
        }

        res.json(JSON.parse(data));
    });
});

app.get('/users', (req, res) => {
    fs.readFile('./src/users.json', 'utf8', (error, data) => {
        if (error) {
            res.json({});
        }

        let dataUsers = JSON.parse(data);
        dataUsers = dataUsers.filter(usuario => usuario.email !== 'admin');
        res.json(dataUsers);
    });
});

app.post('/users', (req, res) => {
    let userInput = req.body;

    let users;
    
    fs.readFile('./src/users.json', 'utf8', (error, data) => {
        if (error) {
            res.status(500).json({ message: 'No se pudo almacenar el usuario' });
        }
    
        
        users = JSON.parse(data);
        let existUser = users.findIndex(user => user.email === userInput.email);
    
        if (existUser !== -1) {
            res.status(400).json({ message: 'El usuario ya existe' });
        } else {
            users.push(userInput);
            fs.writeFile('./src/users.json', JSON.stringify(users), error => {
                if (error) {
                    res.status(500).json({ message: 'No se pudo almacenar el usuario' });
                }
            });
            
        }

    });
    
    res.status(200).json({ message: 'Usuario almacenado' });
});

app.put('/users/modify', (req, res) => {
    let userInput = req.body;

    let users;
    
    fs.readFile('./src/users.json', 'utf8', (error, data) => {
        if (error) {
            res.status(500).json({ type: "error", message: 'No se pudo modificarr el usuario' });
        }
    
        
        users = JSON.parse(data);
        let existUser = users.findIndex(user => user.email === userInput.email);

    
        if (existUser !== -1) {

            users[existUser] = userInput;
            fs.writeFile('./src/users.json', JSON.stringify(users), error => {
                if (error) {
                    res.status(500).json({ type: "error", message: 'No se pudo modificar el usuario' });
                }
            });

            res.status(200).json({ type: "success", message: 'El usuario fue modificado' });
        } else {
            res.status(500).json({ type: "error", message: 'No se pudo modificar el usuario' });
        }

    });
    
});

app.patch('/users/activate', (req, res) => {
    console.log("activar")
    
    if (req.body.email) {
        let emailUser = req.body.email;
        fs.readFile('./src/users.json', 'utf8', (error, data) => {
            if (error) {
                res.status(500).json({ type: "error", message: 'No se pudo modificar el estado de la cuenta del usuario' });
            }
        
            let users = JSON.parse(data);
            let indexUser = users.findIndex(user => user.email === emailUser);
        
            if (indexUser !== -1) {
                users[indexUser].active = !users[indexUser].active;
                console.log(`user: ${emailUser} - Status: ${users[indexUser].active}`);

                fs.writeFile('./src/users.json', JSON.stringify(users), error => {
                    if (error) {
                        res.status(500).json({ type: "error", message: 'No se pudo modificar el estado de la cuenta del usuario' });
                    }
                });

                res.status(200).json({ type: "success", message: 'Se modifico el status de la cuenta del usuario' });
            } else {
                res.status(500).json({ type: "error", message: 'El usuario no existe' });
            }
    
        });
    } else {
        res.status(500).json({ type: "error", message: 'No se pudo modificar el estado de la cuenta del usuario' });
    }
});

app.patch('/users/bloquear', (req, res) => {
    console.log("bloquear");
    
    if (req.body.email) {
        let emailUser = req.body.email;
        fs.readFile('./src/users.json', 'utf8', (error, data) => {
            if (error) {
                res.status(500).json({ type: "error", message: 'No se pudo bloquear el estado de la cuenta del usuario 1' });
            }
        
            let users = JSON.parse(data);
            let indexUser = users.findIndex(user => user.email === emailUser);
        
            if (indexUser !== -1 && users[indexUser].active === true) {
                users[indexUser].active = false;
                console.log(`bloqueado user: ${emailUser} - Status: ${users[indexUser].active}`);

                fs.writeFile('./src/users.json', JSON.stringify(users), error => {
                    if (error) {
                        res.status(500).json({ type: "error", message: 'No se pudo bloquear el estado de la cuenta del usuario' });
                    }
                });

                res.status(200).json({ type: "success", message: 'Se bloqueo el status de la cuenta del usuario' });
            } else {
                res.status(500).json({ type: "error", message: 'El usuario no se puede bloquear' });
            }
    
        });
    } else {
        res.status(500).json({ type: "error", message: 'No se pudo bloquear el estado de la cuenta del usuario2' });
    }
});

app.delete('/users/delete', (req, res) => {
    if (req.body.email) {
        let emailUser = req.body.email;
        fs.readFile('./src/users.json', 'utf8', (error, data) => {
            if (error) {
                res.status(500).json({ type: "error", message: 'No se pudo eliminar la cuenta del usuario 1' });
            }
        
            let users = JSON.parse(data);
            let indexUser = users.findIndex(user => user.email === emailUser);
        
            if (indexUser !== -1) {
                
                let eliminado = users.splice(indexUser, 1);
                console.log('eliminado', eliminado);

                fs.writeFile('./src/users.json', JSON.stringify(users), error => {
                    if (error) {
                        res.status(500).json({ type: "error", message: 'No se pudo eliminar al usuario' });
                    }
                });

                res.status(200).json({ type: "success", message: 'Se elimino la cuenta del usuario' });
            } else {
                res.status(500).json({ type: "error", message: 'El usuario no se encuentra' });
            }
    
        });
    }
});

app.post('/users/login', (req, res) => {
    let credentials = req.body;

    fs.readFile('./src/users.json', 'utf8', (error, data) => {
        if (error) {
            res.status(500).json({ type: 'error', message: 'No se pudo leer el usuario' });
        }

        let users = JSON.parse(data);
        let existUser = users.find(user => user.email === credentials.email && user.password === credentials.password);

        if (existUser === undefined || existUser === null || existUser.active === false) {
            res.status(401).json({ type: 'error', message: 'Usuario o contraseña incorrectos' });
        } else if (existUser.active) {
            res.status(200).json({ type: 'success', message: 'Usuario autenticado' });
        } else {
            res.status(401).json({ type: 'error', message: 'Usuario o contraseña incorrectos' });
        }
    });
});


app.listen(3030, () => {
    console.log('Server is running on port ' + 3030);
});