document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-new-note').addEventListener('click', popupCreate);

    document.querySelectorAll('.category__dropdown-btn').forEach(button => {
        button.addEventListener('click', () => {
            const notesList = button.closest('.category').querySelector('.notes-list');
            if (notesList) {
                notesList.classList.toggle('hidden');
                console.log('Toggled regular notes list:', notesList);
                return;
            }

            const bookmarkedNotesList = button.closest('.category').querySelector('.bookmarked-notes-list');
            if (bookmarkedNotesList) {
                bookmarkedNotesList.classList.toggle('hidden');
                console.log('Toggled bookmarked notes list:', bookmarkedNotesList);
            }
        });
    });
});

function popupCreate() {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    popupContainer.innerHTML = `

        <div class="popup">
        
            <div class="popup__note">

                <div class="popup__note-top">

                    <div class="popup__note-context">

                        <img src="images/notepad-icon.png">
                    
                        <h3 class="popup__header">New Note</h3>

                    </div>

                    <div class="popup__btn-wrapper">

                        <button class="popup__save-btn"><i class="ri-check-line"></i></button>

                        <button class="popup__close-btn"><i class="ri-close-line"></i></button>

                    </div>

                </div>

                <textarea class="popup__note-title" placeholder="Add a Title"></textarea>
                <textarea class="popup__note-content" placeholder="Add a Description"></textarea>

                <div class="popup__options-wrapper">
                
                    <div class="popup__priorities">

                        <button class="popup__priorities-open-btn"><i class="ri-bookmark-line"></i>Priority</button>

                        <ul class="popup__priorities-btn-list">

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-1" data-priority="1"><i class="ri-bookmark-line"></i>Priority 1</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-2" data-priority="2"><i class="ri-bookmark-line"></i>Priority 2</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-3" data-priority="3"><i class="ri-bookmark-line"></i>Priority 3</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-4" data-priority="4"><i class="ri-bookmark-line"></i>Priority 4</button>
                            </li>

                        </ul>

                    </div>
                
                    <div class="popup__tags">

                        <button class="popup__tags-open-btn"><i class="ri-hashtag"></i>Tags</button>

                        <ul class="popup__tags-btn-list">
                        </ul>

                    </div>
                
                </div>

            </div>
        
        </div>

    `;

    document.body.appendChild(popupContainer);
    document.body.style.overflow = 'hidden';

    const createTextArea = document.querySelector('.popup__note-content');
    createTextArea.addEventListener('input', autoResize);
    autoResize.call(createTextArea);

    popupContainer.querySelector('.popup__save-btn').addEventListener('click', createNote);
    popupContainer.querySelector('.popup__close-btn').addEventListener('click', closePopup);
    popupContainer.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);

    //! gonna dd the exact same of the below to the popupEdit function BUT change popupContainer to editingPopup (NOT existingPopup) since thats what .popup-container is called in the popupEdit function
    //*UPDATE: The toggle works!
    //* now i need to modify setupPriorityButtons so that it works with the editnote functions priority buttons too 
    const prioritiesBtnList = popupContainer.querySelector('.popup__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    setupPriorityButtons(); //! the event listeners for the editing the priorities wasnt working because i fogor to call the function....
}

