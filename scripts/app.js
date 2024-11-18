document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-new-note').addEventListener('click', popupCreate);
});

function popupCreate() {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    popupContainer.innerHTML = `

        <div class="popup">
        
            <div class="popup__note">

                <textarea class="popup__note-title" placeholder="Title"></textarea>
                <textarea class="popup__note-content" placeholder="Description"></textarea>

                <div class="popup__options-wrapper">
                
                    <div class="popup__priorities">

                        <button class="popup__priorities-open-btn"><i class="ri-flag-line"></i>Priority</button>

                        <ul class="popup__priorities-btn-list">

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-1" data-priority="1"><i class="ri-flag-fill"></i>Priority 1</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-2" data-priority="2"><i class="ri-flag-fill"></i>Priority 2</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-3" data-priority="3"><i class="ri-flag-fill"></i>Priority 3</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-4" data-priority="4"><i class="ri-flag-fill"></i>Priority 4</button>
                            </li>

                        </ul>

                    </div>
                
                    <div class="popup__tags">

                        <button class="popup__tags-open-btn"><i class="ri-price-tag-line"></i>Tags</button>

                        <ul class="popup__tags-btn-list">
                            
                        </ul>

                    </div>
                
                </div>

                <div class="popup__btn-wrapper">
                    <button class="popup__save-btn">Save</button>
                    <button class="popup__cancel-btn">Cancel</button>
                </div>

            </div>
        
        </div>

    `;

    document.body.appendChild(popupContainer);

    popupContainer.querySelector('.popup__save-btn').addEventListener('click', createNote);
    popupContainer.querySelector('.popup__cancel-btn').addEventListener('click', cancelNote);
    popupContainer.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);

    const prioritiesBtnList = popupContainer.querySelector('.popup__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    //! these names are long as hell damn
}

function popupEdit(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    //const noteToEdit = notes.find(note => note.id == noteId);
    const noteToEdit = notes.find(note => String(note.id) === String(noteId));// changed to string
    const noteTitle = noteToEdit ? noteToEdit.title : "";
    const noteContent = noteToEdit ? noteToEdit.content : "";
    const notePriority = noteToEdit ? noteToEdit.priority : "";
    const editingPopup = document.createElement('div');

    editingPopup.classList.add('popup-container');
    const existingPopup = document.querySelector('.popup-container');

    if (existingPopup) {
        existingPopup.remove();
    }

    if (!noteToEdit) {
        console.error('Note not found!');
        return;
    }

    editingPopup.innerHTML = `
    
        <div class="popup-edit" data-id="${noteId}">

            <div class="popup-edit__note">
            
                <label for="popup-edit__note-title">Title</label>
                <textarea class="popup-edit__note-title" id="popup-edit__note-title">${noteTitle}</textarea>

                <label for="popup-edit__note-content">Description</label>
                <textarea class="popup-edit__note-content">${noteContent}</textarea>

                <div class="popup-edit__options-wrapper">
                
                    <div class="popup-edit__priorities">

                        <button class="popup-edit__priorities-open-btn"><i class="ri-flag-line"></i>${notePriority}</button>

                        <ul class="popup-edit__priorities-btn-list">
                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-1" data-priority="1"><i class="ri-flag-fill"></i>Priority 1</button>
                            </li>
                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-2" data-priority="2"><i class="ri-flag-fill"></i>Priority 2</button>
                            </li>
                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-3" data-priority="3"><i class="ri-flag-fill"></i>Priority 3</button>
                            </li>
                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-4" data-priority="4"><i class="ri-flag-fill"></i>Priority 4</button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="popup-edit__btn-wrapper">
                    <button class="popup-edit__save-btn"><i class="ri-save-line"></i></button>
                    <button class="popup-edit__cancel-btn"><i class="ri-close-line"></i></button>
                </div>

            </div>

        </div>

    `;

    document.body.appendChild(editingPopup);

    editingPopup.querySelector('.popup-edit__save-btn').addEventListener('click', keepChanges);
    editingPopup.querySelector('.popup-edit__cancel-btn').addEventListener('click', discardChanges);
}

