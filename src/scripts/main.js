import '../styles/style.scss';
import '../styles/button.scss';
import '../styles/note.scss';
import '../styles/popup.scss';
import '../styles/popup-edit.scss';
import '../styles/popup-tags.scss';
import '../styles/sidebar.scss';
import '../styles/filter.scss';
import '../styles/popup-filter.scss';

import tagsImage from '../images/tags_image.png';
import priorityImage from '../images/priority_image.png';
import notepadImage from '../images/notepad_image.png';

document.addEventListener('DOMContentLoaded', () => {

    //* I wanna add drag to drop functionality to the notes so that they can be rearranged in the list and/or moved from the unbookmarked list to the bookmarked list and vice versa. See (https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) for more info.

    let customizationPopup = document.querySelector('.custom');
    customizationPopup.style.display = 'none';

    document.addEventListener('click', function (event) {
        const toggleTargetElements = document.querySelectorAll('[data-toggle="visibility"]');

        toggleTargetElements.forEach(element => {
            const parent = element.parentElement;

            if (!element.contains(event.target) && !parent.contains(event.target)) {
                element.style.display = 'none';
            }
        });
    });

    const notesLists = document.querySelectorAll('.notes-list, .bookmarked-notes-list');
    const listViewBtn = document.getElementById('list-view-btn');
    const gridViewBtn = document.getElementById('grid-view-btn');
    const storedLayout = 'notesLayout';

    function applySavedLayout() {
        const savedLayout = localStorage.getItem(storedLayout) || 'list-layout';

        notesLists.forEach(list => {
            list.classList.remove('list-layout', 'grid-layout');
            list.classList.add(savedLayout);
        });

        updateActiveButtonStyle(savedLayout);
        setNoteStyling(savedLayout);
    }

    function updateActiveButtonStyle(savedLayout) {
        [listViewBtn, gridViewBtn].forEach(button => {
            if (button.dataset.value === savedLayout) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    function setLayout(layout) {
        notesLists.forEach(list => {
            list.classList.remove('list-layout', 'grid-layout');
            list.classList.add(layout);
        });

        localStorage.setItem(storedLayout, layout);

        updateActiveButtonStyle(layout);
        setNoteStyling(layout);
    }

    listViewBtn.addEventListener('click', () => setLayout('list-layout'));
    gridViewBtn.addEventListener('click', () => setLayout('grid-layout'));

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

    const savedSortOption = localStorage.getItem('sortOption');

    if (savedSortOption) {
        document.querySelectorAll('.custom__select-choice').forEach(choice => {
            if (choice.getAttribute('data-value') === savedSortOption) {
                const trigger = choice.closest('.custom__select').querySelector('.custom__select-trigger');
                trigger.textContent = choice.textContent;
            }
        });
    }

    document.querySelectorAll('.custom__select-choice').forEach(choice => {
        choice.addEventListener('click', () => {
            const trigger = choice.closest('.custom__select').querySelector('.custom__select-trigger');
            trigger.textContent = choice.textContent;

            const dropdown = choice.closest('.custom__select-options');
            dropdown.classList.add('hidden');

            const sortValue = choice.getAttribute('data-value');

            localStorage.setItem('sortOption', sortValue);

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

    document.querySelector('.btn-new-note').addEventListener('click', () => {
        noteCreation();
    });

    document.querySelector('.btn-new-tag').addEventListener('click', () => {
        popupCreateTag();
    });

    document.querySelector('.btn-toggle-options').addEventListener('click', () => {
        const filterTab = document.querySelector('.custom');
        filterTab.style.display = filterTab.style.display === 'none' ? 'block' : 'none';
    });

    document.querySelectorAll('.category__dropdown-btn').forEach(button => {
        button.addEventListener('click', () => {
            const category = button.closest('.category');
            const notesList = category.querySelector('.notes-list') || category.querySelector('.bookmarked-notes-list');

            button.classList.toggle('rotate');
            if (notesList) {
                notesList.classList.toggle('hidden');
            }
        });
    });

    document.querySelector('.sidebar__tag-list').addEventListener('click', (event) => {
        const clickedTag = event.target;

        if (clickedTag.classList.contains('sidebar__tag-item')) {
            const tagName = clickedTag.textContent.trim();
            filterByTag(tagName);
        }
    });

    document.querySelector('.sidebar__priority-list').addEventListener('click', (event) => {
        const clickedPriority = event.target;

        if (clickedPriority.classList.contains('sidebar__priority-item')) {
            const priorityValue = clickedPriority.textContent.trim();
            filterByPriority(priorityValue);
        }
    });

    updateSidebarTagList();
    applySavedLayout();
});

function popupCreateTag() {
    const tagCreatingPopup = document.createElement('div');
    tagCreatingPopup.classList.add('tag-creation-popup');

    tagCreatingPopup.innerHTML = `
    
        <div class="popup-tags">

            <div class="popup-tags__top">
            
                <div class="popup-tags__context">

                    <img src="${tagsImage}" alt="Tags Icon">

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
    document.body.style.overflow = 'hidden';

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

    tagCreatingPopup.querySelector('.popup-tags__close-btn').addEventListener('click', () => {
        tagCreatingPopup.remove();
        document.body.style.overflow = 'auto';
    });

    tagCreatingPopup.addEventListener('click', () => {
        tagCreatingPopup.remove();
        document.body.style.overflow = 'auto';
    });

    tagCreatingPopup.querySelector('.popup-tags').addEventListener('click', (event) => {
        event.stopPropagation();
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

                        <img src="${notepadImage}" alt="Image of Notepad">
                    
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

                        <ul class="popup__priorities-btn-list" data-toggle="visibility">

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

                        <ul class="popup__tags-btn-list" data-toggle="visibility">
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

    noteCreationPopup.querySelector('.popup__close-btn').addEventListener('click', () => {
        noteCreationPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteCreationPopup.addEventListener('click', () => {
        noteCreationPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteCreationPopup.querySelector('.popup').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    noteCreationPopup.querySelector('.popup__priorities-open-btn').addEventListener('click', togglePriorityOptions);
    noteCreationPopup.querySelector('.popup__tags-open-btn').addEventListener('click', toggleTagOptions);

    setupPriorityButtons();
    renderTags();
}

function popupEdit(noteId, originalTagName, originalPriority) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const noteToEdit = notes.find(note => note.id === noteId);
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

                        <img src="${notepadImage}" alt="Image of a notepad">
                    
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

                        <ul class="popup-edit__priorities-btn-list" data-toggle="visibility">

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

                        <ul class="popup-edit__tags-btn-list" data-toggle="visibility">
                            
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

    noteEditingPopup.addEventListener('click', () => {
        noteEditingPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteEditingPopup.querySelector('.popup-edit__close-btn').addEventListener('click', () => {
        noteEditingPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteEditingPopup.querySelector('.popup-edit').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    setupPriorityButtons();
    renderTags();
}

function togglePriorityOptions() {
    const prioritiesBtnList = document.querySelector('.popup__priorities-btn-list');
    const prioritiesBtnListEdit = document.querySelector('.popup-edit__priorities-btn-list');

    if (prioritiesBtnList) {
        prioritiesBtnList.style.display = prioritiesBtnList.style.display === 'none' ? 'block' : 'none';
    } else if (prioritiesBtnListEdit) {
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
            console.error('prioritiesBtnListEdit is null');
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
    }

    else {
        noteCreationPopup.remove();
        document.body.style.overflow = 'auto';
    }
}

function setNoteStyling(savedLayout) {
    const aboutDivs = document.querySelectorAll('.note__about');
    const contentDivs = document.querySelectorAll('.note__content');
    //? not sure how I would handle the default view stuff tho

    if (savedLayout === 'list-layout') {
        aboutDivs.forEach(div => {
            if (div) {
                div.classList.add('note-about-list-view');
                div.classList.remove('note-about-grid-view');
            }
        });

        contentDivs.forEach(div => {
            if (div) {
                div.classList.add('note-content-list-view');
                div.classList.remove('note-content-grid-view');
            }
        });
    }

    else if (savedLayout === 'grid-layout') {
        aboutDivs.forEach(div => {
            if (div) {
                div.classList.add('note-about-grid-view');
                div.classList.remove('note-about-list-view');
            }
        });

        contentDivs.forEach(div => {
            if (div) {
                div.classList.add('note-content-grid-view');
                div.classList.remove('note-content-list-view');
            }
        });
    }
}

function showNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const notesList = document.querySelector('.notes-list');
    const bookmarkedNotesList = document.querySelector('.bookmarked-notes-list');
    const noteWrapper = document.querySelector('.note-wrapper');

    notesList.innerHTML = '';
    bookmarkedNotesList.innerHTML = '';

    notes.forEach(note => {
        const noteObject = document.createElement('div');
        noteObject.classList.add('note');
        noteObject.setAttribute('data-id', note.id);
        noteObject.draggable = true;

        const creationDate = new Date(note.creationDate);
        const formattedDate = creationDate.toLocaleDateString('en-uk', {
            minute: 'numeric',
            hour: 'numeric',
            day: 'numeric',
            weekday: 'short',
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

    if (!noteWrapper._hasClickListener) {
        noteWrapper.addEventListener('click', (event) => {
            const bookmarkBtn = event.target.closest('.btn-bookmark-note');
            const deleteBtn = event.target.closest('.btn-delete-note');
            const note = event.target.closest('.note');

            if (bookmarkBtn) {
                const noteId = bookmarkBtn.getAttribute('data-id');
                bookmarkNote(noteId);
                return;
            }

            if (deleteBtn) {
                const noteId = deleteBtn.getAttribute('data-id');
                deleteNote(noteId);
                return;
            }

            if (note && !event.target.closest('.note__options')) {
                const noteId = note.getAttribute('data-id');
                popupEdit(noteId);
                return;
            }
        });
        noteWrapper._hasClickListener = true;
        console.log('Note wrapper event listener added.');
    }

    setNoteStyling(localStorage.getItem('notesLayout') || 'list-layout');
}

function renderTags() {
    const tagListDropdowns = document.querySelectorAll('.popup__tags-btn-list, .popup-edit__tags-btn-list');

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

        for (const button of tagButtons) {
            button.addEventListener('click', () => {
                let tag = button.textContent;

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

                    tagsBtnOpenEdit.textContent = tag;
                    tagsBtnListEdit.style.display = 'none';
                });
            }
        }
    }
}

function bookmarkNote(noteId) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const note = notes.find(note => note.id === noteId);

    if (note) {
        note.bookmarked = !note.bookmarked;

        localStorage.setItem('notes', JSON.stringify(notes));

        showNotes();
        updateNoteCount();
        updateBookmarkedNoteCount();
    } else {
        console.error('Something went wrong with the bookmarking function.');
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
            if (note.id === noteId) {
                const updatedNote = {
                    ...note,
                    title: noteTitle,
                    content: noteContent,
                    priority: prioritiesBtnOpen.textContent.trim(),
                    priorityColor: prioritiesBtnOpen.style.color || note.priorityColor,
                    tags: tagsBtnOpen
                };

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

    const noteFilteringPopup = document.createElement('div');

    const popupFilterHTML = `
                <div class="popup-filter">
                    <div class="popup-filter__top">
                        <div class="popup-filter__context">
                            <img src="${tagsImage}" alt="Image of a tag icon">
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

    noteFilteringPopup.addEventListener('click', () => {
        noteFilteringPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteFilteringPopup.querySelector('.popup-filter__close-btn').addEventListener('click', () => {
        noteFilteringPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteFilteringPopup.querySelector('.popup-filter').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    if (!filteredNotesList._hasClickListener) {
        filteredNotesList.addEventListener('click', (event) => {
            const bookmarkBtn = event.target.closest('.btn-bookmark-note');
            const deleteBtn = event.target.closest('.btn-delete-note');
            const note = event.target.closest('.popup-filter__note');


            if (bookmarkBtn) {
                const noteId = bookmarkBtn.getAttribute('data-id');
                bookmarkNote(noteId);
                refreshFilterPopup(tagName, null);
                return;
            }

            if (deleteBtn) {
                const noteId = deleteBtn.getAttribute('data-id');
                deleteNote(noteId);
                refreshFilterPopup(tagName, null);
                return;
            }

            if (note && !event.target.closest('.note__options')) {
                const noteId = note.getAttribute('data-id');
                popupEdit(noteId, tagName);
                return;
            }
        });

        filteredNotesList._hasClickListener = true;
    }
}

//! Deal with cross browser compatibility

function filterByPriority(priorityValue) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    const filteredNotes = notes.filter(note => note.priority == priorityValue);
    console.log('Notes found with priority:', priorityValue, filteredNotes);

    const noteFilteringPopup = document.createElement('div');

    const popupFilterHTML = `
                <div class="popup-filter">
                    <div class="popup-filter__top">
                        <div class="popup-filter__context">
                            <img src="${priorityImage}" alt="Image of a priority icon">
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
    });

    noteFilteringPopup.addEventListener('click', () => {
        noteFilteringPopup.remove();
        document.body.style.overflow = 'auto';
    });

    noteFilteringPopup.querySelector('.popup-filter').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    if (!filteredNotesList._hasClickListener) {
        filteredNotesList.addEventListener('click', (event) => {
            const bookmarkBtn = event.target.closest('.btn-bookmark-note');
            const deleteBtn = event.target.closest('.btn-delete-note');
            const note = event.target.closest('.popup-filter__note');


            if (bookmarkBtn) {
                const noteId = bookmarkBtn.getAttribute('data-id');
                bookmarkNote(noteId);
                refreshFilterPopup(null, priorityValue);
                return;
            }

            if (deleteBtn) {
                const noteId = deleteBtn.getAttribute('data-id');
                deleteNote(noteId);
                refreshFilterPopup(null, priorityValue);
                return;
            }

            if (note && !event.target.closest('.note__options')) {
                const noteId = note.getAttribute('data-id');
                popupEdit(noteId, null, priorityValue);
                return;
            }
        });

        filteredNotesList._hasClickListener = true;
    }
}

function refreshFilterPopup(tagName, priorityValue) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    let filteredNotes;

    if (tagName) {
        filteredNotes = notes.filter(note => note.tags && note.tags.includes(tagName));
    } else if (priorityValue) {
        filteredNotes = notes.filter(note => note.priority == priorityValue);
    } else {
        return;
    }

    const noteFilteringPopup = document.querySelector('.note-filtering-popup');

    noteFilteringPopup.innerHTML = '';
    noteFilteringPopup.remove();

    const noteFilteringPopupAfterChangesSaved = document.createElement('div');
    noteFilteringPopupAfterChangesSaved.classList.add('note-filtering-popup');

    const imgSrc = tagName ? tagsImage : priorityImage;

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
        noteFilteringPopupAfterChangesSaved.remove();
        document.body.style.overflow = 'auto';

        if (noteEditingPopup) {
            noteEditingPopup.remove();
        }
    });

    noteFilteringPopupAfterChangesSaved.addEventListener('click', () => {
        noteFilteringPopupAfterChangesSaved.remove();
        document.body.style.overflow = 'auto';

        if (noteEditingPopup) {
            noteEditingPopup.remove();
        }
    });

    noteFilteringPopupAfterChangesSaved.querySelector('.popup-filter').addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const filteredNotesList = document.querySelector('.popup-filter__notes-list');

    if (!filteredNotesList._hasClickListener) {
        filteredNotesList.addEventListener('click', (event) => {
            const bookmarkBtn = event.target.closest('.btn-bookmark-note');
            const deleteBtn = event.target.closest('.btn-delete-note');
            const note = event.target.closest('.popup-filter__note');


            if (bookmarkBtn) {
                const noteId = bookmarkBtn.getAttribute('data-id');
                bookmarkNote(noteId);
                refreshFilterPopup(tagName, priorityValue);
                return;
            }

            if (deleteBtn) {
                const noteId = deleteBtn.getAttribute('data-id');
                deleteNote(noteId);
                refreshFilterPopup(tagName, priorityValue);
                return;
            }

            if (note && !event.target.closest('.note__options')) {
                const noteId = note.getAttribute('data-id');
                popupEdit(noteId, tagName, priorityValue);
                return;
            }
        });

        filteredNotesList._hasClickListener = true;
    }
}

function deleteNote(noteId) {
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    notes = notes.filter(note => note.id !== noteId);

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