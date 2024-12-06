document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.custom__select-trigger').forEach(trigger => {
        trigger.addEventListener('click', (event) => {
            const dropdown = trigger.nextElementSibling;

            const isVisible = !dropdown.classList.contains('hidden');

            document.querySelectorAll('.custom__select-options').forEach(otherDropdown => {
                otherDropdown.classList.add('hidden');
            });

            if (!isVisible) {
                dropdown.classList.toggle('hidden');
            }

            event.stopPropagation();

        });
    });

    document.addEventListener('click', (event) => {
        document.querySelectorAll('.custom__select-options').forEach(dropdown => {
            const eachSortingParent = dropdown.closest('.custom__select');
            if (!eachSortingParent.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        });
    });

    document.querySelectorAll('.custom__select-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const trigger = choice.closest('.custom__select').querySelector('.custom__select-trigger');
            trigger.textContent = choice.textContent;

            const dropdown = choice.closest('.custom__select-options');
            dropdown.classList.add('hidden');

            const sortValue = choice.getAttribute('data-value');

            if (sortValue === 'ascending-name' || sortValue === 'descending-name') {
                sortByTitle(sortValue);
            } else if (sortValue === 'latest-date' || sortValue === 'oldest-date') {
                sortByDate(sortValue);
            } else if (sortValue === 'ascending-priority' || sortValue === 'descending-priority') {
                sortByPriority(sortValue);
            }
        });
    });

    function sortByTitle(sortValue) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (!Array.isArray(notes)) {
            console.error('Notes is not an array:', notes);
            return;
        }

        notes.sort((a, b) => {
            if (sortValue === 'ascending-name') {
                return a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
            } else if (sortValue === 'descending-name') {
                return b.title.localeCompare(a.title, undefined, { sensitivity: 'base' });
            }
        });

        localStorage.setItem('notes', JSON.stringify(notes));

        showNotes();
    }

    function sortByDate(sortValue) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (!Array.isArray(notes)) {
            console.error('Notes is not an array:', notes);
            return;
        }

        notes.sort((a, b) => {
            if (sortValue === 'latest-date') {
                return new Date(b.creationDate) - new Date(a.creationDate);
            } else if (sortValue === 'oldest-date') {
                return new Date(a.creationDate) - new Date(b.creationDate);
            }
        });

        localStorage.setItem('notes', JSON.stringify(notes));

        showNotes();
    }

    document.querySelector('.btn-filter-by-priority').addEventListener('click', () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

       

        showNotes();
    });

    //! this needs to be be ran when the DOM is fully loaded NOT when the popup is created
    const sidebarTagList = document.querySelector('.sidebar__tag-list');
    const tags = JSON.parse(localStorage.getItem('tags')) || [];

    tags.forEach(tag => {
        const sidebarTagItem = document.createElement('li');
        sidebarTagItem.classList.add('sidebar__tag-item');
        sidebarTagItem.textContent = tag;
        sidebarTagList.appendChild(sidebarTagItem);
    })
});