function popupEdit(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
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

    //! Changed the class name from "popup-edit__priorities-open-btn" to "popup__priorities-open-btn" to stop the keepChanges function from passing "prioritiesBtnOpen.textContent" as null. I also had to use const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn'); instead of const prioritiesBtnOpen = document.querySelector('.popup-edit__priorities-open-btn');

    //! I also did the same for the contents of popup-edit__priorities and changed it to popup__priorities

    //* ATM the btn list is displayed by default and is at the bottom of the page so I will need to check that priority toggle function and the styles for this popup and how to get it to behave the same as the one in the popupCreate function

    editingPopup.innerHTML = `
    
        <div class="popup-edit" data-id="${noteId}">

            <div class="popup-edit__note">

                <div class="popup-edit__note-top">

                    <div class="popup-edit__note-context">

                        <img src="images/notepad-icon.png">
                    
                        <h3 class="popup-edit__header">Edit Note</h3>

                    </div>

                    <div class="popup-edit__btn-wrapper">
                    
                        <button class="popup-edit__save-btn"><i class="ri-check-line"></i></button>

                        <button class="popup-edit__close-btn"><i class="ri-close-line"></i></button>
                    
                    </div>
                    
                </div>
            
                <label for="popup-edit__note-title">Title</label>
                <textarea class="popup-edit__note-title" id="popup-edit__note-title">${noteTitle}</textarea>

                <label for="popup-edit__note-content">Description</label>
                <textarea class="popup-edit__note-content">${noteContent}</textarea>

                <div class="popup-edit__options-wrapper">
                
                    <div class="popup-edit__priorities">

                        <button class="popup-edit__priorities-open-btn"><i class="ri-bookmark-line"></i>${notePriority}</button>

                        <ul class="popup-edit__priorities-btn-list">

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-1" data-priority="1"><i class="ri-bookmark-line"></i>Priority 1</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-2" data-priority="2"><i class="ri-bookmark-line"></i>Priority 2</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-3" data-priority="3"><i class="ri-bookmark-line"></i>Priority 3</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-4" data-priority="4"><i class="ri-bookmark-line"></i>Priority 4</button>
                            </li>

                        </ul>

                    </div>

                    <div class="popup-edit__tags">

                        <button class="popup-edit__tags-open-btn"><i class="ri-hashtag"></i>Tags</button>

                        <ul class="popup-edit__tags-btn-list">
                            
                        </ul>

                    </div>

                </div>

            </div>

        </div>

    `;

    document.body.appendChild(editingPopup);
    document.body.style.overflow = 'hidden';

    const editTextArea = document.querySelector('.popup-edit__note-content');
    editTextArea.addEventListener('input', autoResize);
    autoResize.call(editTextArea);

    editingPopup.querySelector('.popup-edit__save-btn').addEventListener('click', keepChanges);
    editingPopup.querySelector('.popup-edit__close-btn').addEventListener('click', closePopup);

    //! added the below last night to see if it would allow my changes to togglePriorityOptions function to work since there are now 2 popup__priorities-open-btn (1 in the popup-create popup and 1 in the popup-edit popup)
    editingPopup.querySelector('.popup-edit__priorities-open-btn').addEventListener('click', togglePriorityOptions);

    const prioritiesBtnList = editingPopup.querySelector('.popup-edit__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    setupPriorityButtons();
}

function viewNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToView = notes.find(note => String(note.id) === String(noteId));
    const noteTitle = noteToView ? noteToView.title : "";
    const noteContent = noteToView ? noteToView.content : "";
    const viewingPopup = document.createElement('div');

    viewingPopup.classList.add('popup-container');
    const existingPopup = document.querySelector('.popup-container');

    if (existingPopup) {
        existingPopup.remove();
    }

    if (!noteToView) {
        console.error('Note not found!');
        return;
    }

    viewingPopup.innerHTML = `
    
        <div class="popup-view" data-id="${noteId}">

            <div class="popup-view__note">

                <div class="popup-view__note-top">

                    <img src="images/notepad-icon.png">
                
                    <button class="popup-view__close-btn"><i class="ri-close-line"></i></button>
                
                </div>

                <label for="popup-view__note-title">Title</label>
                <textarea class="popup-view__note-title" id="popup-view__note-title">${noteTitle}</textarea>

                <label for="popup-view__note-content">Description</label>
                <textarea class="popup-view__note-content">${noteContent}</textarea>

            </div>

        </div>

    `;

    document.body.appendChild(viewingPopup);
    document.body.style.overflow = 'hidden';

    const viewTextArea = document.querySelector('.popup-view__note-content');
    viewTextArea.addEventListener('input', autoResize);
    autoResize.call(viewTextArea);

    viewingPopup.querySelector('.popup-view__close-btn').addEventListener('click', closePopup);
}

