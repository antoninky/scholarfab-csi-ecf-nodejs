import express from 'express';
import { NoteService } from '../services/notes.service.mjs';

export function loadApplicationController(app) {
    const router = express.Router();
    const noteService = NoteService.getInstance(app.get('db'));

    router.get('/notes/create', async (req, res) => {
        res.render('create_notes');
    });

    router.post('/notes/create', async (req, res) => {
        await noteService.createNote(req,res);
        res.redirect('/notes/read'); // Souci de redirection après la création d'une note, la page ne redirige pas vers la page de lecture des notes
    });

    router.get('/notes/read', async (req, res) => {
        res.render('read_notes', { user: req.session.user, notes:await noteService.getNotes(req,res)  }); // Pass the user to the view
    });

    router.post('/notes/delete/:id', async (req, res) => {
        const noteId = req.params.id;
        await noteService.deleteNote(noteId, req, res);
        res.redirect('/notes/read');
    });

    app.use(router);
}