function togglePriorityOptions() {
    const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn');
    console.log('Element of the button that toggles the priority options:', prioritiesBtnOpen);

    const prioritiesBtnList = document.querySelector('.popup__priorities-btn-list');
    console.log('Element of the list of priority options:', prioritiesBtnList);

    console.log('Display of the list of priority options:', prioritiesBtnList.style.display);

    if (prioritiesBtnList) {
        prioritiesBtnList.style.display = prioritiesBtnList.style.display === 'none' ? 'block' : 'none';

        const priorityBtn1 = document.getElementById('popup__priority-btn-1');
        const priorityBtn2 = document.getElementById('popup__priority-btn-2');
        const priorityBtn3 = document.getElementById('popup__priority-btn-3');
        const priorityBtn4 = document.getElementById('popup__priority-btn-4');

        priorityBtn1.addEventListener('click', () => {
            prioritiesBtnOpen.textContent = 'Priority 1';
            console.log('Priority set to 1');
            prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';

            prioritiesBtnList.style.display = 'none';
        });

        priorityBtn2.addEventListener('click', () => {
            prioritiesBtnOpen.textContent = 'Priority 2';
            console.log('Priority set to 2');
            prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';

            prioritiesBtnList.style.display = 'none';
        });

        priorityBtn3.addEventListener('click', () => {
            prioritiesBtnOpen.textContent = 'Priority 3';
            console.log('Priority set to 3');
            prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';

            prioritiesBtnList.style.display = 'none';
        });

        priorityBtn4.addEventListener('click', () => {
            prioritiesBtnOpen.textContent = 'Priority 4';
            console.log('Priority set to 4');
            prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';

            prioritiesBtnList.style.display = 'none';
        });

        // set the text content of the main button to 1 and then when loading the note in the show notes function have the shownotes function take the textcontent of the main button as what it should show as the note.priority value hahah
    }
}

function cancelNote() {
    const popupContainer = document.querySelector('.popup-container');

    if (popupContainer) {
        popupContainer.remove();
    }
}

function discardChanges() {
    const editingPopup = document.querySelector('.popup-edit');

    if (editingPopup) {
        editingPopup.remove();
    }
}

function createNote() {
    const popupContainer = document.querySelector('.popup-container');
    const noteTitle = document.querySelector('.popup__note-title').value;
    const noteContent = document.querySelector('.popup__note-content').value;
    const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn');

    if (noteTitle.trim() !== "" && noteContent.trim() !== "") {
        const note = {
            //id: new Date().getTime(),
            id: String(new Date().getTime()), // Convert the ID to a string
            title: noteTitle,
            content: noteContent,
            creationDate: new Date().toISOString(),
            bookmarked: false,
            priority: prioritiesBtnOpen.textContent,
        };

        //
        // setItem(key, value) – store key / value pair.
        //     getItem(key) – get the value by key.
        //         removeItem(key) – remove the key with its value.
        //             clear() – delete everything.
        //                 key(index) – get the key on a given position.
        //                     length – the number of stored items.;


        const storedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        storedNotes.unshift(note);

        localStorage.setItem('notes', JSON.stringify(storedNotes));

        document.querySelector('.popup__note-title').value = "";
        document.querySelector('.popup__note-content').value = "";

        popupContainer.remove();
        showNotes();
        updateNoteCount();
        updateBookmarkedNoteCount();
        console.log('Properties of the created note:', note);
    }

    else {
        displayError();
    }
}

function showNotes() {
    console.log('Current Notes State:', JSON.parse(localStorage.getItem('notes')));

    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.querySelector('.notes-list');
    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');

    notesList.innerHTML = '';
    bookmarkedNotesList.innerHTML = '';

    notes.forEach(note => {
        const noteObject = document.createElement('div');
        noteObject.classList.add('note');
        //noteObject.setAttribute('data-id', note.id);
        noteObject.setAttribute('data-id', String(note.id));

        const creationDate = new Date(note.creationDate);
        const formattedDate = creationDate.toLocaleDateString('en-uk', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        noteObject.innerHTML = `
        
        <div class="note__details">

            <h3 class="note__title">${note.title}</h3>

            <div class="note__options">
                <button class="btn-edit-note" type="button" data-id="${note.id}"><i class="ri-pencil-line"></i></button>
                <button class="btn-delete-note" type="button" data-id="${note.id}"><i class="ri-delete-bin-6-line"></i></button>
                <button class="btn-bookmark-note" type="button" data-id="${note.id}"><i class="ri-star-${note.bookmarked ? 'fill' : 'line'}"></i></button>
            </div>

        </div>

        <div class="note__content">
            <p class="note__text">${note.content}</p>
        </div>

        <div class="note__about">

            <span class="note__priority">
                ${note.priority}
            </span>

            <div class="note__date">
                <time datetime="${note.creationDate}">${formattedDate}</time>
            </div>

        </div>

        `;

        if (note.bookmarked) {
            bookmarkedNotesList.appendChild(noteObject);
        } else {
            notesList.appendChild(noteObject);
        }
    });

    const bookmarkButtons = document.querySelectorAll('.btn-bookmark-note');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.closest('button').getAttribute('data-id');
            bookmarkNote(String(noteId));
        });
    });

    const categories = document.querySelectorAll('.category');

    categories.forEach(category => {
        category.addEventListener('click', (event) => {
            const noteId = event.target.closest('button').getAttribute('data-id');

            if (event.target.closest('.btn-edit-note')) {
                console.log('Edit button clicked. Note ID to edit:', noteId);
                //popupEdit(noteId);
                popupEdit(String(noteId));
            }

            if (event.target.closest('.btn-delete-note')) {
                console.log('Delete button clicked. Note ID to delete:', noteId);
                //deleteNote(noteId);
                deleteNote(String(noteId));
            }
        });
    });
}

function bookmarkNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    //const note = notes.find(note => note.id == noteId);
    const note = notes.find(note => String(note.id) === String(noteId));

    if (note) {
        note.bookmarked = !note.bookmarked;
        console.log(`Bookmark toggled for Note ID: ${noteId}, New State: ${note.bookmarked}`);

        localStorage.setItem('notes', JSON.stringify(notes));

        showNotes();
        updateNoteCount();
        updateBookmarkedNoteCount();
    } else {
        console.log('Something went wrong with the bookmarking function.');
    }
}

function keepChanges() {
    const noteTitle = document.querySelector('.popup-edit__note-title').value.trim();
    const noteContent = document.querySelector('.popup-edit__note-content').value.trim();
    const editingPopup = document.querySelector('.popup-edit');

    if (noteTitle !== "" && noteContent !== "") {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteId = editingPopup.getAttribute('data-id');
        const popupContainer = document.querySelector('.popup-container');
        console.log('11. Noted Updated:', noteId);

        const noteMap = notes.map(note => {
            //if (note.id == noteId) {
            if (String(note.id) === String(noteId)) {
                console.log('12. Updating note:', note);
                return { ...note, title: noteTitle, content: noteContent };
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(noteMap));

        if (editingPopup) {
            editingPopup.remove();
        }

        if (popupContainer) {
            popupContainer.remove();
        }

        showNotes();
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes = notes.filter(note => String(note.id) !== String(noteId));

    localStorage.setItem('notes', JSON.stringify(notes));

    showNotes();
    updateNoteCount();
    updateBookmarkedNoteCount();
}

function updateNoteCount() {
    const unbookmarkedNoteCount = document.getElementById('unbookmarked-count');
    const notesList = document.querySelector('.notes-list');
    const notes = notesList.querySelectorAll('.note');
    const unbookmarkedNoteArray = Array.from(notes);
    console.log('All unbookmarked notes:', unbookmarkedNoteArray);
    unbookmarkedNoteCount.textContent = unbookmarkedNoteArray.length;
}

function updateBookmarkedNoteCount() {
    const bookmarkedNoteCount = document.getElementById('bookmarked-count');
    console.log('ID of number of bookmarked notes:', bookmarkedNoteCount);

    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');
    console.log('Element of the list of bookmarked notes', bookmarkedNotesList);

    const bookmarkedNotes = bookmarkedNotesList.querySelectorAll('.note');
    console.log('List of all of the bookmarked notes', bookmarkedNotes);

    const bookmarkedNotesArray = Array.from(bookmarkedNotes);
    bookmarkedNoteCount.textContent = bookmarkedNotesArray.length;
}

function displayError() {
    const popupError = document.createElement('div');
    popupError.classList.add('popup-error');

    popupError.innerHTML = `

    <p class="popup-error__title">Please add some text to the note</p>
    <button class="popup-error__btn">Close</button>

    `;

    document.body.appendChild(popupError);

    popupError.querySelector('.popup-error__btn').addEventListener('click', closeError);
}

function closeError() {
    let popupError = document.querySelector('.popup-error');

    if (popupError) {
        popupError.remove();
    }
}

showNotes();
updateNoteCount();
updateBookmarkedNoteCount();

//! --------Tag Functionality--------!//
//* have a dropdown or modal menu to add tags to notes
//? refer to https://javascript.info/searching-elements-dom#live-collections on methods
//? user can add multiple tags to a note
//? user can create their own tags (future feature)