function togglePriorityOptions() {
    //* changed querySelector to querySelectorAll below
    //const prioritiesBtnLists = document.querySelectorAll('.popup__priorities-btn-list');

    //* i could just avoid the hassle and just create another of the commented out code from where it checks if prioritiesBtnList exists and change it to use popup-EDIT__priorities-btn-list instead of popup__priorities-btn-list

    //* changing the display of the note options container could fix the issue of how the priorities buttons appear in the wrong place
    //! Update: using dev tools to turn of the absolute positioning fixed it.... but I cant remove that because the other btn list in the createNote popup needs it

    // prioritiesBtnLists.forEach(list => {
    //     list.style.display = list.style.display === 'none' ? 'block' : 'none';
    // });


    const prioritiesBtnList = document.querySelector('.popup__priorities-btn-list'); //*

    if (prioritiesBtnList) {
        prioritiesBtnList.style.display = prioritiesBtnList.style.display === 'none' ? 'block' : 'none'; //*
    } else {
        const prioritiesBtnListEdit = document.querySelector('.popup-edit__priorities-btn-list'); //*

        prioritiesBtnListEdit.style.display = prioritiesBtnListEdit.style.display === 'none' ? 'block' : 'none'; //*
    }



    // if (prioritiesBtnListEdit) {
    //     prioritiesBtnListEdit.style.display = prioritiesBtnListEdit.style.display === 'none' ? 'block' : 'none';
    // }

    //* changed the variable from "prioritiesBtnList" to "prioritiesBtnLists"
}

function setupPriorityButtons() {
    const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn');
    const prioritiesBtnList = document.querySelector('.popup__priorities-btn-list');

    if (prioritiesBtnOpen && prioritiesBtnList) {
        let priorityButtons = prioritiesBtnList.querySelectorAll('.popup__priority-btn');
        priorityButtons.forEach(button => {
            button.addEventListener('click', () => {
                let priority = button.getAttribute('data-priority');
                let colorMap = {
                    '1': 'red',
                    '2': 'orange',
                    '3': 'yellow',
                    '4': 'hsl(215, 100%, 50%)',
                };

                prioritiesBtnOpen.textContent = `Priority ${priority}`;
                console.log('Priority:', priority);

                prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';

                prioritiesBtnOpen.style.color = colorMap[priority];
                console.log('Color being set:', colorMap[priority]);

                prioritiesBtnList.style.display = 'none';
                console.log(`Priority set to ${priority}`);
            });
        });
    } else {
        const prioritiesBtnOpenEdit = document.querySelector('.popup-edit__priorities-open-btn');
        const prioritiesBtnListEdit = document.querySelector('.popup-edit__priorities-btn-list');
        console.log('prioritiesBtnOpenEdit class is:', prioritiesBtnOpenEdit);
        console.log('prioritiesBtnListEdit class is:', prioritiesBtnListEdit);

        if (prioritiesBtnOpenEdit && prioritiesBtnListEdit) {
            let priorityButtons = prioritiesBtnListEdit.querySelectorAll('.popup-edit__priority-btn');
            priorityButtons.forEach(button => {
                button.addEventListener('click', () => {
                    let priority = button.getAttribute('data-priority');
                    console.log('The data priority attribute is:', priority);
                    let colorMap = {
                        '1': 'red',
                        '2': 'orange',
                        '3': 'yellow',
                        '4': 'hsl(215, 100%, 50%)',
                    };

                    prioritiesBtnOpenEdit.textContent = `Priority ${priority}`;
                    console.log('Priority after edit:', priority);

                    prioritiesBtnOpenEdit.style.backgroundColor = 'hsl(0, 0%, 25%)';

                    prioritiesBtnOpenEdit.style.color = colorMap[priority];
                    console.log('Color being changed to:', colorMap[priority], 'after edit');

                    prioritiesBtnListEdit.style.display = 'none';
                    console.log(`Priority has been changed to ${priority}`);
                });
            });
        } else {
            console.log('prioritiesBtnListEdit is null');
        }
    }
}

