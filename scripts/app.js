document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.btn-new-note').addEventListener('click', popupCreate);

    // clicking the btn opens the popup for creating tags
    document.querySelector('.btn-new-tag').addEventListener('click', popupCreateTag);

    document.querySelectorAll('.category__dropdown-btn').forEach(button => {
        button.addEventListener('click', () => {
            const notesList = button.closest('.category').querySelector('.notes-list');

            button.classList.toggle('rotate');

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

function popupCreateTag() {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    const tagsList = document.querySelector('popup__tags-list');
    const tagsInput = document.querySelector('.popup__tags-input');
    const tags = [];

    popupContainer.innerHTML = `
    
        <div class="popup__tags">

            <input type="text" class="popup__tags-input" placeholder="Add a tag" />

            <button class="popup__tags-add-btn">Add Tag</button>

            <ul class="popup__tags-list"></ul>

        </div>
    
    `;

    document.querySelector('.popup__tags-add-btn').addEventListener('click', () => {
        //trim whitespace from the end of what the user typed into the input and pass it as a variable
        const tag = tagsInput.value.trim();

        //check if the tag exists and also if the tag is not currently inside the tags array
        if (tag && !tags.includes(tag)) {
            // add the tag to the start of the array
            tags.unshift(tag);

            //an li element is then created and added to the tagsList aka the popup__tags-list
            const tagItem = document.createElement('li');

            // the text of the tagItem is then set to be whatever the tag that was created was (the word the user typed to be the tag)
            tagItem.textContent = tag;

            // append the tagItem to the start of the tagsList (popup__tags-list)
            tagsList.unshift(tagItem);

            // reset/clear the input field so the user can add another tag if needed
            tagsInput.value = '';
        }
    });
}

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

    const prioritiesBtnList = popupContainer.querySelector('.popup__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    popupContainer.querySelector('.popup__save-btn').addEventListener('click', createNote);
    popupContainer.querySelector('.popup__close-btn').addEventListener('click', closePopup);
    popupContainer.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);

    setupPriorityButtons();
}

function popupEdit(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => String(note.id) === String(noteId));
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

                        <button class="popup-edit__priorities-open-btn">
                            <i class="ri-bookmark-line"></i>${notePriority}
                        </button>

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

    const prioritiesBtnList = editingPopup.querySelector('.popup-edit__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    editingPopup.querySelector('.popup-edit__save-btn').addEventListener('click', keepChanges);
    editingPopup.querySelector('.popup-edit__close-btn').addEventListener('click', closePopup);
    editingPopup.querySelector('.popup-edit__priorities-open-btn').addEventListener('click', togglePriorityOptions);

    setupPriorityButtons();
}

function togglePriorityOptions() {
    const prioritiesBtnList = document.querySelector('.popup__priorities-btn-list');
    const prioritiesBtnListEdit = document.querySelector('.popup-edit__priorities-btn-list');

    if (prioritiesBtnList) {
        prioritiesBtnList.style.display = prioritiesBtnList.style.display === 'none' ? 'block' : 'none';
    } else {
        prioritiesBtnListEdit.style.display = prioritiesBtnListEdit.style.display === 'none' ? 'block' : 'none';
    }
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
            priorityColor: prioritiesBtnOpen.style.color,
            tags: [],
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
        closePopup();
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
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            weekday: 'long',
            month: 'short',
            hour12: true,
        });

        noteObject.innerHTML = `
        
        <div class="note__details">

            <h3 class="note__title">${note.title}</h3>

            <div class="note__options">
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
            popupEdit(String(noteId));
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

        if (popupContainer) {
            popupContainer.remove();

            document.body.style.overflow = 'auto';
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
    const textAreas = document.querySelectorAll('.popup__note-content, .popup-edit__note-content');

    textAreas.forEach((textArea) => {
        textArea.style.height = 'auto';
        textArea.style.height = `${textArea.scrollHeight}px`;
    });
}

showNotes();
updateNoteCount();
updateBookmarkedNoteCount();

//* Tagging feature (multiple tags per note)
// 1. Clicking the add new tag btn opens a popup
// 2. The popup will allow the user to create tags by typing them into an input field
// 3. Clicking the add tag button (next to the input field) will add the tag to the array of tags OF THE TAGLIST NOT THE NOTES TAG ARRAY (the tagList var)
// 4. When creating or editing a note, the user can click the tags option btn and the dropdown will display the list of tags pulled from the tagsList var array
// 5. Clicking a tag from the dropdown will add it to that specific note's tags array
// 6. Clicking the remove tag button (small X icon inside the tag itself) will remove the tag from the note OBJECT's tags array
//! Obvs the tags added to the notes will need to be displayed every time notes are shown so I'll need to update the functions accordingly