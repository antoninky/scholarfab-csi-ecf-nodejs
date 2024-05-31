import express from 'express';
import { NoteService } from '../services/notes.service.mjs';

export function loadApplicationController(app) {
    const router = express.Router();
    const noteService = NoteService.getInstance(app.get('db'));

    router.post('/notes/create', async (req, res) => {
        await noteService.createNote(req,res);
        res.status(303).redirect('/notes/read');
    });

    router.get('/notes/read', async (req, res) => {

        res.render('notes', { notes:await noteService.getNotes(req,res)  });
    });

    router.post('/notes/delete/:id', async (req, res) => {
        const noteId = req.params.id;
        await noteService.deleteNote(noteId, req, res);
        res.redirect('/notes/read');
    });

    app.use(router);
    // définir les autres routes de l'application ici ...
}