function closePopup() {
    const popupContainer = document.querySelector('.popup-container');

    if (popupContainer) {
        popupContainer.remove();

        document.body.style.overflow = 'auto';
    }
}

function createNote() {
    const popupContainer = document.querySelector('.popup-container');
    const noteTitle = document.querySelector('.popup__note-title').value;
    const noteContent = document.querySelector('.popup__note-content').value;
    const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn');

    if (noteTitle.trim() !== "" && noteContent.trim() !== "") {
        const note = {
            id: String(new Date().getTime()),
            title: noteTitle,
            content: noteContent,
            creationDate: new Date().toISOString(),
            bookmarked: false,
            priority: prioritiesBtnOpen.textContent,
            priorityColor: prioritiesBtnOpen.style.color
        };

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
                <i class="ri-circle-fill" style="color: ${note.priorityColor}"></i>
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

    const notesToOpen = document.querySelectorAll('.note');
    notesToOpen.forEach(note => {
        note.addEventListener('click', (event) => {
            if (
                event.target.closest('.btn-edit-note') ||
                event.target.closest('.btn-delete-note') ||
                event.target.closest('.btn-bookmark-note')
            ) {
                return;
            }

            const noteId = note.getAttribute('data-id');
            viewNote(String(noteId));
            console.log('Note to open:', noteId);
        });
    });

    const bookmarkButtons = document.querySelectorAll('.btn-bookmark-note');
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const noteId = event.target.closest('button').getAttribute('data-id');
            bookmarkNote(String(noteId));
        });
    });

    const editNoteButtons = document.querySelectorAll('.btn-edit-note');
    editNoteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            let noteId = null;
            if (event.target.classList.contains('btn-edit-note')) {
                noteId = event.target.getAttribute('data-id');
                console.log('Edit button clicked. Note ID to edit:', noteId);
                popupEdit(String(noteId));
            }
        });
    });

    const deleteNoteButtons = document.querySelectorAll('.btn-delete-note');
    deleteNoteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            let noteId = null;
            if (event.target.classList.contains('btn-delete-note')) {
                noteId = event.target.getAttribute('data-id');
                deleteNote(String(noteId));
                console.log('Delete button clicked. Note ID to delete:', noteId);
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
    const prioritiesBtnOpen = document.querySelector('.popup-edit__priorities-open-btn').textContent;
    const editingPopup = document.querySelector('.popup-edit');

    if (noteTitle !== "" && noteContent !== "") {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteId = editingPopup.getAttribute('data-id');
        const popupContainer = document.querySelector('.popup-container');
        console.log('11. Noted Updated:', noteId);

        const noteMap = notes.map(note => {
            if (String(note.id) === String(noteId)) {
                console.log('12. Updating note:', note);
                return { ...note, title: noteTitle, content: noteContent, priority: prioritiesBtnOpen, priorityColor: document.querySelector('.popup-edit__priorities-open-btn').style.color };
                //! for updating the priority color, if I want to use the variable "prioritiesBtnOpen" I would have to change the initial declaration to let prioritiesBtnOpen = document.querySelector('.popup-edit__priorities-open-btn').textContent and then also use "let prioritiesBtnOpen = document.querySelector('.popup-edit__priorities-open-btn')" but inside this if statement
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

function autoResize() {
    const createTextArea = document.querySelector('.popup__note-content');
    const editTextArea = document.querySelector('.popup-edit__note-content');
    const viewTextArea = document.querySelector('.popup-view__note-content');

    if (editTextArea) {
        editTextArea.style.height = 'auto';
        editTextArea.style.height = editTextArea.scrollHeight + 'px';
    }

    if (createTextArea) {
        createTextArea.style.height = 'auto';
        createTextArea.style.height = createTextArea.scrollHeight + 'px';
    }

    if (viewTextArea) {
        viewTextArea.style.height = 'auto';
        viewTextArea.style.height = viewTextArea.scrollHeight + 'px';
    }
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