function popupCreateTag() {
    const popupContainer = document.createElement('div');
    popupContainer.classList.add('popup-container');

    popupContainer.innerHTML = `
    
        <div class="popup-tags">

            <div class="popup-tags__top">
            
                <div class="popup-tags__context">

                    <img src="images/tags-icon.png">

                    <h3 class="popup-tags__header">Tags</h3>

                </div>

                <div class="popup-tags__btn-wrapper">

                    <button class="popup-tags__close-btn"><i class="ri-close-line"></i></button>

                </div>
            
            </div>

            <div class="popup-tags__middle">

                <div class="input-wrapper">
                
                    <input type="text" class="input-field" id="popup-tags__input" placeholder="" />
                    <label for="popup-tags__input" class="input-label">Tag name</label>
                
                </div>
            
            </div>

            <div class="popup-tags__bottom">

                <h4 class="popup-tags__list-header">Created Tags</h4>
                <ul class="popup-tags__list"></ul>
            
            </div>

        </div>
    
    `;

    //check that all variables actually exists in the DOM before doing anything with them man...
    document.body.appendChild(popupContainer);

    const tagsList = document.querySelector('.popup-tags__list');
    const tagsInput = document.getElementById('popup-tags__input');
    const tags = JSON.parse(localStorage.getItem('tags')) || [];


    //? Now that I think about it, it might be a good idea to have a sidebar that displays all of the tags when the page loads but i'll need to create a new function for that. Would also need to get called as frequently as the showNotes function too
    tags.forEach(tag => {
        const tagItem = document.createElement('li');

        tagItem.classList.add('tag-item');
        tagItem.textContent = tag;
        tagsList.appendChild(tagItem);

        //*upon opening the popup the script will display the existing tags so yes I do need to "do this" twice plus ion have to do another function like showNotes since i won't be assigning an ID for any of the tags
    });

    tagsInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const tag = tagsInput.value.trim();
            //* this tag is just THE TEXT of the tag not the actual tag object/item itself so don't get confused 

            if (tag && !tags.includes(tag)) {
                tags.unshift(tag);

                const tagItem = document.createElement('li');
                tagItem.classList.add('tag-item');
                tagItem.textContent = tag;

                tagsList.appendChild(tagItem);
                tagsInput.value = '';

                //* "'tags'"" is the JS array --> it gets converted to a JSON string --> the JSON string gets stored as the value of a key (key: value) --> the key gets it's name from the inside of "stringify(tags)"
                localStorage.setItem('tags', JSON.stringify(tags));

                tagsInput.value = '';

                console.log('Tag Created:', tag);
                console.log('Tags in localStorage:', tags);
            }
        }
    });

    tagsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('tag-item')) {
            const tagItem = event.target;
            const tag = tagItem.textContent;
            const tagIndex = tags.indexOf(tag);

            if (tagIndex > -1) {
                tags.splice(tagIndex, 1);
                localStorage.setItem('tags', JSON.stringify(tags));

                tagItem.remove();

                console.log('Tag Deleted:', tag);
                console.log('Updated list of tags in localStorage:', tags);

                //? do i even need this here??
                showNotes();

                //* the function that for refreshing the display of tags (if i do end up creating another area that displays them) will need to be called once the deletion happens
            }
        }
    });

    document.querySelector('.popup-tags__close-btn').addEventListener('click', closePopup);
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

                        <button class="popup__priorities-open-btn"><i class="ri-bookmark-fill"></i>Priority</button>

                        <ul class="popup__priorities-btn-list">

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-1" data-priority="1"><i class="ri-bookmark-fill"></i>Priority 1</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-2" data-priority="2"><i class="ri-bookmark-fill"></i>Priority 2</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-3" data-priority="3"><i class="ri-bookmark-fill"></i>Priority 3</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-4" data-priority="4"><i class="ri-bookmark-fill"></i>Priority 4</button>
                            </li>

                        </ul>

                    </div>
                
                    <div class="popup__tags">

                        <button class="popup__tags-open-btn"><i class="ri-price-tag-3-fill"></i>Tags</button>

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

    const tagsBtnList = popupContainer.querySelector('.popup__tags-btn-list');
    tagsBtnList.style.display = 'none';

    popupContainer.querySelector('.popup__save-btn').addEventListener('click', createNote);
    popupContainer.querySelector('.popup__close-btn').addEventListener('click', closePopup);
    popupContainer.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);
    popupContainer.querySelector('.popup__tags-open-btn').addEventListener('click', toggleTagOptions);

    setupPriorityButtons();
    renderTags();
}

function popupEdit(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => String(note.id) === String(noteId));
    const noteTitle = noteToEdit ? noteToEdit.title : "";
    const noteContent = noteToEdit ? noteToEdit.content : "";
    const notePriority = noteToEdit ? noteToEdit.priority : "";
    const noteTag = noteToEdit ? noteToEdit.tags : "";
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
                            <i class="ri-bookmark-fill"></i>${notePriority}
                        </button>

                        <ul class="popup-edit__priorities-btn-list">

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-1" data-priority="1"><i class="ri-bookmark-fill"></i>Priority 1</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-2" data-priority="2"><i class="ri-bookmark-fill"></i>Priority 2</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-3" data-priority="3"><i class="ri-bookmark-fill"></i>Priority 3</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-4" data-priority="4"><i class="ri-bookmark-fill"></i>Priority 4</button>
                            </li>

                        </ul>

                    </div>

                    <div class="popup-edit__tags">

                        <button class="popup-edit__tags-open-btn"><i class="ri-price-tag-3-fill"></i>${noteTag}</button>

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

    const tagsBtnList = editingPopup.querySelector('.popup-edit__tags-btn-list');
    tagsBtnList.style.display = 'none';

    editingPopup.querySelector('.popup-edit__save-btn').addEventListener('click', keepChanges);
    editingPopup.querySelector('.popup-edit__close-btn').addEventListener('click', closePopup);
    editingPopup.querySelector('.popup-edit__priorities-open-btn').addEventListener('click', togglePriorityOptions);
    editingPopup.querySelector('.popup-edit__tags-open-btn').addEventListener('click', toggleTagOptions);

    setupPriorityButtons();
    renderTags();
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

