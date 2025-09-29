const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const JWT_SECRET = `testestestes*-+*-/-*/+9/+*/-*/-*/98494-*/-*/-*/`;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Setup para Upload de Imagens ---
const UPLOADS_DIR = 'uploads';
if (!fs.existsSync(UPLOADS_DIR)){
    fs.mkdirSync(UPLOADS_DIR);
}
app.use('/uploads', express.static(path.join(__dirname, UPLOADS_DIR)));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erro ao abrir o database', err.message);
    } else {
        console.log('Conectado ao database SQLite.');
        initializeDb();
    }
});

function initializeDb() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL, role TEXT NOT NULL
        )`, (err) => {
            if (err) return console.error("Erro ao criar tabela de usuários", err.message);
            db.get("SELECT * FROM users WHERE email = ?", ['rick@exemplo'], (err, row) => {
                if (!row) {
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync('rick@123', salt);
                    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", 
                        ['Rick', 'rick@exemplo', hashedPassword, 'admin'],
                        (err) => { if (err) console.error("Erro ao criar usuário admin", err.message); else console.log("Usuário admin criado."); }
                    );
                }
            });
        });

        db.run(`CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT NOT NULL, price REAL NOT NULL,
            stock INTEGER NOT NULL, image TEXT, createdAt TEXT NOT NULL
        )`, (err) => {
            if (err) return console.error("Erro ao criar tabela de produtos", err.message);
            db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
                if (row && row.count === 0) {
                    console.log("Populando produtos da FakeStoreAPI...");
                    seedProducts();
                } else {
                    console.log("Tabela de produtos já populada.");
                }
            });
        });
    });
}

function seedProducts() {
    https.get('https://fakestoreapi.com/products', (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const stmt = db.prepare("INSERT INTO products (name, description, price, stock, image, createdAt) VALUES (?, ?, ?, ?, ?, ?)");
                JSON.parse(data).forEach(p => {
                    const stock = p.rating ? p.rating.count : Math.floor(Math.random() * 200) + 50;
                    stmt.run(p.title, p.description, p.price, stock, p.image, new Date().toISOString());
                });
                stmt.finalize((err) => { if (err) console.error("Erro ao popular produtos", err.message); else console.log("Produtos populados com sucesso."); });
            } catch (e) { console.error("Erro ao popular produtos:", e.message); }
        });
    }).on('error', (err) => console.error("Erro ao buscar da FakeStoreAPI:", err.message));
}

// --- Middlewares de Autenticação ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Acesso negado. Requer privilégios de administrador." });
    }
    next();
};

// --- Rotas da API ---

// ROTAS DE USUÁRIO
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ success: false, message: "Credenciais inválidas" });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
    });
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    db.run("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, hashedPassword, 'user'], function(err) {
        if (err) return res.status(400).json({ error: "Este e-mail já está em uso." });
        res.status(201).json({ success: true, message: 'Usuário criado com sucesso' });
    });
});

// ROTAS DE PRODUTO
app.get('/products', (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(p => ({ ...p, id: `prod-${p.id}` })));
    });
});

app.get('/products/:id', (req, res) => {
    const internalId = req.params.id.replace('prod-', '');
    db.get("SELECT * FROM products WHERE id = ?", [internalId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) res.json({ ...row, id: `prod-${row.id}` });
        else res.status(404).json({ message: "Produto não encontrado" });
    });
});

app.post('/products', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
    const { name, description, price, stock } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    db.run(`INSERT INTO products (name, description, price, stock, image, createdAt) VALUES (?, ?, ?, ?, ?, ?)`,
        [name, description, parseFloat(price), parseInt(stock), imagePath, new Date().toISOString()],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: `prod-${this.lastID}`, name, description, price, stock, image: imagePath });
        }
    );
});

app.put('/products/:id', authenticateToken, isAdmin, upload.single('image'), (req, res) => {
    const internalId = req.params.id.replace('prod-', '');
    const { name, description, price, stock } = req.body;
    
    db.get("SELECT image FROM products WHERE id = ?", [internalId], (err, row) => {
        if(err) return res.status(500).json({ error: err.message });
        if(!row) return res.status(404).json({ message: "Produto não encontrado" });

        let imagePath = req.body.image || row.image;
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
            if (row.image && row.image.startsWith('/uploads/')) {
                const oldPath = path.join(__dirname, row.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
        }

        db.run(`UPDATE products SET name=?, description=?, price=?, stock=?, image=? WHERE id=?`,
            [name, description, parseFloat(price), parseInt(stock), imagePath, internalId],
            function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: "Produto atualizado com sucesso" });
            }
        );
    });
});

app.delete('/products/:id', authenticateToken, isAdmin, (req, res) => {
    const internalId = req.params.id.replace('prod-', '');
    db.get("SELECT image FROM products WHERE id = ?", [internalId], (err, row) => {
        if(err) return res.status(500).json({ error: err.message });
        if (row && row.image && row.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, row.image);
            if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
        }
        db.run("DELETE FROM products WHERE id = ?", internalId, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: "Produto não encontrado" });
            res.json({ message: "Produto deletado com sucesso" });
        });
    });
});


app.listen(PORT, () => {
    console.log(`Servidor em http://localhost:${PORT}`);
});

