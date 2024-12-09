import '/styles/style.scss';
import '/styles/button.scss';
import '/styles/note.scss';
import '/styles/popup.scss';
import '/styles/popup-edit.scss';
import '/styles/popup-tags.scss';
import '/styles/sidebar.scss';
import '/styles/filter.scss';
import '/styles/popup-filter.scss';

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

    function sortByPriority(sortValue) {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];

        if (!Array.isArray(notes)) {
            console.error('Notes is not an array:', notes);
            return;
        }

        notes.forEach(note => {
            if (typeof note.priority !== 'string') {
                console.error('Note priority is not a string:', note);
            }
        });

        notes.sort((a, b) => {
            if (sortValue === 'descending-priority') {
                return a.priority.localeCompare(b.priority, undefined, { sensitivity: 'base' });
            } else if (sortValue === 'ascending-priority') {
                return b.priority.localeCompare(a.priority, undefined, { sensitivity: 'base' });
            }
        });

        localStorage.setItem('notes', JSON.stringify(notes));

        showNotes();
    }

    document.querySelector('.btn-new-note').addEventListener('click', noteCreation);

    document.querySelector('.btn-new-tag').addEventListener('click', popupCreateTag);

    document.querySelector('.btn-toggle-options').addEventListener('click', () => {
        const filterTab = document.querySelector('.custom');
        filterTab.classList.toggle('hidden');
    });

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

    document.querySelector('.sidebar__tag-list').addEventListener('click', (event) => {
        const clickedTag = event.target;

        if (clickedTag.classList.contains('sidebar__tag-item')) {
            const tagName = clickedTag.textContent.trim();
            console.log('Clicked Tag:', tagName);
            filterByTag(tagName);
        }
    });

    document.querySelector('.sidebar__priority-list').addEventListener('click', (event) => {
        const clickedPriority = event.target;

        if (clickedPriority.classList.contains('sidebar__priority-item')) {
            const priorityValue = clickedPriority.textContent.trim();
            console.log('Clicked Priority:', priorityValue);
            filterByPriority(priorityValue);
        }
    });

    updateSidebarTagList();
});

function popupCreateTag() {
    const tagCreatingPopup = document.createElement('div');
    tagCreatingPopup.classList.add('tag-creation-popup');

    tagCreatingPopup.innerHTML = `
    
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

    document.body.appendChild(tagCreatingPopup);

    const tagsList = document.querySelector('.popup-tags__list');
    const tagsInput = document.getElementById('popup-tags__input');
    const tags = JSON.parse(localStorage.getItem('tags')) || [];

    tags.forEach(tag => {
        const tagItem = document.createElement('li');
        const icon = document.createElement('i');

        tagItem.classList.add('tag-item');
        icon.classList.add('ri-delete-bin-line');

        tagItem.textContent = tag;

        tagItem.appendChild(icon);
        tagsList.appendChild(tagItem);
    });

    tagsInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            const tag = tagsInput.value.trim();

            if (tag && !tags.includes(tag)) {
                tags.unshift(tag);

                const tagItem = document.createElement('li');
                tagItem.classList.add('tag-item');
                tagItem.textContent = tag;

                const icon = document.createElement('i');
                icon.classList.add('ri-delete-bin-line');
                tagItem.appendChild(icon);

                tagsList.appendChild(tagItem);
                tagsInput.value = '';

                localStorage.setItem('tags', JSON.stringify(tags));

                tagsInput.value = '';

                console.log('Tag Created:', tag);
                console.log('Tags in localStorage:', tags);

                updateSidebarTagList();
            }
        }
    });

    tagsList.addEventListener('click', function (event) {
        if (event.target.classList.contains('ri-delete-bin-line')) {
            const tagItem = event.target.parentElement;
            const tag = tagItem.textContent.trim();
            const tagIndex = tags.indexOf(tag);

            if (tagIndex > -1) {
                tags.splice(tagIndex, 1);
                localStorage.setItem('tags', JSON.stringify(tags));

                tagItem.remove();

                console.log('Tag Deleted:', tag);
                console.log('Updated list of tags in localStorage:', tags);

                const sidebarTags = document.querySelectorAll('.sidebar__tag-item');
                sidebarTags.forEach(sidebarTag => {
                    if (sidebarTag.textContent.trim() === tag) {
                        sidebarTag.remove();
                    }
                });

                showNotes();
                updateSidebarTagList();
            }
        }
    });

    document.querySelector('.popup-tags__close-btn').addEventListener('click', () => {
        tagCreatingPopup.remove();
    });
}

function noteCreation() {
    const noteCreationPopup = document.createElement('div');
    noteCreationPopup.classList.add('note-creation-popup');

    noteCreationPopup.innerHTML = `

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

                        <button class="popup__priorities-open-btn"><i class="ri-circle-fill"></i>Priority</button>

                        <ul class="popup__priorities-btn-list">

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-1" data-priority="1"><i class="ri-circle-fill"></i>Priority 1</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-2" data-priority="2"><i class="ri-circle-fill"></i>Priority 2</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-3" data-priority="3"><i class="ri-circle-fill"></i>Priority 3</button>
                            </li>

                            <li class="popup__priorities-btn-item">
                                <button class="popup__priority-btn" id="popup__priority-btn-4" data-priority="4"><i class="ri-circle-fill"></i>Priority 4</button>
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

    document.body.appendChild(noteCreationPopup);
    document.body.style.overflow = 'hidden';

    const createTextArea = document.querySelector('.popup__note-content');
    createTextArea.addEventListener('input', autoResize);
    autoResize.call(createTextArea);

    const prioritiesBtnList = noteCreationPopup.querySelector('.popup__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    const tagsBtnList = noteCreationPopup.querySelector('.popup__tags-btn-list');
    tagsBtnList.style.display = 'none';

    noteCreationPopup.querySelector('.popup__save-btn').addEventListener('click', createNote);
    noteCreationPopup.querySelector('.popup__close-btn').addEventListener('click', () => noteCreationPopup.remove());
    noteCreationPopup.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);
    noteCreationPopup.querySelector('.popup__tags-open-btn').addEventListener('click', toggleTagOptions);

    setupPriorityButtons();
    renderTags();
}