function toggleTagOptions() {
    const tagsBtnList = document.querySelector('.popup__tags-btn-list');
    const tagsBtnListEdit = document.querySelector('.popup-edit__tags-btn-list');

    if (tagsBtnList) {
        tagsBtnList.style.display = tagsBtnList.style.display === 'none' ? 'block' : 'none';
    } else {
        tagsBtnListEdit.style.display = tagsBtnListEdit.style.display === 'none' ? 'block' : 'none';
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

    //const tags = JSON.parse(localStorage.getItem('tags')) || [];
    const tagName = document.querySelector('.popup__tags-open-btn');

    if (noteTitle.trim() !== "" && noteContent.trim() !== "") {
        const note = {
            id: String(new Date().getTime()),
            title: noteTitle,
            content: noteContent,
            creationDate: new Date().toISOString(),
            bookmarked: false,
            priority: prioritiesBtnOpen.textContent,
            priorityColor: prioritiesBtnOpen.style.color,
            tags: tagName.textContent,
            //! for the sake of simplicity, i'll limit the number of tags to ONE
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

            <div class="note__tag">
                <i class="ri-price-tag-3-fill"></i>
                ${note.tags}
            </div>

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

function renderTags() {
    const tagsBtnOpen = document.querySelectorAll('.popup__tags-open-btn, .popup-edit__tags-open-btn');
    console.log('Classes for toggling tag list:', tagsBtnOpen);

    const tagListDropdowns = document.querySelectorAll('.popup__tags-btn-list, .popup-edit__tags-btn-list');
    console.log('Classes for tag list dropdowns:', tagListDropdowns);

    const tags = JSON.parse(localStorage.getItem('tags')) || [];

    //! the below does the exact same thing as forEach but and i guess is somewhat easier to read but since I've used forEach elsehwere in this file multiple times idk if it would cause an issue at some point while i'm dealing with this whole tags feature nonsense ffs (see https://stackoverflow.com/questions/50844095/should-one-use-for-of-or-foreach-when-iterating-through-an-array for reference)
    for (const tag of tags) {
        for (const dropdown of tagListDropdowns) {
            const tagButton = document.createElement('li');

            tagButton.classList.add('btn-tag');
            tagButton.textContent = tag;

            dropdown.appendChild(tagButton);
        }
    }

    setupTagButtons();
}

function setupTagButtons() {
    const tagsBtnOpen = document.querySelector('.popup__tags-open-btn');
    const tagsBtnList = document.querySelector('.popup__tags-btn-list');

    if (tagsBtnOpen && tagsBtnList) {
        let tagButtons = tagsBtnList.querySelectorAll('.btn-tag');
        console.log('HTML elements for every tag button:', tagButtons);

        for (const button of tagButtons) {
            button.addEventListener('click', () => {
                let tag = button.textContent;
                console.log('Tag:', tag);

                tagsBtnOpen.textContent = tag;
                tagsBtnList.style.display = 'none';
                //! there is a noticeable delay if I change the tags in quick succession so i'm assuming this is where it would be better to delegate the event listener to the parent element of the tag buttons (tagsBtnList)
            });
        }
    } else {
        const tagsBtnOpenEdit = document.querySelector('.popup-edit__tags-open-btn');
        const tagsBtnListEdit = document.querySelector('.popup-edit__tags-btn-list');

        if (tagsBtnOpenEdit && tagsBtnListEdit) {
            let tagButtons = tagsBtnListEdit.querySelectorAll('.btn-tag');
            for (const button of tagButtons) {
                button.addEventListener('click', () => {
                    let tag = button.textContent;
                    console.log('Tag:', tag);

                    tagsBtnOpenEdit.textContent = tag;
                    tagsBtnListEdit.style.display = 'none';
                });
            }
        }
    }
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
    const tagsBtnOpen = document.querySelector('.popup-edit__tags-open-btn').textContent;
    const editingPopup = document.querySelector('.popup-edit');

    if (noteTitle !== "" && noteContent !== "") {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteId = editingPopup.getAttribute('data-id');
        const popupContainer = document.querySelector('.popup-container');
        console.log('11. Noted Updated:', noteId);

        const noteMap = notes.map(note => {
            if (String(note.id) === String(noteId)) {
                console.log('12. Updating note:', note);
                return { ...note, title: noteTitle, content: noteContent, priority: prioritiesBtnOpen, priorityColor: document.querySelector('.popup-edit__priorities-open-btn').style.color, tags: tagsBtnOpen };
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