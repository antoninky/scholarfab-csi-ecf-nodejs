
// notes.service.mjs
import { nanoid } from 'nanoid';
import sqlite3 from 'sqlite3';

let __instance = null;

export class NoteService {
    constructor(db) {
        this.db = db;
    }

    createNote(req,res) {
        const { app, method } = req
        const owner_id = req.session.user.id;
        const db = app.get('g:db')
        // Insérer la note dans la base de données
        const { title, content } = req.body;
        const sql = `INSERT INTO notes (title, content, owner_id) VALUES (?, ?, ?)`;
        return new Promise((resolve, reject) => {
            db.run(sql, [title, content, owner_id], (err) => {
                if (err) {
                    reject(err);
                }
            });
        });
    }

    getNotes(req,res) {
        const { app, method } = req
        const db = app.get('g:db')
        const owner_id = req.session.user.id;
        // Récupérer les notes de la base de données pour un utilisateur spécifique
        const sql = `SELECT * FROM notes WHERE owner_id = ?`;
        return new Promise((resolve, reject) => {
            db.all(sql, [owner_id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    deleteNote(noteId,req, res) {
        const { app, method } = req
        const db = app.get('g:db')
        // Supprimer la note de la base de données
        const sql = `DELETE FROM notes WHERE id = ?`;
        return new Promise((resolve, reject) => {
            db.run(sql, [noteId], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    static getInstance(db) {
        if(!__instance) {
            __instance = new NoteService(db)
        }
        return __instance
    }
}