function popupEdit(noteId, originalTagName, originalPriority) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => String(note.id) === String(noteId));
    const noteTitle = noteToEdit ? noteToEdit.title : "";
    const noteContent = noteToEdit ? noteToEdit.content : "";
    const notePriority = noteToEdit ? noteToEdit.priority : "";
    const noteTag = noteToEdit ? noteToEdit.tags : "";
    const noteEditingPopup = document.createElement('div');

    noteEditingPopup.classList.add('note-editing-popup');
    noteEditingPopup.dataset.id = noteId;

    if (!noteToEdit) {
        console.error('Note not found!');
        return;
    }

    noteEditingPopup.innerHTML = `
    
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
                            <i class="ri-circle-fill"></i>${notePriority}
                        </button>

                        <ul class="popup-edit__priorities-btn-list">

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-1" data-priority="1"><i class="ri-circle-fill"></i>Priority 1</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-2" data-priority="2"><i class="ri-circle-fill"></i>Priority 2</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-3" data-priority="3"><i class="ri-circle-fill"></i>Priority 3</button>
                            </li>

                            <li class="popup-edit__priorities-btn-item">
                                <button class="popup-edit__priority-btn" id="popup-edit__priority-btn-4" data-priority="4"><i class="ri-circle-fill"></i>Priority 4</button>
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

    document.body.appendChild(noteEditingPopup);
    document.body.style.overflow = 'hidden';

    const editTextArea = document.querySelector('.popup-edit__note-content');
    editTextArea.addEventListener('input', autoResize);
    autoResize.call(editTextArea);

    const prioritiesBtnList = noteEditingPopup.querySelector('.popup-edit__priorities-btn-list');
    prioritiesBtnList.style.display = 'none';

    const tagsBtnList = noteEditingPopup.querySelector('.popup-edit__tags-btn-list');
    tagsBtnList.style.display = 'none';

    noteEditingPopup.querySelector('.popup-edit__priorities-open-btn').addEventListener('click', togglePriorityOptions);
    noteEditingPopup.querySelector('.popup-edit__tags-open-btn').addEventListener('click', toggleTagOptions);

    noteEditingPopup.querySelector('.popup-edit__save-btn').addEventListener('click', () => {
        saveChangesToNote(originalTagName, originalPriority);
    });

    noteEditingPopup.querySelector('.popup-edit__close-btn').addEventListener('click', () => {
        noteEditingPopup.remove();
        document.body.style.overflow = 'auto';
    });

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

                prioritiesBtnOpen.textContent = `Priority ${priority}`.trim();
                prioritiesBtnOpen.style.backgroundColor = 'hsl(0, 0%, 25%)';
                prioritiesBtnOpen.style.color = colorMap[priority];
                prioritiesBtnList.style.display = 'none';
            });
        });
    } else {
        const prioritiesBtnOpenEdit = document.querySelector('.popup-edit__priorities-open-btn');
        const prioritiesBtnListEdit = document.querySelector('.popup-edit__priorities-btn-list');

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

                    prioritiesBtnOpenEdit.textContent = `Priority ${priority}`.trim();
                    prioritiesBtnOpenEdit.style.backgroundColor = 'hsl(0, 0%, 25%)';
                    prioritiesBtnOpenEdit.style.color = colorMap[priority];
                    prioritiesBtnListEdit.style.display = 'none';
                });
            });
        } else {
            console.log('prioritiesBtnListEdit is null');
        }
    }
}

function createNote() {
    const noteCreationPopup = document.querySelector('.note-creation-popup');
    const noteTitle = document.querySelector('.popup__note-title').value;
    const noteContent = document.querySelector('.popup__note-content').value;
    const prioritiesBtnOpen = document.querySelector('.popup__priorities-open-btn');
    const tagName = document.querySelector('.popup__tags-open-btn').textContent;

    if (noteTitle.trim() !== "" && noteContent.trim() !== "") {
        const note = {
            id: String(new Date().getTime()),
            title: noteTitle,
            content: noteContent,
            creationDate: new Date().toISOString(),
            bookmarked: false,
            priority: prioritiesBtnOpen.textContent.trim(),
            priorityColor: prioritiesBtnOpen.style.color,
            tags: [tagName]
        };

        let storedNotes = JSON.parse(localStorage.getItem('notes')) || [];

        if (!Array.isArray(storedNotes)) {
            console.error('Stored notes is not an array:', storedNotes);
            storedNotes = [];
        }

        storedNotes.unshift(note);

        localStorage.setItem('notes', JSON.stringify(storedNotes));

        document.querySelector('.popup__note-title').value = "";
        document.querySelector('.popup__note-content').value = "";

        noteCreationPopup.remove();
        document.body.style.overflow = 'auto';

        showNotes();
        updateNoteCount();
        updateBookmarkedNoteCount();

        console.log('Properties of the created note:', note);
        console.log('Notes in localStorage after creation:', storedNotes);

    }

    else {
        noteCreationPopup.remove();
        document.body.style.overflow = 'auto';
    }
}

function showNotes() {
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
                <button class="btn-delete-note" type="button" data-id="${note.id}"><i class="ri-delete-bin-line"></i></button>
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

            <span class="note__tag ${note.tags ? '' : 'hidden'}">
                <i class="ri-price-tag-3-fill ${note.tags ? '' : 'hidden'}"></i>
                ${note.tags || ''}
            </span>

            <span class="note__date">
                <time datetime="${note.creationDate}">${formattedDate}</time>
            </span>

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
            if (event.target.classList.contains('btn-delete-note')) {
                const noteId = event.target.getAttribute('data-id');
                deleteNote(noteId);
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

function saveChangesToNote(originalTagName, originalPriority) {
    const noteTitle = document.querySelector('.popup-edit__note-title').value.trim();
    const noteContent = document.querySelector('.popup-edit__note-content').value.trim();
    const prioritiesBtnOpen = document.querySelector('.popup-edit__priorities-open-btn');
    const tagsBtnOpen = document.querySelector('.popup-edit__tags-open-btn').textContent.trim();
    const noteEditingPopup = document.querySelector('.note-editing-popup');

    if (noteTitle !== "" && noteContent !== "") {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        const noteId = noteEditingPopup.getAttribute('data-id');

        const noteMap = notes.map(note => {
            if (String(note.id) === String(noteId)) {
                const updatedNote = {
                    ...note,
                    title: noteTitle,
                    content: noteContent,
                    priority: prioritiesBtnOpen.textContent.trim(),
                    priorityColor: prioritiesBtnOpen.style.color || note.priorityColor,
                    tags: tagsBtnOpen
                };

                console.log('12. Updating note:', updatedNote);
                return updatedNote;
            }
            return note;
        });

        localStorage.setItem('notes', JSON.stringify(noteMap));

        const noteFilteringPopup = document.querySelector('.note-filtering-popup');

        if (noteFilteringPopup) {
            refreshFilterPopup(originalTagName, originalPriority);
        } else {
            document.body.style.overflow = 'auto';

            noteEditingPopup.remove();
        }

        showNotes();
    }
}

function filterByTag(tagName) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.tags && note.tags.includes(tagName));
    const notesList = document.querySelector('.notes-list');
    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');

    if (notesList && bookmarkedNotesList) {
        document.body.querySelector('.note-app').classList.add('hidden');
    }

    const noteFilteringPopup = document.createElement('div');

    const popupFilterHTML = `
                <div class="popup-filter">
                    <div class="popup-filter__top">
                        <div class="popup-filter__context">
                            <img src="images/tags-icon.png">
                            <h3 class="popup-filter__header">Notes with the Tag ${tagName}</h3>
                        </div>
                        <button type="button" class="popup-filter__close-btn">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="popup-filter__notes-list">

                        ${filteredNotes.map(note => {
        const date = new Date(note.creationDate);
        const formattedDate = date.toLocaleDateString('en-uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `

                        <div class="popup-filter__note" data-id="${note.id}">

                            <div class="popup-filter__note-details">

                                <h3 class="popup-filter__note-title">${note.title}</h3>

                                <div class="popup-filter__note-options">

                                    <button class="btn-delete-note" type="button" data-id="${note.id}">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>

                                    <button class="btn-bookmark-note" type="button" data-id="${note.id}">
                                        <i class="ri-star-${note.bookmarked ? 'fill' : 'line'}"></i>
                                    </button>

                                </div>
                            </div>

                            <div class="popup-filter__note-content">
                                <p class="popup-filter__note-text">${note.content}</p>
                            </div>

                            <div class="popup-filter__note-about">

                                <span class="popup-filter__note-priority">
                                    <i class="ri-circle-fill" style="color: ${note.priorityColor}"></i>
                                    ${note.priority}
                                </span>

                                <span class="popup-filter__note-tag">
                                    <i class="ri-price-tag-3-fill"></i>
                                    ${note.tags}
                                </span>

                                <span class="popup-filter__note-date">
                                    <time datetime="${note.creationDate}">${formattedDate}</time>
                                </span>

                            </div>

                        </div>
                    `;

    }).join('')}

                    </div>

                </div>
            `;

    noteFilteringPopup.innerHTML = popupFilterHTML;
    noteFilteringPopup.classList.add('note-filtering-popup');

    document.body.appendChild(noteFilteringPopup);
    document.body.style.overflow = 'hidden';

    noteFilteringPopup.querySelector('.popup-filter__close-btn').addEventListener('click', () => {
        noteFilteringPopup.remove();
        document.body.style.overflow = 'auto';
        document.body.querySelector('.note-app').classList.remove('hidden');
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    filteredNotesList.addEventListener('click', (event) => {
        const note = event.target.closest('.popup-filter__note');

        if (!note || !filteredNotesList.contains(note)) {
            return;
        }

        if (
            event.target.closest('.btn-delete-note') ||
            event.target.closest('.btn-bookmark-note')
        ) {
            return;
        }

        const noteId = note.getAttribute('data-id');
        popupEdit(noteId, tagName);
    });

    filteredNotesList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.btn-delete-note');
        if (deleteButton) {
            const noteId = deleteButton.getAttribute('data-id');
            deleteNote(noteId);
            refreshFilterPopup(tagName, null);
        }
    });

    filteredNotesList.addEventListener('click', (event) => {
        const bookmarkButton = event.target.closest('.btn-bookmark-note');
        if (bookmarkButton) {
            const noteId = bookmarkButton.getAttribute('data-id');
            bookmarkNote(noteId);
            refreshFilterPopup(tagName, null);
        }
    });
}

function filterByPriority(priorityValue) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.priority == priorityValue);
    console.log('Notes found with priority:', priorityValue, filteredNotes);

    const notesList = document.querySelector('.notes-list');
    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');

    if (notesList && bookmarkedNotesList) {
        document.body.querySelector('.note-app').classList.add('hidden');
    }

    const noteFilteringPopup = document.createElement('div');

    const popupFilterHTML = `
                <div class="popup-filter">
                    <div class="popup-filter__top">
                        <div class="popup-filter__context">
                            <img src="images/priority-icon.png">
                            <h3 class="popup-filter__header">Notes with ${priorityValue}</h3>
                        </div>
                        <button type="button" class="popup-filter__close-btn">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="popup-filter__notes-list">

                        ${filteredNotes.map(note => {
        const date = new Date(note.creationDate);
        const formattedDate = date.toLocaleDateString('en-uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `

                        <div class="popup-filter__note" data-id="${note.id}">

                            <div class="popup-filter__note-details">

                                <h3 class="popup-filter__note-title">${note.title}</h3>

                                <div class="popup-filter__note-options">

                                    <button class="btn-delete-note" type="button" data-id="${note.id}">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>

                                    <button class="btn-bookmark-note" type="button" data-id="${note.id}">
                                        <i class="ri-star-${note.bookmarked ? 'fill' : 'line'}"></i>
                                    </button>

                                </div>
                            </div>

                            <div class="popup-filter__note-content">
                                <p class="popup-filter__note-text">${note.content}</p>
                            </div>

                            <div class="popup-filter__note-about">

                                <span class="popup-filter__note-priority">
                                    <i class="ri-circle-fill" style="color: ${note.priorityColor}"></i>
                                    ${note.priority}
                                </span>

                                <span class="popup-filter__note-tag">
                                    <i class="ri-price-tag-3-fill"></i>
                                    ${note.tags}
                                </span>

                                <span class="popup-filter__note-date">
                                    <time datetime="${note.creationDate}">${formattedDate}</time>
                                </span>

                            </div>

                        </div>
                    `;

    }).join('')}

                    </div>

                </div>
            `;

    noteFilteringPopup.innerHTML = popupFilterHTML;
    noteFilteringPopup.classList.add('note-filtering-popup');

    document.body.appendChild(noteFilteringPopup);
    document.body.style.overflow = 'hidden';

    noteFilteringPopup.querySelector('.popup-filter__close-btn').addEventListener('click', () => {
        noteFilteringPopup.remove();
        document.body.style.overflow = 'auto';
        document.body.querySelector('.note-app').classList.remove('hidden');
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    filteredNotesList.addEventListener('click', (event) => {
        const note = event.target.closest('.popup-filter__note');

        if (!note || !filteredNotesList.contains(note)) {
            return;
        }

        if (
            event.target.closest('.btn-delete-note') ||
            event.target.closest('.btn-bookmark-note')
        ) {
            return;
        }

        const noteId = note.getAttribute('data-id');
        popupEdit(noteId, null, priorityValue);
    });

    filteredNotesList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.btn-delete-note');
        if (deleteButton) {
            const noteId = deleteButton.getAttribute('data-id');
            deleteNote(noteId);
            refreshFilterPopup(null, priorityValue);
        }
    });

    filteredNotesList.addEventListener('click', (event) => {
        const bookmarkButton = event.target.closest('.btn-bookmark-note');
        if (bookmarkButton) {
            const noteId = bookmarkButton.getAttribute('data-id');
            bookmarkNote(noteId);
            refreshFilterPopup(null, priorityValue);
        }
    });
}

function refreshFilterPopup(tagName, priorityValue) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    let filteredNotes;

    if (tagName) {
        filteredNotes = notes.filter(note => note.tags && note.tags.includes(tagName));
    } else if (priorityValue) {
        filteredNotes = notes.filter(note => note.priority == priorityValue);
    } else {
        console.error('No tagName or priorityValue provided for filtering.');
        return;
    }

    const noteFilteringPopup = document.querySelector('.note-filtering-popup');

    noteFilteringPopup.innerHTML = '';
    noteFilteringPopup.remove();

    const noteFilteringPopupAfterChangesSaved = document.createElement('div');
    noteFilteringPopupAfterChangesSaved.classList.add('note-filtering-popup');

    console.log('Filtered notes:', filteredNotes);
    console.log('The HTML element that displays the filtered notes:', noteFilteringPopupAfterChangesSaved);

    const imgSrc = tagName ? 'images/tags-icon.png' : 'images/priority-icon.png';

    const popupFilterHTML = `
                <div class="popup-filter">
                    <div class="popup-filter__top">
                        <div class="popup-filter__context">
                            <img src="${imgSrc}">
                            <h3 class="popup-filter__header">Notes with ${tagName ? `Tag: ${tagName}` : `Priority: ${priorityValue}`}</h3>
                        </div>
                        <button type="button" id="popup-filter__close-btn">
                            <i class="ri-close-line"></i>
                        </button>
                    </div>
                    <div class="popup-filter__notes-list">

                        ${filteredNotes.map(note => {
        const date = new Date(note.creationDate);
        const formattedDate = date.toLocaleDateString('en-uk', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
                        <div class="popup-filter__note" data-id="${note.id}">
                            <div class="popup-filter__note-details">
                                <h3 class="popup-filter__note-title">${note.title}</h3>
                                <div class="popup-filter__note-options">
                                    <button class="btn-delete-note" type="button" data-id="${note.id}">
                                        <i class="ri-delete-bin-line"></i>
                                    </button>
                                    <button class="btn-bookmark-note" type="button" data-id="${note.id}">
                                        <i class="ri-star-${note.bookmarked ? 'fill' : 'line'}"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="popup-filter__note-content">
                                <p class="popup-filter__note-text">${note.content}</p>
                            </div>
                            <div class="popup-filter__note-about">
                                <span class="popup-filter__note-priority">
                                    <i class="ri-circle-fill" style="color: ${note.priorityColor}"></i>
                                    ${note.priority}
                                </span>
                                <span class="popup-filter__note-tag">
                                    <i class="ri-price-tag-3-fill"></i>
                                    ${note.tags}
                                </span>
                                <span class="popup-filter__note-date">
                                    <time datetime="${note.creationDate}">${formattedDate}</time>
                                </span>
                            </div>
                        </div>
                    `;
    }).join('')}
                    </div>
                </div>
            `;

    noteFilteringPopupAfterChangesSaved.innerHTML = popupFilterHTML;

    document.body.appendChild(noteFilteringPopupAfterChangesSaved);
    document.body.style.overflow = 'hidden';

    const noteEditingPopup = document.querySelector('.note-editing-popup');

    if (noteEditingPopup) {
        noteEditingPopup.remove();
    }

    noteFilteringPopupAfterChangesSaved.querySelector('#popup-filter__close-btn').addEventListener('click', () => {
        document.body.querySelector('.note-app').classList.remove('hidden');

        noteFilteringPopupAfterChangesSaved.remove();
        document.body.style.overflow = 'auto';

        if (noteEditingPopup) {
            noteEditingPopup.remove();
        }
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    filteredNotesList.addEventListener('click', (event) => {
        const note = event.target.closest('.popup-filter__note');

        if (!note || !filteredNotesList.contains(note)) {
            return;
        }

        if (
            event.target.closest('.btn-delete-note') ||
            event.target.closest('.btn-bookmark-note')
        ) {
            return;
        }

        const noteId = note.getAttribute('data-id');
        popupEdit(noteId, tagName, priorityValue);
    });

    filteredNotesList.addEventListener('click', (event) => {
        const deleteButton = event.target.closest('.btn-delete-note');
        if (deleteButton) {
            const noteId = deleteButton.getAttribute('data-id');
            deleteNote(noteId);

            refreshFilterPopup(tagName, priorityValue);
        }
    });

    filteredNotesList.addEventListener('click', (event) => {
        const bookmarkButton = event.target.closest('.btn-bookmark-note');
        if (bookmarkButton) {
            const noteId = bookmarkButton.getAttribute('data-id');
            bookmarkNote(noteId);
        }
    });
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes = notes.filter(note => String(note.id) !== String(noteId));

    localStorage.setItem('notes', JSON.stringify(notes));

    document.body.style.overflow = 'auto';

    showNotes();
    updateNoteCount();
    updateBookmarkedNoteCount();
}

function updateNoteCount() {
    const unbookmarkedNoteCount = document.getElementById('unbookmarked-count');
    const notesList = document.querySelector('.notes-list');
    const notes = notesList.querySelectorAll('.note');
    const unbookmarkedNoteArray = Array.from(notes);

    unbookmarkedNoteCount.textContent = unbookmarkedNoteArray.length;
}

function updateBookmarkedNoteCount() {
    const bookmarkedNoteCount = document.getElementById('bookmarked-count');
    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');
    const bookmarkedNotes = bookmarkedNotesList.querySelectorAll('.note');
    const bookmarkedNotesArray = Array.from(bookmarkedNotes);

    bookmarkedNoteCount.textContent = bookmarkedNotesArray.length;
}

function updateSidebarTagList() {
    const sidebarTagList = document.querySelector('.sidebar__tag-list');
    const tags = JSON.parse(localStorage.getItem('tags')) || [];

    sidebarTagList.innerHTML = '';

    tags.forEach(tag => {
        const sidebarTagItem = document.createElement('li');
        sidebarTagItem.classList.add('sidebar__tag-item');
        sidebarTagItem.textContent = tag;
        sidebarTagList.appendChild(sidebarTagItem);
    });
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


//! If Vercel throws an error regarding "rollup failed to resolve" then it's because i tried to push a commit for main.js where I've imported a new scss file but have yet to push the actually scss file so Vercel woudn't see it in my repo because it only exists on my local machine NOT the repo. So I have to push the scss file first then push the main.js file.